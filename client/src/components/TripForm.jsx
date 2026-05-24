import React, { useState } from 'react';
import './TripForm.css';

function TripForm({ trip, onSubmit, onClose }) {
  const [title, setTitle] = useState(trip?.title || '');
  const [startDate, setStartDate] = useState(trip?.start_date || '');
  const [endDate, setEndDate] = useState(trip?.end_date || '');
  const [coverImage, setCoverImage] = useState(trip?.cover_image || '');

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      title,
      start_date: startDate,
      end_date: endDate,
      cover_image: coverImage || null,
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{trip ? 'Edit Trip' : 'New Trip'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Summer in Japan" />
          </label>
          <label>
            Start Date
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </label>
          <label>
            End Date
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
          </label>
          <label>
            Cover Image URL
            <input type="url" value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="https://..." />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{trip ? 'Save' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TripForm;
