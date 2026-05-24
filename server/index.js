const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize DB then start server
getDb().then(() => {
  // API routes
  const tripsRouter = require('./routes/trips');
  const activitiesRouter = require('./routes/activities');
  const settingsRouter = require('./routes/settings');

  app.use('/api/trips', tripsRouter);
  app.use('/api', activitiesRouter);
  app.use('/api/settings', settingsRouter);

  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`CoTrip server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
