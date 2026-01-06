<?php

namespace App\Http\Controllers;

use App\Models\Tagihan;
use App\Models\PembayaranSantri;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Xendit\Configuration;
use Xendit\Invoice\InvoiceApi;
use Xendit\Model\CreateInvoiceRequest;
use Barryvdh\DomPDF\Facade\Pdf;

class SantriTagihanController extends Controller
{

    public function index()
    {
        $user = Auth::user();
    
        $tagihan = Tagihan::whereHas('kelas', function ($q) use ($user) {
            $q->where('kelas', $user->kelas);
        })
        ->with(['pembayaran' => function ($q) use ($user) {
            $q->where('user_id', $user->id);
        }])
        ->get();
    
        return view('santri.keuangan', compact('tagihan'));
    }
    
    

    public function bayar(Request $request, $id)
    {
        $user = Auth::user();
    
        // Ambil hanya satu tagihan berdasarkan ID dan kelas santri
        $tagihan = Tagihan::where('id', $id)
            ->whereHas('kelas', function ($q) use ($user) {
                $q->where('kelas', $user->kelas);
            })
            ->with(['pembayaran' => function ($q) use ($user) {
                $q->where('user_id', $user->id);
            }])
            ->first();
    
        if (!$tagihan) {
            return back()->with('error', 'Tagihan tidak ditemukan atau tidak sesuai dengan kelas Anda.');
        }
    
        // Konfigurasi API Xendit
        $config = \Xendit\Configuration::getDefaultConfiguration()
            ->setApiKey(config('services.xendit.secret_key'));
    
        $invoiceApi = new \Xendit\Invoice\InvoiceApi(null, $config);
        $externalId = 'invoice_' . $tagihan->id . '_' . $user->id;
    
        try {
            // Buat invoice di Xendit
            $invoice = $invoiceApi->createInvoice([
                'external_id' => $externalId,
                'amount' => $tagihan->nominal,
                'payer_email' => $user->email,
                'description' => 'Pembayaran Tagihan: ' . $tagihan->nama,
                'success_redirect_url' => route('santri.tagihan.success', ['external_id' => $externalId]),
            ]);
    
            // Simpan atau update ke DB
            PembayaranSantri::updateOrCreate(
                ['user_id' => $user->id, 'tagihan_id' => $tagihan->id],
                [
                    'external_id' => $externalId,
                    'invoice_id' => $invoice['id'],
                    'status' => 'pending',
                ]
            );
    
            return redirect($invoice['invoice_url']);
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal membuat invoice: ' . $e->getMessage());
        }
    }
    
    

    public function success(Request $request)
    {
        // Karena status di-handle via webhook, success() hanya redirect dengan notifikasi
        return redirect()->route('santri.keuangan')
            ->with('success', 'Terima kasih, pembayaran sedang diproses. Silakan cek status dalam beberapa saat.');
    }

    public function show($id)
    {
        $tagihan = \App\Models\Tagihan::with(['pembayaran' => function ($q) {
            $q->where('user_id', auth()->id());
        }])->findOrFail($id);

        return view('santri.detailtagihan', compact('tagihan'));
    }


    public function invoice($id)
    {
        $user = Auth::user();
        $tagihan = Tagihan::with('pembayaran')->findOrFail($id);
        $pembayaran = $tagihan->pembayaran->where('user_id', $user->id)->values()->first();

        $pdf = Pdf::loadView('santri.invoice', compact('tagihan', 'pembayaran', 'user'));
        return $pdf->download('invoice_' . $tagihan->id . '.pdf');
    }


}
