import React, { useRef, useEffect } from 'react';
import ActivityCard from './ActivityCard';
import './TimelineView.css';

function TimelineView({ days, getActivities, allActivities, onAddActivity, onEditActivity, onDeleteActivity, onMoveActivity, currentDayIndex, onSelectDay }) {
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

        const prevDate = index > 0 ? days[index - 1] : null;
        const tonightHotels = activities.filter(a => a.category === 'hotel' && a.date === date);
        let lastNightHotels = [];
        if (allActivities && prevDate) {
          lastNightHotels = allActivities.filter(a =>
            a.category === 'hotel' && a.date !== date && a.end_date && a.date <= date && a.end_date >= date
          );
        }
        const regularActivities = activities.filter(a => a.category !== 'hotel');

        return (
          <div key={date} className={`timeline-column ${isToday ? 'today' : ''}`} onClick={() => onSelectDay(index)}>
            <div className="timeline-column-header">
              <span className="timeline-day-num">Day {index + 1}</span>
              <span className="timeline-day-label">{label}</span>
            </div>
            {lastNightHotels.length > 0 && (
              <div className="day-hotel-section day-hotel-top">
                {lastNightHotels.map(activity => (
                  <ActivityCard
                    key={`prev-${activity.id}`}
                    activity={activity}
                    onEdit={() => onEditActivity(activity)}
                    onDelete={() => onDeleteActivity(activity.id)}
                    onMove={() => onMoveActivity(activity)}
                    compact
                  />
                ))}
              </div>
            )}
            <div className="timeline-column-content">
              {regularActivities.map(activity => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  onEdit={() => onEditActivity(activity)}
                  onDelete={() => onDeleteActivity(activity.id)}
                  onMove={() => onMoveActivity(activity)}
                />
              ))}
              <button className="btn-add-sm" onClick={(e) => { e.stopPropagation(); onAddActivity(date); }}>+</button>
            </div>
            {tonightHotels.length > 0 && (
              <div className="day-hotel-section day-hotel-bottom">
                {tonightHotels.map(activity => (
                  <ActivityCard
                    key={`tonight-${activity.id}`}
                    activity={activity}
                    onEdit={() => onEditActivity(activity)}
                    onDelete={() => onDeleteActivity(activity.id)}
                    onMove={() => onMoveActivity(activity)}
                    compact
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TimelineView;
