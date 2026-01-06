@extends('layouts.admin')

@section('konten')
<h1 class="h4 mb-4">Edit Tagihan</h1>

<form action="{{ route('admin.tagihan.update', $tagihan->id) }}" method="POST" enctype="multipart/form-data">
    @csrf
    @method('PUT')

    <div class="mb-3">
        <label>Nama Tagihan</label>
        <input type="text" name="nama" class="form-control" value="{{ $tagihan->nama }}" required>
    </div>

    <div class="mb-3">
        <label>Nominal</label>
        <input type="number" name="nominal" class="form-control" value="{{ $tagihan->nominal }}" required>
    </div>

    <div class="mb-3">
        <label>Kelas</label>
        <select name="kelas[]" class="form-control" multiple required>
            @foreach($list_kelas as $kelas)
                <option value="{{ $kelas }}" {{ in_array($kelas, $selected_kelas) ? 'selected' : '' }}>{{ $kelas }}</option>
            @endforeach
        </select>
    </div>

    <div class="mb-3">
        <label>Awal Pembayaran</label>
        <input type="date" name="awal_pembayaran" class="form-control" value="{{ $tagihan->awal_pembayaran }}" required>
    </div>

    <div class="mb-3">
        <label>Akhir Pembayaran</label>
        <input type="date" name="akhir_pembayaran" class="form-control" value="{{ $tagihan->akhir_pembayaran }}" required>
    </div>

    <div class="mb-3">
        <label>Surat Pemberitahuan</label>
        <input type="file" name="surat" class="form-control">
        @if($tagihan->surat)
            <small>File saat ini: <a href="{{ asset('storage/surat_tagihan/' . $tagihan->surat) }}" target="_blank">Lihat Surat</a></small>
        @endif
    </div>

    <button type="submit" class="btn btn-primary">Update</button>
    <a href="{{ route('admin.tagihan.index') }}" class="btn btn-secondary">Batal</a>
</form>
@endsection
