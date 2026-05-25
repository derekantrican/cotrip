import React, { useState } from 'react';
import './TripForm.css';

const CATEGORIES = [
  { value: 'transportation', label: '✈️ Transportation' },
  { value: 'hotel', label: '🏨 Hotel' },
  { value: 'sight-seeing', label: '📸 Sight-seeing' },
  { value: 'food', label: '🍜 Food' },
  { value: 'other', label: '📌 Other' },
];

function ActivityForm({ tripId, activity, date, onSubmit, onClose }) {
  const [title, setTitle] = useState(activity?.title || '');
  const [startTime, setStartTime] = useState(activity?.start_time || '');
  const [endTime, setEndTime] = useState(activity?.end_time || '');
  const [category, setCategory] = useState(activity?.category || 'other');
  const [endDate, setEndDate] = useState(activity?.end_date || '');
  const [description, setDescription] = useState(activity?.description || '');
  const [coverImage, setCoverImage] = useState(activity?.cover_image || '');
  const [link, setLink] = useState(activity?.link || '');
  const [mapLink, setMapLink] = useState(activity?.map_link || '');

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      trip_id: tripId,
      date: activity?.date || date,
      start_time: startTime || null,
      end_time: endTime || null,
      title,
      description: description || null,
      category,
      end_date: endDate || null,
      cover_image: coverImage || null,
      link: link || null,
      map_link: mapLink || null,
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>{activity ? 'Edit Activity' : 'New Activity'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Visit Senso-ji Temple" />
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <label>
              Start Time
              <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
            </label>
            <label>
              End Time
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
            </label>
          </div>
          <label>
            Category
            <select value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </label>
          <label>
            End Date <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>(for multi-day activities)</span>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </label>
          <label>
            Description (Markdown)
            <textarea rows="4" value={description} onChange={e => setDescription(e.target.value)} placeholder="Details about this activity..." />
          </label>
          <label>
            Cover Image URL
            <input type="url" value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="https://..." />
          </label>
          <label>
            Link
            <input type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="https://mail.google.com/..." />
          </label>
          <label>
            Google Maps Link
            <input type="url" value={mapLink} onChange={e => setMapLink(e.target.value)} placeholder="https://maps.google.com/..." />
          </label>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">{activity ? 'Save' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ActivityForm;
