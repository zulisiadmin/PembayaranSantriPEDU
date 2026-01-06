@extends('layouts.admin')

@section('konten')
<div class="container-fluid px-4 py-4">
    <!-- Judul Halaman -->
    <div class="mb-4">
        <h2 class="fw-bold text-success mb-1">
            <i class="fas fa-users me-2"></i>Manajemen Pendaftar Santri
        </h2>
        <p class="text-muted">Daftar data santri yang masuk yang belum terdaftar pada website.</p>
    </div>

    <!-- Kartu Tabel -->
    <div class="card border-start border-4 border-success shadow-sm mb-5">
        <div class="card-body">
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="bg-success text-white text-center">
                        <tr>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>Kelas <i class="fas fa-info-circle" title="Jenjang pendidikan santri, contoh: VII A, XII IPA, dll."></i></th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($pendaftar as $row)
                        <tr>
                            <td class="fw-semibold">{{ $row->name }}</td>
                            <td>{{ $row->email }}</td>
                            <td>
                                <span class="badge bg-success bg-opacity-25 text-success px-3 py-1 rounded-pill" 
                                      data-bs-toggle="tooltip" 
                                      data-bs-placement="top" 
                                      title="Kelas atau tingkat pendidikan santri.">
                                    {{ $row->kelas ?? '-' }}
                                </span>
                            </td>
                            <td class="text-center">
                                <div class="d-flex justify-content-center gap-2 flex-wrap">
                                    <a href="{{ route('admin.pendaftar.show', $row->id) }}" class="btn btn-sm btn-outline-success">
                                        <i class="fas fa-eye me-1"></i> Detail
                                    </a>
                                    <form action="{{ route('admin.pendaftar.acc', $row->id) }}" method="POST">
                                        @csrf
                                        <button type="submit" class="btn btn-sm btn-outline-primary">
                                            <i class="fas fa-check me-1"></i> ACC
                                        </button>
                                    </form>
                                    <form action="{{ route('admin.pendaftar.tolak', $row->id) }}" method="POST" onsubmit="return confirm('Yakin ingin menolak pendaftar ini?')">
                                        @csrf
                                        <button type="submit" class="btn btn-sm btn-outline-danger">
                                            <i class="fas fa-times me-1"></i> Tolak
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="4" class="text-center text-muted py-4">
                                <em>🕊️ Belum ada pendaftar yang masuk.</em>
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

{{-- Tooltip script (aktifkan jika belum) --}}
@push('scripts')
<script>
    document.addEventListener("DOMContentLoaded", function () {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })
    });
</script>
@endpush
@endsection
