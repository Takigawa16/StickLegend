// GET /api/progress -> {data}; POST /api/progress {data} saves. Requires "Authorization: Bearer <token>".
const { db, verify } = require('./_lib');
module.exports = async (req, res) => {
  const u = verify((req.headers.authorization || '').slice(7));
  if (!u) return res.status(401).json({ error: 'Unauthorized' });
  try {
    if (req.method === 'POST') {
      const d = req.body && req.body.data;
      if (!d || typeof d !== 'object' || JSON.stringify(d).length > 50000) return res.status(400).json({ error: 'Bad data' });
      await db.set('save:' + u, d); return res.json({ ok: 1 });
    }
    res.json({ data: await db.get('save:' + u) });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
};
