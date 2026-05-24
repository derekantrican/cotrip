const express = require('express');
const router = express.Router();
const { all, get, run } = require('../db');

// GET /api/trips/:tripId/activities — all activities for a trip (optionally filter by date)
router.get('/trips/:tripId/activities', (req, res) => {
  const { date } = req.query;
  let activities;
  if (date) {
    activities = all('SELECT * FROM activities WHERE trip_id = ? AND date = ? ORDER BY start_time, sort_order', [req.params.tripId, date]);
  } else {
    activities = all('SELECT * FROM activities WHERE trip_id = ? ORDER BY date, start_time, sort_order', [req.params.tripId]);
  }
  res.json(activities);
});

// POST /api/activities — create activity
router.post('/activities', (req, res) => {
  const { trip_id, date, start_time, end_time, title, description, category, cover_image, link, sort_order } = req.body;
  if (!trip_id || !date || !title) {
    return res.status(400).json({ error: 'trip_id, date, and title are required' });
  }
  const result = run(
    'INSERT INTO activities (trip_id, date, start_time, end_time, title, description, category, cover_image, link, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [trip_id, date, start_time || null, end_time || null, title, description || null, category || 'other', cover_image || null, link || null, sort_order || 0]
  );
  const activity = get('SELECT * FROM activities WHERE id = ?', [result.lastInsertRowid]);
  res.status(201).json(activity);
});

// PUT /api/activities/:id — update activity
router.put('/activities/:id', (req, res) => {
  const existing = get('SELECT * FROM activities WHERE id = ?', [req.params.id]);
  if (!existing) return res.status(404).json({ error: 'Activity not found' });
  const { date, start_time, end_time, title, description, category, cover_image, link, sort_order } = req.body;
  run(
    'UPDATE activities SET date = ?, start_time = ?, end_time = ?, title = ?, description = ?, category = ?, cover_image = ?, link = ?, sort_order = ? WHERE id = ?',
    [
      date || existing.date, start_time !== undefined ? start_time : existing.start_time, end_time !== undefined ? end_time : existing.end_time,
      title || existing.title, description !== undefined ? description : existing.description, category || existing.category,
      cover_image !== undefined ? cover_image : existing.cover_image, link !== undefined ? link : existing.link,
      sort_order !== undefined ? sort_order : existing.sort_order, req.params.id
    ]
  );
  const activity = get('SELECT * FROM activities WHERE id = ?', [req.params.id]);
  res.json(activity);
});

// DELETE /api/activities/:id — delete activity
router.delete('/activities/:id', (req, res) => {
  const existing = get('SELECT * FROM activities WHERE id = ?', [req.params.id]);
  if (!existing) return res.status(404).json({ error: 'Activity not found' });
  run('DELETE FROM activities WHERE id = ?', [req.params.id]);
  res.status(204).end();
});

module.exports = router;
