import React, { useState } from 'react';
import ActivityCard from './ActivityCard';
import './IdeasPanel.css';

function IdeasPanel({ ideas, tripId, days, onCreateIdea, onEditIdea, onDeleteIdea, onScheduleIdea }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('other');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [schedulingIdea, setSchedulingIdea] = useState(null);

  const CATEGORIES = [
    { value: 'transportation', label: '✈️ Transportation' },
    { value: 'hotel', label: '🏨 Hotel' },
    { value: 'sight-seeing', label: '📸 Sight-seeing' },
    { value: 'food', label: '🍜 Food' },
    { value: 'other', label: '📌 Other' },
  ];

  function handleSubmit(e) {
    e.preventDefault();
    onCreateIdea({
      trip_id: tripId,
      date: null,
      start_time: null,
      end_time: null,
      title,
      description: description || null,
      category,
      cover_image: coverImage || null,
      link: link || null,
      map_link: mapLink || null,
    });
    setTitle('');
    setCategory('other');
    setDescription('');
    setLink('');
    setMapLink('');
    setCoverImage('');
    setShowForm(false);
  }

  function handleSchedule(idea, date) {
    onScheduleIdea(idea, date);
    setSchedulingIdea(null);
  }

  return (
    <div className={`ideas-panel ${collapsed ? 'collapsed' : ''}`}>
      <button className="ideas-panel-toggle" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? '💡›' : '‹💡'}
      </button>
      {!collapsed && (
        <div className="ideas-panel-content">
          <h3 className="ideas-panel-title">Ideas</h3>
          <div className="ideas-list">
            {ideas.length === 0 && !showForm && (
              <p className="ideas-empty">No ideas yet. Add activities you're considering!</p>
            )}
            {ideas.map(idea => (
              <div key={idea.id} className="idea-item">
                <ActivityCard
                  activity={idea}
                  onEdit={() => onEditIdea(idea)}
                  onDelete={() => onDeleteIdea(idea.id)}
                  onMove={() => setSchedulingIdea(idea)}
                  compact
                />
              </div>
            ))}
          </div>
          {showForm ? (
            <form className="idea-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Activity title..."
                required
                autoFocus
              />
              <select value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <textarea
                rows="2"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Description (optional)"
              />
              <input
                type="url"
                value={link}
                onChange={e => setLink(e.target.value)}
                placeholder="Link (optional)"
              />
              <input
                type="url"
                value={mapLink}
                onChange={e => setMapLink(e.target.value)}
                placeholder="Google Maps link (optional)"
              />
              <input
                type="url"
                value={coverImage}
                onChange={e => setCoverImage(e.target.value)}
                placeholder="Cover image URL (optional)"
              />
              <div className="idea-form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Add</button>
              </div>
            </form>
          ) : (
            <button className="btn-add-idea" onClick={() => setShowForm(true)}>+ Add Idea</button>
          )}
        </div>
      )}

      {schedulingIdea && (
        <div className="modal-overlay" onClick={() => setSchedulingIdea(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Schedule Idea</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>Schedule "{schedulingIdea.title}" on:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflow: 'auto' }}>
              {days.map((d, i) => (
                <button
                  key={d}
                  className="btn-sm"
                  onClick={() => handleSchedule(schedulingIdea, d)}
                >
                  Day {i + 1} — {new Date(d + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                </button>
              ))}
            </div>
            <div className="modal-actions" style={{ marginTop: '16px' }}>
              <button className="btn-secondary" onClick={() => setSchedulingIdea(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IdeasPanel;
