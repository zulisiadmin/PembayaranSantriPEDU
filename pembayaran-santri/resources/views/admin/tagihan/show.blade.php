@extends('layouts.admin')

@section('konten')
<h1 class="h4 mb-4">Detail Tagihan</h1>

<table class="table table-bordered">
    <tr><th>Nama Tagihan</th><td>{{ $tagihan->nama }}</td></tr>
    <tr><th>Nominal</th><td>Rp {{ number_format($tagihan->nominal, 0, ',', '.') }}</td></tr>
    <tr><th>Kelas</th>
        <td>
            @foreach($tagihan->kelas as $kelas)
                <span class="badge bg-primary">{{ $kelas->kelas }}</span>
            @endforeach
        </td>
    </tr>
    <tr><th>Awal Pembayaran</th><td>{{ $tagihan->awal_pembayaran }}</td></tr>
    <tr><th>Akhir Pembayaran</th><td>{{ $tagihan->akhir_pembayaran }}</td></tr>
    <tr><th>Surat</th>
        <td>
            @if($tagihan->surat)
                <a href="{{ asset('storage/surat_tagihan/' . $tagihan->surat) }}" target="_blank">Lihat Surat</a>
            @else
                <span class="text-muted">Tidak ada</span>
            @endif
        </td>
    </tr>
</table>

<a href="{{ route('admin.tagihan.index') }}" class="btn btn-secondary">Kembali</a>
@endsection
