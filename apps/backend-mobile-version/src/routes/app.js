const express = require('express');
const db = require('../db/connection');

const router = express.Router();

router.get('/update', (req, res, next) => {
  try {
    const channel = req.query.channel || 'stable';

    const stmt = db.prepare(`
      SELECT version_name, build_number, apk_url, release_notes, force_update, checksum
      FROM releases
      WHERE active = 1 AND channel = ?
      LIMIT 1
    `);

    const release = stmt.get(channel);

    if (!release) {
      return res.status(200).json({ update_available: false });
    }

    res.status(200).json({
      version_name: release.version_name,
      build_number: release.build_number,
      apk_url: release.apk_url,
      release_notes: release.release_notes,
      force_update: !!release.force_update,
      checksum: release.checksum
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
