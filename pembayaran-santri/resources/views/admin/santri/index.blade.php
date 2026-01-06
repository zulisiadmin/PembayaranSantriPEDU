@extends('layouts.admin')

@section('konten')
<h1 class="h4 mb-4">Manajemen Santri</h1>

<form method="GET" action="{{ route('admin.santri') }}" class="form-inline mb-3">
    <div class="form-group mr-2">
        <select name="kelas" class="form-control">
            <option value="">-- Filter Kelas --</option>
            @foreach($list_kelas as $kelas)
                <option value="{{ $kelas }}" {{ request('kelas') == $kelas ? 'selected' : '' }}>
                    {{ $kelas }}
                </option>
            @endforeach
        </select>
    </div>

    <div class="form-group mr-2">
        <select name="status" class="form-control">
            <option value="">-- Filter Status --</option>
            @foreach($list_status as $status)
                <option value="{{ $status }}" {{ request('status') == $status ? 'selected' : '' }}>
                    {{ ucfirst($status) }}
                </option>
            @endforeach
        </select>
    </div>

    <button type="submit" class="btn btn-primary">Filter</button>
</form>
<div class="mb-3">
    <a href="{{ route('admin.santri.create') }}" class="btn btn-success">+ Tambah Santri</a>
    <a href="{{ route('admin.santri.export') }}" class="btn btn-outline-primary">Download Excel</a>
</div>


<table class="table table-bordered">
    <thead class="thead-dark">
        <tr>
            <th>Nama</th>
            <th>Email</th>
            <th>Kelas</th>
            <th>Status</th>
            <th>No HP</th>
            <th>Aksi</th>
        </tr>
    </thead>
    <tbody>
        @forelse($santri as $row)
            <tr>
                <td>{{ $row->name }}</td>
                <td>{{ $row->email }}</td>
                <td>{{ $row->kelas }}</td>
                <td>{{ $row->status }}</td>
                <td>{{ $row->no_hp }}</td>
                <td>
                    <a href="{{ route('admin.santri.edit', $row->id) }}" class="btn btn-sm btn-warning">Edit</a>
                    <a href="{{ route('admin.santri.show', $row->id) }}" class="btn btn-sm btn-info">Detail</a>
                    <form action="{{ route('admin.santri.destroy', $row->id) }}" method="POST" style="display:inline-block;" onsubmit="return confirm('Yakin ingin menghapus?')">
                        @csrf
                        @method('DELETE')
                        <button class="btn btn-sm btn-danger">Hapus</button>
                    </form>
                </td>
            </tr>
        @empty
            <tr>
                <td colspan="6" class="text-center">Tidak ada data santri.</td>
            </tr>
        @endforelse
    </tbody>
</table>


{{ $santri->withQueryString()->links() }}
@endsection