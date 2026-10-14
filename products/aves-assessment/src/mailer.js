const nodemailer = require("nodemailer");
const settings = require("./settings");

async function loadSmtpConfig() {
  const row = await settings.getSetting("smtp.config");
  const cfg = row?.value ? JSON.parse(row.value) : {};
  const password = await settings.getSecret("smtp.password");
  return { ...cfg, password, passwordConfigured: !!password };
}
async function saveSmtpConfig(input, userId) {
  const cfg = {
    enabled: !!input.enabled,
    host: String(input.host || "").trim(),
    port: Number(input.port || 587),
    security: input.security || "starttls",
    username: String(input.username || "").trim(),
    fromName: String(input.fromName || "Aves Assessment").trim(),
    fromEmail: String(input.fromEmail || "").trim()
  };
  const secret = input.password === undefined ? undefined : String(input.password || "");
  await settings.putSetting("smtp.config", JSON.stringify(cfg), userId);
  if (secret !== undefined) await settings.putSetting("smtp.password", "", userId, secret);
  return { ...cfg, passwordConfigured: secret === undefined ? (await loadSmtpConfig()).passwordConfigured : !!secret };
}
async function transport() {
  const cfg=await loadSmtpConfig();
  if(!cfg.enabled) throw new Error("SMTP is disabled");
  if(!cfg.host || !cfg.fromEmail) throw new Error("SMTP host and From Email are required");
  const secure=cfg.security==="tls" || Number(cfg.port)===465;
  const auth=cfg.username ? {user:cfg.username,pass:cfg.password} : undefined;
  return {
    cfg,
    tx:nodemailer.createTransport({
      host:cfg.host, port:Number(cfg.port||587), secure,
      requireTLS:cfg.security==="starttls", auth
    })
  };
}
async function sendMail({to,subject,text}) {
  const {cfg,tx}=await transport();
  return tx.sendMail({from:{name:cfg.fromName||"Aves Assessment",address:cfg.fromEmail},to,subject,text});
}
async function verifySmtp() {
  const {tx}=await transport(); return tx.verify();
}
module.exports={loadSmtpConfig,saveSmtpConfig,sendMail,verifySmtp};
