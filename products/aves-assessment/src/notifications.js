const db=require("./db");
const {id}=require("./security");
const {sendMail}=require("./mailer");

const DEFAULTS={
  invite:{subject:"You are invited to Aves Assessment",body:"You have been invited to complete an Aves Assessment. Open: {{inviteUrl}}"},
  access_expiry:{subject:"Aves Assessment access expires soon",body:"Your access to {{assessmentName}} expires on {{validUntil}}."},
  incomplete_reminder:{subject:"Aves Assessment needs more information",body:"{{assessmentName}} is {{completeness}}% complete. Completing missing information can improve estimate confidence."},
  quote_ready:{subject:"Aves Assessment estimate status updated",body:"The estimate status for {{assessmentName}} is now {{status}}."}
};
function render(str,payload){return String(str||"").replace(/\{\{(\w+)\}\}/g,(_,k)=>payload?.[k]??"")}
async function getTemplate(eventKey,locale="en"){
  let r=await db.query("SELECT subject,body_text FROM notification_templates WHERE event_key=? AND locale=? AND enabled=true",[eventKey,locale]);
  if(!r.rows[0]&&locale!=="en")r=await db.query("SELECT subject,body_text FROM notification_templates WHERE event_key=? AND locale='en' AND enabled=true",[eventKey]);
  return r.rows[0]||DEFAULTS[eventKey]||{subject:eventKey,body:""};
}
async function queue(eventKey,toEmail,payload,when=new Date()){
  const qid=id("nq_"),now=new Date();
  await db.exec("INSERT INTO notification_queue(id,event_key,to_email,payload_text,status,attempts,next_attempt_at,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?)",
    [qid,eventKey,toEmail,JSON.stringify(payload||{}),"pending",0,when,now,now]);
  return qid;
}
async function dispatch(limit=25){
  const r=await db.query("SELECT * FROM notification_queue WHERE status='pending' AND next_attempt_at<=? ORDER BY created_at LIMIT "+Number(limit),[new Date()]);
  const results=[];
  for(const item of r.rows){
    try{
      const payload=JSON.parse(item.payload_text||"{}"),tpl=await getTemplate(item.event_key,payload.locale||"en");
      await sendMail({to:item.to_email,subject:render(tpl.subject,payload),text:render(tpl.body_text||tpl.body,payload)});
      await db.exec("UPDATE notification_queue SET status='sent',attempts=attempts+1,last_error=NULL,updated_at=? WHERE id=?",[new Date(),item.id]);
      results.push({id:item.id,status:"sent"});
    }catch(e){
      const attempts=Number(item.attempts||0)+1;
      const next=new Date(Date.now()+Math.min(3600000,60000*Math.pow(2,Math.min(attempts,5))));
      await db.exec("UPDATE notification_queue SET attempts=?,last_error=?,next_attempt_at=?,updated_at=? WHERE id=?",[attempts,String(e.message||e).slice(0,1000),next,new Date(),item.id]);
      results.push({id:item.id,status:"retry",error:String(e.message||e)});
    }
  }
  return results;
}
async function scheduleReminders(){
  const now=new Date(),soon=new Date(Date.now()+72*3600*1000);
  const expiry=await db.query(
    "SELECT aa.id,u.email,u.locale,a.name assessment_name,aa.valid_until FROM assessment_access aa JOIN users u ON u.id=aa.user_id JOIN assessments a ON a.id=aa.assessment_id WHERE aa.valid_until>? AND aa.valid_until<=?",
    [now,soon]
  );
  for(const x of expiry.rows) await queue("access_expiry",x.email,{locale:x.locale,assessmentName:x.assessment_name,validUntil:x.valid_until});
  const incomplete=await db.query(
    "SELECT DISTINCT u.email,u.locale,a.name assessment_name,a.completeness FROM assessment_access aa JOIN users u ON u.id=aa.user_id JOIN assessments a ON a.id=aa.assessment_id WHERE a.status='draft' AND a.completeness<85 AND (aa.valid_until IS NULL OR aa.valid_until>?)",
    [now]
  );
  for(const x of incomplete.rows) await queue("incomplete_reminder",x.email,{locale:x.locale,assessmentName:x.assessment_name,completeness:x.completeness});
  return {expiry:expiry.rows.length,incomplete:incomplete.rows.length};
}
module.exports={queue,dispatch,scheduleReminders,DEFAULTS};
