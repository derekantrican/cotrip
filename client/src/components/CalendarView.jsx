import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { getLocalToday } from '../utils/dateUtils';
import './CalendarView.css';

function CalendarView({ days, getActivities, onSelectDay, onDropOnDate }) {
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(0);

  const startHour = 0;
  const endHour = 24;

  useEffect(() => {
    api.getSettings().then(settings => {
      if (settings.first_day_of_week === 'monday') setFirstDayOfWeek(1);
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

  function formatTime(time) {
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'p' : 'a';
    const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour}:${m.toString().padStart(2, '0')}${ampm}`;
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
            <div className="calendar-time-gutter-header"></div>
            <div className="calendar-time-gutter-body">
              {HOURS.filter((_, i) => i % 3 === 0).map(h => (
                <div key={h} className="calendar-time-label" style={{ top: `${((h - startHour) / totalHours) * 100}%` }}>
                  {h === 0 ? '12:00a' : h < 12 ? `${h}:00a` : h === 12 ? '12:00p' : `${h - 12}:00p`}
                </div>
              ))}
            </div>
          </div>
          {week.map((cell, ci) => {
            if (!cell) return <div key={ci} className="calendar-day-col empty" />;
            const allDayActivities = getActivities(cell.date);
            const activities = allDayActivities.filter(a => a.category !== 'hotel');
            const hotels = allDayActivities.filter(a => a.category === 'hotel');
            const dateObj = new Date(cell.date + 'T00:00:00');
            const isToday = cell.date === getLocalToday();
            return (
              <div key={ci} className={`calendar-day-col ${isToday ? 'today' : ''}`} onClick={() => onSelectDay(cell.index)}
                onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
                onDrop={(e) => { e.preventDefault(); e.stopPropagation(); try { const a = JSON.parse(e.dataTransfer.getData('application/json')); if (a.date !== cell.date && onDropOnDate) onDropOnDate(a, cell.date); } catch(err){} }}
              >
                <div className="calendar-day-col-header">
                  {dateObj.getDate()}
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
                        {(a.start_time || a.end_time) && (
                          <span className="calendar-event-time">
                            {a.start_time && formatTime(a.start_time)}
                            {a.start_time && a.end_time && ' – '}
                            {a.end_time && formatTime(a.end_time)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {hotels.length > 0 && (
                  <div className="calendar-day-hotels">
                    {hotels.map(h => (
                      <div key={h.id} className="calendar-hotel-item">
                        🏨 {h.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default CalendarView;
