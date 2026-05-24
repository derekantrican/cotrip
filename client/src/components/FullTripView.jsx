import React from 'react';
import './CalendarView.css';

function FullTripView({ days, getActivities, onSelectDay }) {
  // Similar to CalendarView but starts at trip day 1 in top-left (no weekday padding)
  const cells = days.map((date, index) => ({ date, index }));
  // Pad to fill the last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="calendar-header-cell">
            {i < days.length ? `Day ${i + 1}` : ''}
          </div>
        ))}
      </div>
      <div className="calendar-grid">
        {cells.map((cell, i) => {
          if (!cell) return <div key={i} className="calendar-cell empty" />;
          const activities = getActivities(cell.date);
          const dateObj = new Date(cell.date + 'T00:00:00');
          const isToday = cell.date === new Date().toISOString().split('T')[0];
          const label = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
          return (
            <div key={i} className={`calendar-cell ${isToday ? 'today' : ''}`} onClick={() => onSelectDay(cell.index)}>
              <div className="calendar-cell-date">Day {cell.index + 1}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
              <div className="calendar-cell-activities">
                {activities.slice(0, 3).map(a => (
                  <div key={a.id} className={`calendar-activity-dot category-${a.category}`}>
                    {a.title}
                  </div>
                ))}
                {activities.length > 3 && <span className="calendar-more">+{activities.length - 3}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FullTripView;
