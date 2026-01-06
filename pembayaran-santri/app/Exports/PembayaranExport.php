<?php

namespace App\Exports;

use App\Models\Tagihan;
use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PembayaranExport implements FromCollection, WithHeadings
{
    protected $tagihan;

    public function __construct(Tagihan $tagihan)
    {
        $this->tagihan = $tagihan;
    }

    public function collection()
    {
        // Ambil semua santri di kelas terkait tagihan
        $kelas = $this->tagihan->kelas->pluck('kelas');
        $santri = User::where('role', 'santri')
            ->whereIn('kelas', $kelas)
            ->select('name', 'kelas', 'email')
            ->get();

        // Tambahkan kolom status pembayaran (sementara default: Belum Bayar)
        return $santri->map(function ($item) {
            return [
                'tagihan' => $this->tagihan->nama,
                'nama' => $item->name,
                'kelas' => $item->kelas,
                'email' => $item->email,
                'status_pembayaran' => 'Belum Bayar',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Tagihan',
            'Nama',
            'Kelas',
            'Email',
            'Status Pembayaran'
        ];
    }
}
