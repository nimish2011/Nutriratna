/**
 * Admin authentication. Accounts come from environment variables (see .env.example);
 * passwords are never stored in the website code. Sessions are signed tokens (HMAC-SHA256).
 */
import crypto from 'node:crypto';
import { ROLES } from '../src/config/constants.js';

const SESSION_HOURS = 8;
const SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');
if (!process.env.SESSION_SECRET) console.warn('⚠  SESSION_SECRET not set — admin sessions reset whenever the server restarts.');

const accounts = [
  { username: process.env.ADMIN_USERNAME || 'admin', password: process.env.ADMIN_PASSWORD, role: ROLES.ADMIN },
  { username: process.env.EXEC_USERNAME || 'executive', password: process.env.EXEC_PASSWORD, role: ROLES.EXECUTIVE },
].filter((a) => a.password);

if (!accounts.some((a) => a.role === ROLES.ADMIN) || accounts[0].password.length < 8) {
  console.error('✖ Set ADMIN_PASSWORD (at least 8 characters) in your .env file. See .env.example.');
  process.exit(1);
}

const digest = (v) => crypto.createHash('sha256').update(String(v)).digest();
const safeEqual = (a, b) => crypto.timingSafeEqual(digest(a), digest(b));
const sign = (payload) => crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');

/** Returns { token, user } for valid credentials, otherwise null. */
export function login(username, password) {
  // Check every account (no early exit) so timing doesn't reveal which usernames exist.
  let match = null;
  for (const a of accounts) {
    if (safeEqual(a.username, username) & safeEqual(a.password, password)) match = a;
  }
  if (!match) return null;
  const payload = Buffer.from(JSON.stringify({ u: match.username, r: match.role, exp: Date.now() + SESSION_HOURS * 3600e3 })).toString('base64url');
  return { token: `${payload}.${sign(payload)}`, user: { username: match.username, role: match.role } };
}

function verify(token) {
  const [payload, signature] = String(token || '').split('.');
  if (!payload || !signature || !safeEqual(sign(payload), signature)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.exp > Date.now() ? { username: data.u, role: data.r } : null;
  } catch {
    return null;
  }
}

/** Express middleware: requires a valid token; optionally only for the given role. */
export const requireAuth = (role) => (req, res, next) => {
  const user = verify((req.headers.authorization || '').replace(/^Bearer /, ''));
  if (!user) return res.status(401).json({ error: 'Please sign in again' });
  if (role && user.role !== role) return res.status(403).json({ error: 'You do not have permission for this action' });
  req.user = user;
  next();
};
