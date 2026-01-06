@extends('layouts.auth') {{-- atau layouts.santri jika ingin tema yang sama --}}

@section('content')
<div class="max-w-md mx-auto mt-12 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
    <h2 class="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">📝 Daftar Akun Santri</h2>

    <form method="POST" action="{{ route('register') }}">
        @csrf

        <div class="mb-4">
            <label class="block mb-1 text-gray-700 dark:text-gray-200">Nama Lengkap</label>
            <input type="text" name="name" required value="{{ old('name') }}"
                class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        </div>

        <div class="mb-4">
            <label class="block mb-1 text-gray-700 dark:text-gray-200">Email</label>
            <input type="email" name="email" required value="{{ old('email') }}"
                class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        </div>

        <div class="mb-4">
            <label class="block mb-1 text-gray-700 dark:text-gray-200">Password</label>
            <input type="password" name="password" required
                class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        </div>

        <div class="mb-4">
            <label class="block mb-1 text-gray-700 dark:text-gray-200">Konfirmasi Password</label>
            <input type="password" name="password_confirmation" required
                class="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
        </div>

        <button type="submit"
            class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg shadow">
            Daftar Sekarang
        </button>
    </form>
</div>
@endsection
