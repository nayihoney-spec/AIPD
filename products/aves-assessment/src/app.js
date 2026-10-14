const express=require("express");
const helmet=require("helmet");
const path=require("path");
const fs=require("fs");
const archiver=require("archiver");
const db=require("./db");
const auth=require("./auth");
const mailer=require("./mailer");
const notifications=require("./notifications");
const settings=require("./settings");
const {hashPassword,verifyPassword,randomToken,tokenHash,id}=require("./security");

const app=express();
app.set("trust proxy",1);
app.use(helmet({contentSecurityPolicy:false}));
app.use(express.json({limit:"3mb"}));
app.use(express.urlencoded({extended:false,limit:"1mb"}));

function publicBase(req){return String(process.env.PUBLIC_BASE_URL||((req.headers["x-forwarded-proto"]||req.protocol)+"://"+req.get("host"))).replace(/\/$/,"")}
function jsonParse(x,fallback={}){try{return JSON.parse(x||"")}catch(_){return fallback}}
function now(){return new Date()}
function isoOrNull(x){if(!x)return null;const d=new Date(x);return isNaN(d.getTime())?null:d}
async function audit(userId,action,entityType,entityId,details){
  try{await db.exec("INSERT INTO audit_log(id,user_id,action,entity_type,entity_id,details_text,created_at) VALUES(?,?,?,?,?,?,?)",
    [id("aud_"),userId||null,action,entityType,entityId||null,JSON.stringify(details||{}),now()])}catch(e){console.error("audit",e)}
}
async function pageAuth(req,res,next){
  try{const u=await auth.loadSession(req);if(!u)return res.redirect("/login");req.user=u;next()}catch(e){next(e)}
}

app.get("/healthz",async(req,res)=>{
  try{await db.query("SELECT 1 AS ok");res.json({ok:true,service:"aves-assessment",dbDialect:db.dialect})}
  catch(e){res.status(503).json({ok:false,error:"database_unavailable"})}
});
app.get("/login",(req,res)=>res.sendFile(path.join(__dirname,"..","web","login.html")));
app.get("/invite",(req,res)=>res.sendFile(path.join(__dirname,"..","web","invite.html")));
app.get("/",pageAuth,(req,res)=>res.sendFile(path.join(__dirname,"..","app","index.html")));

app.post("/api/v1/auth/login",async(req,res,next)=>{
  try{
    const email=String(req.body.email||"").trim().toLowerCase(),password=String(req.body.password||"");
    const r=await db.query("SELECT * FROM users WHERE email=? AND status='active'",[email]);const u=r.rows[0];
    if(!u||!(await verifyPassword(password,u.password_hash)))return res.status(401).json({error:"invalid_credentials"});
    const sid=randomToken(32),expires=new Date(Date.now()+Number(process.env.SESSION_TTL_HOURS||12)*3600000);
    await db.exec("INSERT INTO sessions(id,user_id,expires_at,created_at,last_seen_at) VALUES(?,?,?,?,?)",[sid,u.id,expires,now(),now()]);
    auth.setSessionCookie(res,sid,expires);await audit(u.id,"auth.login","user",u.id,{});
    res.json({ok:true,user:{id:u.id,email:u.email,displayName:u.display_name,isPlatformAdmin:!!u.is_platform_admin,locale:u.locale,mustChangePassword:!!u.must_change_password}});
  }catch(e){next(e)}
});
app.post("/api/v1/auth/logout",auth.requireAuth,async(req,res,next)=>{
  try{await db.exec("DELETE FROM sessions WHERE id=?",[req.user.session_id]);auth.clearSessionCookie(res);res.json({ok:true})}catch(e){next(e)}
});
app.post("/api/v1/auth/change-password",auth.requireAuth,async(req,res,next)=>{
  try{
    const password=String(req.body.password||"");if(password.length<12)return res.status(400).json({error:"password_min_12"});
    const hash=await hashPassword(password);await db.exec("UPDATE users SET password_hash=?,must_change_password=false,updated_at=? WHERE id=?",[hash,now(),req.user.id]);
    await audit(req.user.id,"auth.password_changed","user",req.user.id,{});res.json({ok:true});
  }catch(e){next(e)}
});
app.get("/api/v1/session",auth.requireAuth,async(req,res,next)=>{
  try{
    const a=req.user.is_platform_admin
      ? await db.query("SELECT id,name,status,completeness,confidence FROM assessments ORDER BY updated_at DESC")
      : await db.query("SELECT a.id,a.name,a.status,a.completeness,a.confidence FROM assessment_access aa JOIN assessments a ON a.id=aa.assessment_id WHERE aa.user_id=? AND (aa.valid_from IS NULL OR aa.valid_from<=?) AND (aa.valid_until IS NULL OR aa.valid_until>=?) ORDER BY a.updated_at DESC",[req.user.id,now(),now()]);
    res.json({user:{id:req.user.id,email:req.user.email,displayName:req.user.display_name,isPlatformAdmin:!!req.user.is_platform_admin,locale:req.user.locale,mustChangePassword:!!req.user.must_change_password},assessments:a.rows});
  }catch(e){next(e)}
});
app.post("/api/v1/auth/accept-invitation",async(req,res,next)=>{
  try{
    const token=String(req.body.token||""),password=String(req.body.password||""),displayName=String(req.body.displayName||"").trim();
    if(password.length<12)return res.status(400).json({error:"password_min_12"});
    const inv=(await db.query("SELECT * FROM invitations WHERE token_hash=? AND accepted_at IS NULL AND expires_at>?",[tokenHash(token),now()])).rows[0];
    if(!inv)return res.status(400).json({error:"invalid_or_expired_invitation"});
    let u=(await db.query("SELECT * FROM users WHERE email=?",[inv.email])).rows[0];const ts=now();
    if(!u){
      const uid=id("usr_"),hash=await hashPassword(password);
      await db.exec("INSERT INTO users(id,email,password_hash,display_name,status,is_platform_admin,must_change_password,locale,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)",
        [uid,inv.email,hash,displayName||inv.email.split("@")[0],"active",false,false,String(req.body.locale||"en"),ts,ts]);
      u=(await db.query("SELECT * FROM users WHERE id=?",[uid])).rows[0];
    }
    const mem=(await db.query("SELECT id FROM organization_memberships WHERE organization_id=? AND user_id=?",[inv.organization_id,u.id])).rows[0];
    if(!mem)await db.exec("INSERT INTO organization_memberships(id,organization_id,user_id,role,created_at) VALUES(?,?,?,?,?)",[id("mem_"),inv.organization_id,u.id,"member",ts]);
    if(inv.assessment_id){
      const ac=(await db.query("SELECT id FROM assessment_access WHERE assessment_id=? AND user_id=?",[inv.assessment_id,u.id])).rows[0];
      if(ac)await db.exec("UPDATE assessment_access SET permission=? WHERE id=?",[inv.permission,ac.id]);
      else await db.exec("INSERT INTO assessment_access(id,assessment_id,user_id,permission,valid_from,valid_until,created_at) VALUES(?,?,?,?,?,?,?)",
        [id("acc_"),inv.assessment_id,u.id,inv.permission,inv.valid_from||ts,inv.expires_at,ts]);
    }
    await db.exec("UPDATE invitations SET accepted_at=? WHERE id=?",[ts,inv.id]);
    const sid=randomToken(32),expires=new Date(Date.now()+Number(process.env.SESSION_TTL_HOURS||12)*3600000);
    await db.exec("INSERT INTO sessions(id,user_id,expires_at,created_at,last_seen_at) VALUES(?,?,?,?,?)",[sid,u.id,expires,ts,ts]);auth.setSessionCookie(res,sid,expires);
    await audit(u.id,"invitation.accepted","invitation",inv.id,{assessmentId:inv.assessment_id});res.json({ok:true});
  }catch(e){next(e)}
});

app.get("/api/v1/assessments",auth.requireAuth,async(req,res,next)=>{
  try{
    let r;
    if(req.user.is_platform_admin)r=await db.query("SELECT * FROM assessments ORDER BY updated_at DESC");
    else r=await db.query("SELECT a.* FROM assessment_access aa JOIN assessments a ON a.id=aa.assessment_id WHERE aa.user_id=? AND (aa.valid_from IS NULL OR aa.valid_from<=?) AND (aa.valid_until IS NULL OR aa.valid_until>=?) ORDER BY a.updated_at DESC",[req.user.id,now(),now()]);
    res.json(r.rows.map(x=>({...x,payload:jsonParse(x.payload_text,{})})));
  }catch(e){next(e)}
});
app.get("/api/v1/assessments/:id",auth.requireAuth,async(req,res,next)=>{
  try{
    const p=await auth.assessmentPermission(req.user.id,req.params.id,!!req.user.is_platform_admin);if(!p)return res.status(403).json({error:"forbidden"});
    const x=(await db.query("SELECT * FROM assessments WHERE id=?",[req.params.id])).rows[0];if(!x)return res.status(404).json({error:"not_found"});
    res.json({...x,payload:jsonParse(x.payload_text,{})});
  }catch(e){next(e)}
});
app.put("/api/v1/assessments/:id",auth.requireAuth,async(req,res,next)=>{
  try{
    const p=await auth.assessmentPermission(req.user.id,req.params.id,!!req.user.is_platform_admin);
    if(!p||(!req.user.is_platform_admin&&p!=="editor"))return res.status(403).json({error:"editor_required"});
    const payload=req.body.payload||{},completeness=Math.max(0,Math.min(100,Number(req.body.completeness||0))),confidence=String(req.body.confidence||"low").toLowerCase();
    await db.exec("UPDATE assessments SET payload_text=?,completeness=?,confidence=?,updated_at=? WHERE id=?",[JSON.stringify(payload),completeness,confidence,now(),req.params.id]);
    await audit(req.user.id,"assessment.updated","assessment",req.params.id,{completeness,confidence});res.json({ok:true});
  }catch(e){next(e)}
});
app.post("/api/v1/assessments/:id/quotes",auth.requireAuth,async(req,res,next)=>{
  try{
    const p=await auth.assessmentPermission(req.user.id,req.params.id,!!req.user.is_platform_admin);if(!p)return res.status(403).json({error:"forbidden"});
    const a=(await db.query("SELECT * FROM assessments WHERE id=?",[req.params.id])).rows[0];if(!a)return res.status(404).json({error:"not_found"});
    const qn="Q-"+new Date().toISOString().slice(0,10).replace(/-/g,"")+"-"+Math.floor(Math.random()*90000+10000);
    const snapshot={assessment:jsonParse(a.payload_text,{}),completeness:a.completeness,confidence:a.confidence,configVersion:a.config_version,pricingVersion:a.pricing_version,estimate:req.body.estimate||null};
    await db.exec("INSERT INTO quote_snapshots(id,assessment_id,quote_number,snapshot_text,issued_by,issued_at) VALUES(?,?,?,?,?,?)",[id("q_"),a.id,qn,JSON.stringify(snapshot),req.user.id,now()]);
    const recipients=await db.query("SELECT DISTINCT u.email,u.locale FROM assessment_access aa JOIN users u ON u.id=aa.user_id WHERE aa.assessment_id=?",[a.id]);for(const x of recipients.rows)await notifications.queue("quote_ready",x.email,{locale:x.locale,assessmentName:a.name,status:"Formal Quote Snapshot "+qn});notifications.dispatch(10).catch(()=>{});await audit(req.user.id,"quote.snapshot_created","assessment",a.id,{quoteNumber:qn});res.json({ok:true,quoteNumber:qn});
  }catch(e){next(e)}
});

app.get("/api/v1/admin/configuration",auth.requireAuth,auth.requireAdmin,async(req,res,next)=>{
  try{const x=await settings.getSetting("app.configuration");res.json({configuration:jsonParse(x?.value,{})})}catch(e){next(e)}
});
app.put("/api/v1/admin/configuration",auth.requireAuth,auth.requireAdmin,async(req,res,next)=>{
  try{await settings.putSetting("app.configuration",JSON.stringify(req.body.configuration||{}),req.user.id);await audit(req.user.id,"configuration.updated","platform","app.configuration",{});res.json({ok:true})}catch(e){next(e)}
});
app.get("/api/v1/admin/smtp",auth.requireAuth,auth.requireAdmin,async(req,res,next)=>{
  try{const x=await mailer.loadSmtpConfig();delete x.password;res.json(x)}catch(e){next(e)}
});
app.put("/api/v1/admin/smtp",auth.requireAuth,auth.requireAdmin,async(req,res,next)=>{
  try{const x=await mailer.saveSmtpConfig(req.body||{},req.user.id);delete x.password;await audit(req.user.id,"smtp.updated","platform","smtp",{});res.json(x)}catch(e){next(e)}
});
app.post("/api/v1/admin/smtp/test",auth.requireAuth,auth.requireAdmin,async(req,res,next)=>{
  try{await mailer.verifySmtp();const to=String(req.body.to||req.user.email);await mailer.sendMail({to,subject:"Aves Assessment SMTP test",text:"SMTP configuration test succeeded."});res.json({ok:true})}catch(e){res.status(400).json({error:"smtp_test_failed",message:String(e.message||e)})}
});
app.post("/api/v1/admin/invitations",auth.requireAuth,auth.requireAdmin,async(req,res,next)=>{
  try{
    const email=String(req.body.email||"").trim().toLowerCase(),organizationName=String(req.body.organizationName||"").trim(),assessmentName=String(req.body.assessmentName||"").trim();
    if(!email||!organizationName||!assessmentName)return res.status(400).json({error:"email_organization_assessment_required"});
    let org=(await db.query("SELECT * FROM organizations WHERE name=?",[organizationName])).rows[0];const ts=now();
    if(!org){const oid=id("org_");await db.exec("INSERT INTO organizations(id,name,status,created_at,updated_at) VALUES(?,?,?,?,?)",[oid,organizationName,"active",ts,ts]);org=(await db.query("SELECT * FROM organizations WHERE id=?",[oid])).rows[0]}
    let assessment=(await db.query("SELECT * FROM assessments WHERE organization_id=? AND name=?",[org.id,assessmentName])).rows[0];
    if(!assessment){const aid=id("asmt_"),payload={requirements:[],sites:[],processFlows:{},equipment:[]};await db.exec("INSERT INTO assessments(id,organization_id,name,status,config_version,pricing_version,payload_text,completeness,confidence,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
      [aid,org.id,assessmentName,"draft","2026.10","2026.10",JSON.stringify(payload),0,"low",req.user.id,ts,ts]);assessment=(await db.query("SELECT * FROM assessments WHERE id=?",[aid])).rows[0]}
    const token=randomToken(32),validFrom=isoOrNull(req.body.validFrom)||ts,expires=isoOrNull(req.body.validUntil)||new Date(Date.now()+7*86400000);
    const iid=id("inv_");await db.exec("INSERT INTO invitations(id,email,organization_id,assessment_id,permission,token_hash,valid_from,expires_at,accepted_at,created_by,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?)",
      [iid,email,org.id,assessment.id,String(req.body.permission||"editor"),tokenHash(token),validFrom,expires,null,req.user.id,ts]);
    const inviteUrl=publicBase(req)+"/invite?token="+encodeURIComponent(token);
    await notifications.queue("invite",email,{locale:req.body.locale||"en",inviteUrl,assessmentName:assessment.name,validUntil:expires.toISOString()});
    notifications.dispatch(10).catch(()=>{});
    await audit(req.user.id,"invitation.created","invitation",iid,{assessmentId:assessment.id,email});
    res.json({ok:true,invitationId:iid,assessmentId:assessment.id,expiresAt:expires,delivery:"queued"});
  }catch(e){next(e)}
});

app.all("/api/internal/notifications/run",async(req,res,next)=>{
  try{
    const bearer=String(req.headers.authorization||"").replace(/^Bearer\s+/i,"");
    let allowed=!!process.env.CRON_SECRET&&bearer===process.env.CRON_SECRET;
    if(!allowed){const u=await auth.loadSession(req);allowed=!!u?.is_platform_admin}
    if(!allowed)return res.status(403).json({error:"forbidden"});
    const scheduled=await notifications.scheduleReminders(),sent=await notifications.dispatch(50);res.json({ok:true,scheduled,processed:sent.length,results:sent});
  }catch(e){next(e)}
});

app.get("/api/v1/distribution/install-package",auth.requireAuth,async(req,res,next)=>{
  try{
    if(!req.user.is_platform_admin){
      const access=await db.query("SELECT COUNT(*) c FROM assessment_access WHERE user_id=? AND (valid_until IS NULL OR valid_until>=?)",[req.user.id,now()]);
      if(Number(access.rows[0]?.c||0)<1)return res.status(403).json({error:"authorized_user_required"});
    }
    res.setHeader("Content-Type","application/zip");
    res.setHeader("Content-Disposition",'attachment; filename="aves-assessment-local-2026.10.16-beta.zip"');
    const zip=archiver("zip",{zlib:{level:9}});zip.on("error",next);zip.pipe(res);
    const root=path.join(__dirname,"..");
    const include=["package.json","server.js","Dockerfile","docker-compose.yml",".env.example","install.sh","install.ps1","app","src","scripts","migrations","web","docs/INSTALLATION.md","docs/USER_MANUAL.md","docs/ADMIN_MANUAL.md"];
    for(const item of include){const p=path.join(root,item);if(fs.existsSync(p)){const st=fs.statSync(p);if(st.isDirectory())zip.directory(p,item);else zip.file(p,{name:item})}}
    zip.finalize();
  }catch(e){next(e)}
});

app.use((err,req,res,next)=>{console.error(err);if(res.headersSent)return next(err);res.status(500).json({error:"internal_error"})});
module.exports=app;
