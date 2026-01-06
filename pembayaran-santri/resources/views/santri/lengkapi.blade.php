@extends('santri.santri')

@section('konten')
@if(session('error'))
    <div style="color: red; margin-bottom: 15px;">
        {{ session('error') }}
    </div>
@endif


<div class="container">

    {{-- Hanya tampilkan form jika approval_status = pending dan data belum lengkap --}}
    @if (auth()->user()->approval_status === 'pending' && empty(auth()->user()->no_kts))
        <h2>Lengkapi Data Diri</h2>

        <form method="POST" action="{{ route('santri.lengkapi.simpan') }}">
            @csrf
            <div class="mb-2">
                <label>No KTS</label>
                <input type="text" name="no_kts" class="form-control" required>
            </div>
            <div class="mb-2">
                <label>NIK</label>
                <input type="text" name="nik" class="form-control" required>
            </div>
            <div class="mb-2">
                <label>No KK</label>
                <input type="text" name="no_kk" class="form-control" required>
            </div>
            <div class="mb-2">
                <label>Alamat</label>
                <textarea name="alamat" class="form-control" required></textarea>
            </div>
            <div class="mb-2">
                <label>Kelas</label>
                <select name="kelas" class="form-select" required>
                    <option value="">-- Pilih Kelas --</option>
                    <option value="awaliyah" {{ old('kelas') == 'awaliyah' ? 'selected' : '' }}>Awaliyah</option>
                    <option value="wustho" {{ old('kelas') == 'wustho' ? 'selected' : '' }}>Wustho</option>
                    <option value="ulya" {{ old('kelas') == 'ulya' ? 'selected' : '' }}>Ulya</option>
                    <option value="khidmah" {{ old('kelas') == 'khidmah' ? 'selected' : '' }}>Khidmah</option>
                    <option value="legend" {{ old('kelas') == 'legend' ? 'selected' : '' }}>Khidmah Legend</option>
                </select>
            </div>
            <div class="mb-2">
                <label>Status</label>
                <select name="status" class="form-control" required>
                    <option value="kerja">Kerja</option>
                    <option value="mahasiswa">Mahasiswa</option>
                    <option value="smk">SMK</option>
                </select>
            </div>
            <div class="mb-3">
                <label>No HP</label>
                <input type="text" name="no_hp" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary">Simpan</button>
        </form>
    @endif

</div>
@endsection
