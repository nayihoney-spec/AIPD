const db = require("./db");

const COOKIE = "aves_session";

function parseCookies(req) {
  return Object.fromEntries(String(req.headers.cookie || "").split(";").map(x => x.trim()).filter(Boolean).map(x => {
    const i = x.indexOf("="); return i < 0 ? [x, ""] : [x.slice(0,i), decodeURIComponent(x.slice(i+1))];
  }));
}
async function loadSession(req) {
  const token = parseCookies(req)[COOKIE];
  if (!token) return null;
  const r = await db.query(
    "SELECT s.id session_id,s.expires_at,u.id,u.email,u.display_name,u.status,u.is_platform_admin,u.locale " +
    "FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.id=? AND s.expires_at > ? AND u.status='active'",
    [token, new Date()]
  );
  const user = r.rows[0] || null;
  if (user) db.exec("UPDATE sessions SET last_seen_at=? WHERE id=?", [new Date(), token]).catch(()=>{});
  return user;
}
async function requireAuth(req,res,next) {
  try { const u=await loadSession(req); if(!u) return res.status(401).json({error:"authentication_required"}); req.user=u; next(); }
  catch(e){ next(e); }
}
async function requireAdmin(req,res,next) {
  try { const u=req.user||await loadSession(req); if(!u) return res.status(401).json({error:"authentication_required"}); if(!u.is_platform_admin) return res.status(403).json({error:"admin_required"}); req.user=u; next(); }
  catch(e){ next(e); }
}
async function assessmentPermission(userId, assessmentId, isAdmin=false) {
  if (isAdmin) return "admin";
  const r=await db.query(
    "SELECT permission FROM assessment_access WHERE assessment_id=? AND user_id=? " +
    "AND (valid_from IS NULL OR valid_from<=?) AND (valid_until IS NULL OR valid_until>=?)",
    [assessmentId,userId,new Date(),new Date()]
  );
  return r.rows[0]?.permission || null;
}
function setSessionCookie(res, token, expiresAt) {
  res.cookie(COOKIE, token, {
    httpOnly:true, sameSite:"lax", secure:process.env.NODE_ENV==="production",
    expires:new Date(expiresAt), path:"/"
  });
}
function clearSessionCookie(res){ res.clearCookie(COOKIE,{path:"/"}); }
module.exports={COOKIE,loadSession,requireAuth,requireAdmin,assessmentPermission,setSessionCookie,clearSessionCookie};
