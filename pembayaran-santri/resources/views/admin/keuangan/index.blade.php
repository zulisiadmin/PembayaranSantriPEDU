@extends('layouts.admin')

@section('konten')
<div class="container-fluid px-4">
    <h1 class="mt-4 text-success">📋 Daftar Tagihan</h1>
    <p class="text-muted mb-4">Kelola daftar tagihan dengan mudah dan terstruktur.</p>

    {{-- Tombol Aksi --}}
    <div class="d-flex justify-content-between align-items-center mb-4">
        <a href="{{ route('admin.tagihan.create') }}" class="btn btn-success shadow-sm">
            <i class="bi bi-plus-circle me-2"></i> Tambah Tagihan Baru
        </a>
        <span class="badge bg-light text-dark p-2">
            Total: {{ $tagihan->count() }} tagihan
        </span>
    </div>

    {{-- Card Tagihan --}}
    <div class="row g-4">
        @forelse($tagihan as $row)
        <div class="col-xl-4 col-md-6">
            <div class="card shadow-lg border-0 h-100 position-relative">
                <div class="card-body p-4">
                    <h5 class="card-title text-success fw-bold mb-3">
                        <i class="bi bi-cash-coin me-2"></i> {{ $row->nama }}
                    </h5>
                    <p class="mb-2">
                        <span class="text-muted">💰 Nominal:</span> 
                        <span class="fw-semibold">Rp {{ number_format($row->nominal, 0, ',', '.') }}</span>
                    </p>
                    <p class="mb-2">
                        <span class="text-muted">🎓 Kelas:</span>
                        @foreach($row->kelas as $k)
                            <span class="badge bg-success me-1">{{ $k->kelas }}</span>
                        @endforeach
                    </p>
                    <p class="mb-2">
                        <span class="text-muted">📅 Periode:</span> 
                        {{ $row->awal_pembayaran }} <small class="text-muted">s/d</small> {{ $row->akhir_pembayaran }}
                    </p>
                    <p class="mb-3">
                        <span class="text-muted">📄 Surat:</span>
                        @if($row->surat)
                            <a href="{{ asset('storage/surat_tagihan/' . $row->surat) }}" class="btn btn-sm btn-outline-primary ms-2" target="_blank">Lihat Surat</a>
                        @else
                            <span class="text-muted">Tidak Ada</span>
                        @endif
                    </p>

                    {{-- Aksi --}}
                    <div class="d-flex flex-wrap gap-2">
                        <a href="{{ route('admin.tagihan.show', $row->id) }}" class="btn btn-sm btn-outline-info">Detail</a>
                        <a href="{{ route('admin.tagihan.edit', $row->id) }}" class="btn btn-sm btn-outline-warning">Edit</a>
                        <form action="{{ route('admin.tagihan.destroy', $row->id) }}" method="POST" onsubmit="return confirm('Hapus tagihan ini?')">
                            @csrf @method('DELETE')
                            <button class="btn btn-sm btn-outline-danger">Hapus</button>
                        </form>
                        <a href="{{ route('admin.tagihan.pembayaran', $row->id) }}" class="btn btn-sm btn-outline-secondary">Pembayaran</a>
                        <a href="{{ route('admin.tagihan.export', $row->id) }}" class="btn btn-sm btn-outline-success">Export</a>
                    </div>
                </div>
            </div>
        </div>
        @empty
        <div class="col-12">
            <div class="alert alert-light text-center shadow-sm py-5">
                <i class="bi bi-inbox display-4 text-muted"></i>
                <p class="mt-3 mb-0 text-muted">Belum ada tagihan yang tersedia.</p>
            </div>
        </div>
        @endforelse
    </div>
</div>
@endsection
