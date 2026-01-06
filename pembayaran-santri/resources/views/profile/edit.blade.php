@extends('santri.santri')

@push('styles')
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
@endpush

@push('scripts')
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
@endpush

@section('konten')
<div x-data="{ step: 1 }" class="max-w-4xl mx-auto my-10 p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-xl transform transition-all duration-500">

  {{-- Step Indicator --}}
  <div class="flex justify-between items-center mb-12">
    <template x-for="i in 4" :key="i">
      <div class="text-center w-full relative">
        <div
          :class="step >= i ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'"
          class="w-12 h-12 mx-auto rounded-full flex items-center justify-center font-bold text-xl transition-all duration-300 shadow-lg"
        >
          <i :class="{
            1: 'fas fa-user',
            2: 'fas fa-id-card',
            3: 'fas fa-map-marker-alt',
            4: 'fas fa-graduation-cap'
          }[i]"></i>
        </div>
        <div class="mt-2 text-sm font-semibold" x-text="['Dasar', 'Resmi', 'Kontak', 'Akademik'][i-1]"></div>
        <div
          class="absolute top-5 left-1/2 transform -translate-x-1/2 w-full h-1 bg-gray-300 dark:bg-gray-700"
          x-show="i < 4"
        >
          <div
            class="h-full bg-green-500 transition-all duration-300"
            :style="step > i ? 'width:100%' : 'width:0%'"
          ></div>
        </div>
      </div>
    </template>
  </div>

  <form method="POST" action="{{ route('santri.profil.update') }}">
    @csrf @method('PUT')

    {{-- Step 1 --}}
    <div x-show="step === 1" x-transition class="space-y-8">
      <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-500">
        <label class="block text-gray-700 dark:text-gray-300 font-medium">📛 Nama Lengkap</label>
        <input
          type="text" name="name" required
          value="{{ old('name', Auth::user()->name) }}"
          class="mt-2 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
        >
      </div>
      <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-500">
        <label class="block text-gray-700 dark:text-gray-300 font-medium">🎫 No KTS</label>
        <input
          type="text" name="no_kts" required
          value="{{ old('no_kts', Auth::user()->no_kts) }}"
          class="mt-2 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
        >
      </div>
    </div>

    {{-- Step 2 --}}
    <div x-show="step === 2" x-transition class="space-y-8">
      <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-500">
        <label class="block text-gray-700 dark:text-gray-300 font-medium">🔖 NIK</label>
        <input
          type="text" name="nik" required
          value="{{ old('nik', Auth::user()->nik) }}"
          class="mt-2 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
        >
      </div>
      <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-500">
        <label class="block text-gray-700 dark:text-gray-300 font-medium">🏠 No KK</label>
        <input
          type="text" name="no_kk" required
          value="{{ old('no_kk', Auth::user()->no_kk) }}"
          class="mt-2 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
        >
      </div>
    </div>

    {{-- Step 3 --}}
    <div x-show="step === 3" x-transition class="space-y-8">
      <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-500">
        <label class="block text-gray-700 dark:text-gray-300 font-medium">📍 Alamat Lengkap</label>
        <textarea
          name="alamat" rows="3" required
          class="mt-2 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
        >{{ old('alamat', Auth::user()->alamat) }}</textarea>
      </div>
      <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-500">
        <label class="block text-gray-700 dark:text-gray-300 font-medium">📞 No HP</label>
        <input
          type="text" name="no_hp" required
          value="{{ old('no_hp', Auth::user()->no_hp) }}"
          class="mt-2 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
        >
      </div>
    </div>

    {{-- Step 4 --}}
    <div x-show="step === 4" x-transition class="space-y-8">
      <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-500">
        <label class="block text-gray-700 dark:text-gray-300 font-medium">🎓 Kelas</label>
        <input
          type="text" name="kelas" required
          value="{{ old('kelas', Auth::user()->kelas) }}"
          class="mt-2 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
        >
      </div>
      <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-all duration-500">
        <label class="block text-gray-700 dark:text-gray-300 font-medium">📋 Status</label>
        <select
          name="status" required
          class="mt-2 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
        >
          <option value="">-- Pilih Status --</option>
          <option value="kerja" {{ old('status', Auth::user()->status)==='kerja'?'selected':'' }}>Kerja</option>
          <option value="mahasiswa" {{ old('status', Auth::user()->status)==='mahasiswa'?'selected':'' }}>Mahasiswa</option>
          <option value="smk" {{ old('status', Auth::user()->status)==='smk'?'selected':'' }}>SMK</option>
        </select>
      </div>
    </div>

    {{-- Navigation --}}
    <div class="mt-12 flex justify-between items-center">
      <button
        type="button" x-show="step > 1" @click="step--"
        class="bg-gradient-to-r from-gray-400 to-gray-600 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition"
      >
        <i class="fas fa-arrow-left mr-3"></i> Sebelumnya
      </button>

      <button
        type="button" x-show="step < 4" @click="step++"
        class="ml-auto bg-gradient-to-r from-green-400 to-green-600 text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition"
      >
        Selanjutnya <i class="fas fa-arrow-right ml-3"></i>
      </button>

      <button
        type="submit" x-show="step === 4"
        class="ml-auto bg-gradient-to-r from-blue-500 to-blue-700 text-white px-10 py-3 rounded-xl shadow-lg hover:scale-105 transition"
      >
        <i class="fas fa-check-circle mr-3"></i> Selesai
      </button>
    </div>
  </form>
</div>
@endsection