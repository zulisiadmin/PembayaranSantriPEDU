@extends('layouts.admin')

@section('konten')
<div class="py-10 px-4 sm:px-8 lg:px-16 text-gray-800">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
            <h1 class="text-3xl font-bold text-green-800 flex items-center gap-3">
                <i class="fas fa-mosque text-green-600 text-2xl"></i>
                Rekap Pembayaran Santri
            </h1>
            <p class="text-sm text-gray-500 mt-1">Catatan pembayaran santri pondok pesantren</p>
        </div>
        <a href="#" class="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg shadow-md transition">
            <i class="fas fa-file-excel"></i> Export Excel
        </a>
    </div>

    <!-- Cards -->
    @if($pembayaran->count())
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        @foreach ($pembayaran as $item)
        <div class="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl shadow-md hover:shadow-lg transition p-5 space-y-3">

            <!-- Nama & Kelas -->
            <div class="flex items-center justify-between">
                <h2 class="text-base font-semibold text-green-900 truncate">{{ $item->user->name ?? '-' }}</h2>
                <span class="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">{{ $item->user->kelas ?? '-' }}</span>
            </div>

            <!-- Status -->
            <div class="flex items-center gap-2 text-sm">
                @if ($item->status === 'paid')
                    <i class="fas fa-check-circle text-emerald-500"></i>
                    <span class="text-green-700 font-semibold">Lunas</span>
                @else
                    <i class="fas fa-times-circle text-rose-500"></i>
                    <span class="text-rose-600 font-semibold">Belum Bayar</span>
                @endif
            </div>

            <!-- Tanggal Bayar -->
            <div class="text-xs text-gray-500 flex items-center gap-2">
                <i class="fas fa-calendar-alt"></i>
                <span>{{ $item->paid_at ? \Carbon\Carbon::parse($item->paid_at)->translatedFormat('d M Y') : '-' }}</span>
            </div>

            <!-- Metode -->
            <div class="text-xs mt-2">
                <span class="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    <i class="fas fa-hand-holding-usd"></i> {{ $item->payment_method ?? '-' }}
                </span>
            </div>

        </div>
        @endforeach
    </div>
    @else
    <div class="text-center text-gray-400 italic mt-20">
        Tidak ada data pembayaran untuk ditampilkan.
    </div>
    @endif

</div>
@endsection
