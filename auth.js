const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role = 'client' } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email/password required' });
  const hashed = await bcrypt.hash(password, 10);
  const id = uuidv4();
  try {
    db.prepare('INSERT INTO users (id,name,email,password,role) VALUES (?,?,?,?,?)')
      .run(id, name || '', email, hashed, role);
    const token = jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (e) {
    res.status(400).json({ error: 'email already used' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!row) return res.status(400).json({ error: 'invalid credentials' });
  const ok = await bcrypt.compare(password, row.password);
  if (!ok) return res.status(400).json({ error: 'invalid credentials' });
  const token = jwt.sign({ id: row.id, email: row.email, role: row.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: row.id, name: row.name, email: row.email, role: row.role, credits: row.credits }});
});

// Get current user (token)
router.get('/user', (req,res)=>{
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({error:'unauthorized'});
  const token = auth.split(' ')[1];
  try{
    const data = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const row = db.prepare('SELECT id,name,email,role,credits FROM users WHERE id = ?').get(data.id);
    res.json(row);
  }catch(e){ res.status(401).json({error:'invalid token'}); }
});

module.exports = router;
