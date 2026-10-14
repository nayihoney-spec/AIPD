const db = require("./db");
const { encryptSecret, decryptSecret } = require("./security");

async function getSetting(key) {
  const r = await db.query("SELECT value_text, secret_ciphertext FROM platform_settings WHERE setting_key = ?", [key]);
  if (!r.rows[0]) return null;
  return { value: r.rows[0].value_text, secretCiphertext: r.rows[0].secret_ciphertext };
}
async function putSetting(key, value, userId = null, secret = undefined) {
  const now = new Date();
  const current = await getSetting(key);
  const secretCiphertext = secret === undefined
    ? (current?.secretCiphertext || null)
    : (secret ? encryptSecret(secret) : null);
  if (current) {
    await db.exec("UPDATE platform_settings SET value_text = ?, secret_ciphertext = ?, updated_by = ?, updated_at = ? WHERE setting_key = ?",
      [value == null ? null : String(value), secretCiphertext, userId, now, key]);
  } else {
    await db.exec("INSERT INTO platform_settings(setting_key,value_text,secret_ciphertext,updated_by,updated_at) VALUES(?,?,?,?,?)",
      [key, value == null ? null : String(value), secretCiphertext, userId, now]);
  }
}
async function getSecret(key) {
  const x = await getSetting(key);
  return x?.secretCiphertext ? decryptSecret(x.secretCiphertext) : "";
}
module.exports = { getSetting, putSetting, getSecret };
