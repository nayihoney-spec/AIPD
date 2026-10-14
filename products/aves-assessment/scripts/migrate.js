require("dotenv").config();
const fs=require("fs"),path=require("path");
const db=require("../src/db");
async function main(){
  const file=path.join(__dirname,"..","migrations",db.dialect==="mysql"?"mysql":"postgres","001_init.sql");
  const sql=fs.readFileSync(file,"utf8");
  const statements=sql.split(/;\s*(?:\r?\n|$)/).map(x=>x.trim()).filter(Boolean);
  for(const stmt of statements) await db.exec(stmt);
  console.log("Migration complete for "+db.dialect);
}
main().then(()=>db.close()).catch(e=>{console.error(e);process.exit(1)});
