import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import './ActivityCard.css';

const CATEGORY_LABELS = {
  transportation: '✈️ Transportation',
  hotel: '🏨 Hotel',
  'sight-seeing': '📸 Sight-seeing',
  food: '🍜 Food',
  other: '📌 Other',
};

function ActivityCard({ activity, onEdit, onDelete, onMove }) {
  const [expanded, setExpanded] = useState(false);

  function formatTime(time) {
    if (!time) return '';
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 || 12;
    return `${h12}:${m} ${ampm}`;
  }

  const timeStr = activity.start_time
    ? `${formatTime(activity.start_time)}${activity.end_time ? ' – ' + formatTime(activity.end_time) : ''}`
    : '';

  return (
    <div className={`activity-card category-${activity.category || 'other'}`} onClick={() => setExpanded(!expanded)}>
      {activity.cover_image && (
        <div className="activity-card-image" style={{ backgroundImage: `url(${activity.cover_image})` }} />
      )}
      <div className="activity-card-body">
        <div className="activity-card-header">
          <span className="activity-category">{CATEGORY_LABELS[activity.category] || CATEGORY_LABELS.other}</span>
          {timeStr && <span className="activity-time">{timeStr}</span>}
        </div>
        <h4 className="activity-title">{activity.title}</h4>
        {expanded && activity.description && (
          <div className="activity-description">
            <MarkdownRenderer content={activity.description} />
          </div>
        )}
        {expanded && (
          <div className="activity-actions">
            {activity.link && (
              <a href={activity.link} target="_blank" rel="noopener noreferrer" className="btn-sm btn-open" onClick={e => e.stopPropagation()}>Open</a>
            )}
            <button className="btn-sm" onClick={(e) => { e.stopPropagation(); onMove(); }}>Move</button>
            <button className="btn-sm" onClick={(e) => { e.stopPropagation(); onEdit(); }}>Edit</button>
            <button className="btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); onDelete(); }}>Delete</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityCard;
