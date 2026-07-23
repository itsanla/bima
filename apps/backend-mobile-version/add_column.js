const db = require('./src/db/connection');
try {
  db.exec("ALTER TABLE releases ADD COLUMN checksum TEXT;");
  console.log("Column checksum added.");
} catch (e) {
  console.log("Column might already exist or another error:", e.message);
}
