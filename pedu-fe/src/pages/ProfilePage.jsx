import { CheckCircle2, Edit3, GraduationCap, IdCard, MapPin, Save, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../api';
import { ImagePlaceholder } from '../components/ImagePlaceholder';
import { ListScreen } from '../components/ListScreen';
import { normalizeSantriUser } from '../data/mockData';
import './ProfilePage.css';

const baseFields = [
  ['name', 'Nama lengkap', 'text', true],
  ['email', 'Email', 'email', true],
  ['no_kts', 'NIS lokal pesantren', 'text', true],
  ['nisn', 'NISN', 'text', false],
  ['nik', 'NIK santri', 'text', true],
  ['no_kk', 'Nomor KK', 'text', true],
  ['tempat_lahir', 'Tempat lahir', 'text', true],
  ['tanggal_lahir', 'Tanggal lahir', 'date', true],
  ['jenis_kelamin', 'Jenis kelamin', 'select', true, [['L', 'Laki-laki'], ['P', 'Perempuan']]],
  ['agama', 'Agama', 'text', true],
  ['kewarganegaraan', 'Kewarganegaraan', 'text', true],
  ['tanggal_masuk', 'Tanggal masuk pesantren', 'date', true],
  ['pembiaya_sekolah', 'Yang membiayai sekolah', 'select', true, [['Orang Tua', 'Orang Tua'], ['Wali', 'Wali'], ['Beasiswa', 'Beasiswa'], ['Mandiri', 'Mandiri']]],
  ['hobi', 'Hobi', 'text', false],
  ['cita_cita', 'Cita-cita', 'text', false],
  ['anak_ke', 'Anak ke', 'number', false],
  ['jumlah_saudara', 'Jumlah saudara', 'number', false],
  ['no_hp', 'Nomor HP', 'tel', true],
  ['asrama', 'Asrama', 'text', true],
  ['status_saat_ini', 'Status saat ini', 'select', true, [['kerja', 'Kerja'], ['kuliah', 'Kuliah'], ['sekolah', 'Sekolah'], ['tidak ada', 'Tidak ada']]],
];

const addressFields = [
  ['alamat', 'Alamat lengkap', 'textarea', true],
  ['provinsi', 'Provinsi', 'text', true],
  ['kabupaten', 'Kabupaten/Kota', 'text', true],
  ['kecamatan', 'Kecamatan', 'text', true],
  ['desa', 'Desa/Kelurahan', 'text', true],
  ['kode_pos', 'Kode pos', 'text', false],
];

const parentFields = [
  ['nama_ayah', 'Nama ayah', 'text', false],
  ['nik_ayah', 'NIK ayah', 'text', false],
  ['pekerjaan_ayah', 'Pekerjaan ayah', 'text', false],
  ['pendidikan_ayah', 'Pendidikan ayah', 'text', false],
  ['nama_ibu', 'Nama ibu kandung', 'text', true],
  ['nik_ibu', 'NIK ibu', 'text', false],
  ['pekerjaan_ibu', 'Pekerjaan ibu', 'text', false],
  ['pendidikan_ibu', 'Pendidikan ibu', 'text', false],
  ['nama_wali', 'Nama wali', 'text', false],
  ['hubungan_wali', 'Hubungan wali', 'text', false],
  ['no_hp_wali', 'HP wali', 'tel', false],
];

const teacherFields = [
  ['name', 'Nama lengkap', 'text', true],
  ['email', 'Email', 'email', true],
  ['alamat', 'Alamat', 'textarea', false],
  ['no_hp', 'Nomor HP', 'tel', false],
  ['foto', 'URL foto sementara', 'text', false],
];

export function ProfilePage({ user, onUserUpdate }) {
  const [profile, setProfile] = useState(user || {});
  const [completion, setCompletion] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState('');
  const santri = normalizeSantriUser(profile);
  const isTeacher = (profile.role || user?.role) === 'ustad';
  const requiredFields = useMemo(
    () => (isTeacher ? teacherFields : [...baseFields, ...addressFields, ...parentFields]).filter((field) => field[3]).map(([name]) => name),
    [isTeacher]
  );
  const localCompletion = calculateCompletion(profile, requiredFields);
  const percentage = completion?.percentage ?? localCompletion.percentage;

  useEffect(() => {
    let alive = true;

    async function loadProfile() {
      try {
        const data = await apiFetch('/santri/profile');
        if (!alive) return;
        setProfile(data.user || user || {});
        setCompletion(data.completion || null);
        onUserUpdate?.(data.user);
      } catch {
        if (!alive) return;
        setProfile(user || {});
      }
    }

    loadProfile();

    return () => {
      alive = false;
    };
  }, [user?.id]);

  function updateField(name, value) {
    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function submitProfile(event) {
    event.preventDefault();
    setStatus('Menyimpan data...');

    try {
      const response = await apiFetch('/santri/profile', {
        method: 'PUT',
        body: JSON.stringify(normalizePayload(profile, isTeacher)),
      });
      setProfile(response.user);
      setCompletion(response.completion);
      onUserUpdate?.(response.user);
      setIsEditing(false);
      setStatus(response.message || 'Data berhasil disimpan.');
    } catch (error) {
      setStatus(error.message || 'Data belum bisa disimpan.');
    }
  }

  return (
    <ListScreen title="Profil" subtitle={isTeacher ? 'Data profil ustadz pengajar.' : 'Data induk santri untuk kebutuhan pesantren dan EMIS.'}>
      <section className="profile-card">
        {/* <ImagePlaceholder label="Foto santri sementara" /> */}
        <div className="avatar large">{santri.avatar}</div>
        <h2>{santri.name}</h2>
        <p>{santri.nis}</p>
        <span>{santri.className}</span>
      </section>

      <section className="profile-completion">
        <div>
          <p>Kelengkapan Data EMIS</p>
          <strong>{percentage}%</strong>
        </div>
        <div className="progress-track">
          <span style={{ width: `${percentage}%` }} />
        </div>
        <button className="complete-button" onClick={() => setIsEditing((value) => !value)}>
          <Edit3 size={17} /> {isEditing ? 'Tutup Form' : 'Lengkapi Data'}
        </button>
      </section>

      {!isEditing && !isTeacher && (
        <>
          <ProfileSummary icon={<IdCard size={22} />} title="Identitas" lines={[
            `NIK: ${profile.nik || '-'}`,
            `NISN: ${profile.nisn || '-'}`,
            `Asrama: ${profile.asrama || '-'}`,
            `Status: ${formatCurrentStatus(profile.status_saat_ini)}`,
            `${profile.tempat_lahir || '-'}, ${formatDate(profile.tanggal_lahir)}`,
          ]} />
          <ProfileSummary icon={<MapPin size={22} />} title="Alamat" lines={[
            profile.alamat || '-',
            [profile.desa, profile.kecamatan, profile.kabupaten].filter(Boolean).join(', ') || '-',
          ]} />
          <ProfileSummary icon={<UserRound size={22} />} title="Orang Tua / Wali" lines={[
            `Ibu: ${profile.nama_ibu || '-'}`,
            `Ayah: ${profile.nama_ayah || '-'}`,
            `Wali: ${profile.nama_wali || '-'}`,
          ]} />
          {/* <article className="list-item">
            <div className="list-icon">
              <GraduationCap size={22} />
            </div>
            <div>
              <h3>Status Akademik</h3>
              <p>{santri.academic}</p>
            </div>
            <strong>{percentage}%</strong>
          </article> */}
        </>
      )}

      {!isEditing && isTeacher && (
        <>
          <ProfileSummary icon={<UserRound size={22} />} title="Data Ustadz" lines={[
            `Email: ${profile.email || '-'}`,
            `No HP: ${profile.no_hp || '-'}`,
            `Alamat: ${profile.alamat || '-'}`,
          ]} />
        </>
      )}

      {isEditing && (
        <form className="emis-form" onSubmit={submitProfile}>
          {isTeacher ? (
            <FieldGroup title="Profil Ustadz" fields={teacherFields} profile={profile} onChange={updateField} />
          ) : (
            <>
              <FieldGroup title="Identitas Santri" fields={baseFields} profile={profile} onChange={updateField} />
              <FieldGroup title="Alamat Domisili" fields={addressFields} profile={profile} onChange={updateField} />
              <FieldGroup title="Orang Tua dan Wali" fields={parentFields} profile={profile} onChange={updateField} />
              <p className="emis-note">
                Nomor HP mengikuti validasi EMIS: gunakan kode negara tanpa tanda plus, contoh 6281234567890.
              </p>
            </>
          )}
          <button className="save-profile-button" type="submit">
            <Save size={18} /> Simpan Data
          </button>
          {status && <p className="profile-status"><CheckCircle2 size={16} /> {status}</p>}
        </form>
      )}
    </ListScreen>
  );
}

function FieldGroup({ title, fields, profile, onChange }) {
  return (
    <section className="form-group-card">
      <h3>{title}</h3>
      {fields.map(([name, label, type, required, options]) => (
        <label className="profile-field" key={name}>
          {label}{required ? ' *' : ''}
          {type === 'select' ? (
            <select value={profile[name] || ''} onChange={(event) => onChange(name, event.target.value)} required={required}>
              <option value="">Pilih</option>
              {options.map(([value, text]) => (
                <option key={value} value={value}>{text}</option>
              ))}
            </select>
          ) : type === 'textarea' ? (
            <textarea rows="4" value={profile[name] || ''} onChange={(event) => onChange(name, event.target.value)} required={required} />
          ) : (
            <input type={type} value={formatInputValue(profile[name])} onChange={(event) => onChange(name, event.target.value)} required={required} />
          )}
        </label>
      ))}
    </section>
  );
}

function ProfileSummary({ icon, title, lines }) {
  return (
    <article className="profile-summary">
      <div className="list-icon">{icon}</div>
      <div>
        <h3>{title}</h3>
        {lines.map((line, index) => <p key={`${title}-${index}`}>{line}</p>)}
      </div>
    </article>
  );
}

function calculateCompletion(profile, requiredFields) {
  const filled = requiredFields.filter((field) => Boolean(profile?.[field])).length;
  return {
    filled,
    total: requiredFields.length,
    percentage: Math.round((filled / requiredFields.length) * 100),
  };
}

function normalizePayload(profile, isTeacher = false) {
  const fields = (isTeacher ? teacherFields : [...baseFields, ...addressFields, ...parentFields]).map(([name]) => name);
  return fields.reduce((payload, name) => {
    payload[name] = profile[name] ?? '';
    return payload;
  }, {});
}

function formatDate(value) {
  if (!value) return '-';
  return formatInputValue(value);
}

function formatInputValue(value) {
  if (!value) return '';
  if (typeof value === 'string') return value.slice(0, 10);
  return String(value).slice(0, 10);
}

function formatCurrentStatus(value) {
  const labels = {
    kerja: 'Kerja',
    kuliah: 'Kuliah',
    sekolah: 'Sekolah',
    'tidak ada': 'Tidak ada',
  };

  return labels[value] || '-';
}
