// Shared helpers: Redis (Upstash) client, password hashing (scrypt), signed session tokens (HMAC).
const { Redis } = require('@upstash/redis'), c = require('crypto');
const db = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN });
const mac = p => c.createHmac('sha256', process.env.AUTH_SECRET || '').update(p).digest('base64url');
const sign = u => { const p = Buffer.from(JSON.stringify({ u, e: Date.now() + 30 * 864e5 })).toString('base64url'); return p + '.' + mac(p); };
const verify = t => { try { const [p, s] = (t || '').split('.'), ok = mac(p); if (!process.env.AUTH_SECRET || s.length !== ok.length || !c.timingSafeEqual(Buffer.from(s), Buffer.from(ok))) return null; const d = JSON.parse(Buffer.from(p, 'base64url')); return d.e > Date.now() ? d.u : null; } catch (e) { return null; } };
const hash = (pw, salt = c.randomBytes(16).toString('hex')) => salt + ':' + c.scryptSync(pw, salt, 32).toString('hex');
const check = (pw, h) => { const x = hash(pw, h.split(':')[0]); return x.length === h.length && c.timingSafeEqual(Buffer.from(x), Buffer.from(h)); };
module.exports = { db, sign, verify, hash, check };
