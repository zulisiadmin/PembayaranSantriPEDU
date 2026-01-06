<?php

namespace App\Http\Controllers;

use App\Models\Tagihan;
use App\Models\KelasTagihan;
use App\Models\User;
use App\Models\PembayaranSantri;
use App\Exports\PembayaranExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

class TagihanController extends Controller
{
    public function index()
    {
        $tagihan = Tagihan::with('kelas')->latest()->get();
        return view('admin.keuangan.index', compact('tagihan'));
    }

    public function create()
    {
        $list_kelas = User::where('role', 'santri')->distinct()->pluck('kelas');
        return view('admin.tagihan.create', compact('list_kelas'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required',
            'kelas' => 'required|array',
            'nominal' => 'required|numeric',
            'awal_pembayaran' => 'required|date',
            'akhir_pembayaran' => 'required|date|after_or_equal:awal_pembayaran',
            'surat' => 'nullable|file|mimes:pdf,jpg,jpeg,png',
        ]);

        $data = $request->only('nama', 'nominal', 'awal_pembayaran', 'akhir_pembayaran');

        if ($request->hasFile('surat')) {
            $filename = $request->file('surat')->store('surat_tagihan', 'public');
            $data['surat'] = basename($filename);
        }

        $tagihan = Tagihan::create($data);

        foreach ($request->kelas as $kelas) {
            KelasTagihan::create([
                'tagihan_id' => $tagihan->id,
                'kelas' => $kelas,
            ]);
        }

        $santris = User::whereIn('kelas', $request->kelas)->get();

        foreach ($santris as $santri) {
            PembayaranSantri::create([
                'user_id' => $santri->id,
                'tagihan_id' => $tagihan->id,
                'status' => 'pending',
            ]);
        }

        return redirect()->route('admin.tagihan.index')->with('success', 'Tagihan berhasil ditambahkan.');
    }

    public function show(Tagihan $tagihan)
    {
        $tagihan->load('kelas');
        return view('admin.tagihan.show', compact('tagihan'));
    }

    public function edit(Tagihan $tagihan)
    {
        $list_kelas = User::where('role', 'santri')->distinct()->pluck('kelas');
        $selected_kelas = $tagihan->kelas->pluck('kelas')->toArray();
        return view('admin.tagihan.edit', compact('tagihan', 'list_kelas', 'selected_kelas'));
    }

    public function update(Request $request, Tagihan $tagihan)
    {
        $request->validate([
            'nama' => 'required',
            'kelas' => 'required|array',
            'nominal' => 'required|numeric',
            'awal_pembayaran' => 'required|date',
            'akhir_pembayaran' => 'required|date|after_or_equal:awal_pembayaran',
            'surat' => 'nullable|file|mimes:pdf,jpg,jpeg,png',
        ]);

        $data = $request->only('nama', 'nominal', 'awal_pembayaran', 'akhir_pembayaran');

        if ($request->hasFile('surat')) {
            if ($tagihan->surat) Storage::delete('public/surat_tagihan/' . $tagihan->surat);
            $filename = $request->file('surat')->store('surat_tagihan', 'public');
            $data['surat'] = basename($filename);
        }

        $tagihan->update($data);

        KelasTagihan::where('tagihan_id', $tagihan->id)->delete();
        foreach ($request->kelas as $kelas) {
            KelasTagihan::create([
                'tagihan_id' => $tagihan->id,
                'kelas' => $kelas,
            ]);
        }

        PembayaranSantri::where('tagihan_id', $tagihan->id)->delete();
        $santris = User::whereIn('kelas', $request->kelas)->get();

        foreach ($santris as $santri) {
            PembayaranSantri::create([
                'user_id' => $santri->id,
                'tagihan_id' => $tagihan->id,
                'status' => 'pending',
            ]);
        }

        return redirect()->route('admin.tagihan.index')->with('success', 'Tagihan berhasil diperbarui.');
    }

    public function destroy(Tagihan $tagihan)
    {
        if ($tagihan->surat) Storage::delete('public/surat_tagihan/' . $tagihan->surat);
        $tagihan->delete();
        return redirect()->route('admin.tagihan.index')->with('success', 'Tagihan berhasil dihapus.');
    }

    public function pembayaran(Tagihan $tagihan)
    {
        $pembayaran = PembayaranSantri::with('user')
                        ->where('tagihan_id', $tagihan->id)
                        ->get();
        return view('admin.keuangan.pembayaran', compact('tagihan', 'pembayaran'));
    }

    public function export(Tagihan $tagihan)
    {
        return Excel::download(new PembayaranExport($tagihan), 'tagihan_' . $tagihan->id . '.xlsx');
    }
}
