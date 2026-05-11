import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { apiFetch, clearSession, getStoredSession, storeSession } from './api';
import { Layout } from './components/Layout';
import { getTestingAgenda } from './data/mockData';
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
  const [selectedAgenda, setSelectedAgenda] = useState(getTestingAgenda()[0]);
  const [bootstrapData, setBootstrapData] = useState(null);

  useEffect(() => {
    window.history.replaceState({ view }, '', window.location.pathname);

    function handlePopState(event) {
      const nextView = event.state?.view || 'home';
      setView(nextView);
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function navigate(nextView) {
    if (nextView === view) return;
    setView(nextView);
    window.history.pushState({ view: nextView }, '', window.location.pathname);
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
    <Layout onLogout={logout} onNavigate={navigate} user={session.user}>
      {view === 'home' && (
        <HomePage
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
      {view === 'agenda' && <AgendaPage agenda={selectedAgenda} user={session.user} />}
      {view === 'tagihan' && <BillsPage />}
      {view === 'jadwal' && <SchedulePage user={session.user} />}
      {view === 'kitab' && <BooksPage />}
      {view === 'profil' && <ProfilePage user={session.user} onUserUpdate={updateSessionUser} />}
      {view === 'perizinan' && <PermitsPage user={session.user} />}
      {view === 'kalender' && <CalendarPage />}
      {view === 'notifikasi' && <NotificationsPage onNavigate={setView} />}
      {view === 'tentang' && <AboutPage />}
    </Layout>
  );
}

createRoot(document.getElementById('root')).render(<App />);
