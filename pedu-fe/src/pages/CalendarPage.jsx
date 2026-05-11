import { ChevronLeft, ChevronRight, Clock3, MapPin, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../api';
import { LoadingState } from '../components/LoadingState';
import './CalendarPage.css';

const weekdayLabels = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'];

export function CalendarPage() {
  const today = new Date();
  const [visibleMonth, setVisibleMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(toDateKey(today));
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('loading');
  const monthKey = `${visibleMonth.getFullYear()}-${String(visibleMonth.getMonth() + 1).padStart(2, '0')}`;
  const days = useMemo(() => buildMonthDays(visibleMonth), [visibleMonth]);
  const eventsByDate = useMemo(() => groupEventsByDate(events), [events]);
  const selectedEvents = eventsByDate[selectedDate] || [];

  useEffect(() => {
    let alive = true;

    async function loadCalendar() {
      try {
        const data = await apiFetch(`/santri/calendar?month=${monthKey}`);
        if (!alive) return;
        setEvents(data.events || []);
        setStatus('ready');
      } catch (error) {
        if (!alive) return;
        setEvents([]);
        setStatus(error.message || 'Internet tidak ada, mohon periksa jaringan anda.');
      }
    }

    loadCalendar();

    return () => {
      alive = false;
    };
  }, [monthKey]);

  function moveMonth(direction) {
    setVisibleMonth((current) => {
      const next = new Date(current.getFullYear(), current.getMonth() + direction, 1);
      setSelectedDate(toDateKey(new Date(next.getFullYear(), next.getMonth(), 1)));
      return next;
    });
  }

  return (
    <div className="screen-content calendar-screen">
      <section className="calendar-panel">
        <div className="calendar-head">
          <div>
            <p>{visibleMonth.getFullYear()}</p>
            <h2>{formatMonth(visibleMonth)}</h2>
          </div>
          <div className="calendar-nav">
            <button onClick={() => moveMonth(-1)} aria-label="Bulan sebelumnya">
              <ChevronLeft size={28} />
            </button>
            <button onClick={() => moveMonth(1)} aria-label="Bulan berikutnya">
              <ChevronRight size={28} />
            </button>
          </div>
        </div>

        <div className="weekday-row">
          {weekdayLabels.map((label) => <span key={label}>{label}</span>)}
        </div>

        <div className="month-grid">
          {days.map((day) => {
            const dateEvents = eventsByDate[day.key] || [];
            const isSelected = day.key === selectedDate;
            return (
              <button
                className={`day-cell ${day.isCurrentMonth ? '' : 'muted'} ${isSelected ? 'selected' : ''}`}
                key={day.key}
                onClick={() => setSelectedDate(day.key)}
              >
                <span>{day.date.getDate()}</span>
                {dateEvents.length > 0 && (
                  <div className="event-dots">
                    {dateEvents.slice(0, 3).map((event) => (
                      <i key={event.id} style={{ background: event.color }} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {status === 'loading' && <LoadingState compact />}
      </section>

      <section className="selected-date-panel">
        <span className="drag-handle" />
        <p>Jadwal</p>
        <h2>{formatFullDate(selectedDate)}</h2>
        <div className="legend-row">
          <span><i className="class-dot" /> Pengajian kelas</span>
          <span><i className="routine-dot" /> Rutin</span>
          <span><i className="pesantren-dot" /> Pesantren</span>
        </div>

        {status === 'loading' ? (
          <div className="empty-calendar-detail">Sedang memuat...</div>
        ) : status !== 'ready' ? (
          <div className="empty-calendar-detail">{status}</div>
        ) : selectedEvents.length === 0 ? (
          <div className="empty-calendar-detail">Tidak ada agenda di tanggal ini</div>
        ) : (
          <div className="calendar-event-list">
            {selectedEvents.map((event) => (
              <article className="calendar-event-card" key={event.id}>
                <i style={{ background: event.color }} />
                <div>
                  <span>{event.typeLabel}</span>
                  <h3>{event.title}</h3>
                  <p><Clock3 size={14} /> {event.time}</p>
                  {event.teacher && <p><UserRound size={14} /> {event.teacher}</p>}
                  {event.location && <p><MapPin size={14} /> {event.location}</p>}
                  {event.description && <p>{event.description}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function buildMonthDays(month) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const startOffset = (first.getDay() + 6) % 7;
  const start = new Date(first);
  start.setDate(first.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return {
      date,
      key: toDateKey(date),
      isCurrentMonth: date.getMonth() === month.getMonth(),
    };
  });
}

function groupEventsByDate(events) {
  return events.reduce((grouped, event) => {
    grouped[event.date] = [...(grouped[event.date] || []), event];
    return grouped;
  }, {});
}

function toDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatMonth(date) {
  return new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(date);
}

function formatFullDate(dateKey) {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date(`${dateKey}T00:00:00`));
}
