@extends('layouts.santri')


@section('konten')
<div class="container">
    <h1 class="h4 mb-4">Detail Tagihan</h1>

    <div class="card mb-4">
        <div class="card-body">
            <p><strong>Nama Tagihan:</strong> {{ $tagihan->nama }}</p>
            <p><strong>Nominal:</strong> Rp {{ number_format($tagihan->nominal, 0, ',', '.') }}</p>
            <p><strong>Periode:</strong> {{ $tagihan->awal_pembayaran }} s/d {{ $tagihan->akhir_pembayaran }}</p>
            <p><strong>Status Pembayaran:</strong>
                @php
                    $pembayaran = $tagihan->pembayaran->firstWhere('user_id', auth()->id());
                @endphp
                @if ($pembayaran && $pembayaran->status === 'paid')
                    <span class="badge bg-success">Sudah Bayar</span>
                @else
                    <span class="badge bg-warning">Belum</span>
                @endif
            </p>
            @if ($pembayaran && $pembayaran->invoice_id)
                <p><strong>Invoice ID:</strong> {{ $pembayaran->invoice_id }}</p>
                <a href="{{ route('santri.tagihan.invoice', $tagihan->id) }}" class="btn btn-primary" target="_blank">
                    <i class="fa fa-file-pdf"></i> Download Invoice PDF
                </a>

            @endif
        </div>
    </div>

    <a href="{{ route('santri.keuangan') }}" class="btn btn-secondary">Kembali</a>
</div>
@endsection
