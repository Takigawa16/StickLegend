// GET /api/leaderboard -> {rows:[{username,tier,streak}]} top 10 by tier, public.
// POST /api/leaderboard {tier,streak} -> upserts the caller's arena score. Requires "Authorization: Bearer <token>".
const { db, verify } = require('./_lib');
module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const u = verify((req.headers.authorization || '').slice(7));
      if (!u) return res.status(401).json({ error: 'Unauthorized' });
      const tier = Math.max(1, Math.min(9999, parseInt(req.body && req.body.tier) || 1));
      const streak = Math.max(0, Math.min(9999, parseInt(req.body && req.body.streak) || 0));
      const { error } = await db.from('arena_scores').upsert({ username: u, tier, streak, updated_at: new Date().toISOString() });
      if (error) throw error;
      return res.json({ ok: 1 });
    }
    const { data, error } = await db.from('arena_scores').select('username,tier,streak').order('tier', { ascending: false }).order('streak', { ascending: false }).limit(10);
    if (error) throw error;
    res.json({ rows: data || [] });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
};
