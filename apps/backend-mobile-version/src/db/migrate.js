const db = require('./connection');

function migrate() {
  const query = `
    CREATE TABLE IF NOT EXISTS releases (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      version_name  TEXT NOT NULL,
      build_number  INTEGER UNIQUE NOT NULL,
      apk_url       TEXT NOT NULL,
      release_notes TEXT,
      force_update  INTEGER DEFAULT 0,
      channel       TEXT DEFAULT 'stable',
      active        INTEGER DEFAULT 0,
      checksum      TEXT,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  
  db.exec(query);
  console.log('Database migration completed successfully.');
}

module.exports = migrate;
