import React from 'react';
import ActivityCard from './ActivityCard';
import './DayView.css';

function DayView({ date, activities, onAddActivity, onEditActivity, onDeleteActivity }) {
  return (
    <div className="day-view">
      <div className="day-activities">
        {activities.length === 0 ? (
          <p className="day-empty">No activities planned for this day</p>
        ) : (
          activities.map(activity => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onEdit={() => onEditActivity(activity)}
              onDelete={() => onDeleteActivity(activity.id)}
            />
          ))
        )}
      </div>
      <button className="btn-add-activity" onClick={onAddActivity}>+ Add Activity</button>
    </div>
  );
}

export default DayView;
