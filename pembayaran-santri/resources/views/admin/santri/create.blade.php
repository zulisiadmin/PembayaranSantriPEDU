@extends('layouts.admin')

@section('konten')
<div class="container-fluid px-4">
    <h1 class="mt-4 mb-3">🧑‍🎓 Tambah Santri Baru</h1>
    <div class="card shadow-sm border-0">
        <div class="card-body">
            <form method="POST" action="{{ route('admin.santri.store') }}" enctype="multipart/form-data">
                @csrf

                {{-- Row 1 --}}
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="nama" class="form-label">Nama Lengkap</label>
                        <input type="text" name="nama" class="form-control" value="{{ old('nama') }}" required>
                    </div>
                    <div class="col-md-6">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" name="email" class="form-control" value="{{ old('email') }}" required>
                    </div>
                </div>

                {{-- Row 2 --}}
                <div class="row mb-3">
                    <div class="col-md-4">
                        <label for="kelas" class="form-label">Kelas</label>
                        <select name="kelas" class="form-select" required>
                            <option value="">-- Pilih Kelas --</option>
                            <option value="awaliyah" {{ old('kelas') == 'awaliyah' ? 'selected' : '' }}>Ula</option>
                            <option value="wustho" {{ old('kelas') == 'wustho' ? 'selected' : '' }}>Wustho</option>
                            <option value="ulya" {{ old('kelas') == 'ulya' ? 'selected' : '' }}>Ulya</option>
                            <option value="khidmah" {{ old('kelas') == 'khidmah' ? 'selected' : '' }}>Khidmah</option>
                            <option value="legend" {{ old('kelas') == 'legend' ? 'selected' : '' }}>Khidmah Legend</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label for="status" class="form-label">Status</label>
                        <input type="text" name="status" class="form-control" value="{{ old('status') }}" required>
                    </div>
                    <div class="col-md-4">
                        <label for="no_hp" class="form-label">No HP</label>
                        <input type="text" name="no_hp" class="form-control" value="{{ old('no_hp') }}">
                    </div>
                </div>

                {{-- Row 3 --}}
                <div class="row mb-3">
                    <div class="col-md-4">
                        <label for="no_kts" class="form-label">No KTS</label>
                        <input type="text" name="no_kts" class="form-control" value="{{ old('no_kts') }}">
                    </div>
                    <div class="col-md-4">
                        <label for="nik" class="form-label">NIK</label>
                        <input type="text" name="nik" class="form-control" value="{{ old('nik') }}">
                    </div>
                    <div class="col-md-4">
                        <label for="no_kk" class="form-label">No KK</label>
                        <input type="text" name="no_kk" class="form-control" value="{{ old('no_kk') }}">
                    </div>
                </div>

                {{-- Alamat --}}
                <div class="mb-3">
                    <label for="alamat" class="form-label">Alamat Lengkap</label>
                    <textarea name="alamat" class="form-control" rows="2">{{ old('alamat') }}</textarea>
                </div>

                {{-- Foto dan Password --}}
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="foto_kts" class="form-label">Upload Foto KTS</label>
                        <input type="file" name="foto_kts" class="form-control" accept="image/*">
                    </div>
                    <div class="col-md-6">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" name="password" class="form-control" required>
                    </div>
                </div>

                {{-- Tombol --}}
                <div class="mt-4">
                    <button type="submit" class="btn btn-success">
                        <i class="bi bi-check-circle"></i> Simpan
                    </button>
                    <a href="{{ route('admin.santri') }}" class="btn btn-secondary">
                        <i class="bi bi-arrow-left"></i> Kembali
                    </a>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
