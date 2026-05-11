import { Download, FileText, Plus, Send } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { API_BASE_URL, apiFetch, getStoredSession } from '../api';
import { ListScreen } from '../components/ListScreen';
import './PermitsPage.css';

const tabs = [
  ['menunggu', 'Menunggu'],
  ['disetujui', 'Disetujui'],
  ['ditolak', 'Ditolak'],
];

const initialForm = {
  nama: '',
  no_hp: '',
  perihal: 'keluar',
  ditujukan_kepada: 'pengurus',
  tujuan_keluar: '',
  kembali_pada: '',
  alasan: '',
};

export function PermitsPage({ user }) {
  const [activeTab, setActiveTab] = useState('menunggu');
  const [permits, setPermits] = useState([]);
  const [selectedPermit, setSelectedPermit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    ...initialForm,
    nama: user?.name || '',
    no_hp: user?.no_hp || '',
  });
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    loadPermits(activeTab);
  }, [activeTab]);

  const visiblePermits = useMemo(() => permits.filter((permit) => permit.status === activeTab), [permits, activeTab]);

  async function loadPermits(statusName = activeTab) {
    setStatus('loading');
    try {
      const data = await apiFetch(`/santri/permits?status=${statusName}`);
      setPermits(data.permits || []);
      setStatus('ready');
    } catch {
      setPermits([]);
      setStatus('ready');
    }
  }

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submitPermit(event) {
    event.preventDefault();
    setStatus('saving');
    try {
      const payload = {
        ...form,
        tujuan_keluar: form.perihal === 'keluar' ? form.tujuan_keluar : null,
        kembali_pada: form.perihal === 'keluar' ? form.kembali_pada : null,
      };
      const response = await apiFetch('/santri/permits', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      setShowForm(false);
      setSelectedPermit(response.permit);
      setActiveTab('menunggu');
      await loadPermits('menunggu');
    } catch (error) {
      setStatus(error.message || 'Pengajuan belum bisa dikirim.');
    }
  }

  async function downloadLetter(permit) {
    const session = getStoredSession();
    const response = await fetch(`${API_BASE_URL}${permit.downloadUrl}`, {
      headers: {
        Accept: 'text/plain',
        Authorization: `Bearer ${session?.token}`,
      },
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `surat-izin-${permit.id}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ListScreen title="Perizinan" subtitle="Ajukan izin keluar, sakit, atau tugas kerja dan pantau statusnya.">
      <div className="permit-tabs">
        {tabs.map(([value, label]) => (
          <button key={value} className={activeTab === value ? 'active' : ''} onClick={() => setActiveTab(value)}>
            {label}
          </button>
        ))}
      </div>

      <button className="new-permit-button" onClick={() => setShowForm((value) => !value)}>
        <Plus size={17} /> {showForm ? 'Tutup Form' : 'Ajukan Perizinan'}
      </button>

      {showForm && (
        <form className="permit-form" onSubmit={submitPermit}>
          <label>Nama
            <input value={form.nama} onChange={(event) => updateField('nama', event.target.value)} required />
          </label>
          <label>No HP
            <input value={form.no_hp} onChange={(event) => updateField('no_hp', event.target.value)} required />
          </label>
          <label>Perihal
            <select value={form.perihal} onChange={(event) => updateField('perihal', event.target.value)} required>
              <option value="keluar">Keluar</option>
              <option value="sakit">Sakit</option>
              <option value="tugas/kerja">Tugas/Kerja</option>
            </select>
          </label>
          <label>Ke siapa
            <select value={form.ditujukan_kepada} onChange={(event) => updateField('ditujukan_kepada', event.target.value)} required>
              <option value="pengurus">Pengurus</option>
              <option value="ust pesantren">Ust Pesantren</option>
            </select>
          </label>
          {form.perihal === 'keluar' && (
            <>
              <label>Kemana
                <input value={form.tujuan_keluar} onChange={(event) => updateField('tujuan_keluar', event.target.value)} required />
              </label>
              <label>Kapan kembali
                <input type="datetime-local" value={form.kembali_pada} onChange={(event) => updateField('kembali_pada', event.target.value)} required />
              </label>
            </>
          )}
          <label>Alasan
            <textarea rows="4" value={form.alasan} onChange={(event) => updateField('alasan', event.target.value)} />
          </label>
          <button type="submit" className="submit-permit-button">
            <Send size={17} /> Kirim Pengajuan
          </button>
        </form>
      )}

      {status === 'loading' && <div className="permit-loader"><span /><span /><span /></div>}

      {status !== 'loading' && visiblePermits.map((permit) => (
        <article className="permit-item" key={permit.id}>
          <div className="list-icon">
            <FileText size={21} />
          </div>
          <div>
            <h3>{permit.perihal}</h3>
            <p>{permit.dateLabel}</p>
            <span className={`permit-status ${permit.status}`}>{permit.statusLabel}</span>
          </div>
          <button className="small-button" onClick={() => setSelectedPermit(permit)}>Detail</button>
        </article>
      ))}

      {status !== 'loading' && visiblePermits.length === 0 && (
        <p className="empty-permit">Belum ada pengajuan pada status ini.</p>
      )}

      {selectedPermit && (
        <section className="permit-detail">
          <div>
            <h3>Detail Pengajuan</h3>
            <button onClick={() => setSelectedPermit(null)}>Tutup</button>
          </div>
          <p><strong>Perihal:</strong> {selectedPermit.perihal}</p>
          <p><strong>Ditujukan:</strong> {selectedPermit.ditujukanKepada}</p>
          {selectedPermit.tujuanKeluar && <p><strong>Tujuan:</strong> {selectedPermit.tujuanKeluar}</p>}
          {selectedPermit.kembaliLabel && <p><strong>Kembali:</strong> {selectedPermit.kembaliLabel}</p>}
          <p><strong>Status:</strong> {selectedPermit.statusLabel}</p>
          <p><strong>Catatan:</strong> {selectedPermit.catatanAdmin || '-'}</p>
          {selectedPermit.downloadUrl && (
            <button className="download-letter-button" onClick={() => downloadLetter(selectedPermit)}>
              <Download size={17} /> Download Surat
            </button>
          )}
        </section>
      )}
    </ListScreen>
  );
}
