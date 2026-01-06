@extends('layouts.admin')

@section('konten')
<div class="container-fluid px-4">
    <h1 class="mt-4 mb-4 fw-bold">✨ Dashboard Admin</h1>

    <div class="row g-4">
        <div class="col-lg-4 col-md-6">
            <div class="card border-0 shadow dashboard-box">
                <div class="card-body d-flex align-items-center justify-content-between">
                    <div>
                        <h5 class="fw-semibold mb-1">Manajemen Santri</h5>
                        <p class="text-muted mb-2 small">Kelola data santri aktif</p>
                        <a href="{{ route('admin.santri') }}" class="btn btn-sm btn-outline-primary">Masuk</a>
                    </div>
                    <i class="bi bi-people fs-2 text-primary"></i>
                </div>
            </div>
        </div>

        <div class="col-lg-4 col-md-6">
            <div class="card border-0 shadow dashboard-box">
                <div class="card-body d-flex align-items-center justify-content-between">
                    <div>
                        <h5 class="fw-semibold mb-1">Pendaftaran</h5>
                        <p class="text-muted mb-2 small">Pantau santri baru</p>
                        <a href="{{ route('admin.pendaftar') }}" class="btn btn-sm btn-outline-success">Masuk</a>
                    </div>
                    <i class="bi bi-person-plus fs-2 text-success"></i>
                </div>
            </div>
        </div>

        <div class="col-lg-4 col-md-6">
            <div class="card border-0 shadow dashboard-box">
                <div class="card-body d-flex align-items-center justify-content-between">
                    <div>
                        <h5 class="fw-semibold mb-1">Keuangan</h5>
                        <p class="text-muted mb-2 small">Tagihan dan pembayaran</p>
                        <a href="{{ route('admin.tagihan.index') }}" class="btn btn-sm btn-outline-danger">Masuk</a>
                    </div>
                    <i class="bi bi-wallet2 fs-2 text-danger"></i>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- Tambahkan styling --}}
@push('styles')
<style>
    .dashboard-box {
        transition: all 0.3s ease-in-out;
        border-radius: 1rem;
    }

    .dashboard-box:hover {
        transform: scale(1.02);
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    }

    .card-body i {
        transition: transform 0.3s ease;
    }

    .dashboard-box:hover .card-body i {
        transform: rotate(5deg) scale(1.1);
    }
</style>
@endpush
@endsection