@extends('layouts.admin')

@section('konten')
<h1 class="h4 mb-4">Tambah Tagihan Baru</h1>

<form action="{{ route('admin.tagihan.store') }}" method="POST" enctype="multipart/form-data">
    @csrf
    <div class="mb-3">
        <label>Nama Tagihan</label>
        <input type="text" name="nama" class="form-control" required>
    </div>

    <div class="mb-3">
        <label>Nominal</label>
        <input type="number" name="nominal" class="form-control" required>
    </div>

    <div class="mb-3">
        <label class="form-label">Kelas (Pilih lebih dari satu jika perlu)</label>
        <div class="row">
            @foreach($list_kelas as $kelas)
                <div class="col-md-4">
                    <div class="form-check">
                        <input 
                            class="form-check-input" 
                            type="checkbox" 
                            name="kelas[]" 
                            value="{{ $kelas }}" 
                            id="kelas_{{ $loop->index }}"
                            {{ is_array(old('kelas')) && in_array($kelas, old('kelas')) ? 'checked' : '' }}
                        >
                        <label class="form-check-label" for="kelas_{{ $loop->index }}">
                            {{ ucfirst($kelas) }}
                        </label>
                    </div>
                </div>
            @endforeach
        </div>
    </div>


    <div class="mb-3">
        <label>Awal Pembayaran</label>
        <input type="date" name="awal_pembayaran" class="form-control" required>
    </div>

    <div class="mb-3">
        <label>Akhir Pembayaran</label>
        <input type="date" name="akhir_pembayaran" class="form-control" required>
    </div>

    <div class="mb-3">
        <label>Upload Surat Pemberitahuan</label>
        <input type="file" name="surat" class="form-control">
    </div>

    <button type="submit" class="btn btn-primary">Simpan</button>
    <a href="{{ route('admin.tagihan.index') }}" class="btn btn-secondary">Kembali</a>
</form>
@endsection
