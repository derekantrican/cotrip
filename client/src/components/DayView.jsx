import React from 'react';
import ActivityCard from './ActivityCard';
import './DayView.css';

function DayView({ date, activities, allActivities, days, onAddActivity, onEditActivity, onDeleteActivity, onMoveActivity, onDropOnDate }) {
  const dayIndex = days ? days.indexOf(date) : -1;
  const prevDate = dayIndex > 0 ? days[dayIndex - 1] : null;

  // Hotels that apply to this night (date matches this day)
  const tonightHotels = activities.filter(a => a.category === 'hotel' && a.date === date);

  // Hotels from previous night that span into today
  let lastNightHotels = [];
  if (allActivities && prevDate) {
    lastNightHotels = allActivities.filter(a =>
      a.category === 'hotel' && a.date !== date && a.end_date && a.date <= date && a.end_date >= date
    );
  }

  // Regular activities (non-hotel)
  const regularActivities = activities.filter(a => a.category !== 'hotel');

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDrop(e) {
    e.preventDefault();
    try {
      const activity = JSON.parse(e.dataTransfer.getData('application/json'));
      if (activity.date !== date && onDropOnDate) {
        onDropOnDate(activity, date);
      }
    } catch (err) {}
  }

  return (
    <div className="day-view" onDragOver={handleDragOver} onDrop={handleDrop}>
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

      <div className="day-activities">
        {regularActivities.length === 0 && lastNightHotels.length === 0 && tonightHotels.length === 0 ? (
          <p className="day-empty">No activities planned for this day</p>
        ) : regularActivities.length === 0 ? (
          <p className="day-empty">No activities (aside from hotels)</p>
        ) : (
          regularActivities.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onEdit={() => onEditActivity(activity)}
              onDelete={() => onDeleteActivity(activity.id)}
              onMove={() => onMoveActivity(activity)}
            />
          ))
        )}
      </div>

      <button className="btn-add-activity" onClick={onAddActivity}>+ Add Activity</button>

      {tonightHotels.length > 0 && (
        <div className="day-hotel-section day-hotel-bottom">
          {tonightHotels.map(activity => (
            <ActivityCard
              key={`tonight-${activity.id}`}
              activity={activity}
              onEdit={() => onEditActivity(activity)}
              onDelete={() => onDeleteActivity(activity.id)}
              onMove={() => onMoveActivity(activity)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DayView;
