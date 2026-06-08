import React from 'react';
import './CalendarView.css';

function FullTripView({ days, getActivities, allActivities, onSelectDay, onDropOnDate }) {
  const cells = days.map((date, index) => ({ date, index }));
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="calendar-view">
      <div className="calendar-grid">
        {cells.map((cell, i) => {
          if (!cell) return <div key={i} className="calendar-cell empty" />;
          const activities = getActivities(cell.date);
          const dateObj = new Date(cell.date + 'T00:00:00');
          const isToday = cell.date === new Date().toISOString().split('T')[0];
          const label = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

          const prevDate = cell.index > 0 ? days[cell.index - 1] : null;
          const tonightHotels = activities.filter(a => a.category === 'hotel' && a.date === cell.date);
          let lastNightHotels = [];
          if (allActivities && prevDate) {
            lastNightHotels = allActivities.filter(a =>
              a.category === 'hotel' && a.date !== cell.date && a.end_date && a.date <= cell.date && a.end_date >= cell.date
            );
          }
          const regularActivities = activities.filter(a => a.category !== 'hotel');

          return (
            <div key={i} className={`calendar-cell ${isToday ? 'today' : ''}`} onClick={() => onSelectDay(cell.index)}
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
              onDrop={(e) => { e.preventDefault(); try { const a = JSON.parse(e.dataTransfer.getData('application/json')); if (a.date !== cell.date && onDropOnDate) onDropOnDate(a, cell.date); } catch(err){} }}
            >
              <div className="calendar-cell-date">Day {cell.index + 1}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
              {lastNightHotels.length > 0 && (
                <div className="calendar-cell-hotels">
                  {lastNightHotels.map(a => (
                    <div key={`prev-${a.id}`} className="calendar-activity-dot category-hotel">🏨 {a.title}</div>
                  ))}
                </div>
              )}
              <div className="calendar-cell-activities">
                {regularActivities.slice(0, 5).map(a => (
                  <div key={a.id} className={`calendar-activity-dot category-${a.category}`}>
                    {a.start_time && <span style={{opacity: 0.7, marginRight: '4px'}}>{a.start_time.slice(0,5)}</span>}
                    {a.title}
                  </div>
                ))}
                {regularActivities.length > 5 && <span className="calendar-more">+{regularActivities.length - 5} more</span>}
              </div>
              {tonightHotels.length > 0 && (
                <div className="calendar-cell-hotels" style={{ marginTop: 'auto' }}>
                  {tonightHotels.map(a => (
                    <div key={`tonight-${a.id}`} className="calendar-activity-dot category-hotel">🏨 {a.title}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FullTripView;
