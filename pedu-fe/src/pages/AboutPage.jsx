import { Code2, Globe, HeartHandshake, Mail, Smartphone } from 'lucide-react';
import { ListScreen } from '../components/ListScreen';
import './AboutPage.css';

export function AboutPage() {
  return (
    <ListScreen title="Tentang Aplikasi" subtitle="PEDU, aplikasi pendamping administrasi dan kegiatan pesantren.">
      <section className="about-hero">
        <div className="about-icon">
          <Smartphone size={34} />
        </div>
        <h2>PEDU Pesantren</h2>
        <p>
          Aplikasi ini dibuat untuk membantu santri dan pengurus pesantren dalam mengelola tagihan,
          agenda pengajian, jadwal kelas, kitab, kalender pesantren, profil santri, serta notifikasi penting
          dalam satu tempat yang mudah digunakan.
        </p>
      </section>

      <article className="about-section">
        <div className="list-icon">
          <HeartHandshake size={22} />
        </div>
        <div>
          <h3>Motivasi Pembuatan</h3>
          <p>
            Aplikasi ini dibuat oleh Zuli Priadi sebagai bentuk ikhtiar untuk mengamalkan ilmu yang dimiliki
            demi kepentingan Pesantren Ekonomi Darul Uchwah agar semakin maju, tertata, dan modern.
          </p>
          <p>
            Harapannya, teknologi tidak hanya menjadi alat bantu administrasi, tetapi juga menjadi jalan
            kecil untuk memperkuat pelayanan, kedisiplinan, dan kebermanfaatan di lingkungan pesantren.
          </p>
        </div>
      </article>

      <article className="about-section">
        <div className="list-icon">
          <Code2 size={22} />
        </div>
        <div>
          <h3>Detail Developer</h3>
          <ul className="developer-list">
            <li><strong>Zuli Priadi</strong></li>
            <li><Mail size={15} /> zulipriadi@gmail.com</li>
            <li><Globe size={15} /> zuli-priadi.my.id</li>
          </ul>
        </div>
      </article>
    </ListScreen>
  );
}
