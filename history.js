const express = require('express');
const db = require('../db');
const router = express.Router();

function authId(req) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try {
    const token = auth.split(' ')[1];
    return require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'dev_secret').id;
  } catch (e) { return null; }
}

router.get('/', (req, res) => {
  const userId = authId(req);
  if (!userId) return res.status(401).json({ error: 'unauthorized' });
  const rows = db.prepare('SELECT * FROM history WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  res.json({ history: rows.map(r => ({ id: r.id, created_at: r.created_at, data: JSON.parse(r.data), result: JSON.parse(r.result) })) });
});

router.get('/:id', (req, res) => {
  const userId = authId(req);
  if (!userId) return res.status(401).json({ error: 'unauthorized' });
  const row = db.prepare('SELECT * FROM history WHERE id = ? AND user_id = ?').get(req.params.id, userId);
  if (!row) return res.status(404).json({ error: 'not found' });
  res.json({ id: row.id, created_at: row.created_at, data: JSON.parse(row.data), result: JSON.parse(row.result) });
});

module.exports = router;
