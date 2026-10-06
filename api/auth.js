// POST /api/auth  {action:'register'|'login', user, pass} -> {user, token}
const { db, sign, hash, check } = require('./_lib');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const { action, user, pass } = req.body || {}, u = String(user || '').trim().toLowerCase();
    if (!/^[a-z0-9_]{3,20}$/.test(u)) return res.status(400).json({ error: 'Username: 3-20 letters, numbers or _' });
    if (String(pass || '').length < 6) return res.status(400).json({ error: 'Password needs 6+ characters' });
    if (!process.env.AUTH_SECRET) return res.status(500).json({ error: 'Server missing AUTH_SECRET' });
    if (action === 'register') {
      const { data: existing, error: selErr } = await db.from('users').select('username').eq('username', u).maybeSingle();
      if (selErr) throw selErr;
      if (existing) return res.status(409).json({ error: 'Username already taken' });
      const { error } = await db.from('users').insert({ username: u, password_hash: hash(String(pass)) });
      if (error) throw error;
    } else {
      const { data: row, error } = await db.from('users').select('password_hash').eq('username', u).maybeSingle();
      if (error) throw error;
      if (!row || !check(String(pass), row.password_hash)) return res.status(401).json({ error: 'Wrong username or password' });
    }
    res.json({ user: u, token: sign(u) });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
};
