@extends('layouts.admin')

@section('konten')
<h1 class="h4 mb-4">Edit Data Santri</h1>

<form action="{{ route('admin.santri.update', $santri->id) }}" method="POST" enctype="multipart/form-data">
    @csrf
    @method('PUT')

    <div class="mb-3">
        <label for="nama" class="form-label">Nama Santri</label>
        <input type="text" name="nama" id="nama" class="form-control" value="{{ old('nama', $santri->nama) }}" required>
    </div>

    <div class="mb-3">
        <label for="nis" class="form-label">NIS</label>
        <input type="text" name="nis" id="nis" class="form-control" value="{{ old('nis', $santri->nis) }}" required>
    </div>

    <div class="mb-3">
        <label for="kelas" class="form-label">Kelas</label>
        <input type="text" name="kelas" id="kelas" class="form-control" value="{{ old('kelas', $santri->kelas) }}" required>
    </div>

    <div class="mb-3">
        <label for="alamat" class="form-label">Alamat</label>
        <textarea name="alamat" id="alamat" class="form-control" rows="3">{{ old('alamat', $santri->alamat) }}</textarea>
    </div>

    <div class="mb-3">
        <label for="foto" class="form-label">Foto (Opsional)</label>
        <input type="file" name="foto" id="foto" class="form-control">
        @if($santri->foto)
            <img src="{{ asset('storage/' . $santri->foto) }}" alt="Foto" class="img-thumbnail mt-2" style="max-height: 150px;">
        @endif
    </div>

    <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
    <a href="{{ route('admin.santri') }}" class="btn btn-secondary">Batal</a>
</form>
@endsection
