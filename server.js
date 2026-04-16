const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const Database = require('better-sqlite3');

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db', 'admin.sqlite');
const INIT_SQL = path.join(__dirname, 'db', 'init.sql');
const SESSION_TTL_MS = 1000 * 60 * 60 * 8;
const CONFIG_PATH = path.join(__dirname, 'db', 'site-config.json');
const sessions = new Map();

const hashPassword = (password) => crypto.createHash('sha256').update(password).digest('hex');

const ensureDb = () => {
  const db = new Database(DB_PATH);
  const sql = fs.readFileSync(INIT_SQL, 'utf8');
  db.exec(sql);
  return db;
};

if (process.argv.includes('--init-db')) {
  ensureDb().close();
  console.log('Base de datos inicializada en db/admin.sqlite');
  process.exit(0);
}

const db = ensureDb();

const readConfig = () => {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch {
    return null;
  }
};

const writeConfig = (config) => {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
};

const getSessionFromRequest = (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return null;
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return { token, session };
};

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ ok: false, message: 'Usuario y contraseña son obligatorios.' });
  }

  const user = db
    .prepare('SELECT id, username, password_hash FROM admin_users WHERE username = ?')
    .get(username);

  if (!user || user.password_hash !== hashPassword(password)) {
    return res.status(401).json({ ok: false, message: 'Credenciales inválidas.' });
  }

  const token = crypto.randomUUID();
  sessions.set(token, {
    userId: user.id,
    username: user.username,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });

  return res.json({ ok: true, token, username: user.username });
});

app.get('/api/session', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const session = token ? sessions.get(token) : null;

  if (!session || session.expiresAt < Date.now()) {
    if (token) sessions.delete(token);
    return res.status(401).json({ ok: false });
  }

  return res.json({ ok: true, username: session.username });
});

app.post('/api/logout', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) sessions.delete(token);
  return res.json({ ok: true });
});


app.get('/api/config', (_req, res) => {
  return res.json({ ok: true, config: readConfig() });
});

app.post('/api/config', (req, res) => {
  const active = getSessionFromRequest(req);
  if (!active) {
    return res.status(401).json({ ok: false, message: 'Sesión inválida.' });
  }

  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ ok: false, message: 'Config inválida.' });
  }

  writeConfig(req.body);
  return res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
