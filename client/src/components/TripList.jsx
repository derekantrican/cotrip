import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import TripCard from './TripCard';
import TripForm from './TripForm';
import './TripList.css';

function TripList() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    try {
      const data = await api.getTrips();
      setTrips(data);

      // Auto-navigate to active trip only on first visit (not when user clicked "back")
      if (!searchParams.has('list')) {
        const today = new Date().toISOString().split('T')[0];
        const activeTrip = data.find(t => t.start_date <= today && t.end_date >= today);
        if (activeTrip) {
          navigate(`/trip/${activeTrip.id}`);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(tripData) {
    try {
      await api.createTrip(tripData);
      setShowForm(false);
      loadTrips();
    } catch (err) {
      console.error('Failed to create trip:', err);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this trip and all its activities?')) return;
    try {
      await api.deleteTrip(id);
      loadTrips();
    } catch (err) {
      console.error('Failed to delete trip:', err);
    }
  }

  if (loading) return <div className="loading">Loading trips...</div>;

  return (
    <div className="trip-list">
      <header className="trip-list-header">
        <h1>CoTrip</h1>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ New Trip</button>
      </header>
      <div className="trip-grid">
        {trips.length === 0 ? (
          <p className="empty-state">No trips yet. Create your first trip!</p>
        ) : (
          trips.map(trip => (
            <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
          ))
        )}
      </div>
      {showForm && <TripForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />}
    </div>
  );
}

export default TripList;
