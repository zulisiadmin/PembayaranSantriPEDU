@extends('layouts.santri')

@push('styles')
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
@endpush

@section('konten')
<div class="max-w-3xl mx-auto my-10 p-6 bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-lg">

    <h2 class="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
        ✍️ Update Profil Santri
    </h2>

    <form method="POST" action="{{ route('santri.profil.update') }}">
        @csrf
        @method('PUT')

        <table class="w-full text-left text-sm border-collapse border border-gray-300 dark:border-gray-700">
            <tbody>

                <tr class="border-b border-gray-300 dark:border-gray-700">
                    <th class="px-4 py-3 font-semibold bg-gray-100 dark:bg-gray-800 w-36">📛 Nama Lengkap</th>
                    <td class="px-4 py-3">
                        <input type="text" name="name" required
                            value="{{ old('name', Auth::user()->name) }}"
                            class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100">
                    </td>
                </tr>

                <tr class="border-b border-gray-300 dark:border-gray-700">
                    <th class="px-4 py-3 font-semibold bg-gray-100 dark:bg-gray-800">🎫 No KTS</th>
                    <td class="px-4 py-3">
                        <input type="text" name="no_kts" required
                            value="{{ old('no_kts', Auth::user()->no_kts) }}"
                            class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100">
                    </td>
                </tr>

                <tr class="border-b border-gray-300 dark:border-gray-700">
                    <th class="px-4 py-3 font-semibold bg-gray-100 dark:bg-gray-800">🔖 NIK</th>
                    <td class="px-4 py-3">
                        <input type="text" name="nik" required
                            value="{{ old('nik', Auth::user()->nik) }}"
                            class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100">
                    </td>
                </tr>

                <tr class="border-b border-gray-300 dark:border-gray-700">
                    <th class="px-4 py-3 font-semibold bg-gray-100 dark:bg-gray-800">🏠 No KK</th>
                    <td class="px-4 py-3">
                        <input type="text" name="no_kk" required
                            value="{{ old('no_kk', Auth::user()->no_kk) }}"
                            class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100">
                    </td>
                </tr>

                <tr class="border-b border-gray-300 dark:border-gray-700">
                    <th class="px-4 py-3 font-semibold align-top bg-gray-100 dark:bg-gray-800">📍 Alamat Lengkap</th>
                    <td class="px-4 py-3">
                        <textarea name="alamat" rows="3" required
                            class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 resize-none">{{ old('alamat', Auth::user()->alamat) }}</textarea>
                    </td>
                </tr>

                <tr class="border-b border-gray-300 dark:border-gray-700">
                    <th class="px-4 py-3 font-semibold bg-gray-100 dark:bg-gray-800">📞 No HP</th>
                    <td class="px-4 py-3">
                        <input type="text" name="no_hp" required
                            value="{{ old('no_hp', Auth::user()->no_hp) }}"
                            class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-red-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100">
                    </td>
                </tr>

                <tr class="border-b border-gray-300 dark:border-gray-700">
                    <th class="px-4 py-3 font-semibold bg-gray-100 dark:bg-gray-800">🎓 Kelas</th>
                    <td class="px-4 py-3">
                        <input type="text" name="kelas" required
                            value="{{ old('kelas', Auth::user()->kelas) }}"
                            class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100">
                    </td>
                </tr>

                <tr>
                    <th class="px-4 py-3 font-semibold bg-gray-100 dark:bg-gray-800">📋 Status</th>
                    <td class="px-4 py-3">
                        <select name="status" required
                            class="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100">
                            <option value="">-- Pilih Status --</option>
                            <option value="kerja" {{ old('status', Auth::user()->status) === 'kerja' ? 'selected' : '' }}>Kerja</option>
                            <option value="mahasiswa" {{ old('status', Auth::user()->status) === 'mahasiswa' ? 'selected' : '' }}>Mahasiswa</option>
                            <option value="smk" {{ old('status', Auth::user()->status) === 'smk' ? 'selected' : '' }}>SMK</option>
                        </select>
                    </td>
                </tr>

            </tbody>
        </table>

        <div class="mt-6 text-center">
            <button type="submit"
                class="bg-gradient-to-r from-green-500 to-green-1000 text-black px-8 py-2 rounded-full shadow-lg hover:scale-105 transition transform flex items-center justify-center gap-2 mx-auto text-sm">
                <i class="fas fa-check-circle"></i> Simpan
            </button>
        </div>
    </form>
</div>
@endsection
