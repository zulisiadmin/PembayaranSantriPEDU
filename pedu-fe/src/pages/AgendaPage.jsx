import { Camera, CheckCircle2, Clock3, FileText, LocateFixed, MapPin, XCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../api';
import { ImagePlaceholder } from '../components/ImagePlaceholder';
import './AgendaPage.css';

export function AgendaPage({ agenda, user }) {
  const [locationStatus, setLocationStatus] = useState('Belum diambil');
  const [coords, setCoords] = useState(null);
  const [attendanceMode, setAttendanceMode] = useState(null);
  const [cameraStatus, setCameraStatus] = useState('Kamera belum dinyalakan');
  const [cameraStream, setCameraStream] = useState(null);
  const [photoBlob, setPhotoBlob] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [absentReason, setAbsentReason] = useState('');
  const [permissionFile, setPermissionFile] = useState(null);
  const [submitStatus, setSubmitStatus] = useState('');
  const [distanceMeters, setDistanceMeters] = useState(null);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [attendanceResult, setAttendanceResult] = useState(null);
  const [teacherReport, setTeacherReport] = useState(null);
  const [reportStatus, setReportStatus] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const now = new Date();
  const isAgendaClosed = agenda.isClosed ?? (agenda.endsAt ? now >= new Date(agenda.endsAt) : now.getHours() >= agenda.endHour);
  const isAgendaNotStarted = agenda.startsAt ? now < new Date(agenda.startsAt) : false;
  const isPresentLocked = isAgendaClosed || isAgendaNotStarted || Boolean(attendanceResult);
  const isAbsentLocked = isAgendaClosed || Boolean(attendanceResult);
  const isTeacher = user?.role === 'ustad';

  useEffect(() => {
    setAttendanceResult(agenda.attendance || null);
    setAttendanceMode(null);
    setSubmitStatus('');
    setPhotoBlob(null);
    setPhotoPreview('');
    setCoords(null);
    setDistanceMeters(null);
    setLocationAllowed(false);
    setLocationStatus('Belum diambil');
    stopCamera();
    if (user?.role === 'ustad') {
      loadTeacherReport();
    }
  }, [agenda.id]);

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  function readLocation() {
    // TODO: ganti geolocation web ini dengan integrasi maps provider untuk absensi.
    if (!navigator.geolocation) {
      setLocationStatus('Perangkat tidak mendukung lokasi');
      return;
    }

    setLocationStatus('Mengambil lokasi...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        const nextDistance = calculateDistanceMeters(
          nextCoords.latitude,
          nextCoords.longitude,
          Number(agenda.latitude),
          Number(agenda.longitude)
        );
        const maxDistance = Number(agenda.attendanceRadiusMeters || 50);
        setCoords(nextCoords);
        setDistanceMeters(nextDistance);
        setLocationAllowed(nextDistance <= maxDistance);
        setLocationStatus(
          nextDistance <= maxDistance
            ? `Valid, jarak ${Math.round(nextDistance)}m dari lokasi pengajian`
            : `Terlalu jauh, jarak ${Math.round(nextDistance)}m dari lokasi pengajian`
        );
      },
      () => {
        setLocationAllowed(false);
        setLocationStatus('Lokasi belum diizinkan');
      }
    );
  }

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraStatus('Browser/perangkat tidak mendukung kamera langsung');
      return;
    }

    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      setCameraStream(stream);
      setCameraStatus('Kamera aktif');
    } catch {
      setCameraStatus('Izin kamera ditolak atau kamera tidak tersedia');
    }
  }

  function stopCamera() {
    const stream = streamRef.current || cameraStream;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    streamRef.current = null;
  }

  function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !video.videoWidth) {
      setCameraStatus('Kamera belum siap');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) {
        setCameraStatus('Gagal mengambil foto');
        return;
      }
      setPhotoBlob(blob);
      setPhotoPreview(URL.createObjectURL(blob));
      setCameraStatus('Foto berhasil diambil');
      stopCamera();
    }, 'image/jpeg', 0.88);
  }

  async function retakePhoto() {
    setPhotoBlob(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview('');
    setCameraStatus('Menyalakan kamera ulang...');
    await startCamera();
  }

  async function choosePresent() {
    if (isPresentLocked) return;
    setAttendanceMode('present');
    setSubmitStatus('');
    readLocation();
    await startCamera();
  }

  function chooseAbsent() {
    if (isAbsentLocked) return;
    setAttendanceMode('absent');
    setSubmitStatus('');
    stopCamera();
  }

  async function submitPresent() {
    if (!photoBlob || !coords || !locationAllowed) {
      setSubmitStatus('Foto wajib tersedia dan lokasi harus berada maksimal 50m dari titik pengajian.');
      return;
    }

    const formData = new FormData();
    formData.append('type', 'present');
    formData.append('photo', photoBlob, `kehadiran-agenda-${agenda.id}.jpg`);
    formData.append('latitude', coords.latitude);
    formData.append('longitude', coords.longitude);

    await submitAttendance(formData);
  }

  async function submitAbsent() {
    if (absentReason.trim().length < 10 || (!isTeacher && !permissionFile)) {
      setSubmitStatus(isTeacher ? 'Alasan minimal 10 karakter wajib diisi.' : 'Alasan minimal 10 karakter dan bukti izin wajib diupload.');
      return;
    }

    const formData = new FormData();
    formData.append('type', 'absent');
    formData.append('reason', absentReason);
    if (permissionFile) {
      formData.append('permission_document', permissionFile);
    }

    await submitAttendance(formData);
  }

  async function submitAttendance(formData) {
    setSubmitStatus('Mengirim...');
    try {
      const response = await apiFetch(`/santri/agendas/${agenda.id}/attendance`, {
        method: 'POST',
        body: formData,
      });
      setSubmitStatus(response.message || 'Absensi berhasil dikirim.');
      setAttendanceResult(response.attendance || (
        formData.get('type') === 'present'
          ? { type: 'present', label: 'Hadir Ngaji' }
          : { type: 'absent', label: 'Belum bisa hadir - izin diajukan' }
      ));
      setAttendanceMode(null);
      stopCamera();
      if (isTeacher) {
        loadTeacherReport();
      }
    } catch (error) {
      setSubmitStatus(error.message || 'Gagal mengirim. Pastikan backend Laravel aktif di 127.0.0.1:8000.');
    }
  }

  async function loadTeacherReport() {
    setReportStatus('Memuat rekap santri...');
    try {
      const data = await apiFetch(`/santri/agendas/${agenda.id}/attendances`);
      setTeacherReport(data);
      setReportStatus('');
    } catch (error) {
      setTeacherReport(null);
      setReportStatus(error.message || 'Rekap santri belum bisa dimuat.');
    }
  }

  return (
    <div className="screen-content">
      <section className="detail-panel">
        <ImagePlaceholder label="Foto agenda sementara" />
        <span className="pill">{agenda.status}</span>
        <span className={`detail-state-pill ${isAgendaClosed ? 'closed' : 'active'}`}>
          {agenda.stateLabel || (isAgendaClosed ? 'Selesai' : 'Aktif')}
        </span>
        <h2>{agenda.title}</h2>
        <p>{agenda.teacher}</p>
        <div className="detail-list">
          <span>
            <Clock3 size={16} /> {agenda.time}
          </span>
          <span>
            <MapPin size={16} /> {agenda.location}
          </span>
          <span>
            <FileText size={16} /> {isTeacher ? 'Konfirmasi maksimal' : 'Izin maksimal'} jam {agenda.permitUntil}
          </span>
          {attendanceResult && (
            <span className={`attendance-info ${attendanceResult.type}`}>
              <CheckCircle2 size={16} /> {attendanceResult.label}
            </span>
          )}
        </div>
        {isAgendaClosed && (
          <p className="closed-warning">Waktu pengajian sudah selesai. Absensi tidak bisa dikirim.</p>
        )}
        {isAgendaNotStarted && (
          <p className="closed-warning">Kajian belum dimulai. Kehadiran belum bisa dikirim, tetapi izin/absen tetap bisa diajukan.</p>
        )}
        <div className="action-grid">
          <button className="present-button" disabled={isPresentLocked} onClick={choosePresent}>
            <CheckCircle2 size={18} /> Hadir
          </button>
          <button className="absent-button" disabled={isAbsentLocked} onClick={chooseAbsent}>
            <XCircle size={18} /> Absen
          </button>
        </div>
      </section>

      {attendanceMode === 'present' && !attendanceResult && (
        <section className="form-panel">
          <h3>Verifikasi Kehadiran</h3>
          <div className="camera-panel">
            {photoPreview ? (
              <img src={photoPreview} alt="Foto kehadiran" />
            ) : (
              <video ref={videoRef} autoPlay playsInline muted />
            )}
            <canvas ref={canvasRef} hidden />
          </div>
          <div className="camera-actions">
            {photoPreview ? (
              <button className="outline-button" onClick={retakePhoto}>
                <Camera size={18} /> Ulangi Foto
              </button>
            ) : (
              <>
                <button className="outline-button" onClick={startCamera}>
                  <Camera size={18} /> Nyalakan Kamera
                </button>
                <button className="outline-button" onClick={capturePhoto}>
                  <Camera size={18} /> Ambil Foto
                </button>
              </>
            )}
          </div>
          <p className="field-note">{cameraStatus}. Foto wajib dari kamera perangkat.</p>
          <div className="location-box">
            <LocateFixed size={18} />
            <div>
              <strong>Live location</strong>
              <p>{locationStatus}</p>
              {distanceMeters !== null && (
                <p>Maksimal {agenda.attendanceRadiusMeters || 50}m dari titik pengajian.</p>
              )}
            </div>
          </div>
          <button className="submit-attendance-button" onClick={submitPresent}>Kirim Kehadiran</button>
          {submitStatus && <p className="submit-status">{submitStatus}</p>}
        </section>
      )}

      {attendanceMode === 'absent' && !attendanceResult && (
        <section className="form-panel">
          <h3>{isTeacher ? 'Form Tidak Bisa Hadir' : 'Form Izin / Absen'}</h3>
          <label className="text-field">
            {isTeacher ? 'Alasan tidak bisa hadir' : 'Alasan absen'}
            <textarea
              rows="5"
              placeholder="Tulis alasan dengan jelas dan lengkap"
              value={absentReason}
              onChange={(event) => setAbsentReason(event.target.value)}
              required
            />
          </label>
          {!isTeacher && (
            <>
              <label className="document-field">
                <FileText size={24} />
                <span>{permissionFile ? permissionFile.name : 'Upload dokumen izin dari pengurus'}</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,image/*"
                  onChange={(event) => setPermissionFile(event.target.files?.[0] || null)}
                  required
                />
              </label>
              <p className="field-note">Bukti izin wajib berupa dokumen/surat izin dari pengurus.</p>
            </>
          )}
          {isTeacher && <p className="field-note">Untuk ustadz, cukup tuliskan alasan dengan jelas.</p>}
          <button className="submit-attendance-button" onClick={submitAbsent}>{isTeacher ? 'Kirim Alasan' : 'Kirim Izin'}</button>
          {submitStatus && <p className="submit-status">{submitStatus}</p>}
        </section>
      )}

      {isTeacher && (
        <section className="form-panel">
          <div className="teacher-report-head">
            <h3>Data Santri</h3>
            <button className="outline-button" onClick={loadTeacherReport}>Muat Ulang</button>
          </div>
          {reportStatus && <p className="field-note">{reportStatus}</p>}
          {teacherReport && (
            <>
              <div className="teacher-report-summary">
                <span>Total <strong>{teacherReport.summary.total}</strong></span>
                <span>Hadir <strong>{teacherReport.summary.present}</strong></span>
                <span>Izin <strong>{teacherReport.summary.absent}</strong></span>
                <span>Belum <strong>{teacherReport.summary.missing}</strong></span>
              </div>
              <div className="student-attendance-list">
                {teacherReport.students.map((student) => (
                  <article key={student.userId}>
                    <div>
                      <strong>{student.name}</strong>
                      <p>{student.noKts || student.email}</p>
                      {student.reason && <p>Alasan: {student.reason}</p>}
                    </div>
                    <span className={`attendance-badge ${student.status}`}>{student.statusLabel}</span>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}

function calculateDistanceMeters(fromLat, fromLng, toLat, toLng) {
  if ([fromLat, fromLng, toLat, toLng].some((value) => Number.isNaN(value))) {
    return Number.POSITIVE_INFINITY;
  }

  const earthRadius = 6371000;
  const latDelta = toRadians(toLat - fromLat);
  const lngDelta = toRadians(toLng - fromLng);
  const startLat = toRadians(fromLat);
  const endLat = toRadians(toLat);
  const a = Math.sin(latDelta / 2) ** 2
    + Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDelta / 2) ** 2;

  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(value) {
  return value * Math.PI / 180;
}
