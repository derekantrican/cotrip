const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'cotrip.db');

let db = null;

async function getDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  // Load existing database if file exists
  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      cover_image TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id INTEGER NOT NULL,
      date TEXT,
      end_date TEXT,
      start_time TEXT,
      end_time TEXT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'other',
      cover_image TEXT,
      link TEXT,
      map_link TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
    )
  `);

  const activityColumns = all('PRAGMA table_info(activities)');
  if (!activityColumns.some((column) => column.name === 'end_date')) {
    db.run('ALTER TABLE activities ADD COLUMN end_date TEXT');
  }
  if (!activityColumns.some((column) => column.name === 'map_link')) {
    db.run('ALTER TABLE activities ADD COLUMN map_link TEXT');
  }

  // Migration: allow null date (for ideas)
  const dateCol = activityColumns.find(c => c.name === 'date');
  if (dateCol && dateCol.notnull === 1) {
    db.run(`CREATE TABLE activities_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id INTEGER NOT NULL,
      date TEXT,
      end_date TEXT,
      start_time TEXT,
      end_time TEXT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'other',
      cover_image TEXT,
      link TEXT,
      map_link TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
    )`);
    db.run('INSERT INTO activities_new SELECT id, trip_id, date, end_date, start_time, end_time, COALESCE(title, \'Untitled\'), description, category, cover_image, link, map_link, sort_order, created_at FROM activities');
    db.run('DROP TABLE activities');
    db.run('ALTER TABLE activities_new RENAME TO activities');
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Insert default settings if not present
  db.run("INSERT OR IGNORE INTO settings (key, value) VALUES ('first_day_of_week', '\"sunday\"')");
  db.run("INSERT OR IGNORE INTO settings (key, value) VALUES ('calendar_start_hour', '6')");
  db.run("INSERT OR IGNORE INTO settings (key, value) VALUES ('calendar_end_hour', '24')");

  save();
  return db;
}

function save() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

// Helper: run a query and return all rows as objects
function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

// Helper: run a query and return first row
function get(sql, params = []) {
  const rows = all(sql, params);
  return rows[0] || null;
}

// Helper: run an insert/update/delete
function run(sql, params = []) {
  db.run(sql, params);
  // Get the last insert rowid using a prepared statement
  const stmt = db.prepare("SELECT last_insert_rowid() as id");
  stmt.step();
  const lastId = stmt.getAsObject().id;
  stmt.free();
  save();
  return { lastInsertRowid: lastId };
}

module.exports = { getDb, all, get, run, save };
