# CoTrip — Trip Planning App

## Overview

A mobile-friendly, dark-themed React app for planning multi-day trips. Each trip has a date range, and each day can contain time-blocked activities (transportation, hotel, sight-seeing, etc.) with cover images, links, titles, and markdown descriptions.

---

## Tech Stack

| Layer      | Choice                              |
|------------|-------------------------------------|
| Frontend   | Create React App (JavaScript)       |
| Styling    | Plain CSS (dark theme, responsive)  |
| Backend    | Express.js                          |
| Database   | SQLite (via `better-sqlite3`)       |
| Deployment | Railway (single service or monorepo)|
| Auth       | None (single user, v1)             |

---

## Project Structure

```
cotrip/
├── client/                  # CRA frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── TripList.jsx         # Dashboard: trip cards
│       │   ├── TripCard.jsx         # Card showing trip summary
│       │   ├── TripView.jsx         # Trip wrapper: view mode switcher
│       │   ├── DayView.jsx          # Single day: vertical activity timeline
│       │   ├── TimelineView.jsx     # Multi-day horizontal scroll columns
│       │   ├── CalendarView.jsx     # Sun-Sat (or Mon-Sun) grid
│       │   ├── FullTripView.jsx     # Grid starting at trip day 1
│       │   ├── DayNav.jsx           # Mobile: < Day 3 — Wed Jun 7 >
│       │   ├── ActivityCard.jsx     # Single activity block
│       │   ├── ActivityForm.jsx     # Add/edit activity modal
│       │   ├── TripForm.jsx         # Create/edit trip modal
│       │   ├── SettingsPanel.jsx    # User preferences (first day of week, etc.)
│       │   └── MarkdownRenderer.jsx # Renders markdown descriptions
│       ├── App.jsx
│       ├── App.css
│       ├── index.js
│       └── index.css                # CSS variables, dark theme globals
├── server/                  # Express API
│   ├── index.js             # Server entry point
│   ├── db.js                # SQLite setup + migrations
│   └── routes/
│       ├── trips.js         # CRUD for trips
│       └── activities.js    # CRUD for activities
├── package.json             # Root scripts (dev, build, start)
└── PLAN.md
```

---

## Data Model (SQLite)

### `trips`
| Column       | Type    | Notes                        |
|--------------|---------|------------------------------|
| id           | INTEGER | PK, autoincrement            |
| title        | TEXT    | Trip name                    |
| start_date   | TEXT    | ISO date (YYYY-MM-DD)        |
| end_date     | TEXT    | ISO date (YYYY-MM-DD)        |
| cover_image  | TEXT    | Optional URL for trip card    |
| created_at   | TEXT    | ISO timestamp                |

### `activities`
| Column       | Type    | Notes                              |
|--------------|---------|------------------------------------|
| id           | INTEGER | PK, autoincrement                  |
| trip_id      | INTEGER | FK → trips.id                      |
| date         | TEXT    | ISO date (YYYY-MM-DD)              |
| start_time   | TEXT    | HH:MM (24h)                        |
| end_time     | TEXT    | HH:MM (24h), nullable              |
| title        | TEXT    | Activity name                      |
| description  | TEXT    | Markdown-formatted                 |
| category     | TEXT    | transportation/hotel/sight-seeing/food/other |
| cover_image  | TEXT    | URL, nullable                      |
| link         | TEXT    | URL (e.g., Gmail reservation link) |
| sort_order   | INTEGER | For manual reordering              |
| created_at   | TEXT    | ISO timestamp                      |

### `settings`
| Column | Type | Notes                              |
|--------|------|------------------------------------|
| key    | TEXT | PK (e.g., "first_day_of_week")     |
| value  | TEXT | JSON-encoded value                 |

**Default settings:**
- `first_day_of_week`: `"sunday"` (options: `"sunday"`, `"monday"`)

---

## UI / UX Design

### Theme
- **Background:** `#0a0a0a` (near-black)
- **Surface/cards:** `#1a1a1a`
- **Text:** `#f0f0f0` (white)
- **Accent:** `#6366f1` (indigo/violet — can tweak later)
- **Muted text:** `#a0a0a0`
- **Category colors:** each activity type gets a subtle left-border accent

### Home / Dashboard
- If a trip is **currently active** (today falls within its date range) → auto-navigate to that trip's view, scrolled to today's date
- Otherwise → show a grid/list of trip cards (sorted by date, upcoming first)
- FAB or button to "Create Trip"

### Trip Views (Desktop)

Four view modes, selectable via toggle/tabs in the trip header:

1. **Day View** — Single day, full detail. Activities shown in a vertical timeline. Nav arrows or day picker to switch days.

2. **Timeline View** — Multiple days side-by-side, each column takes the full vertical height of the viewport. Horizontally scrollable. Good for seeing a few days at a glance.

3. **Calendar View** — Days laid out in a Sun–Sat grid (or Mon–Sun, based on user setting). Each day is a card showing activity summaries. Traditional calendar feel.

4. **Trip View** — Similar grid layout to Calendar, but always starts with the first day of the trip in the top-left corner regardless of what weekday it falls on. Compact overview of the entire trip.

**Setting:** "First day of the week" (Sun or Mon) — affects Calendar View grid layout. Stored as a user preference.

### Trip Views (Mobile)

- **Day View only** — single day fills the screen
- Vertical scroll to see all activities for that day
- **Swipe left/right** to traverse between days (gesture-based navigation)
- **< / > arrow buttons** at the top as an alternative to swiping (also serves as a visual affordance)
- Day indicator/label between the arrows (e.g., "Day 3 — Wed Jun 7")

### Activity Card
- Cover image at top (if provided)
- Category badge/icon
- Title (bold)
- Time range (e.g., "9:00 AM – 11:30 AM")
- Description preview (first ~2 lines of rendered markdown)
- Tap to expand full details + link button

### Responsive Behavior
- Mobile (<768px): Day View only, swipe navigation
- Desktop (≥768px): All four views available, default to Timeline View

---

## API Endpoints

### Trips
| Method | Path            | Description         |
|--------|-----------------|---------------------|
| GET    | /api/trips      | List all trips      |
| GET    | /api/trips/:id  | Get trip + days     |
| POST   | /api/trips      | Create trip         |
| PUT    | /api/trips/:id  | Update trip         |
| DELETE | /api/trips/:id  | Delete trip         |

### Activities
| Method | Path                      | Description              |
|--------|---------------------------|--------------------------|
| GET    | /api/trips/:id/activities | All activities for a trip|
| POST   | /api/activities           | Create activity          |
| PUT    | /api/activities/:id       | Update activity          |
| DELETE | /api/activities/:id       | Delete activity          |

---

## Implementation Phases

### Phase 1 — Scaffolding & Backend
- [ ] Initialize CRA in `client/`
- [ ] Initialize Express server in `server/`
- [ ] Set up SQLite with `better-sqlite3`, create tables
- [ ] Implement trip CRUD routes
- [ ] Implement activity CRUD routes
- [ ] Root `package.json` scripts for dev (concurrently) and production build

### Phase 2 — Core Frontend
- [ ] Dark theme CSS variables + global styles
- [ ] Dashboard / TripList with TripCard
- [ ] TripForm (create/edit trip)
- [ ] TripView with day tabs
- [ ] DayView with timeline of ActivityCards
- [ ] ActivityForm (create/edit activity)
- [ ] Markdown rendering for descriptions (using `react-markdown`)

### Phase 3 — Polish & Deploy
- [ ] Auto-navigate to active trip + today's day
- [ ] Responsive tweaks
- [ ] Loading/error states
- [ ] Railway deployment config (single service: Express serves built CRA)
- [ ] Persist SQLite DB on Railway volume

---

## Future Ideas (not v1)
- "Now" indicator line on today's timeline
- Timezone support per day/activity
- Drag-and-drop reordering
- Share trip via read-only link
- Export itinerary to PDF
- Weather forecast integration
- Map view with activity pins
