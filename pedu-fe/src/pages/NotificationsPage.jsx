import { Bell, CheckCircle2, ReceiptText, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import { LoadingState } from '../components/LoadingState';
import { ListScreen } from '../components/ListScreen';
import { announcements } from '../data/mockData';
import './NotificationsPage.css';

export function NotificationsPage({ onNavigate }) {
  const [notifications, setNotifications] = useState([]);
  const [status, setStatus] = useState('loading');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let alive = true;

    async function loadNotifications() {
      try {
        const data = await apiFetch('/santri/notifications');
        if (!alive) return;
        setNotifications(data.notifications || []);
        setStatus('ready');
      } catch {
        if (!alive) return;
        setNotifications(announcements.map((item, index) => ({
          id: `fallback-${index}`,
          type: 'announcement',
          title: item.title,
          body: item.body,
          dateLabel: item.date,
          isRead: true,
        })));
        setStatus('fallback');
      }
    }

    loadNotifications();
    const timer = window.setInterval(loadNotifications, 8000);

    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, []);

  async function openNotification(notification) {
    if (!String(notification.id).startsWith('fallback')) {
      await apiFetch(`/santri/notifications/${notification.id}/read`, { method: 'POST' });
      setNotifications((current) => current.map((item) => (
        item.id === notification.id ? { ...item, isRead: true } : item
      )));
    }

    if (notification.type === 'bill' || notification.action === 'tagihan') {
      onNavigate('tagihan');
      return;
    }

    if (notification.type === 'permit' || notification.action === 'perizinan') {
      onNavigate('perizinan');
      return;
    }

    setSelected(notification);
  }

  return (
    <ListScreen title="Notifikasi" subtitle="Pengumuman pesantren, tagihan baru, dan informasi penting.">
      {status === 'loading' && <LoadingState rows={3} />}
      {status !== 'loading' && notifications.length === 0 && (
        <div className="empty-notification">
          <Bell size={24} />
          <p>Belum ada notifikasi.</p>
        </div>
      )}
      {status !== 'loading' && notifications.map((notification) => (
        <button
          className={`notification-item ${notification.isRead ? '' : 'unread'}`}
          key={notification.id}
          onClick={() => openNotification(notification)}
        >
          <div className="list-icon">
            {notification.type === 'bill' ? <ReceiptText size={22} /> : <Bell size={22} />}
          </div>
          <div>
            <h3>{notification.title}</h3>
            <p>
              {notification.body
                ?.split(' ')
                .slice(0, 20)
                .join(' ')}
              {notification.body?.split(' ').length > 20 ? '...' : ''}
            </p>
            <span>{notification.dateLabel}</span>
          </div>
          {!notification.isRead && <i />}
        </button>
      ))}

      {selected && (
        <div className="notification-modal-backdrop" role="dialog" aria-modal="true" aria-label="Detail notifikasi">
          <section className="notification-modal">
            <button className="modal-close-button" onClick={() => setSelected(null)} aria-label="Tutup">
              <X size={18} />
            </button>
            <div className="modal-notification-icon">
              <CheckCircle2 size={32} />
            </div>
            <h2>{selected.title}</h2>
            <p>{selected.body}</p>
            <span>{selected.dateLabel}</span>
            <button className="modal-primary-button" onClick={() => setSelected(null)}>
              Mengerti
            </button>
          </section>
        </div>
      )}
    </ListScreen>
  );
}
