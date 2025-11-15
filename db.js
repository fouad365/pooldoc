const Database = require('better-sqlite3');
const db = new Database('./db.sqlite');

// Users
db.prepare(`CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT,
  credits INTEGER DEFAULT 0,
  company_id TEXT
)`).run();

// History (calculations / reports)
db.prepare(`CREATE TABLE IF NOT EXISTS history (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  created_at INTEGER,
  data TEXT,
  result TEXT
)`).run();

// Companies / invoices (basic)
db.prepare(`CREATE TABLE IF NOT EXISTS companies (
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  address TEXT
)`).run();

module.exports = db;
