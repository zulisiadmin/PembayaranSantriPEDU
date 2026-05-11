import { Clock3, MapPin, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import { LoadingState } from '../components/LoadingState';
import { ListScreen } from '../components/ListScreen';
import { getSchedulesForClass, normalizeSantriUser } from '../data/mockData';
import './SchedulePage.css';

export function SchedulePage({ user }) {
  const santri = normalizeSantriUser(user);
  const [schedules, setSchedules] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let alive = true;

    async function loadSchedules() {
      try {
        const data = await apiFetch('/santri/schedules/nightly');
        if (!alive) return;
        setSchedules(data.schedules || []);
        setStatus('ready');
      } catch {
        if (!alive) return;
        setSchedules(mapFallbackSchedules(santri.className));
        setStatus('fallback');
      }
    }

    loadSchedules();

    return () => {
      alive = false;
    };
  }, [santri.className]);

  return (
    <ListScreen title="Jadwal Pengajian Malam" subtitle={`${santri.className}, jadwal Minggu sampai Rabu.`}>
      {status === 'loading' && <LoadingState rows={3} />}
      {status !== 'loading' && schedules.map((schedule) => (
        <article className="schedule-card" key={schedule.id || `${schedule.day}-${schedule.title}`}>
          <div className="schedule-day">
            <span>{schedule.day}</span>
            <strong>{schedule.time}</strong>
          </div>
          <div className="schedule-main">
            <h3>{schedule.title}</h3>
            <p><UserRound size={15} /> {schedule.teacher}</p>
            <p><MapPin size={15} /> {schedule.location || 'Aula Utama'}</p>
          </div>
          <Clock3 className="schedule-icon" size={24} />
        </article>
      ))}
    </ListScreen>
  );
}

function mapFallbackSchedules(className) {
  return getSchedulesForClass(className).map(([day, title, time, teacher]) => ({
    day,
    title,
    time,
    teacher,
    location: 'Aula Utama',
  }));
}
