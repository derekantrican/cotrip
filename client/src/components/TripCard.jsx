import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TripCard.css';

function TripCard({ trip, onDelete }) {
  const navigate = useNavigate();

  function formatDateRange(start, end) {
    const s = new Date(start + 'T00:00:00');
    const e = new Date(end + 'T00:00:00');
    const opts = { month: 'short', day: 'numeric' };
    const startStr = s.toLocaleDateString(undefined, opts);
    const endStr = e.toLocaleDateString(undefined, { ...opts, year: 'numeric' });
    return `${startStr} – ${endStr}`;
  }

  function getDayCount(start, end) {
    const s = new Date(start + 'T00:00:00');
    const e = new Date(end + 'T00:00:00');
    return Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
  }

  return (
    <div className="trip-card" onClick={() => navigate(`/trip/${trip.id}`)}>
      {trip.cover_image && (
        <div className="trip-card-image" style={{ backgroundImage: `url(${trip.cover_image})` }} />
      )}
      <div className="trip-card-content">
        <h3>{trip.title}</h3>
        <p className="trip-card-dates">{formatDateRange(trip.start_date, trip.end_date)}</p>
        <p className="trip-card-days">{getDayCount(trip.start_date, trip.end_date)} days</p>
      </div>
      <button className="trip-card-delete" onClick={(e) => { e.stopPropagation(); onDelete(trip.id); }} title="Delete trip">✕</button>
    </div>
  );
}

export default TripCard;
