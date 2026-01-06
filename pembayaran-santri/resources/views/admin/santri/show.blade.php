@extends('layouts.admin')

@section('konten')
<div class="card shadow-lg border-start-success border-3 mb-4">
    <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0"><i class="fas fa-user-graduate me-2"></i>Detail Santri</h5>
        <a href="{{ route('admin.santri') }}" class="btn btn-light btn-sm">
            <i class="fas fa-arrow-left me-1"></i> Kembali
        </a>
    </div>

    <div class="card-body">
        <div class="row g-3">
            <div class="col-md-6">
                <strong>Nama:</strong><br>
                <span>{{ $santri->name }}</span>
            </div>
            <div class="col-md-6">
                <strong>Email:</strong><br>
                <span>{{ $santri->email }}</span>
            </div>
            <div class="col-md-6">
                <strong>Kelas:</strong><br>
                <span>{{ $santri->kelas }}</span>
            </div>
            <div class="col-md-6">
                <strong>Status:</strong><br>
                <span class="badge bg-success text-white">{{ ucfirst($santri->status) }}</span>
            </div>
            <div class="col-md-6">
                <strong>No HP:</strong><br>
                <span>{{ $santri->no_hp }}</span>
            </div>
            <div class="col-md-6">
                <strong>No KTS:</strong><br>
                <span>{{ $santri->no_kts }}</span>
            </div>
            <div class="col-md-6">
                <strong>NIK:</strong><br>
                <span>{{ $santri->nik }}</span>
            </div>
            <div class="col-md-6">
                <strong>No KK:</strong><br>
                <span>{{ $santri->no_kk }}</span>
            </div>
            <div class="col-md-12">
                <strong>Alamat:</strong><br>
                <p class="mb-1">{{ $santri->alamat }}</p>
            </div>
            <div class="col-md-12">
                <strong>Foto KTS:</strong><br>
                @if($santri->kts)
                    <img src="{{ asset('storage/' . $santri->kts) }}" class="img-thumbnail border border-success" width="200" alt="Foto KTS">
                @else
                    <span class="text-muted">Belum ada foto</span>
                @endif
            </div>
        </div>
    </div>
</div>
@endsection
