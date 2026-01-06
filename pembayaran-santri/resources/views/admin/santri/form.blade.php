@extends('layouts.admin')

@section('konten')
<div class="container-fluid">
    <h1 class="h4 mb-4 text-success fw-bold"><i class="fas fa-user-graduate me-2"></i>Detail Pendaftar Santri</h1>

    <div class="card shadow-lg border-start-success border-3 mb-4">
        <div class="card-body">
            <table class="table table-borderless mb-0">
                <tr>
                    <th width="25%">Nama</th>
                    <td>: {{ $santri->name }}</td>
                </tr>
                <tr>
                    <th>Email</th>
                    <td>: {{ $santri->email }}</td>
                </tr>
                <tr>
                    <th>Kelas</th>
                    <td>: {{ $santri->kelas }}</td>
                </tr>
                <tr>
                    <th>Status</th>
                    <td>: {{ $santri->status }}</td>
                </tr>
                <tr>
                    <th>No HP</th>
                    <td>: {{ $santri->no_hp }}</td>
                </tr>
                <tr>
                    <th>No KTS</th>
                    <td>: {{ $santri->no_kts }}</td>
                </tr>
                <tr>
                    <th>NIK</th>
                    <td>: {{ $santri->nik }}</td>
                </tr>
                <tr>
                    <th>No KK</th>
                    <td>: {{ $santri->no_kk }}</td>
                </tr>
                <tr>
                    <th>Alamat</th>
                    <td>: {{ $santri->alamat }}</td>
                </tr>
                <tr>
                    <th>Status Persetujuan</th>
                    <td>: 
                        <span class="badge 
                            @if($santri->approval_status === 'accepted') bg-success 
                            @elseif($santri->approval_status === 'rejected') bg-danger 
                            @else bg-warning text-dark 
                            @endif">
                            {{ ucfirst($santri->approval_status) }}
                        </span>
                    </td>
                </tr>
                <tr>
                    <th>Foto KTS</th>
                    <td>
                        @if($santri->kts)
                            <img src="{{ asset('storage/' . $santri->kts) }}" alt="KTS" width="200" class="img-thumbnail border border-success">
                        @else
                            <span class="text-muted fst-italic">Belum ada foto KTS</span>
                        @endif
                    </td>
                </tr>
            </table>
        </div>
    </div>

    <a href="{{ route('admin.pendaftar') }}" class="btn btn-outline-success">
        <i class="fas fa-arrow-left me-1"></i> Kembali ke Daftar Pendaftar
    </a>
</div>
@endsection
