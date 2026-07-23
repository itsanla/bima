const validateRelease = (req, res, next) => {
  const { version_name, build_number, apk_url, release_notes, force_update, channel, checksum } = req.body;

  if (!version_name || typeof version_name !== 'string') {
    return res.status(400).json({ error: 'version_name is required and must be a string' });
  }

  if (!build_number || !Number.isInteger(build_number)) {
    return res.status(400).json({ error: 'build_number is required and must be an integer' });
  }

  if (!apk_url || typeof apk_url !== 'string') {
    return res.status(400).json({ error: 'apk_url is required and must be a string' });
  }

  if (release_notes !== undefined && typeof release_notes !== 'string') {
    return res.status(400).json({ error: 'release_notes must be a string' });
  }

  if (force_update !== undefined && typeof force_update !== 'boolean') {
    return res.status(400).json({ error: 'force_update must be a boolean' });
  }

  if (channel !== undefined && typeof channel !== 'string') {
    return res.status(400).json({ error: 'channel must be a string' });
  }

  if (checksum !== undefined && typeof checksum !== 'string') {
    return res.status(400).json({ error: 'checksum must be a string' });
  }

  next();
};

module.exports = validateRelease;
