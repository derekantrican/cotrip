import React, { useState, useEffect } from 'react';
import { api } from '../api';
import './CalendarView.css';

function CalendarView({ days, getActivities, onSelectDay }) {
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(0); // 0 = Sunday

  useEffect(() => {
    api.getSettings().then(settings => {
      if (settings.first_day_of_week === 'monday') setFirstDayOfWeek(1);
    }).catch(() => {});
  }, []);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const orderedLabels = [...dayLabels.slice(firstDayOfWeek), ...dayLabels.slice(0, firstDayOfWeek)];

  // Find the first date and pad to the start of the week
  const firstDate = new Date(days[0] + 'T00:00:00');
  const firstDay = firstDate.getDay();
  const padBefore = (firstDay - firstDayOfWeek + 7) % 7;

  const cells = [];
  for (let i = 0; i < padBefore; i++) cells.push(null);
  days.forEach((date, index) => cells.push({ date, index }));
  // Pad to fill the last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        {orderedLabels.map(l => <div key={l} className="calendar-header-cell">{l}</div>)}
      </div>
      <div className="calendar-grid">
        {cells.map((cell, i) => {
          if (!cell) return <div key={i} className="calendar-cell empty" />;
          const activities = getActivities(cell.date);
          const dateObj = new Date(cell.date + 'T00:00:00');
          const isToday = cell.date === new Date().toISOString().split('T')[0];
          return (
            <div key={i} className={`calendar-cell ${isToday ? 'today' : ''}`} onClick={() => onSelectDay(cell.index)}>
              <div className="calendar-cell-date">{dateObj.getDate()}</div>
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

export default CalendarView;
