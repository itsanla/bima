const express = require('express');
const db = require('../db/connection');
const auth = require('../middleware/auth');
const validateRelease = require('../middleware/validate-release');

const router = express.Router();

router.post('/', auth, validateRelease, (req, res, next) => {
  const { version_name, build_number, apk_url, release_notes, force_update, channel, checksum } = req.body;
  const isForceUpdate = force_update ? 1 : 0;
  const targetChannel = channel || 'stable';

  try {
    const updateActiveStmt = db.prepare(`UPDATE releases SET active = 0 WHERE active = 1 AND channel = ?`);
    
    const insertStmt = db.prepare(`
      INSERT INTO releases (version_name, build_number, apk_url, release_notes, force_update, channel, checksum, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `);

    const transaction = db.transaction(() => {
      updateActiveStmt.run(targetChannel);
      const result = insertStmt.run(version_name, build_number, apk_url, release_notes, isForceUpdate, targetChannel, checksum || null);
      return result;
    });

    const info = transaction();

    console.log(`[RELEASE CREATED] Version: ${version_name} (Build ${build_number}) at ${new Date().toISOString()}`);

    res.status(201).json({
      id: info.lastInsertRowid,
      version_name,
      build_number,
      apk_url,
      release_notes,
      force_update: !!isForceUpdate,
      channel: targetChannel,
      checksum: checksum || null,
      active: true
    });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Conflict: build_number already exists' });
    }
    next(error);
  }
});

// Assuming GET /update will be mounted somewhere, wait, the instructions say:
// Register routes - mount router di /api/v1/releases (POST) dan /api/v1/app (GET /update)
// Wait! 1.6 says "Tambah handler GET /update di router"
// It's probably easier to put it here or create a separate file.
// Let's create an app router for GET /update in the same file or a new file.
// Wait, 1.7.4 says: "Register routes - mount router di /api/v1/releases (POST) dan /api/v1/app (GET /update)"
// So I will export this router for releases and also add another route or just put it in a separate file app.js?
// The instructions just say "Tambah handler GET /update di router". I'll put it in releases.js and then in index.js I'll mount them appropriately, or maybe create src/routes/app.js. Let me put GET /update in a new app.js for clarity, or just export two routers.

module.exports = router;
