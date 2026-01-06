@extends('layouts.santri')

@section('konten')
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" x-data="{ show: false }" x-init="setTimeout(() => show = true, 200)">
    <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-700 dark:text-emerald-300 mb-8 flex items-center gap-2 animate__animated animate__fadeInDown">
        🕌 Tagihan Santri Aktif
    </h1>

    {{-- Notifikasi --}}
    @if(session('success'))
        <div class="mb-5 p-3 bg-green-50 border-l-4 border-green-600 text-green-800 rounded-md shadow-sm flex items-center gap-2 text-sm">
            ✅ {{ session('success') }}
        </div>
    @endif
    @if(session('error'))
        <div class="mb-5 p-3 bg-red-50 border-l-4 border-red-600 text-red-800 rounded-md shadow-sm flex items-center gap-2 text-sm">
            ❌ {{ session('error') }}
        </div>
    @endif

    {{-- Daftar Tagihan --}}
    @if($tagihan->count() > 0)
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" x-show="show"
             x-transition:enter="transition ease-out duration-500"
             x-transition:enter-start="opacity-0 translate-y-4"
             x-transition:enter-end="opacity-100 translate-y-0">

            @foreach($tagihan as $row)
                @php
                    $status = $row->pembayaran && $row->pembayaran->first()
                        ? $row->pembayaran->first()->status
                        : 'belum';
                @endphp

                <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-emerald-100 dark:border-gray-700 p-5 text-sm transition hover:-translate-y-1 hover:shadow-xl">

                    {{-- Ikon besar dekoratif dengan label --}}
                    <div class="absolute top-2 right-3 text-6xl text-emerald-200 dark:text-emerald-700 opacity-10 flex flex-col items-center pointer-events-none select-none">
                        🧾
                        <span class="text-xs mt-1 text-gray-400 dark:text-gray-600 font-semibold">Tagihan</span>
                    </div>

                    {{-- Judul --}}
                    <h2 class="text-base font-semibold text-gray-800 dark:text-white mb-1">
                        {{ $row->nama }}
                    </h2>
                    <p class="text-xs text-gray-500 dark:text-gray-400 italic mb-2">
                        {{ $row->awal_pembayaran }} - {{ $row->akhir_pembayaran }}
                    </p>

                    {{-- Nominal --}}
                    <div class="flex items-center gap-2 mb-3">
                        <div class="text-xl">💰</div>
                        <div>
                            <p class="text-sm font-bold text-emerald-600 dark:text-emerald-300">
                                Rp {{ number_format($row->nominal, 0, ',', '.') }}
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Jumlah tagihan</p>
                        </div>
                    </div>

                    {{-- Status --}}
                    <div class="mb-3">
                        <span class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold 
                            {{ $status === 'paid' ? 'bg-emerald-500 text-white' : 'bg-yellow-400 text-white' }}">
                            {{ $status === 'paid' ? '✔ Sudah Bayar' : '⚠ Belum Bayar' }}
                        </span>
                    </div>

                    {{-- Aksi --}}
                    <div class="flex flex-col gap-3 mt-4">
                        {{-- Tombol Lihat Detail --}}
                        <div>
                            <a href="{{ route('santri.tagihan.show', $row->id) }}"
                               class="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-hitam rounded-md shadow transition text-sm font-medium"
                               aria-label="Lihat detail tagihan">
                                📄 <span>Lihat Detail</span>
                            </a>
                            <small class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            
                            </small>
                        </div>

                        {{-- Tombol Bayar --}}
                        @if($status !== 'paid')
                        <div>
                            <a href="{{ route('santri.tagihan.bayar', $row->id) }}"
                               class="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-900 text-hitam rounded-md shadow transition text-sm font-medium"
                               aria-label="Bayar tagihan sekarang">
                                💳 <span>Bayar Sekarang</span>
                            </a>
                            <small class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            
                            </small>
                        </div>
                        @endif
                    </div>
                </div>
            @endforeach
        </div>
    @else
        {{-- Tidak ada tagihan --}}
        <div class="text-center py-16" x-show="show"
             x-transition:enter="transition ease-out duration-500"
             x-transition:enter-start="opacity-0 scale-90"
             x-transition:enter-end="opacity-100 scale-100">
            <div class="w-44 h-44 mx-auto mb-5">
                <img src="https://cdn-icons-png.flaticon.com/512/6598/6598516.png"
                     alt="Tidak Ada Tagihan"
                     class="w-full h-full object-contain opacity-80 dark:invert drop-shadow-2xl animate-bounce-slow">
            </div>

            <p class="text-xl font-semibold text-gray-600 dark:text-gray-200 mb-1">
                Tidak Ada Tagihan 🎉
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
                Anda telah menyelesaikan semua pembayaran. Tetap semangat!
            </p>
        </div>
    @endif
</div>
@endsection
