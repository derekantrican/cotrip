const express = require('express');
const router = express.Router();
const { all, run } = require('../db');

// GET /api/settings — get all settings
router.get('/', (req, res) => {
  const rows = all('SELECT * FROM settings');
  const settings = {};
  for (const row of rows) {
    settings[row.key] = JSON.parse(row.value);
  }
  res.json(settings);
});

// PUT /api/settings/:key — update a setting
router.put('/:key', (req, res) => {
  const { value } = req.body;
  run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [req.params.key, JSON.stringify(value)]);
  res.json({ [req.params.key]: value });
});

module.exports = router;
