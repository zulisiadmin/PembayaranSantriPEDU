import { Bell, LogOut, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import { normalizeSantriUser } from '../data/mockData';
import './Layout.css';

export function Layout({ children, onLogout, onNavigate, user }) {
  const santri = normalizeSantriUser(user);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let alive = true;

    async function loadUnreadCount() {
      try {
        const data = await apiFetch('/santri/notifications/unread-count');
        if (!alive) return;
        setUnreadCount(data.unreadCount || 0);
      } catch {
        if (!alive) return;
        setUnreadCount(0);
      }
    }

    loadUnreadCount();
    const timer = window.setInterval(loadUnreadCount, 8000);

    return () => {
      alive = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <main className="phone-shell">
      <header className="top-area">
        <div className="profile-row">
          <div className="avatar">{santri.avatar}</div>
          <div>
            <strong>{santri.name}</strong>
            <span>{santri.role} - {santri.className}</span>
          </div>
          <button className="icon-button" title="Menu" onClick={() => onNavigate('home')}>
            <Menu size={20} />
          </button>
          <button className="icon-button notification-button" title="Notifikasi" onClick={() => onNavigate('notifikasi')}>
            <Bell size={20} />
            {unreadCount > 0 && <span>{unreadCount > 9 ? '9+' : unreadCount}</span>}
          </button>
          <button className="icon-button" title="Keluar" onClick={onLogout}>
            <LogOut size={19} />
          </button>
        </div>
      </header>
      {children}
    </main>
  );
}
