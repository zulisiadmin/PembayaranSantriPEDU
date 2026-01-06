@extends('layouts.admin')

@section('konten')
<div class="py-10 px-4 sm:px-8 lg:px-16">

    <!-- Judul Halaman -->
    <div class="mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-emerald-700 flex items-center gap-3">
            <i class="fas fa-user-graduate text-emerald-500 text-xl"></i>
            Detail Pendaftar Santri
        </h1>
        <p class="text-sm text-gray-500 mt-1">Informasi lengkap calon santri pondok pesantren</p>
    </div>

    <!-- Card Detail -->
    <div class="bg-white rounded-2xl shadow-md border-l-4 border-emerald-500 overflow-hidden">
        <div class="p-6 sm:p-8">
            <div class="grid sm:grid-cols-2 gap-y-5 gap-x-6 text-gray-800 text-sm sm:text-base">
                <div><strong>Nama</strong><div class="text-gray-600 mt-1">{{ $santri->name }}</div></div>
                <div><strong>Email</strong><div class="text-gray-600 mt-1">{{ $santri->email }}</div></div>
                <div><strong>Kelas</strong><div class="text-gray-600 mt-1">{{ $santri->kelas }}</div></div>
                <div><strong>Status</strong><div class="text-gray-600 mt-1">{{ $santri->status }}</div></div>
                <div><strong>No HP</strong><div class="text-gray-600 mt-1">{{ $santri->no_hp }}</div></div>
                <div><strong>No KTS</strong><div class="text-gray-600 mt-1">{{ $santri->no_kts }}</div></div>
                <div><strong>NIK</strong><div class="text-gray-600 mt-1">{{ $santri->nik }}</div></div>
                <div><strong>No KK</strong><div class="text-gray-600 mt-1">{{ $santri->no_kk }}</div></div>
                <div class="sm:col-span-2">
                    <strong>Alamat</strong>
                    <div class="text-gray-600 mt-1">{{ $santri->alamat }}</div>
                </div>
                <div>
                    <strong>Status Persetujuan</strong>
                    <div class="mt-1">
                        <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold
                            @if($santri->approval_status === 'accepted') bg-emerald-100 text-emerald-700
                            @elseif($santri->approval_status === 'rejected') bg-red-100 text-red-700
                            @else bg-yellow-100 text-yellow-800
                            @endif">
                            {{ ucfirst($santri->approval_status) }}
                        </span>
                    </div>
                </div>
                <div>
                    <strong>Foto KTS</strong>
                    <div class="mt-2">
                        @if($santri->kts)
                            <img src="{{ asset('storage/' . $santri->kts) }}" alt="Foto KTS" class="w-52 rounded-lg border-2 border-emerald-500 shadow">
                        @else
                            <span class="text-sm text-gray-400 italic">Belum ada foto KTS</span>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Tombol Kembali -->
    <div class="mt-6">
        <a href="{{ route('admin.pendaftar') }}" class="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 border border-emerald-500 text-emerald-700 rounded-lg hover:bg-emerald-50 transition">
            <i class="fas fa-arrow-left"></i> Kembali ke Daftar Pendaftar
        </a>
    </div>

</div>
@endsection
