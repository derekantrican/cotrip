import React, { useState, useEffect } from 'react';
import { api } from '../api';
import './CalendarView.css';

function CalendarView({ days, getActivities, onSelectDay }) {
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(0);
  const [startHour, setStartHour] = useState(6);
  const [endHour, setEndHour] = useState(24);

  useEffect(() => {
    api.getSettings().then(settings => {
      if (settings.first_day_of_week === 'monday') setFirstDayOfWeek(1);
      if (settings.calendar_start_hour !== undefined) setStartHour(settings.calendar_start_hour);
      if (settings.calendar_end_hour !== undefined) setEndHour(settings.calendar_end_hour);
    }).catch(() => {});
  }, []);

  const totalHours = endHour - startHour;
  const HOURS = Array.from({ length: totalHours }, (_, i) => i + startHour);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const orderedLabels = [...dayLabels.slice(firstDayOfWeek), ...dayLabels.slice(0, firstDayOfWeek)];

  const firstDate = new Date(days[0] + 'T00:00:00');
  const firstDay = firstDate.getDay();
  const padBefore = (firstDay - firstDayOfWeek + 7) % 7;

  const cells = [];
  for (let i = 0; i < padBefore; i++) cells.push(null);
  days.forEach((date, index) => cells.push({ date, index }));
  while (cells.length % 7 !== 0) cells.push(null);

  // Group into weeks
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  function getActivityStyle(activity, cellDate) {
    const totalMin = totalHours * 60;
    const isMultiDay = activity.end_date && activity.end_date !== activity.date;

    if (!isMultiDay) {
      // Single-day activity
      if (!activity.start_time) return { top: '0%', height: '20px' };
      const [sh, sm] = activity.start_time.split(':').map(Number);
      const startMin = (sh - startHour) * 60 + sm;
      const top = Math.max(0, (startMin / totalMin) * 100);

      let height = 5;
      if (activity.end_time) {
        const [eh, em] = activity.end_time.split(':').map(Number);
        const endMin = (eh - startHour) * 60 + em;
        height = Math.max(3, ((endMin - startMin) / totalMin) * 100);
      }
      return { top: `${top}%`, height: `${height}%` };
    }

    // Multi-day activity: determine if this is start day, middle day, or end day
    const isStartDay = cellDate === activity.date;
    const isEndDay = cellDate === activity.end_date;

    if (isStartDay) {
      // Start from start_time, extend to bottom of day
      if (!activity.start_time) return { top: '0%', height: '100%' };
      const [sh, sm] = activity.start_time.split(':').map(Number);
      const startMin = (sh - startHour) * 60 + sm;
      const top = Math.max(0, (startMin / totalMin) * 100);
      return { top: `${top}%`, height: `${100 - top}%` };
    } else if (isEndDay) {
      // Start from top of day, extend to end_time
      if (!activity.end_time) return { top: '0%', height: '20px' };
      const [eh, em] = activity.end_time.split(':').map(Number);
      const endMin = (eh - startHour) * 60 + em;
      const height = Math.max(3, (endMin / totalMin) * 100);
      return { top: '0%', height: `${height}%` };
    } else {
      // Middle day: spans the entire day
      return { top: '0%', height: '100%' };
    }
  }

  function getCategoryColor(cat) {
    const colors = {
      transportation: 'var(--cat-transportation)',
      hotel: 'var(--cat-hotel)',
      'sight-seeing': 'var(--cat-sight-seeing)',
      food: 'var(--cat-food)',
      other: 'var(--cat-other)',
    };
    return colors[cat] || colors.other;
  }

  return (
    <div className="calendar-view calendar-timeblock">
      <div className="calendar-header">
        <div className="calendar-header-cell time-gutter"></div>
        {orderedLabels.map(l => <div key={l} className="calendar-header-cell">{l}</div>)}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="calendar-week-row">
          <div className="calendar-time-gutter">
            {HOURS.filter((_, i) => i % 3 === 0).map(h => (
              <div key={h} className="calendar-time-label" style={{ top: `${((h - startHour) / totalHours) * 100}%` }}>
                {h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`}
              </div>
            ))}
          </div>
          {week.map((cell, ci) => {
            if (!cell) return <div key={ci} className="calendar-day-col empty" />;
            const allDayActivities = getActivities(cell.date);
            const activities = allDayActivities.filter(a => a.category !== 'hotel');
            const hotels = allDayActivities.filter(a => a.category === 'hotel');
            const dateObj = new Date(cell.date + 'T00:00:00');
            const isToday = cell.date === new Date().toISOString().split('T')[0];
            return (
              <div key={ci} className={`calendar-day-col ${isToday ? 'today' : ''}`} onClick={() => onSelectDay(cell.index)}>
                <div className="calendar-day-col-header">
                  {dateObj.getDate()}
                  {hotels.length > 0 && <span className="calendar-hotel-badge" title={hotels[0].title}>🏨</span>}
                </div>
                <div className="calendar-day-col-body">
                  {activities.map(a => {
                    const style = getActivityStyle(a, cell.date);
                    return (
                      <div
                        key={a.id}
                        className="calendar-event"
                        style={{ ...style, backgroundColor: getCategoryColor(a.category) }}
                        title={`${a.title}${a.start_time ? ' (' + a.start_time + ')' : ''}`}
                      >
                        <span className="calendar-event-title">{a.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default CalendarView;
