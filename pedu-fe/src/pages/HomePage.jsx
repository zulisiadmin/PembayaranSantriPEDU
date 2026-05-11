import { Clock3, MapPin, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import { LoadingState } from '../components/LoadingState';
import { formatAgendaDate, getTodayAgenda } from '../data/mockData';
import './HomePage.css';

const menuItems = [
  { label: 'Tagihan', target: 'tagihan', icon: 'fa-solid fa-wallet' },
  { label: 'Jadwal', target: 'jadwal', icon: 'fa-solid fa-clock' },
  { label: 'Kitab', target: 'kitab', icon: 'fa-solid fa-book-open' },
  { label: 'Perizinan', target: 'perizinan', icon: 'fa-solid fa-file-signature' },
  { label: 'Profil', target: 'profil', icon: 'fa-solid fa-user-graduate' },
  { label: 'Kalender', target: 'kalender', icon: 'fa-solid fa-star-and-crescent' },
  { label: 'Tentang', target: 'tentang', icon: 'fa-solid fa-circle-info' },
];

function getAgendaStateClass(agenda) {
  if (agenda.isHoliday) return 'holiday';
  if (agenda.isClosed) return 'closed';
  if (agenda.isActive) return 'active';
  return 'waiting';
}

export function HomePage({ bootstrapAgenda, bootstrapAnnouncement, onOpenAgenda, onNavigate, user }) {
  const [todayAgenda, setTodayAgenda] = useState(bootstrapAgenda || []);
  const [agendaStatus, setAgendaStatus] = useState(bootstrapAgenda ? 'ready' : 'loading');
  const [announcement, setAnnouncement] = useState(bootstrapAnnouncement || null);
  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const [unpaidCount, setUnpaidCount] = useState(0);
  const visibleMenuItems = user?.role === 'ustad'
    ? menuItems.filter((item) => !['tagihan', 'perizinan'].includes(item.target))
    : menuItems;
  const roleLabel = user?.role === 'ustad' ? 'Ustadz' : 'Santri';

  useEffect(() => {
    let alive = true;

    async function loadAgenda() {
      if (bootstrapAgenda) {
        setTodayAgenda(bootstrapAgenda);
        setAgendaStatus('ready');
        return;
      }

      try {
        const data = await apiFetch('/santri/agendas/today');
        if (!alive) return;
        setTodayAgenda(data.agendas || []);
        setAgendaStatus('ready');
      } catch {
        if (!alive) return;
        setTodayAgenda(getTodayAgenda());
        setAgendaStatus('fallback');
      }
    }

    loadAgenda();

    return () => {
      alive = false;
    };
  }, [bootstrapAgenda]);

  useEffect(() => {
    let alive = true;

    async function loadAnnouncement() {
      try {
        const data = await apiFetch('/santri/announcements/latest');
        if (!alive) return;
        setAnnouncement(data.announcement || null);
      } catch {
        if (!alive) return;
        setAnnouncement(null);
      }
    }

    loadAnnouncement();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;

    async function loadUnpaidBills() {
      try {
        const data = await apiFetch('/santri/bills');
        if (!alive) return;
        setUnpaidCount((data.bills || []).filter((bill) => bill.status !== 'paid').length);
      } catch {
        if (!alive) return;
        setUnpaidCount(0);
      }
    }

    loadUnpaidBills();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="screen-content home-content">
      <section className="today-panel">
        <div className="section-head">
          <div>
            <p>Agenda Hari Ini</p>
            <h2>{formatAgendaDate()}</h2>
          </div>
        </div>

        {agendaStatus === 'loading' && (
          <LoadingState rows={2} />
        )}

        {agendaStatus !== 'loading' && todayAgenda.length > 0 ? todayAgenda.map((agenda) => (
          <article className="agenda-row" key={agenda.id}>
            <div>
              <h3>{agenda.title}</h3>
              <p>{agenda.teacher}</p>
              <span>
                <Clock3 size={14} /> {agenda.time}
              </span>
              <span>
                <MapPin size={14} /> {agenda.location}
              </span>
              {agenda.holidayReason && <small className="holiday-note">{agenda.holidayReason}</small>}
            </div>
            <div>
              <span className={`state-pill ${getAgendaStateClass(agenda)}`}>{agenda.stateLabel}</span>
              {!agenda.isHoliday && <button onClick={() => onOpenAgenda(agenda)}>Detail</button>}
            </div>
          </article>
        )) : agendaStatus !== 'loading' && (
          <div className="empty-agenda">
            <i className="fa-solid fa-moon" aria-hidden="true" />
            <p>Tidak ada pengajian malam hari ini.</p>
          </div>
        )}
      </section>

      {announcement && (
        <button className="announcement-strip" type="button" onClick={() => setAnnouncementOpen(true)}>
          <i className="fa-solid fa-bullhorn" aria-hidden="true" />
          <div>
            <strong>{announcement.title}</strong>
            <p>{announcement.body}</p>
          </div>
        </button>
      )}

      <section className="menu-section">
        <h2>Menu {roleLabel}</h2>
        <p>
          {user?.role === 'ustad'
            ? 'Kelola jadwal mengajar, kitab, kalender, dan profil pengajar.'
            : 'Kelola pembayaran, jadwal, kitab, kalender, dan data akademik santri.'}
        </p>
        <div className="menu-grid">
          {visibleMenuItems.map((item) => (
            <button key={item.label} onClick={() => onNavigate(item.target)}>
              <span>
                <i className={item.icon} aria-hidden="true" />
                {/* <img src="/icons/nama-icon.svg" alt="" /> */}
                {item.target === 'tagihan' && unpaidCount > 0 && (
                  <b className="menu-badge">{unpaidCount > 99 ? '99+' : unpaidCount}</b>
                )}
              </span>
              {item.label}
            </button>
          ))}
        </div>
      </section>
      {announcementOpen && announcement && (
        <div className="announcement-modal-backdrop" role="dialog" aria-modal="true" aria-label="Detail pengumuman">
          <section className="announcement-modal">
            <button className="modal-close-button" type="button" onClick={() => setAnnouncementOpen(false)} aria-label="Tutup">
              <X size={18} />
            </button>
            <i className="fa-solid fa-bullhorn" aria-hidden="true" />
            <h2>{announcement.title}</h2>
            <p>{announcement.body}</p>
            {announcement.dateLabel && <span>{announcement.dateLabel}</span>}
            <button className="modal-primary-button" type="button" onClick={() => setAnnouncementOpen(false)}>
              Mengerti
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
