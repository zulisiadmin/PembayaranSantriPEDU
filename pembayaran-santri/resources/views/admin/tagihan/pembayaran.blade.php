@extends('admin.layout')

@section('konten')
<div class="container">
    <h1 class="h4 mb-4">Data Pembayaran Santri</h1>

    <a href="{{ route('tagihan.export', $tagihan->id) }}" class="btn btn-success mb-3">Export ke Excel</a>

    <table class="table table-bordered">
        <thead class="table-dark">
            <tr>
                <th>Nama Santri</th>
                <th>Kelas</th>
                <th>Status Pembayaran</th>
                <th>Tanggal Bayar</th>
                <th>Metode</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($santri as $row)
                @php
                    $pembayaran = $row->pembayaranSantri->where('tagihan_id', $tagihan->id)->first();
                @endphp
                <tr>
                    <td>{{ $row->name }}</td>
                    <td>{{ $row->kelas }}</td>
                    <td>
                        @if ($pembayaran && $pembayaran->status === 'paid')
                            <span class="badge bg-success">Sudah Bayar</span>
                        @else
                            <span class="badge bg-warning text-dark">Belum Bayar</span>
                        @endif
                    </td>
                    <td>{{ $pembayaran->paid_at ?? '-' }}</td>
                    <td>{{ $pembayaran->payment_method ?? '-' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection
