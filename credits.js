const express = require('express');
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

function authId(req) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try {
    const token = auth.split(' ')[1];
    return require('jsonwebtoken').verify(token, process.env.JWT_SECRET || 'dev_secret').id;
  } catch (e) { return null; }
}

// Get credits
router.get('/', (req, res) => {
  const id = authId(req); if (!id) return res.status(401).json({ error: 'unauthorized' });
  const user = db.prepare('SELECT id,credits FROM users WHERE id = ?').get(id);
  res.json({ credits: user.credits });
});

// Simulate buy credits (stub)
router.post('/buy', (req, res) => {
  const id = authId(req); if (!id) return res.status(401).json({ error: 'unauthorized' });
  const { pack = 10 } = req.body; // number of credits bought
  db.prepare('UPDATE users SET credits = credits + ? WHERE id = ?').run(pack, id);
  res.json({ ok: true, added: pack });
});

module.exports = router;
