const express = require('express');
const router = express.Router();
const { all, get, run } = require('../db');

// GET /api/trips — list all trips
router.get('/', (req, res) => {
  const trips = all('SELECT * FROM trips ORDER BY start_date DESC');
  res.json(trips);
});

// GET /api/trips/:id — get single trip with activities
router.get('/:id', (req, res) => {
  const trip = get('SELECT * FROM trips WHERE id = ?', [req.params.id]);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  const activities = all('SELECT * FROM activities WHERE trip_id = ? ORDER BY COALESCE(date, "9999-99-99"), COALESCE(end_date, date), start_time, sort_order', [req.params.id]);
  res.json({ ...trip, activities });
});

// POST /api/trips — create trip
router.post('/', (req, res) => {
  const { title, start_date, end_date, cover_image } = req.body;
  if (!title || !start_date || !end_date) {
    return res.status(400).json({ error: 'title, start_date, and end_date are required' });
  }
  const result = run('INSERT INTO trips (title, start_date, end_date, cover_image) VALUES (?, ?, ?, ?)', [title, start_date, end_date, cover_image || null]);
  const trip = get('SELECT * FROM trips WHERE id = ?', [result.lastInsertRowid]);
  res.status(201).json(trip);
});

// PUT /api/trips/:id — update trip
router.put('/:id', (req, res) => {
  const { title, start_date, end_date, cover_image } = req.body;
  const existing = get('SELECT * FROM trips WHERE id = ?', [req.params.id]);
  if (!existing) return res.status(404).json({ error: 'Trip not found' });
  run('UPDATE trips SET title = ?, start_date = ?, end_date = ?, cover_image = ? WHERE id = ?', [
    title || existing.title, start_date || existing.start_date, end_date || existing.end_date,
    cover_image !== undefined ? cover_image : existing.cover_image, req.params.id
  ]);
  const trip = get('SELECT * FROM trips WHERE id = ?', [req.params.id]);
  res.json(trip);
});

// DELETE /api/trips/:id — delete trip and its activities
router.delete('/:id', (req, res) => {
  const existing = get('SELECT * FROM trips WHERE id = ?', [req.params.id]);
  if (!existing) return res.status(404).json({ error: 'Trip not found' });
  run('DELETE FROM activities WHERE trip_id = ?', [req.params.id]);
  run('DELETE FROM trips WHERE id = ?', [req.params.id]);
  res.status(204).end();
});

module.exports = router;
