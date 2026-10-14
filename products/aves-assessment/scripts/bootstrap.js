require("dotenv").config();
const db=require("../src/db");
const {hashPassword,id}=require("../src/security");

async function main(){
  const email=String(process.env.BOOTSTRAP_ADMIN_EMAIL||"").trim().toLowerCase();
  const password=String(process.env.BOOTSTRAP_ADMIN_PASSWORD||"");
  if(!email||!password){console.log("Bootstrap admin skipped: BOOTSTRAP_ADMIN_EMAIL/PASSWORD not set.");return;}
  const existing=await db.query("SELECT id FROM users WHERE email=?",[email]);
  if(existing.rows[0]){console.log("Bootstrap admin already exists.");return;}
  const now=new Date(),uid=id("usr_"),hash=await hashPassword(password);
  await db.exec("INSERT INTO users(id,email,password_hash,display_name,status,is_platform_admin,must_change_password,locale,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?)",
    [uid,email,hash,"Platform Admin","active",true,true,"en",now,now]);
  console.log("Bootstrap admin created; password is not printed. Change it at first login.");
}
main().then(()=>db.close()).catch(e=>{console.error(e);process.exit(1)});
