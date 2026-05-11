export const santri = {
  name: 'Ahmad Awaliyah',
  role: 'Santri',
  roleKey: 'santri',
  nis: 'NIS-AW1-001',
  className: 'Awaliyah 1',
  avatar: 'AA',
  academic: 'Siap naik kelas',
};

export const userRoles = [
  { key: 'superadmin', label: 'Super Admin' },
  { key: 'admin', label: 'Admin' },
  { key: 'ustad', label: 'Ustadz' },
  { key: 'keuangan', label: 'Keuangan' },
  { key: 'santri', label: 'Santri' },
  { key: 'pengurus', label: 'Pengurus' },
];

export const publicRegisterRole = 'santri';

export function initialsFromName(name = '') {
  const words = name.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((word) => word[0]).join('').toUpperCase() || 'S';
}

export function normalizeSantriUser(user) {
  if (!user) return santri;

  return {
    name: user.name || santri.name,
    role: user.role ? roleLabel(user.role) : santri.role,
    roleKey: user.role || santri.roleKey,
    nis: user.no_kts || user.nis || user.email || santri.nis,
    className: user.role === 'ustad' ? 'Pengajar Pesantren' : (user.kelas || user.className || santri.className),
    avatar: initialsFromName(user.name || santri.name),
    academic: user.academic || santri.academic,
  };
}

export function roleLabel(role) {
  return userRoles.find((item) => item.key === role)?.label || role;
}

export function getTestingAgenda() {
  const now = new Date();
  const activeStart = new Date(now);
  activeStart.setHours(now.getHours() - 1);
  const activeEnd = new Date(now);
  activeEnd.setHours(now.getHours() + 1);
  const closedStart = new Date(now);
  closedStart.setHours(now.getHours() - 4);
  const closedEnd = new Date(now);
  closedEnd.setHours(now.getHours() - 2);

  return [
    {
      id: 'local-active',
      title: 'Pengajian Malam Aktif',
      teacher: 'Pengasuh Pesantren',
      location: 'Aula Utama',
      latitude: -6.2495400,
      longitude: 106.9057300,
      attendanceRadiusMeters: 50,
      time: `${formatTime(activeStart)} - ${formatTime(activeEnd)}`,
      status: 'Wajib',
      stateLabel: 'Aktif',
      permitUntil: formatTime(new Date(activeStart.getTime() - 2 * 60 * 60 * 1000)),
      startsAt: activeStart.toISOString(),
      endsAt: activeEnd.toISOString(),
      isClosed: false,
      isActive: true,
    },
    {
      id: 'local-closed',
      title: 'Pengajian Malam Selesai',
      teacher: 'Pengasuh Pesantren',
      location: 'Aula Utama',
      latitude: -6.2495400,
      longitude: 106.9057300,
      attendanceRadiusMeters: 50,
      time: `${formatTime(closedStart)} - ${formatTime(closedEnd)}`,
      status: 'Wajib',
      stateLabel: 'Selesai',
      permitUntil: formatTime(new Date(closedStart.getTime() - 2 * 60 * 60 * 1000)),
      startsAt: closedStart.toISOString(),
      endsAt: closedEnd.toISOString(),
      isClosed: true,
      isActive: false,
    },
  ];
}

function formatTime(date) {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date).replace(':', '.');
}

export function isNightlyStudyDay(date = new Date()) {
  const day = date.getDay();
  return day >= 0 && day <= 3;
}

export function getTodayAgenda(date = new Date()) {
  return getTestingAgenda(date);
}

export function formatAgendaDate(date = new Date()) {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(date);
}

export const bills = [
  { name: 'Tagihan Bulanan Mei', amount: 'Rp250.000', type: 'Bulanan seluruh santri' },
  { name: 'Listrik Khidmah', amount: 'Rp45.000', type: 'Khusus santri Khidmah' },
  { name: 'Agenda Khataman', amount: 'Rp35.000', type: 'Tagihan agenda tertentu' },
];

export const schedulesByClass = {
  'Awaliyah 1': [
    ['Minggu', 'Fathul Qorib', '20:00 - 23:00', 'Ust. Jamal'],
    ['Senin', 'Nasoihul Ibad', '20:00 - 23:00', 'Ust. Salman'],
    ['Selasa', 'Aqidatul Awam', '20:00 - 23:00', 'Ust. Hamdan'],
    ['Rabu', 'Safinatun Najah', '20:00 - 23:00', 'Ust. Rofiq'],
    ['Jumat', 'Tashrif', '20:00 - 23:00', 'Ust. Jamal'],
  ],
  'Awaliyah 2': [
    ['Minggu', 'Jurumiyah', '20:00 - 23:00', 'Ust. Mahfudz'],
    ['Senin', 'Mabadi Fiqih', '20:00 - 23:00', 'Ust. Farhan'],
    ['Selasa', 'Tijan Darori', '20:00 - 23:00', 'Ust. Fikri'],
    ['Rabu', 'Ta lim Muta alim', '20:00 - 23:00', 'Ust. Idris'],
    ['Jumat', 'Akhlakul Banin', '20:00 - 23:00', 'Ust. Farhan'],
  ],
  'Awaliyah 3': [
    ['Minggu', 'Imrithi', '20:00 - 23:00', 'Ust. Ridwan'],
    ['Senin', 'Sulam Taufiq', '20:00 - 23:00', 'Ust. Hasan'],
    ['Selasa', 'Kailani', '20:00 - 23:00', 'Ust. Zain'],
    ['Rabu', 'Washoya', '20:00 - 23:00', 'Ust. Munir'],
    ['Jumat', 'Durusul Fiqhiyyah', '20:00 - 23:00', 'Ust. Hasan'],
  ],
  'Wusto 1': [
    ['Minggu', 'Fathul Muin', '20:00 - 23:00', 'Ust. Najib'],
    ['Senin', 'Alfiyah Ibnu Malik', '20:00 - 23:00', 'Ust. Haris'],
    ['Selasa', 'Bulughul Maram', '20:00 - 23:00', 'Ust. Bahri'],
    ['Rabu', 'Tafsir Jalalain', '20:00 - 23:00', 'Ust. Amin'],
    ['Jumat', 'Ushul Fiqih', '20:00 - 23:00', 'Ust. Najib'],
  ],
  'Wusto 2': [
    ['Minggu', 'I anatut Thalibin', '20:00 - 23:00', 'Ust. Mukhlis'],
    ['Senin', 'Jauhar Maknun', '20:00 - 23:00', 'Ust. Qomar'],
    ['Selasa', 'Riyadus Shalihin', '20:00 - 23:00', 'Ust. Syafiq'],
    ['Rabu', 'Tafsir Munir', '20:00 - 23:00', 'Ust. Habib'],
    ['Jumat', 'Bidayatul Hidayah', '20:00 - 23:00', 'Ust. Mukhlis'],
  ],
  'Wusto 3': [
    ['Minggu', 'Mahalli', '20:00 - 23:00', 'Ust. Yahya'],
    ['Senin', 'Uqudul Juman', '20:00 - 23:00', 'Ust. Afif'],
    ['Selasa', 'Minhajul Abidin', '20:00 - 23:00', 'Ust. Latif'],
    ['Rabu', 'Hikam', '20:00 - 23:00', 'Ust. Said'],
    ['Jumat', 'Qawaidul Fiqhiyah', '20:00 - 23:00', 'Ust. Yahya'],
  ],
  'Ulya 1': [
    ['Minggu', 'Fathul Wahhab', '20:00 - 23:00', 'Ust. Mustofa'],
    ['Senin', 'Jam ul Jawami', '20:00 - 23:00', 'Ust. Naufal'],
    ['Selasa', 'Shahih Bukhari', '20:00 - 23:00', 'Ust. Khalil'],
    ['Rabu', 'Ihya Ulumuddin', '20:00 - 23:00', 'Ust. Mubin'],
    ['Jumat', 'Ulum Hadits', '20:00 - 23:00', 'Ust. Khalil'],
  ],
  'Ulya 2': [
    ['Minggu', 'Bughyatul Mustarsyidin', '20:00 - 23:00', 'Ust. Wahid'],
    ['Senin', 'Al Asybah wan Nazhair', '20:00 - 23:00', 'Ust. Hilmi'],
    ['Selasa', 'Shahih Muslim', '20:00 - 23:00', 'Ust. Ihsan'],
    ['Rabu', 'Tafsir Ibnu Katsir', '20:00 - 23:00', 'Ust. Fadlan'],
    ['Jumat', 'Fathul Bari', '20:00 - 23:00', 'Ust. Ihsan'],
  ],
};

export const schedules = schedulesByClass['Awaliyah 1'];

export function getSchedulesForClass(className) {
  return schedulesByClass[className] || schedules;
}

export const books = [
  { title: 'Fathul Qarib', source: 'Google Drive', imageAlt: 'Cover Fathul Qarib' },
  { title: "Ta'lim Muta'allim", source: 'Google Drive', imageAlt: "Cover Ta'lim Muta'allim" },
  { title: 'Safinatun Najah', source: 'Google Drive', imageAlt: 'Cover Safinatun Najah' },
];

export const calendarEvents = [
  ['Kamis malam', 'Berzanji rutin'],
  ['Jumat malam minggu pertama', 'Sholat tasbih bulanan'],
  ['Sabtu minggu pertama', 'Khataman'],
  ['Sabtu malam minggu pertama', 'Manaqib'],
  ['Minggu malam', 'Ratiban'],
  ['Minggu - Rabu', 'Pengajian rutin'],
];

export const announcements = [
  {
    title: 'Pengumuman pembayaran Syahriyah',
    body: 'Batas pembayaran bulan Mei sampai tanggal 10.',
    date: '07 Mei 2026',
  },
  {
    title: 'Perubahan tempat pengajian',
    body: 'Pengajian Fathul Qarib malam ini dipindah ke Aula Utama.',
    date: '07 Mei 2026',
  },
];
