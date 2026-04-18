CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- password por defecto: admin123
INSERT OR IGNORE INTO admin_users (username, password_hash)
VALUES ('admin', '240be518fabd2724ddb6f04eeb2907fbf793f1f8f3ec8535c5ce6d07f1f0f9f0');
