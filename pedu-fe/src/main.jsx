import React, { useEffect, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { createRoot } from 'react-dom/client';
import { apiFetch, clearSession, getStoredSession, storeSession } from './api';
import { Layout } from './components/Layout';
import { AgendaPage } from './pages/AgendaPage';
import { AboutPage } from './pages/AboutPage';
import { AdminPage } from './pages/AdminPage';
import { AuthPage } from './pages/AuthPage';
import { BillsPage } from './pages/BillsPage';
import { BooksPage } from './pages/BooksPage';
import { CalendarPage } from './pages/CalendarPage';
import { HomePage } from './pages/HomePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { PermitsPage } from './pages/PermitsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SchedulePage } from './pages/SchedulePage';
import './styles.css';

function App() {
  const isAdminGate = new URLSearchParams(window.location.search).get('admin') === '1';
  const [session, setSession] = useState(getStoredSession());
  const initialView = new URLSearchParams(window.location.search).get('view');
  const [view, setView] = useState(initialView || 'home');
  const [authMode, setAuthMode] = useState('login');
  const [authStatus, setAuthStatus] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const [bootstrapData, setBootstrapData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const viewRef = React.useRef(view);

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  useEffect(() => {
    window.history.replaceState({ view }, '', window.location.pathname);

    function handlePopState(event) {
      const nextView = event.state?.view || 'home';
      setView(nextView);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    let listener;

    async function bindBackButton() {
      listener = await CapacitorApp.addListener('backButton', () => {
        if (viewRef.current !== 'home') {
          setView('home');
          window.history.replaceState({ view: 'home' }, '', window.location.pathname);
        }
      });
    }

    bindBackButton();

    return () => {
      listener?.remove();
    };
  }, []);

  function navigate(nextView) {
    if (nextView === view) return;
    setView(nextView);
    window.history.pushState({ view: nextView }, '', window.location.pathname);
  }

  function refreshActiveView() {
    setBootstrapData(null);
    setRefreshKey((current) => current + 1);
  }

  async function submitAuth(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setAuthLoading(true);
    setAuthStatus(authMode === 'register' ? '' : '');

    try {
      if (authMode === 'register') {
        await apiFetch('/register/santri', {
          method: 'POST',
          body: JSON.stringify({
            name: form.get('name'),
            email: form.get('login'),
            password: form.get('password'),
            kode_kelas: form.get('kode_kelas'),
          }),
        });
        setAuthMode('login');
        setAuthStatus('Pendaftaran berhasil. Silakan login.');
        return;
      }

      const nextSession = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({
          login: form.get('login'),
          password: form.get('password'),
        }),
      });
      storeSession(nextSession);
      setSession(nextSession);
      try {
        const bootstrap = await apiFetch('/santri/bootstrap');
        setBootstrapData(bootstrap);
      } catch {
        setBootstrapData(null);
      }
      setView('home');
    } catch (error) {
      setAuthStatus(error.message || 'Login gagal. Periksa kembali data akun.');
    } finally {
      setAuthLoading(false);
    }
  }

  function logout() {
    clearSession();
    setSession(null);
    setBootstrapData(null);
    setView('home');
    window.history.replaceState({ view: 'home' }, '', window.location.pathname);
  }

  function updateSessionUser(user) {
    const nextSession = {
      ...session,
      user,
    };
    storeSession(nextSession);
    setSession(nextSession);
  }

  if (isAdminGate) {
    return <AdminPage />;
  }

  if (!session) {
    return (
      <AuthPage
        mode={authMode}
        onModeChange={(nextMode) => {
          setAuthMode(nextMode);
          setAuthStatus('');
        }}
        onSubmit={submitAuth}
        status={authStatus}
        isSubmitting={authLoading}
      />
    );
  }

  return (
    <Layout onLogout={logout} onNavigate={navigate} onRefresh={refreshActiveView} user={session.user}>
      {view === 'home' && (
        <HomePage
          key={`home-${refreshKey}`}
          bootstrapAgenda={bootstrapData?.todayAgenda}
          bootstrapAnnouncement={bootstrapData?.latestAnnouncement}
          user={session.user}
          onNavigate={navigate}
          onOpenAgenda={(agenda) => {
            setSelectedAgenda(agenda);
            navigate('agenda');
          }}
        />
      )}
      {view === 'agenda' && selectedAgenda && <AgendaPage key={`agenda-${refreshKey}`} agenda={selectedAgenda} user={session.user} />}
      {view === 'tagihan' && <BillsPage key={`tagihan-${refreshKey}`} />}
      {view === 'jadwal' && <SchedulePage key={`jadwal-${refreshKey}`} user={session.user} />}
      {view === 'kitab' && <BooksPage key={`kitab-${refreshKey}`} />}
      {view === 'profil' && <ProfilePage key={`profil-${refreshKey}`} user={session.user} onUserUpdate={updateSessionUser} />}
      {view === 'perizinan' && <PermitsPage key={`perizinan-${refreshKey}`} user={session.user} />}
      {view === 'kalender' && <CalendarPage key={`kalender-${refreshKey}`} />}
      {view === 'notifikasi' && <NotificationsPage key={`notifikasi-${refreshKey}`} onNavigate={navigate} />}
      {view === 'tentang' && <AboutPage key={`tentang-${refreshKey}`} />}
    </Layout>
  );
}

createRoot(document.getElementById('root')).render(<App />);
