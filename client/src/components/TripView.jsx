import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import DayView from './DayView';
import TimelineView from './TimelineView';
import CalendarView from './CalendarView';
import FullTripView from './FullTripView';
import ActivityForm from './ActivityForm';
import IdeasPanel from './IdeasPanel';
import './TripView.css';

function TripView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('day');
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [movingActivity, setMovingActivity] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadTrip();
  }, [id]);

  // Auto-refresh trip data every 3 seconds for cross-device sync
  useEffect(() => {
    const interval = setInterval(() => {
      refreshTrip();
    }, 3000);
    return () => clearInterval(interval);
  }, [id]);

  async function refreshTrip() {
    try {
      const data = await api.getTrip(id);
      setTrip(data);
    } catch (err) {
      // Silent fail on background refresh
    }
  }

  async function loadTrip(preserveDay = false) {
    try {
      const data = await api.getTrip(id);
      setTrip(data);

      // Set current day to today only on initial load
      if (!preserveDay) {
        const today = new Date().toISOString().split('T')[0];
        if (today >= data.start_date && today <= data.end_date) {
          const start = new Date(data.start_date + 'T00:00:00');
          const now = new Date(today + 'T00:00:00');
          const dayIndex = Math.round((now - start) / (1000 * 60 * 60 * 24));
          setCurrentDayIndex(dayIndex);
        }
      }
    } catch (err) {
      console.error('Failed to load trip:', err);
    } finally {
      setLoading(false);
    }
  }

  function getDays() {
    if (!trip) return [];
    const days = [];
    const start = new Date(trip.start_date + 'T00:00:00');
    const end = new Date(trip.end_date + 'T00:00:00');
    let current = new Date(start);
    while (current <= end) {
      days.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return days;
  }

  function getActivitiesForDate(date) {
    if (!trip || !trip.activities) return [];
    return trip.activities.filter(a => a.date && (a.date === date || (a.end_date && a.date <= date && a.end_date >= date)));
  }

  function getIdeas() {
    if (!trip || !trip.activities) return [];
    return trip.activities.filter(a => !a.date);
  }

  async function handleCreateIdea(data) {
    try {
      await api.createActivity(data);
      loadTrip(true);
    } catch (err) {
      console.error('Failed to create idea:', err);
    }
  }

  async function handleScheduleIdea(idea, date) {
    try {
      await api.updateActivity(idea.id, { ...idea, date });
      loadTrip(true);
    } catch (err) {
      console.error('Failed to schedule idea:', err);
    }
  }

  async function handleCreateActivity(data) {
    try {
      await api.createActivity(data);
      setShowActivityForm(false);
      loadTrip(true);
    } catch (err) {
      console.error('Failed to create activity:', err);
    }
  }

  async function handleUpdateActivity(data) {
    try {
      await api.updateActivity(editingActivity.id, data);
      setEditingActivity(null);
      loadTrip(true);
    } catch (err) {
      console.error('Failed to update activity:', err);
    }
  }

  async function handleDeleteActivity(activityId) {
    if (!window.confirm('Delete this activity?')) return;
    try {
      await api.deleteActivity(activityId);
      loadTrip(true);
    } catch (err) {
      console.error('Failed to delete activity:', err);
    }
  }

  async function handleMoveActivity(activity, newDate) {
    try {
      await api.updateActivity(activity.id, { ...activity, date: newDate });
      setMovingActivity(null);
      loadTrip(true);
    } catch (err) {
      console.error('Failed to move activity:', err);
    }
  }

  async function handleDropOnDate(activityData, date) {
    try {
      await api.updateActivity(activityData.id, { ...activityData, date });
      loadTrip(true);
    } catch (err) {
      console.error('Failed to drop activity:', err);
    }
  }

  async function handleDropToIdeas(activityData) {
    try {
      await api.updateActivity(activityData.id, { ...activityData, date: null, start_time: null, end_time: null });
      loadTrip(true);
    } catch (err) {
      console.error('Failed to move to ideas:', err);
    }
  }

  function handlePrevDay() {
    setCurrentDayIndex(i => Math.max(0, i - 1));
  }

  function handleNextDay() {
    const days = getDays();
    setCurrentDayIndex(i => Math.min(days.length - 1, i + 1));
  }

  if (loading) return <div className="loading">Loading trip...</div>;
  if (!trip) return <div className="loading">Trip not found</div>;

  const days = getDays();
  const currentDate = days[currentDayIndex];
  const viewModes = ['day', 'timeline', 'calendar', 'trip'];

  // Touch/swipe handling for mobile
  let touchStartX = 0;
  function handleTouchStart(e) { touchStartX = e.touches[0].clientX; }
  function handleTouchEnd(e) {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) handlePrevDay();
      else handleNextDay();
    }
  }

  return (
    <div className="trip-view">
      <header className="trip-view-header">
        <button className="btn-back" onClick={() => navigate('/?list')}>← Trips</button>
        <h1>{trip.title}</h1>
        {!isMobile && (
          <div className="view-mode-toggle">
            {viewModes.map(mode => (
              <button
                key={mode}
                className={`view-mode-btn ${viewMode === mode ? 'active' : ''}`}
                onClick={() => setViewMode(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        )}
      </header>

      {(isMobile || viewMode === 'day') && (
        <div className="day-nav">
          <button className="nav-arrow" onClick={handlePrevDay} disabled={currentDayIndex === 0}>‹</button>
          <span className="day-nav-label">
            Day {currentDayIndex + 1} — {new Date(currentDate + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          <button className="nav-arrow" onClick={handleNextDay} disabled={currentDayIndex === days.length - 1}>›</button>
        </div>
      )}

      <div className="trip-view-body">
        {!isMobile && (
          <IdeasPanel
            ideas={getIdeas()}
            tripId={trip.id}
            days={days}
            onCreateIdea={handleCreateIdea}
            onEditIdea={setEditingActivity}
            onDeleteIdea={handleDeleteActivity}
            onScheduleIdea={handleScheduleIdea}
            onDropToIdeas={handleDropToIdeas}
          />
        )}
        <div className="trip-view-content" onTouchStart={isMobile ? handleTouchStart : undefined} onTouchEnd={isMobile ? handleTouchEnd : undefined}>
        {(isMobile || viewMode === 'day') && (
          <DayView
            date={currentDate}
            days={days}
            activities={getActivitiesForDate(currentDate)}
            allActivities={trip.activities}
            onAddActivity={() => setShowActivityForm(true)}
            onEditActivity={setEditingActivity}
            onDeleteActivity={handleDeleteActivity}
            onMoveActivity={setMovingActivity}
            onDropOnDate={handleDropOnDate}
          />
        )}
        {!isMobile && viewMode === 'timeline' && (
          <TimelineView
            days={days}
            getActivities={getActivitiesForDate}
            allActivities={trip.activities}
            onAddActivity={(date) => { setCurrentDayIndex(days.indexOf(date)); setShowActivityForm(true); }}
            onEditActivity={setEditingActivity}
            onDeleteActivity={handleDeleteActivity}
            onMoveActivity={setMovingActivity}
            currentDayIndex={currentDayIndex}
            onSelectDay={setCurrentDayIndex}
            onDropOnDate={handleDropOnDate}
          />
        )}
        {!isMobile && viewMode === 'calendar' && (
          <CalendarView
            days={days}
            getActivities={getActivitiesForDate}
            onSelectDay={(i) => { setCurrentDayIndex(i); setViewMode('day'); }}
            onDropOnDate={handleDropOnDate}
          />
        )}
        {!isMobile && viewMode === 'trip' && (
          <FullTripView
            days={days}
            getActivities={getActivitiesForDate}
            allActivities={trip.activities}
            onSelectDay={(i) => { setCurrentDayIndex(i); setViewMode('day'); }}
            onDropOnDate={handleDropOnDate}
          />
        )}
      </div>
      </div>

      {showActivityForm && (
        <ActivityForm
          tripId={trip.id}
          date={currentDate}
          onSubmit={handleCreateActivity}
          onClose={() => setShowActivityForm(false)}
        />
      )}
      {editingActivity && (
        <ActivityForm
          tripId={trip.id}
          activity={editingActivity}
          date={editingActivity.date}
          onSubmit={handleUpdateActivity}
          onClose={() => setEditingActivity(null)}
        />
      )}
      {movingActivity && (
        <div className="modal-overlay" onClick={() => setMovingActivity(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Move Activity</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Move "{movingActivity.title}" to:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflow: 'auto' }}>
              {days.map((d, i) => (
                <button
                  key={d}
                  className={`btn-sm ${d === movingActivity.date ? 'active' : ''}`}
                  style={d === movingActivity.date ? { background: 'var(--accent)', color: 'white' } : {}}
                  onClick={() => handleMoveActivity(movingActivity, d)}
                >
                  Day {i + 1} — {new Date(d + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </button>
              ))}
            </div>
            <div className="modal-actions" style={{ marginTop: '16px' }}>
              <button className="btn-secondary" onClick={() => setMovingActivity(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripView;
