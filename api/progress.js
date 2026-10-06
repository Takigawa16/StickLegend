// GET /api/progress -> {data}; POST /api/progress {data} saves. Requires "Authorization: Bearer <token>".
const { db, verify } = require('./_lib');
module.exports = async (req, res) => {
  const u = verify((req.headers.authorization || '').slice(7));
  if (!u) return res.status(401).json({ error: 'Unauthorized' });
  try {
    if (req.method === 'POST') {
      const d = req.body && req.body.data;
      if (!d || typeof d !== 'object' || JSON.stringify(d).length > 50000) return res.status(400).json({ error: 'Bad data' });
      const { error } = await db.from('saves').upsert({ username: u, data: d, updated_at: new Date().toISOString() });
      if (error) throw error;
      return res.json({ ok: 1 });
    }
    const { data, error } = await db.from('saves').select('data').eq('username', u).maybeSingle();
    if (error) throw error;
    res.json({ data: data ? data.data : null });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
};
