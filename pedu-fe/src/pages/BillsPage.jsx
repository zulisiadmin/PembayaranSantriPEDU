import { CheckCircle2, CreditCard, Gift, ReceiptText, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import { LoadingState } from '../components/LoadingState';
import { ListScreen } from '../components/ListScreen';
import { bills as fallbackBills } from '../data/mockData';
import './BillsPage.css';

export function BillsPage() {
  const [bills, setBills] = useState([]);
  const [voucherCode, setVoucherCode] = useState('');
  const [status, setStatus] = useState('loading');
  const [voucherHint, setVoucherHint] = useState(false);
  const [activeTab, setActiveTab] = useState('unpaid');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [paymentSession, setPaymentSession] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      setActiveTab('paid');
      setSuccessModalOpen(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
    loadBills();
  }, []);

  const unpaidBills = bills.filter((bill) => bill.status !== 'paid');
  const paidBills = bills.filter((bill) => bill.status === 'paid');
  const visibleBills = activeTab === 'paid' ? paidBills : unpaidBills;

  async function loadBills() {
    try {
      const data = await apiFetch('/santri/bills');
      setBills(data.bills || []);
      setVoucherHint(Boolean(data.voucherHint));
      setStatus('ready');
    } catch {
      setBills(fallbackBills);
      setStatus('fallback');
    }
  }

  async function applyVoucher() {
    if (!voucherCode.trim()) {
      setStatus('Masukkan kode voucher terlebih dahulu.');
      return;
    }

    setStatus('Memeriksa voucher...');

    try {
      const response = await apiFetch('/santri/vouchers/apply', {
        method: 'POST',
        body: JSON.stringify({ code: voucherCode }),
      });
      setStatus(response.message || 'Voucher berhasil digunakan.');
      setVoucherCode('');
      await loadBills();
    } catch (error) {
      setStatus(error.message || 'Voucher tidak bisa digunakan.');
    }
  }

  async function payBill(bill) {
    setStatus(`Menyiapkan pembayaran ${bill.name}...`);

    try {
      const response = await apiFetch(`/santri/bills/${bill.id}/pay`, {
        method: 'POST',
        body: JSON.stringify({ provider: 'tripay' }),
      });
      setStatus(response.message || 'Pembayaran siap diproses.');
      await loadBills();
      if (response.paymentUrl) {
        setPaymentSession({
          url: response.paymentUrl,
          billName: bill.name,
        });
      }
    } catch (error) {
      setStatus(error.message || 'Pembayaran belum bisa diproses.');
    }
  }

  return (
    <ListScreen title="Tagihan" subtitle="Lakukan Pembayaran untuk menjaga kenyamanan bersama.">
      <div className="voucher-row">
        <Gift size={19} />
        <input
          placeholder={voucherHint ? 'Contoh: BEASISWA-AW1-001' : 'Kode voucher beasiswa'}
          value={voucherCode}
          onChange={(event) => setVoucherCode(event.target.value.toUpperCase())}
        />
        <button onClick={applyVoucher}>Pakai</button>
      </div>
      {status === 'loading' && <LoadingState rows={3} />}
      {status && !['loading', 'ready', 'fallback'].includes(status) && <p className="bill-status">{status}</p>}
      <div className="bill-tabs" role="tablist" aria-label="Filter tagihan">
        <button className={activeTab === 'unpaid' ? 'active' : ''} onClick={() => setActiveTab('unpaid')}>
          Belum Dibayar <span>{unpaidBills.length}</span>
        </button>
        <button className={activeTab === 'paid' ? 'active' : ''} onClick={() => setActiveTab('paid')}>
          Sudah Dibayar <span>{paidBills.length}</span>
        </button>
      </div>
      {status !== 'loading' && visibleBills.length === 0 && (
        <div className="empty-bill-state">
          <ReceiptText size={24} />
          <p>{activeTab === 'paid' ? 'Belum ada tagihan yang lunas.' : 'Tidak ada tagihan yang perlu dibayar.'}</p>
        </div>
      )}
      {status !== 'loading' && visibleBills.map((bill) => (
        <article className="list-item bill-item" key={bill.id || bill.name}>
          <div className="list-icon">
            <ReceiptText size={22} />
          </div>
          <div>
            <h3>{bill.name}</h3>
            <p>{bill.type}</p>
            {bill.statusLabel && (
              <span className={`bill-state ${bill.status === 'paid' ? 'paid' : 'pending'}`}>
                {bill.status === 'paid' && <CheckCircle2 size={13} />}
                {bill.statusLabel}
              </span>
            )}
          </div>
          <div className="bill-side">
            <strong>{bill.amountLabel || bill.amount}</strong>
            <button
              className="pay-bill-button"
              disabled={bill.status === 'paid' || !bill.id}
              onClick={() => payBill(bill)}
            >
              <CreditCard size={14} /> Bayar
            </button>
          </div>
        </article>
      ))}
      {successModalOpen && (
        <div className="payment-modal-backdrop" role="dialog" aria-modal="true" aria-label="Pembayaran berhasil">
          <section className="payment-modal">
            <button className="modal-close-button" onClick={() => setSuccessModalOpen(false)} aria-label="Tutup">
              <X size={18} />
            </button>
            <div className="modal-success-icon">
              <CheckCircle2 size={34} />
            </div>
            <h2>Pembayaran Berhasil</h2>
            <p>Status tagihan akan tampil di tab Sudah Dibayar setelah callback Tripay diterima.</p>
            <button className="modal-primary-button" onClick={() => setSuccessModalOpen(false)}>
              Lihat Tagihan
            </button>
          </section>
        </div>
      )}
      {paymentSession && (
        <div className="payment-sheet" role="dialog" aria-modal="true" aria-label="Halaman pembayaran">
          <header>
            <button
              className="modal-close-button"
              onClick={async () => {
                setPaymentSession(null);
                await loadBills();
              }}
              aria-label="Tutup pembayaran"
            >
              <X size={18} />
            </button>
            <div>
              <strong>Pembayaran</strong>
              <span>{paymentSession.billName}</span>
            </div>
          </header>
          <iframe title="Pembayaran Tripay" src={paymentSession.url} />
          <footer>
            <button
              className="modal-primary-button"
              onClick={async () => {
                setPaymentSession(null);
                await loadBills();
              }}
            >
              Selesai
            </button>
          </footer>
        </div>
      )}
    </ListScreen>
  );
}
