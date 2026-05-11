import { ChevronRight, Loader2, Moon } from 'lucide-react';
import './AuthPage.css';

export function AuthPage({ mode, onModeChange, onSubmit, status = '', isSubmitting = false }) {
  const isRegister = mode === 'register';

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <div className="brand-mark">
          <img src="/img/Logo_Darul_Uchwah.png" alt="PEDU Pesantren" className="brand-logo" />
        </div>
        <h1>{isRegister ? 'Daftar Santri' : 'Masuk Anggota'}</h1>
        <p className="auth-copy">
          {isRegister
            ? 'Daftar ini hanya digunakan untuk santri. Untuk selain santri yang ingin mendapatkan akses bisa menghubungi admin pesantren.'
            : 'Gunakan email atau NIS yang terdaftar untuk masuk.'}
        </p>

        <form className="auth-form" onSubmit={onSubmit}>
          {isRegister && (
            <label>
              Nama lengkap
              <input name="name" type="text" placeholder="Nama santri" required />
            </label>
          )}
          <label>
            Email atau NIS
            <input name="login" type="text" placeholder={isRegister ? 'santri@email.com' : 'santri@pedu.test'} required />
          </label>
          <label>
            Password
            <input name="password" type="password" placeholder="Password" required />
          </label>
          {isRegister && (
            <label>
              Kode kelas
              <input name="kode_kelas" type="text" placeholder="Kode Dari Admin" required />
            </label>
          )}
          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="button-spinner" size={18} />
                {isRegister ? 'Memproses daftar...' : 'Memproses login...'}
              </>
            ) : (
              <>
                {isRegister ? 'Daftar' : 'Masuk'}
                <ChevronRight size={18} />
              </>
            )}
          </button>
          {status && <p className={`auth-status ${isSubmitting ? 'loading' : ''}`}>{status}</p>}
        </form>

        <button className="text-button" onClick={() => onModeChange(isRegister ? 'login' : 'register')} disabled={isSubmitting}>
          {isRegister ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
        </button>
      </section>
    </main>
  );
}
