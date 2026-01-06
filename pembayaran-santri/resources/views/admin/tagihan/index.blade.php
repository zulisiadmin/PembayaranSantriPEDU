@extends('layouts.admin')

@section('konten')
<h1 class="h4 mb-4">Daftar Tagihan</h1>

<a href="{{ route('admin.tagihan.create') }}" class="btn btn-success mb-3">+ Tambah Tagihan</a>

<table class="table table-bordered">
    <thead class="thead-dark">
        <tr>
            <th>Nama Tagihan</th>
            <th>Nominal</th>
            <th>Kelas</th>
            <th>Periode</th>
            <th>Surat</th>
            <th>Aksi</th>
        </tr>
    </thead>
    <tbody>
        @forelse($tagihan as $row)
        <tr>
            <td>{{ $row->nama }}</td>
            <td>Rp {{ number_format($row->nominal, 0, ',', '.') }}</td>
            <td>
                @foreach($row->kelas as $k)
                    <span class="badge bg-primary">{{ $k->kelas }}</span>
                @endforeach
            </td>
            <td>{{ $row->awal_pembayaran }} s/d {{ $row->akhir_pembayaran }}</td>
            <td>
                @if($row->surat)
                    <a href="{{ asset('storage/surat_tagihan/' . $row->surat) }}" target="_blank">Lihat</a>
                @else
                    <span class="text-muted">-</span>
                @endif
            </td>
            <td>
                <a href="{{ route('admin.tagihan.show', $row->id) }}" class="btn btn-sm btn-info">Detail</a>
                <a href="{{ route('admin.tagihan.edit', $row->id) }}" class="btn btn-sm btn-warning">Edit</a>
                <form action="{{ route('admin.tagihan.destroy', $row->id) }}" method="POST" style="display:inline-block;" onsubmit="return confirm('Hapus tagihan ini?')">
                    @csrf
                    @method('DELETE')
                    <button class="btn btn-sm btn-danger">Hapus</button>
                </form>
                <a href="{{ route('admin.tagihan.pembayaran', $row->id) }}" class="btn btn-sm btn-secondary">Pembayaran</a>
                <a href="{{ route('admin.tagihan.export', $row->id) }}" class="btn btn-sm btn-success">Export</a>
            </td>
        </tr>
        @empty
        <tr>
            <td colspan="6" class="text-center">Belum ada tagihan.</td>
        </tr>
        @endforelse
    </tbody>
</table>
@endsection
