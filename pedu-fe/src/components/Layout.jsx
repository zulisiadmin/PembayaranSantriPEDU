import { Bell, LogOut, Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../api';
import { normalizeSantriUser } from '../data/mockData';
import './Layout.css';

export function Layout({ children, onLogout, onNavigate, onRefresh, user }) {
  const santri = normalizeSantriUser(user);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const touchStartYRef = useRef(null);
  const pullThreshold = 72;

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

  function isAtTop() {
    return window.scrollY <= 0 && document.documentElement.scrollTop <= 0;
  }

  function handleTouchStart(event) {
    if (!isAtTop()) {
      touchStartYRef.current = null;
      return;
    }
    touchStartYRef.current = event.touches[0].clientY;
  }

  function handleTouchMove(event) {
    if (touchStartYRef.current === null || !isAtTop()) return;

    const distance = event.touches[0].clientY - touchStartYRef.current;
    if (distance <= 0) {
      setPullDistance(0);
      return;
    }

    setPullDistance(Math.min(distance * 0.45, 96));
  }

  async function handleTouchEnd() {
    const shouldRefresh = pullDistance >= pullThreshold;
    touchStartYRef.current = null;
    setPullDistance(0);

    if (!shouldRefresh || isRefreshing) return;

    setIsRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      window.setTimeout(() => setIsRefreshing(false), 450);
    }
  }

  return (
    <main
      className="phone-shell"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ '--pull-distance': `${pullDistance}px` }}
    >
      <div className={`pull-refresh ${pullDistance > 0 || isRefreshing ? 'visible' : ''}`}>
        <span className={isRefreshing ? 'spinning' : ''} />
        <small>{isRefreshing ? 'Memuat ulang...' : pullDistance >= pullThreshold ? 'Lepas untuk refresh' : 'Tarik untuk refresh'}</small>
      </div>
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
