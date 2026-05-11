import {
  Bell,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  Edit3,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  LogOut,
  Megaphone,
  Menu,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  TicketPercent,
  UserCog,
  UsersRound,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { apiFetch, clearSession, getStoredSession, storeSession } from '../api';
import './AdminPage.css';

const staffRoles = ['superadmin', 'admin', 'keuangan', 'pengurus'];
const fallbackOptions = {
  classes: ['Awaliyah 1', 'Awaliyah 2', 'Awaliyah 3', 'Wusto 1', 'Wusto 2', 'Wusto 3', 'Ulya 1', 'Ulya 2'],
  teachers: ['Ust. Jamal'],
  santris: [],
  billCategories: [
    { value: 'syahriah', label: 'Syahriah' },
    { value: 'agenda', label: 'Agenda' },
    { value: 'lain-lain', label: 'Lain-lain' },
  ],
  roles: ['superadmin', 'admin', 'ustad', 'keuangan', 'santri', 'pengurus'],
  locations: ['Lantai 2B', 'Lantai 3A', 'Lantai 3B', 'Lantai 4A', 'Lantai 4B', 'AKA'],
  agendaStatuses: ['Wajib', 'Sunnah', 'Libur', 'Pengganti'],
};

const modules = [
  {
    key: 'classes',
    title: 'Kelas',
    endpoint: '/admin/classes',
    collection: 'classes',
    columns: ['name', 'description', 'registration_code', 'is_active'],
    fields: [
      ['name', 'Nama kelas', 'text', true],
      ['description', 'Deskripsi', 'textarea', false],
      ['registration_code', 'Kode daftar santri', 'text', true],
      ['is_active', 'Aktif', 'checkbox', false],
    ],
    empty: { name: '', description: '', registration_code: '', is_active: true },
  },
  {
    key: 'users',
    title: 'User',
    endpoint: '/admin/users',
    collection: 'users',
    columns: ['name', 'email', 'role', 'kelas'],
    fields: [
      ['name', 'Nama user', 'text', true],
      ['email', 'Email', 'email', true],
      ['password', 'Password', 'password', false],
      ['role', 'Role', 'select', true, 'roles'],
      ['kelas', 'Kelas', 'select', false, 'classes'],
    ],
    empty: { name: '', email: '', password: '', role: 'santri', kelas: '' },
  },
  {
    key: 'roles',
    title: 'Role',
    endpoint: '/admin/roles',
    collection: 'roles',
    columns: ['name', 'permissions'],
    fields: [
      ['name', 'Nama role', 'text', true],
      ['permissions', 'Akses', 'permissions', false],
    ],
    empty: { name: '', permissions: [] },
  },
  {
    key: 'agendas',
    title: 'Agenda',
    endpoint: '/admin/agendas',
    collection: 'agendas',
    columns: ['title', 'kelas', 'teacher', 'starts_at', 'location', 'present_count', 'absent_count'],
    advancedFilters: [
      ['teacher', 'Ustadz', 'teachers'],
      ['location', 'Lokasi', 'locations'],
      ['kelas', 'Kelas', 'classes'],
      ['date', 'Tanggal', 'date'],
    ],
    fields: [
      ['title', 'Judul', 'text', true],
      ['teacher', 'Pengajar', 'select', true, 'teachers'],
      ['kelas', 'Kelas', 'select', true, 'classes'],
      ['location', 'Lokasi', 'select', true, 'locations'],
      ['starts_at', 'Mulai', 'datetime-local', true],
      ['ends_at', 'Selesai', 'datetime-local', true],
      ['permit_until', 'Batas izin', 'datetime-local', false],
      ['status', 'Status', 'select', false, 'agendaStatuses'],
      ['latitude', 'Latitude', 'number', false],
      ['longitude', 'Longitude', 'number', false],
      ['attendance_radius_meters', 'Radius meter', 'number', false],
    ],
    empty: {
      title: '',
      teacher: '',
      kelas: '',
      location: 'Aula Utama',
      starts_at: '',
      ends_at: '',
      permit_until: '',
      status: 'Wajib',
      latitude: '-6.24954',
      longitude: '106.90573',
      attendance_radius_meters: 50,
    },
  },
  {
    key: 'bills',
    title: 'Tagihan',
    endpoint: '/admin/bills',
    collection: 'bills',
    columns: ['nama', 'kategori', 'nominal', 'awal_pembayaran', 'akhir_pembayaran'],
    fields: [
      ['nama', 'Nama tagihan', 'text', true],
      ['kategori', 'Kategori', 'select', true, 'billCategories'],
      ['deskripsi', 'Deskripsi', 'textarea', false],
      ['nominal', 'Nominal', 'number', true],
      ['kelas', 'Target kelas', 'multi-select', true, 'classes'],
      ['awal_pembayaran', 'Awal pembayaran', 'date', true],
      ['akhir_pembayaran', 'Akhir pembayaran', 'date', true],
    ],
    empty: { nama: '', kategori: 'syahriah', deskripsi: '', nominal: 0, kelas: 'Awaliyah 1', awal_pembayaran: '', akhir_pembayaran: '' },
  },
  {
    key: 'vouchers',
    title: 'Voucher',
    endpoint: '/admin/vouchers',
    collection: 'vouchers',
    columns: ['code', 'santri', 'kelas', 'discount_amount', 'status', 'used_at'],
    fields: [
      ['user_id', 'Santri penerima', 'select', true, 'santris'],
      ['discount_amount', 'Nominal diskon', 'number', false],
    ],
    empty: { user_id: '', code: '', discount_amount: '' },
  },
  {
    key: 'books',
    title: 'Kitab',
    endpoint: '/admin/books',
    collection: 'books',
    columns: ['title', 'file_name', 'source', 'is_active'],
    fields: [
      ['title', 'Nama kitab', 'text', true],
      ['file_name', 'Nama file', 'text', true],
      ['url', 'URL Drive/PDF', 'url', true],
      ['source', 'Sumber', 'text', false],
      ['is_active', 'Aktif', 'checkbox', false],
    ],
    empty: { title: '', file_name: '', url: '', source: 'Google Drive', is_active: true },
  },
  {
    key: 'permits',
    title: 'Perizinan',
    endpoint: '/admin/permits',
    collection: 'data',
    columns: ['nama', 'perihal', 'status', 'created_at'],
    readOnly: true,
  },
  {
    key: 'letter-template',
    title: 'Template Surat',
    endpoint: '/admin/permit-letter-template',
    collection: 'template',
    columns: ['template'],
    templateEditor: true,
    readOnly: true,
  },
  {
    key: 'announcements',
    title: 'Pengumuman',
    endpoint: '/admin/announcements',
    collection: 'announcements',
    columns: ['title', 'body', 'target_roles', 'total_user', 'created_at'],
    fields: [
      ['title', 'Judul', 'text', true],
      ['body', 'Isi pengumuman', 'textarea', true],
      ['roles', 'Target role', 'multi-select', false, 'roles'],
    ],
    empty: { title: '', body: '', roles: [] },
  },
];

const adminNavGroups = [
  {
    label: 'Dashboard',
    items: [
      ['classes', GraduationCap],
      ['users', UsersRound],
      ['roles', ShieldCheck],
    ],
  },
  {
    label: 'Akademik',
    items: [
      ['agendas', CalendarDays],
      ['books', BookOpen],
      ['permits', FileCheck2],
      ['letter-template', FileText],
    ],
  },
  {
    label: 'Keuangan & Info',
    items: [
      ['bills', CreditCard],
      ['vouchers', TicketPercent],
      ['announcements', Megaphone],
    ],
  },
];

export function AdminPage() {
  const [session, setSession] = useState(getStoredSession());
  const [loginStatus, setLoginStatus] = useState('');

  async function submitLogin(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoginStatus('Memeriksa akun...');

    try {
      const nextSession = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({
          login: form.get('login'),
          password: form.get('password'),
        }),
      });

      if (!staffRoles.includes(nextSession.user?.role)) {
        setLoginStatus('Akun ini bukan akun admin/staff.');
        return;
      }

      storeSession(nextSession);
      setSession(nextSession);
      setLoginStatus('');
    } catch (error) {
      setLoginStatus(error.message || 'Login admin gagal.');
    }
  }

  function logout() {
    clearSession();
    setSession(null);
  }

  if (!session || !staffRoles.includes(session.user?.role)) {
    return <AdminLogin onSubmit={submitLogin} status={loginStatus} />;
  }

  return <AdminDashboard session={session} onLogout={logout} />;
}

function AdminLogin({ onSubmit, status }) {
  const isSubmitting = status === 'Memeriksa akun...';

  return (
    <main className="admin-login min-vh-100 d-flex align-items-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5">
            <div className="card border-0">
              <div className="card-body p-4 p-md-5">
                <span className="badge text-bg-success mb-3">PEDU Admin</span>
                <h1 className="h3 fw-bold mb-2">Masuk Admin</h1>
                <p className="text-secondary mb-4">Kelola agenda, santri, tagihan, kitab, pengumuman, dan perizinan.</p>
                <form className="vstack gap-3" onSubmit={onSubmit}>
                  <div>
                    <label className="form-label">Email</label>
                    <input className="form-control form-control-lg" name="login" type="email" defaultValue="superadmin@pedu.test" required />
                  </div>
                  <div>
                    <label className="form-label">Password</label>
                    <input className="form-control form-control-lg" name="password" type="password" defaultValue="password" required />
                  </div>
                  <button className="btn btn-success btn-lg w-100" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Memproses login...' : 'Masuk Dashboard'}
                  </button>
                  {status && <div className="alert alert-warning mb-0">{status}</div>}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function AdminDashboard({ session, onLogout }) {
  const [active, setActive] = useState('classes');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentModule = modules.find((module) => module.key === active) || modules[0];

  function selectModule(key) {
    setActive(key);
    setSidebarOpen(false);
  }

  return (
    <main className={`admin-shell min-vh-100 ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-brand-icon">P</span>
          <div>
            <strong>PEDU</strong>
            <small>Pesantren Dashboard</small>
          </div>
          <button className="admin-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Tutup menu">
            <X size={18} />
          </button>
        </div>
        <div className="admin-user-card">
          <span>{session.user.name?.slice(0, 2).toUpperCase()}</span>
          <div>
            <strong>{session.user.name}</strong>
            <small>{session.user.role}</small>
          </div>
        </div>
        <div className="admin-nav">
          {adminNavGroups.map((group) => (
            <div className="admin-nav-section" key={group.label}>
              <span>{group.label}</span>
              {group.items.map(([key, Icon]) => {
                const module = modules.find((item) => item.key === key);
                if (!module) return null;
                return (
                  <button
                    className={`admin-nav-item ${active === key ? 'active' : ''}`}
                    key={key}
                    onClick={() => selectModule(key)}
                  >
                    <Icon size={18} />
                    <span>{module.title}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>
      <button className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-label="Tutup menu" />

      <section className="admin-main">
        <nav className="navbar navbar-expand-lg bg-white admin-topbar sticky-top">
          <div className="container-fluid px-3 px-lg-4 gap-3">
            <button className="admin-menu-button" onClick={() => setSidebarOpen(true)} aria-label="Buka menu">
              <Menu size={20} />
            </button>
            <div className="admin-top-search">
              <Search size={18} />
              <input placeholder="Cari data admin..." aria-label="Cari data admin" />
            </div>
            <div className="admin-top-actions">
              <button className="admin-icon-button" aria-label="Notifikasi">
                <Bell size={18} />
              </button>
              <div className="admin-top-profile">
                <span>{session.user.name?.slice(0, 2).toUpperCase()}</span>
                <div>
                  <strong>{session.user.name}</strong>
                  <small>{session.user.role}</small>
                </div>
              </div>
              <button className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-1" onClick={onLogout}>
                <LogOut size={15} />
                Keluar
              </button>
            </div>
          </div>
        </nav>

        <div className="container-fluid px-3 px-lg-4 py-4">
          <ModulePanel module={currentModule} />
        </div>
      </section>
    </main>
  );
}

function ModulePanel({ module }) {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(module.empty || {});
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('Memuat...');
  const [permissions, setPermissions] = useState([]);
  const [search, setSearch] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [options, setOptions] = useState(fallbackOptions);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [permitAction, setPermitAction] = useState(null);
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [attendanceReport, setAttendanceReport] = useState(null);
  const [billReport, setBillReport] = useState(null);
  const [toast, setToast] = useState(null);
  const [formStatus, setFormStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const canWrite = !module.readOnly;
  const filteredRows = useMemo(() => applyTableFilters(rows, module, search, filterValue, advancedFilters), [rows, module, search, filterValue, advancedFilters]);
  const filterOptions = useMemo(() => getFilterOptions(rows, module), [rows, module]);
  const isTableLoading = status === 'Memuat...';
  const totalPages = pageSize === 'all' ? 1 : Math.max(1, Math.ceil(filteredRows.length / Number(pageSize)));
  const safePage = Math.min(page, totalPages);
  const paginatedRows = pageSize === 'all'
    ? filteredRows
    : filteredRows.slice((safePage - 1) * Number(pageSize), safePage * Number(pageSize));
  const rangeStart = filteredRows.length === 0 ? 0 : (pageSize === 'all' ? 1 : (safePage - 1) * Number(pageSize) + 1);
  const rangeEnd = pageSize === 'all' ? filteredRows.length : Math.min(safePage * Number(pageSize), filteredRows.length);

  useEffect(() => {
    setRows([]);
    setForm(buildInitialForm(module, options));
    setEditing(null);
    setShowModal(false);
    setSearch('');
    setFilterValue('all');
    setPage(1);
    setPageSize(25);
    setAdvancedFilters({});
    loadRows();
    loadOptions();
  }, [module.key]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  if (module.templateEditor) {
    return <TemplateEditor module={module} />;
  }

  async function loadOptions() {
    try {
      const data = await apiFetch('/admin/options');
      setOptions({
        ...fallbackOptions,
        ...data,
      });
    } catch {
      setOptions(fallbackOptions);
    }
  }

  async function loadRows() {
    setStatus('Memuat...');
    try {
      if (module.createOnly) {
        setRows([]);
        setStatus('');
        return;
      }

      const data = await apiFetch(module.endpoint);
      setRows(extractRows(data, module.collection));
      setPermissions(data.availablePermissions || permissions);
      setStatus('');
    } catch (error) {
      setRows([]);
      setStatus(error.message || 'Data belum bisa dimuat.');
    }
  }

  function startEdit(row) {
    setEditing(row);
    setForm(normalizeForForm(row, module.empty || {}));
    setShowModal(true);
  }

  function resetForm() {
    setEditing(null);
    setForm(buildInitialForm(module, options));
    setFormStatus('');
    setShowModal(false);
  }

  function startCreate() {
    setEditing(null);
    setForm(buildInitialForm(module, options));
    setFormStatus('');
    setShowModal(true);
  }

  async function submitForm(event) {
    event.preventDefault();
    setStatus('Menyimpan...');
    setFormStatus('');
    setIsSaving(true);

    try {
      const payload = normalizePayload(module.key, form, Boolean(editing));
      const url = editing ? `${module.endpoint}/${editing.id}` : module.endpoint;
      const method = editing ? 'PUT' : 'POST';
      await apiFetch(url, {
        method,
        body: JSON.stringify(payload),
      });
      resetForm();
      await loadRows();
      const successMessage = editing
        ? `${module.title} berhasil diperbarui.`
        : `${module.title} berhasil ditambahkan.`;
      setStatus('');
      setToast(successMessage);
    } catch (error) {
      const message = error.message || 'Data belum bisa disimpan.';
      setStatus(message);
      setFormStatus(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function removeRow(row) {
    if (!window.confirm(`Hapus data ${row.name || row.title || row.nama || row.email || row.id}?`)) return;
    setStatus('Menghapus...');
    try {
      await apiFetch(`${module.endpoint}/${row.id}`, { method: 'DELETE' });
      await loadRows();
      setStatus('Data berhasil dihapus.');
    } catch (error) {
      setStatus(error.message || 'Data belum bisa dihapus.');
    }
  }

  async function updatePermit(row, nextStatus, note) {
    setStatus('Memperbarui status...');
    try {
      await apiFetch(`${module.endpoint}/${row.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: nextStatus,
          catatan_admin: note,
        }),
      });
      setPermitAction(null);
      await loadRows();
      setStatus('Status perizinan diperbarui.');
    } catch (error) {
      setStatus(error.message || 'Status belum bisa diperbarui.');
    }
  }

  function openDetail(row) {
    setSelectedDetail(row);
  }

  function setAdvancedFilter(name, value) {
    setPage(1);
    setAdvancedFilters((current) => ({ ...current, [name]: value }));
  }

  async function openAttendanceReport(row) {
    setStatus('Memuat rekap kehadiran...');
    try {
      const data = await apiFetch(`/admin/agendas/${row.id}/attendances`);
      setAttendanceReport(data);
      setStatus('');
    } catch (error) {
      setStatus(error.message || 'Rekap kehadiran belum bisa dimuat.');
    }
  }

  async function openBillReport(row) {
    setStatus('Memuat rekap pembayaran...');
    try {
      const data = await apiFetch(`/admin/bills/${row.id}/payments`);
      setBillReport(data);
      setStatus('');
    } catch (error) {
      setStatus(error.message || 'Rekap pembayaran belum bisa dimuat.');
    }
  }

  function exportCurrentRows() {
    exportModuleRows(module, filteredRows);
  }

  return (
    <div className="vstack gap-4">
      <section className="admin-hero">
        <div>
          <span className="admin-eyebrow">
            <LayoutDashboard size={15} />
            Dashboard
          </span>
          <h1>{module.title}</h1>
          <p>Kelola data {module.title.toLowerCase()} pesantren dari satu panel yang responsif.</p>
        </div>
        <div className="admin-hero-stats">
          <div>
            <strong>{rows.length}</strong>
            <span>Total data</span>
          </div>
          <div>
            <strong>{filteredRows.length}</strong>
            <span>Tampil</span>
          </div>
        </div>
      </section>

      <div className="card border-0 admin-card">
        <div className="card-body">
          <div className="admin-toolbar">
            <div className="admin-search-box">
              <Search size={18} />
              <input
                placeholder={`Cari ${module.title.toLowerCase()}...`}
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </div>
            <label className="admin-filter-pill">
              <Filter size={16} />
              <select value={filterValue} onChange={(event) => {
                setFilterValue(event.target.value);
                setPage(1);
              }} aria-label={`Filter ${module.title}`}>
                <option value="all">Semua</option>
                {filterOptions.map((option) => (
                  <option value={option.value} key={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
            <div className="admin-toolbar-actions">
              {!module.createOnly && (
                <button className="admin-action-button secondary" onClick={loadRows}>
                  <RefreshCw size={16} />
                  Muat Ulang
                </button>
              )}
              {['users', 'bills'].includes(module.key) && filteredRows.length > 0 && (
                <button className="admin-action-button secondary" onClick={exportCurrentRows}>
                  <Download size={16} />
                  Export Excel
                </button>
              )}
              {canWrite && (
                <button className="admin-action-button primary" onClick={startCreate}>
                  <Plus size={16} />
                  Tambah {module.title}
                </button>
              )}
            </div>
          </div>
          {module.advancedFilters && (
            <div className="admin-advanced-filters">
              {module.advancedFilters.map(([name, label, optionKey]) => (
                <label className="admin-filter-control" key={name}>
                  <span>{label}</span>
                  {optionKey === 'date' ? (
                    <input
                      type="date"
                      value={advancedFilters[name] || ''}
                      onChange={(event) => setAdvancedFilter(name, event.target.value)}
                    />
                  ) : (
                    <select
                      value={advancedFilters[name] || ''}
                      onChange={(event) => setAdvancedFilter(name, event.target.value)}
                    >
                      <option value="">Semua {label}</option>
                      {resolveOptions(optionKey, options).map((option) => (
                        <option value={option} key={option}>{option}</option>
                      ))}
                    </select>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {status && !isTableLoading && <div className="alert alert-light border mb-0">{status}</div>}
      {toast && (
        <div className="admin-toast" role="status">
          <CheckCircle2 size={18} />
          <span>{toast}</span>
        </div>
      )}

      {!module.createOnly && (
        <div className="card border-0 admin-card admin-table-card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0 admin-data-table">
                <thead>
                  <tr>
                    {module.columns.map((column) => <th key={column}>{columnLabel(column)}</th>)}
                    <th className="text-end">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.map((row) => (
                    <tr key={row.id}>
                      {module.columns.map((column) => (
                        <td key={column}>{formatCell(row[column], column)}</td>
                      ))}
                      <td className="text-end">
                        {module.key === 'permits' ? (
                          <div className="admin-row-actions">
                            <button className="admin-row-button info" onClick={() => openDetail(row)}>
                              <Eye size={14} />
                              Detail
                            </button>
                            {row.status !== 'disetujui' && (
                              <>
                                <button className="admin-row-button success" onClick={() => setPermitAction({ row, status: 'disetujui' })}>ACC</button>
                                <button className="admin-row-button danger" onClick={() => setPermitAction({ row, status: 'ditolak' })}>Tolak</button>
                              </>
                            )}
                          </div>
                        ) : module.key === 'announcements' ? (
                          <div className="admin-row-actions">
                            <button className="admin-row-button info" onClick={() => openDetail(row)}>
                              <Eye size={14} />
                              Detail
                            </button>
                          </div>
                        ) : (
                          <div className="admin-row-actions">
                            {module.key === 'agendas' && (
                              <button className="admin-row-button success" onClick={() => openAttendanceReport(row)}>Kehadiran</button>
                            )}
                            {module.key === 'bills' && (
                              <button className="admin-row-button success" onClick={() => openBillReport(row)}>Pembayaran</button>
                            )}
                            <button className="admin-row-button info" onClick={() => startEdit(row)}>
                              <Edit3 size={14} />
                              Edit
                            </button>
                            <button className="admin-row-button danger" onClick={() => removeRow(row)} aria-label={`Hapus ${row.name || row.title || row.nama || row.email || row.id}`}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {isTableLoading && filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={module.columns.length + 1}>
                        <div className="admin-table-loading">
                          <span />
                          <strong>Sedang memuat...</strong>
                        </div>
                      </td>
                    </tr>
                  )}
                  {!isTableLoading && filteredRows.length === 0 && (
                    <tr>
                      <td colSpan={module.columns.length + 1} className="text-center text-secondary py-4">Belum ada data.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {!isTableLoading && filteredRows.length > 0 && (
              <div className="admin-pagination">
                <div>
                  Menampilkan <strong>{rangeStart}-{rangeEnd}</strong> dari <strong>{filteredRows.length}</strong> data
                </div>
                <label>
                  Tampil
                  <select value={pageSize} onChange={(event) => {
                    const value = event.target.value === 'all' ? 'all' : Number(event.target.value);
                    setPageSize(value);
                    setPage(1);
                  }}>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value="all">All</option>
                  </select>
                </label>
                <div className="admin-page-buttons">
                  <button disabled={safePage <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} aria-label="Halaman sebelumnya">
                    <ChevronLeft size={16} />
                  </button>
                  <span>{safePage} / {totalPages}</span>
                  <button disabled={safePage >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} aria-label="Halaman berikutnya">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {module.createOnly && (
        <div className="card border-0 admin-card">
          <div className="card-body text-center py-5">
            <h2 className="h5 fw-bold">Buat pengumuman baru</h2>
            <p className="text-secondary">Klik tombol tambah untuk menulis dan mengirim pengumuman.</p>
            <button className="btn btn-success" onClick={startCreate}>Tambah Pengumuman</button>
          </div>
        </div>
      )}

      {showModal && canWrite && (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
          <div className="admin-modal card border-0">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <div>
                <h2 className="h5 fw-bold mb-0">{editing ? `Edit ${module.title}` : `Tambah ${module.title}`}</h2>
                <small className="text-secondary">Isi data sesuai kebutuhan lalu simpan.</small>
              </div>
              <button className="btn-close" aria-label="Tutup" onClick={resetForm} />
            </div>
            <div className="card-body">
              <form className="row g-3" onSubmit={submitForm}>
                {formStatus && (
                  <div className="col-12">
                    <div className="alert alert-warning mb-0">{formStatus}</div>
                  </div>
                )}
                {module.fields.map((field) => (
                  <FieldInput
                    field={field}
                    form={form}
                    setForm={setForm}
                    key={field[0]}
                    permissions={permissions}
                    optionsData={options}
                  />
                ))}
                <div className="col-12 d-flex flex-column flex-sm-row gap-2 justify-content-end">
                  <button className="btn btn-outline-secondary" type="button" onClick={resetForm} disabled={isSaving}>Batal</button>
                  <button className="btn btn-success" type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="admin-button-spinner" size={16} />}
                    {isSaving ? 'Menyimpan...' : (editing ? 'Simpan Perubahan' : 'Simpan Data')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {selectedDetail && (
        <DetailModal row={selectedDetail} onClose={() => setSelectedDetail(null)} />
      )}

      {permitAction && (
        <PermitActionModal
          action={permitAction}
          onClose={() => setPermitAction(null)}
          onSubmit={(note) => updatePermit(permitAction.row, permitAction.status, note)}
        />
      )}

      {attendanceReport && (
        <AttendanceReportModal report={attendanceReport} onClose={() => setAttendanceReport(null)} />
      )}

      {billReport && (
        <BillPaymentReportModal report={billReport} onClose={() => setBillReport(null)} />
      )}
    </div>
  );
}

function FieldInput({ field, form, setForm, permissions, optionsData }) {
  const [name, label, type, required, options] = field;
  const value = form[name];
  const colClass = type === 'textarea' || type === 'permissions' ? 'col-12' : 'col-12 col-md-6';

  function setValue(nextValue) {
    setForm((current) => ({ ...current, [name]: nextValue }));
  }

  if (type === 'checkbox') {
    return (
      <div className="col-12 col-md-6 d-flex align-items-end">
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" checked={Boolean(value)} onChange={(event) => setValue(event.target.checked)} />
          <label className="form-check-label">{label}</label>
        </div>
      </div>
    );
  }

  if (type === 'permissions') {
    return (
      <div className="col-12">
        <label className="form-label">{label}</label>
        <div className="row g-2">
          {permissions.map((permission) => (
            <div className="col-12 col-sm-6 col-xl-4" key={permission}>
              <label className="form-check border rounded p-2 ps-5 bg-light">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={(value || []).includes(permission)}
                  onChange={(event) => {
                    const current = value || [];
                    setValue(event.target.checked
                      ? [...current, permission]
                      : current.filter((item) => item !== permission));
                  }}
                />
                <span className="form-check-label">{permission}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'multi-select') {
    const selectedValues = normalizeArrayValue(value);
    const resolvedOptions = resolveOptions(options, optionsData);

    return (
      <div className={colClass}>
        <label className="form-label">{label}</label>
        <div className="admin-check-grid">
          {resolvedOptions.map((option) => (
            <label className="form-check border rounded p-2 ps-5 bg-light" key={optionValue(option)}>
              <input
                className="form-check-input"
                type="checkbox"
                checked={selectedValues.includes(optionValue(option))}
                onChange={(event) => {
                  setValue(event.target.checked
                    ? [...selectedValues, optionValue(option)]
                    : selectedValues.filter((item) => item !== optionValue(option)));
                }}
              />
              <span className="form-check-label">{optionLabel(option)}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'select') {
    const resolvedOptions = resolveOptions(options, optionsData);
    return (
      <div className={colClass}>
        <label className="form-label">{label}</label>
        <SearchableSelect
          value={value || ''}
          options={resolvedOptions}
          required={required}
          placeholder={`Ketik ${label.toLowerCase()}...`}
          onChange={setValue}
        />
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className={colClass}>
        <label className="form-label">{label}</label>
        <textarea className="form-control" rows="3" value={value || ''} required={required} onChange={(event) => setValue(event.target.value)} />
      </div>
    );
  }

  return (
    <div className={colClass}>
      <label className="form-label">{label}</label>
      <input
        className="form-control"
        type={isMoneyInput(name) ? 'text' : type}
        inputMode={isMoneyInput(name) ? 'numeric' : undefined}
        value={isMoneyInput(name) ? formatNumberInput(value) : formatFormValue(value, type)}
        required={required}
        step={type === 'number' ? 'any' : undefined}
        onChange={(event) => setValue(isMoneyInput(name) ? parseNumberInput(event.target.value) : event.target.value)}
      />
    </div>
  );
}

function SearchableSelect({ value, options, required, placeholder, onChange }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => String(optionValue(option)) === String(value));
  const displayValue = open ? query : (selectedOption ? optionLabel(selectedOption) : '');
  const normalizedQuery = query.trim().toLowerCase();
  const filteredOptions = normalizedQuery
    ? options.filter((option) => optionLabel(option).toLowerCase().includes(normalizedQuery))
    : options;

  function selectOption(option) {
    onChange(optionValue(option));
    setQuery('');
    setOpen(false);
  }

  return (
    <div className="admin-combobox">
      <input
        className="form-control"
        value={displayValue}
        required={required && !value}
        placeholder={placeholder}
        onFocus={() => {
          setQuery('');
          setOpen(true);
        }}
        onBlur={() => {
          window.setTimeout(() => {
            setOpen(false);
            setQuery('');
          }, 120);
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && filteredOptions.length > 0) {
            event.preventDefault();
            selectOption(filteredOptions[0]);
          }
          if (event.key === 'Escape') {
            setOpen(false);
            setQuery('');
          }
        }}
      />
      {open && (
        <div className="admin-combobox-menu">
          {!required && (
            <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => selectOption({ label: 'Tidak dipilih', value: '' })}>
              Tidak dipilih
            </button>
          )}
          {filteredOptions.length > 0 ? filteredOptions.map((option) => (
            <button
              type="button"
              key={optionValue(option)}
              className={String(optionValue(option)) === String(value) ? 'selected' : ''}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => selectOption(option)}
            >
              {optionLabel(option)}
            </button>
          )) : (
            <span>Tidak ada pilihan</span>
          )}
        </div>
      )}
    </div>
  );
}

function extractRows(data, collection) {
  if (collection === 'data' && Array.isArray(data.data)) return data.data;
  if (Array.isArray(data[collection])) return data[collection];
  return [];
}

function buildInitialForm(module, optionsData) {
  const initial = { ...(module.empty || {}) };

  for (const field of module.fields || []) {
    const [name, , type, required, optionKey] = field;
    if (type !== 'select' || !required || initial[name]) continue;

    const resolvedOptions = resolveOptions(optionKey, optionsData);
    const firstOption = resolvedOptions[0];
    if (firstOption !== undefined) {
      initial[name] = optionValue(firstOption);
    }
  }

  return initial;
}

function normalizeForForm(row, empty) {
  const next = { ...empty, ...row };
  for (const key of Object.keys(next)) {
    if (String(key).endsWith('_at') || ['starts_at', 'ends_at', 'permit_until'].includes(key)) {
      next[key] = toDateTimeLocal(next[key]);
    }
  }
  if (Array.isArray(row.kelas)) {
    next.kelas = row.kelas.map((item) => item.kelas || item);
  }
  if (row.user_id !== undefined) next.user_id = String(row.user_id);
  if (row.tagihan_id !== undefined) next.tagihan_id = String(row.tagihan_id);
  return next;
}

function normalizePayload(key, form, isEditing) {
  const payload = { ...form };
  if (key === 'bills') {
    payload.kelas = normalizeArrayValue(form.kelas);
    if (isEditing) delete payload.kelas;
  }
  if (key === 'vouchers') {
    payload.user_id = Number(form.user_id);
    payload.discount_amount = form.discount_amount === '' || form.discount_amount === null ? null : Number(form.discount_amount);
    payload.code = form.code ? String(form.code).trim().toUpperCase() : '';
  }
  if (key === 'announcements') {
    payload.roles = normalizeArrayValue(form.roles);
    if (payload.roles.length === 0) delete payload.roles;
  }
  if (key === 'users' && isEditing && !payload.password) {
    delete payload.password;
  }
  return payload;
}

function formatFormValue(value, type) {
  if (!value) return '';
  if (type === 'datetime-local') return toDateTimeLocal(value);
  if (type === 'date') return String(value).slice(0, 10);
  return String(value);
}

function isMoneyInput(name = '') {
  return ['nominal', 'discount_amount'].includes(name);
}

function parseNumberInput(value) {
  const digits = String(value || '').replace(/[^\d]/g, '');
  return digits ? Number(digits) : '';
}

function formatNumberInput(value) {
  if (value === '' || value === null || value === undefined) return '';
  const number = Number(String(value).replace(/[^\d]/g, ''));
  if (Number.isNaN(number)) return '';
  return number.toLocaleString('en-US');
}

function toDateTimeLocal(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 16);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function columnLabel(column) {
  return column.replaceAll('_', ' ');
}

function formatCell(value, column = '') {
  if (isDateColumn(column) && value) return <DateTimeCell value={value} column={column} />;
  if (isMoneyColumn(column) && value !== null && value !== undefined && value !== '') return formatRupiah(value);
  if (column === 'kategori') return billCategoryLabel(value);
  if (Array.isArray(value)) return value.map((item) => item.kelas || item.name || item).join(', ');
  if (typeof value === 'boolean') return value ? 'Ya' : 'Tidak';
  if (value && typeof value === 'object') return value.name || value.title || JSON.stringify(value);
  if (typeof value === 'string' && value.length > 70) return `${value.slice(0, 70)}...`;
  return value ?? '-';
}

function formatExportCell(value, column = '') {
  if (isDateColumn(column) && value) {
    const parts = getDateTimeParts(value, column);
    return parts.time ? `${parts.day}, ${parts.date} ${parts.time}` : `${parts.day}, ${parts.date}`;
  }
  if (isMoneyColumn(column) && value !== null && value !== undefined && value !== '') return formatRupiah(value);
  if (column === 'kategori') return billCategoryLabel(value);
  if (Array.isArray(value)) return value.map((item) => item.kelas || item.name || item).join(', ');
  if (typeof value === 'boolean') return value ? 'Ya' : 'Tidak';
  if (value && typeof value === 'object') return value.name || value.title || JSON.stringify(value);
  return value ?? '';
}

function DateTimeCell({ value, column }) {
  const parts = getDateTimeParts(value, column);
  return (
    <div className="date-cell">
      <strong>{parts.day}, {parts.date}</strong>
      {parts.time && <span>{parts.time}</span>}
    </div>
  );
}

function getDateTimeParts(value, column = '') {
  const date = parseDateValue(value);
  if (!date) return { day: '-', date: String(value), time: '' };
  const hasTime = String(value).includes('T') || column.endsWith('_at') || ['starts_at', 'ends_at', 'created_at', 'updated_at', 'submittedAt', 'paidAt'].includes(column);
  const dateFormatter = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
  const dayFormatter = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    timeZone: 'Asia/Jakarta',
  });
  const timeFormatter = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  });

  return {
    day: dayFormatter.format(date),
    date: dateFormatter.format(date),
    time: hasTime ? `${timeFormatter.format(date).replace('.', ':')} WIB` : '',
  };
}

function parseDateValue(value) {
  if (!value) return null;
  const raw = String(value);
  const date = new Date(raw.includes('T') ? raw : `${raw}T00:00:00+07:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isDateColumn(column = '') {
  return ['starts_at', 'ends_at', 'created_at', 'updated_at', 'awal_pembayaran', 'akhir_pembayaran', 'paid_at', 'submittedAt', 'paidAt'].includes(column)
    || column.endsWith('_at')
    || column.endsWith('At');
}

function isMoneyColumn(column = '') {
  return ['nominal', 'amount', 'amountPaid', 'discount_amount'].includes(column);
}

function formatRupiah(value) {
  const number = Number(value);
  if (Number.isNaN(number)) return value;
  return `Rp${number.toLocaleString('id-ID')}`;
}

function exportModuleRows(module, rows) {
  const exportRows = rows.map((row) => {
    const next = {};
    module.columns.forEach((column) => {
      next[columnLabel(column)] = formatExportCell(row[column], column);
    });
    return next;
  });
  downloadCsv(`pedu-${module.key}-${dateStamp()}.csv`, exportRows);
}

function exportAttendanceReport(report) {
  const rows = report.students.map((student) => ({
    Agenda: report.agenda.title,
    Kelas: report.agenda.kelas,
    Pengajar: report.agenda.teacher,
    Tanggal: report.agenda.date,
    Jam: report.agenda.time,
    Nama: student.name,
    Email: student.email,
    NIS: student.noKts || '',
    Status: student.statusLabel,
    Waktu: student.submittedLabel || '',
    Alasan: student.reason || '',
  }));
  downloadCsv(`pedu-kehadiran-${report.agenda.kelas}-${dateStamp()}.csv`, rows);
}

function exportBillReport(report) {
  const rows = report.students.map((student) => ({
    Tagihan: report.bill.name,
    Deskripsi: report.bill.description || '',
    Kelas: student.kelas,
    Nama: student.name,
    Email: student.email,
    NIS: student.noKts || '',
    Nominal: student.nominalLabel,
    Status: student.statusLabel,
    Dibayar: student.amountPaidLabel,
    Metode: student.paymentMethod || '',
    WaktuBayar: student.paidAtLabel || '',
    Invoice: student.invoiceId || '',
  }));
  downloadCsv(`pedu-pembayaran-${report.bill.name}-${dateStamp()}.csv`, rows);
}

function downloadCsv(filename, rows) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(';'),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(';')),
  ];
  const blob = new Blob([`\uFEFF${lines.join('\n')}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.replace(/[\\/:*?"<>|]+/g, '-');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const text = String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

function dateStamp() {
  return new Date().toISOString().slice(0, 10);
}

function resolveOptions(options, optionsData) {
  if (Array.isArray(options)) return options;
  return optionsData?.[options] || fallbackOptions[options] || [];
}

function optionValue(option) {
  if (option && typeof option === 'object') return String(option.value);
  return String(option);
}

function optionLabel(option) {
  if (option && typeof option === 'object') return option.label;
  return String(option);
}

function normalizeArrayValue(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return String(value).split(',').map((item) => item.trim()).filter(Boolean);
}

function DetailModal({ row, onClose }) {
  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
      <div className="admin-modal card border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <div>
            <h2 className="h5 fw-bold mb-0">Detail Perizinan</h2>
            <small className="text-secondary">Informasi lengkap pengajuan izin.</small>
          </div>
          <button className="btn-close" aria-label="Tutup" onClick={onClose} />
        </div>
        <div className="card-body">
          <div className="row g-3">
            {Object.entries(row).map(([key, value]) => (
              <div className="col-12 col-md-6" key={key}>
                <div className="detail-box">
                  <span>{columnLabel(key)}</span>
                  <strong>{formatCell(value, key)}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PermitActionModal({ action, onClose, onSubmit }) {
  const [note, setNote] = useState(action.status === 'disetujui' ? 'Pengajuan disetujui.' : 'Pengajuan ditolak.');

  function submit(event) {
    event.preventDefault();
    onSubmit(note);
  }

  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
      <div className="admin-modal card border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <div>
            <h2 className="h5 fw-bold mb-0">{action.status === 'disetujui' ? 'ACC Perizinan' : 'Tolak Perizinan'}</h2>
            <small className="text-secondary">Catatan ini akan dikirim ke santri bersama update status.</small>
          </div>
          <button className="btn-close" aria-label="Tutup" onClick={onClose} />
        </div>
        <form className="card-body" onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Catatan</label>
            <textarea className="form-control" rows="5" value={note} onChange={(event) => setNote(event.target.value)} required />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-outline-secondary" type="button" onClick={onClose}>Batal</button>
            <button className={action.status === 'disetujui' ? 'btn btn-success' : 'btn btn-danger'} type="submit">
              {action.status === 'disetujui' ? 'ACC dan Buat Surat' : 'Tolak Pengajuan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AttendanceReportModal({ report, onClose }) {
  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
      <div className="admin-modal card border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <div>
            <h2 className="h5 fw-bold mb-0">Rekap Kehadiran</h2>
            <small className="text-secondary">{report.agenda.title} - {report.agenda.kelas} - {report.agenda.time}</small>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-success btn-sm" onClick={() => exportAttendanceReport(report)}>Export Excel</button>
            <button className="btn-close" aria-label="Tutup" onClick={onClose} />
          </div>
        </div>
        <div className="card-body">
          <div className="row g-2 mb-3">
            <div className="col-6 col-md-3"><div className="detail-box"><span>Total</span><strong>{report.summary.total}</strong></div></div>
            <div className="col-6 col-md-3"><div className="detail-box"><span>Hadir</span><strong>{report.summary.present}</strong></div></div>
            <div className="col-6 col-md-3"><div className="detail-box"><span>Izin/Absen</span><strong>{report.summary.absent}</strong></div></div>
            <div className="col-6 col-md-3"><div className="detail-box"><span>Belum</span><strong>{report.summary.missing}</strong></div></div>
          </div>
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>NIS</th>
                  <th>Status</th>
                  <th>Waktu</th>
                  <th>Alasan</th>
                </tr>
              </thead>
              <tbody>
                {report.students.map((student) => (
                  <tr key={student.userId}>
                    <td>{student.name}</td>
                    <td>{student.noKts || '-'}</td>
                    <td><span className={`attendance-badge ${student.status}`}>{student.statusLabel}</span></td>
                    <td>{student.submittedLabel || '-'}</td>
                    <td>{student.reason || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillPaymentReportModal({ report, onClose }) {
  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
      <div className="admin-modal card border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <div>
            <h2 className="h5 fw-bold mb-0">Rekap Pembayaran</h2>
            <small className="text-secondary">{report.bill.name} - {report.bill.amountLabel}</small>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-success btn-sm" onClick={() => exportBillReport(report)}>Export Excel</button>
            <button className="btn-close" aria-label="Tutup" onClick={onClose} />
          </div>
        </div>
        <div className="card-body">
          <div className="row g-2 mb-3">
            <div className="col-6 col-md-3"><div className="detail-box"><span>Total Santri</span><strong>{report.summary.total}</strong></div></div>
            <div className="col-6 col-md-3"><div className="detail-box"><span>Lunas</span><strong>{report.summary.paid}</strong></div></div>
            <div className="col-6 col-md-3"><div className="detail-box"><span>Belum</span><strong>{report.summary.unpaid}</strong></div></div>
            <div className="col-6 col-md-3"><div className="detail-box"><span>Periode</span><strong>{report.bill.startsAtLabel} - {report.bill.endsAtLabel}</strong></div></div>
          </div>
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Kelas</th>
                  <th>NIS</th>
                  <th>Status</th>
                  <th>Dibayar</th>
                  <th>Metode</th>
                  <th>Waktu Bayar</th>
                </tr>
              </thead>
              <tbody>
                {report.students.map((student) => (
                  <tr key={student.userId}>
                    <td>{student.name}</td>
                    <td>{student.kelas || '-'}</td>
                    <td>{student.noKts || '-'}</td>
                    <td><span className={`payment-badge ${student.status}`}>{student.statusLabel}</span></td>
                    <td>{student.amountPaidLabel || '-'}</td>
                    <td>{student.paymentMethod || '-'}</td>
                    <td>{student.paidAtLabel || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateEditor({ module }) {
  const [template, setTemplate] = useState('');
  const [status, setStatus] = useState('Memuat template...');

  useEffect(() => {
    loadTemplate();
  }, []);

  async function loadTemplate() {
    setStatus('Memuat template...');
    try {
      const data = await apiFetch(module.endpoint);
      setTemplate(data.template || '');
      setStatus('');
    } catch (error) {
      setStatus(error.message || 'Template belum bisa dimuat.');
    }
  }

  async function saveTemplate(event) {
    event.preventDefault();
    setStatus('Menyimpan template...');
    try {
      const data = await apiFetch(module.endpoint, {
        method: 'PUT',
        body: JSON.stringify({ template }),
      });
      setStatus(data.message || 'Template berhasil disimpan.');
    } catch (error) {
      setStatus(error.message || 'Template belum bisa disimpan.');
    }
  }

  return (
    <div className="vstack gap-4">
      <section className="admin-hero">
        <div>
          <span className="admin-eyebrow">Template</span>
          <h1>Template Surat</h1>
          <p>Edit kop dan isi surat izin resmi. Variabel Laravel Blade seperti permit dan reviewerName bisa tetap digunakan.</p>
        </div>
      </section>
      {status && <div className="alert alert-light border mb-0">{status}</div>}
      <form className="card border-0 admin-card" onSubmit={saveTemplate}>
        <div className="card-body">
          <div className="row g-4">
            <div className="col-12 col-xl-6">
              <label className="form-label">Template Blade Surat Izin</label>
              <textarea className="form-control font-monospace" rows="28" value={template} onChange={(event) => setTemplate(event.target.value)} />
            </div>
            <div className="col-12 col-xl-6">
              <label className="form-label">Preview Surat</label>
              <LetterPreview />
            </div>
          </div>
          <div className="d-flex gap-2 justify-content-end mt-3">
            <button className="btn btn-outline-success" type="button" onClick={loadTemplate}>Muat Ulang</button>
            <button className="btn btn-success" type="submit">Simpan Template</button>
          </div>
        </div>
      </form>
    </div>
  );
}

function LetterPreview() {
  return (
    <div className="letter-preview">
      <div className="letter-kop">
        <h3>Pesantren Ekonomi Darul Ukhwah</h3>
        <p>Jl. Kedoya Duri Raya No.13 28B, Jakarta Barat</p>
        <p>Surat Izin Santri</p>
      </div>
      <div className="letter-title">SURAT IZIN</div>
      <div className="letter-number">Nomor: PEDU/IZIN/20260508093033/0003</div>
      <p>Yang bertanda tangan di bawah ini memberikan izin kepada:</p>
      <table>
        <tbody>
          <tr><td>Nama Pengaju</td><td>: Ahmad Awaliyah</td></tr>
          <tr><td>No. HP</td><td>: 6281234567890</td></tr>
          <tr><td>Perihal Izin</td><td>: Keluar</td></tr>
          <tr><td>Ditujukan Kepada</td><td>: Pengurus</td></tr>
          <tr><td>Tujuan Keluar</td><td>: Rumah keluarga</td></tr>
          <tr><td>Kembali Pada</td><td>: 10 Mei 2026 08:00</td></tr>
          <tr><td>Alasan</td><td>: Keperluan keluarga</td></tr>
          <tr><td>Catatan Pemberi Izin</td><td>: Diizinkan, wajib kembali tepat waktu.</td></tr>
        </tbody>
      </table>
      <p>Demikian surat izin ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
      <div className="letter-signature">
        <p>Jakarta, 08 Mei 2026</p>
        <p>Pemberi Izin</p>
        <strong>Super Admin PEDU</strong>
      </div>
    </div>
  );
}

function applyTableFilters(rows, module, search, filterValue, advancedFilters = {}) {
  const term = search.trim().toLowerCase();

  return rows.filter((row) => {
    const matchesSearch = !term || Object.values(row).some((value) => formatSearchValue(value).includes(term));
    const matchesFilter = filterValue === 'all' || String(row[getFilterKey(module)] ?? '') === filterValue;
    const matchesAdvanced = Object.entries(advancedFilters).every(([key, value]) => {
      if (!value) return true;
      if (key === 'date') return String(row.starts_at || '').slice(0, 10) === value;
      return String(row[key] ?? '') === value;
    });
    return matchesSearch && matchesFilter && matchesAdvanced;
  });
}

function getFilterOptions(rows, module) {
  const key = getFilterKey(module);
  if (!key) return [];

  return [...new Set(rows.map((row) => row[key]).filter((value) => value !== undefined && value !== null && value !== ''))]
    .map((value) => ({
      value: String(value),
      label: formatExportCell(value),
    }));
}

function getFilterKey(module) {
  const preferred = {
    classes: 'is_active',
    users: 'role',
    roles: 'name',
    agendas: 'kelas',
    bills: 'kategori',
    books: 'is_active',
    permits: 'status',
  };

  return preferred[module.key] || module.columns[0];
}

function billCategoryLabel(value) {
  return {
    syahriah: 'Syahriah',
    agenda: 'Agenda',
    'lain-lain': 'Lain-lain',
  }[value] || value || '-';
}

function formatSearchValue(value) {
  if (Array.isArray(value)) return value.map(formatSearchValue).join(' ');
  if (value && typeof value === 'object') return Object.values(value).map(formatSearchValue).join(' ');
  return String(value ?? '').toLowerCase();
}
