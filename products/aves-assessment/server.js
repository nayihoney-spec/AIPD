require("dotenv").config();
const app=require("./src/app");
const notifications=require("./src/notifications");
const port=Number(process.env.PORT||3000);
app.listen(port,()=>console.log("Aves Assessment listening on http://localhost:"+port));
if(process.env.ENABLE_LOCAL_NOTIFICATION_WORKER!=="false"){
  setInterval(()=>notifications.dispatch().catch(e=>console.error("notification worker",e)),60000).unref();
}
