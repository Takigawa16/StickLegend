// Shared helpers: Supabase client (service role, bypasses RLS), password hashing (scrypt), signed session tokens (HMAC).
const { createClient } = require('@supabase/supabase-js'), c = require('crypto');
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const mac = p => c.createHmac('sha256', process.env.AUTH_SECRET || '').update(p).digest('base64url');
const sign = u => { const p = Buffer.from(JSON.stringify({ u, e: Date.now() + 30 * 864e5 })).toString('base64url'); return p + '.' + mac(p); };
const verify = t => { try { const [p, s] = (t || '').split('.'), ok = mac(p); if (!process.env.AUTH_SECRET || s.length !== ok.length || !c.timingSafeEqual(Buffer.from(s), Buffer.from(ok))) return null; const d = JSON.parse(Buffer.from(p, 'base64url')); return d.e > Date.now() ? d.u : null; } catch (e) { return null; } };
const hash = (pw, salt = c.randomBytes(16).toString('hex')) => salt + ':' + c.scryptSync(pw, salt, 32).toString('hex');
const check = (pw, h) => { const x = hash(pw, h.split(':')[0]); return x.length === h.length && c.timingSafeEqual(Buffer.from(x), Buffer.from(h)); };
module.exports = { db, sign, verify, hash, check };
