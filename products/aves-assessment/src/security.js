const crypto = require("crypto");
const bcrypt = require("bcryptjs");

async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}
function id(prefix = "") {
  return prefix + crypto.randomUUID();
}
function tokenHash(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
function keyBytes() {
  const raw = process.env.APP_ENCRYPTION_KEY || "";
  let b;
  try { b = Buffer.from(raw, "base64"); } catch (_) { b = Buffer.alloc(0); }
  if (b.length !== 32) throw new Error("APP_ENCRYPTION_KEY must be a base64-encoded 32-byte key");
  return b;
}
function encryptSecret(value) {
  if (!value) return "";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", keyBytes(), iv);
  const enc = Buffer.concat([cipher.update(String(value), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64");
}
function decryptSecret(value) {
  if (!value) return "";
  const buf = Buffer.from(value, "base64");
  const iv = buf.subarray(0, 12), tag = buf.subarray(12, 28), enc = buf.subarray(28);
  const decipher = crypto.createDecipheriv("aes-256-gcm", keyBytes(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString("utf8");
}
module.exports = { hashPassword, verifyPassword, randomToken, tokenHash, id, encryptSecret, decryptSecret };
