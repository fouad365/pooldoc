const express = require('express');
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// basic CRUD for companies (for enterprise users)
router.post('/', (req, res) => {
  const id = uuidv4();
  const { name, email, address } = req.body;
  db.prepare('INSERT INTO companies (id,name,email,address) VALUES (?,?,?,?)').run(id, name, email, address);
  res.json({ id, name, email, address });
});

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM companies').all();
  res.json({ companies: rows });
});

module.exports = router;
