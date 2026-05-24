import React, { useRef, useEffect } from 'react';
import ActivityCard from './ActivityCard';
import './TimelineView.css';

function TimelineView({ days, getActivities, onAddActivity, onEditActivity, onDeleteActivity, currentDayIndex, onSelectDay }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const cols = scrollRef.current.children;
      if (cols[currentDayIndex]) {
        cols[currentDayIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [currentDayIndex]);

  return (
    <div className="timeline-view" ref={scrollRef}>
      {days.map((date, index) => {
        const activities = getActivities(date);
        const dateObj = new Date(date + 'T00:00:00');
        const label = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
        const isToday = date === new Date().toISOString().split('T')[0];

        return (
          <div key={date} className={`timeline-column ${isToday ? 'today' : ''}`} onClick={() => onSelectDay(index)}>
            <div className="timeline-column-header">
              <span className="timeline-day-num">Day {index + 1}</span>
              <span className="timeline-day-label">{label}</span>
            </div>
            <div className="timeline-column-content">
              {activities.map(activity => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onEdit={() => onEditActivity(activity)}
                  onDelete={() => onDeleteActivity(activity.id)}
                />
              ))}
              <button className="btn-add-sm" onClick={(e) => { e.stopPropagation(); onAddActivity(date); }}>+</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TimelineView;
