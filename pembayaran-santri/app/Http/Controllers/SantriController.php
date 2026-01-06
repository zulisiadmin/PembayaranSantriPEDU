<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\SantriExport;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\FromCollection;
use App\Models\Tagihan;
use App\Models\PembayaranSantri;


class SantriController extends Controller
{   
    public function dashboardSantri()

    {
    $user = Auth::user(); 
    return view('santri.dashboard', compact('user'));
    }

    public function index(Request $request)
    {
        $query = User::where('role', 'santri');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('kelas')) {
            $query->where('kelas', $request->kelas);
        }

        $santri = $query->paginate(10);
        $list_kelas = User::where('role', 'santri')->distinct()->pluck('kelas');
        $list_status = ['kerja', 'mahasiswa', 'smk'];

        return view('admin.santri.index', compact('santri', 'list_kelas', 'list_status'));
    }
    
    public function create()
    {
        return view('admin.santri.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email',
            'kelas' => 'required',
            'status' => 'required',
            'no_hp' => 'required',
            'no_kts' => 'required',
            'nik' => 'required',
            'no_kk' => 'required',
            'alamat' => 'required',
            'kts' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = $request->all();
        $data['role'] = 'santri';
        $data['password'] = bcrypt('password'); // default password

        if ($request->hasFile('kts')) {
            $filename = $request->file('kts')->store('kts', 'public');
            $data['kts'] = basename($filename);
        }

        User::create($data);

        return redirect()->route('admin.santri')->with('success', 'Data santri berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $santri = User::findOrFail($id);
        return view('admin.santri.edit', compact('santri'));
    }

    public function update(Request $request, $id)
    {
        $santri = User::findOrFail($id);

        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users,email,' . $id,
            'kelas' => 'required',
            'status' => 'required',
            'no_hp' => 'required',
            'no_kts' => 'required',
            'nik' => 'required',
            'no_kk' => 'required',
            'alamat' => 'required',
            'kts' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $data = $request->all();

        if ($request->hasFile('kts')) {
            $filename = $request->file('kts')->store('kts', 'public');
            $data['kts'] = basename($filename);
        }

        $santri->update($data);

        return redirect()->route('admin.santri')->with('success', 'Data santri berhasil diupdate.');
    }

    public function show($id)
    {
        $santri = User::findOrFail($id);
        return view('admin.santri.show', compact('santri'));
    }

    public function destroy($id)
    {
        $santri = User::findOrFail($id);
        $santri->delete();

        return redirect()->route('admin.santri')->with('success', 'Data santri berhasil dihapus.');
    }

    public function exportExcel()
    {
        $data = User::where('role', 'santri')->select(
            'name', 'email', 'kelas', 'status', 'no_hp', 'no_kts', 'nik', 'no_kk', 'alamat', 'kts'
        )->get()->map(function ($item) {
            $item->kts = $item->kts ? asset('storage/kts/' . $item->kts) : '-';
            return $item;
        });

        $export = new class($data) implements FromCollection, WithHeadings {
            protected $data;

            public function __construct($data)
            {
                $this->data = $data;
            }

            public function collection()
            {
                return $this->data;
            }

            public function headings(): array
            {
                return [
                    'Nama', 'Email', 'Kelas', 'Status', 'No HP', 'No KTS', 'NIK', 'No KK', 'Alamat', 'Link KTS',
                ];
            }
        };

        return Excel::download($export, 'data-santri.xlsx');
    }

    public function pendaftar()
    {
        $pendaftar = User::where('role', 'santri')->where('approval_status', 'pending')->get();
        return view('admin.pendaftar.index', compact('pendaftar'));
    }

    public function acc($id)
    {
        $user = User::findOrFail($id);
        $user->approval_status = 'accepted';
        $user->save();

        // Notifikasi bisa pakai session flash atau email
        return back()->with('success', 'Pendaftar diterima.');
    }

    public function tolak($id)
    {
        $user = User::findOrFail($id);
        $user->approval_status = 'rejected';
        $user->save();

        return back()->with('success', 'Pendaftar ditolak.');
    }

    public function showPendaftar($id)
    {
        $santri = User::where('role', 'santri')->findOrFail($id);
        return view('admin.pendaftar.show', compact('santri'));
    }

    public function tagihan()
    {
        $user = Auth::user();
        $tagihan = Tagihan::where('user_id', $user->id)->get();
        return view('santri.tagihan', compact('tagihan'));
    }

    public function pembayaran()
    {
        $user = Auth::user();
        $pembayaran = PembayaranSantri::where('user_id', $user->id)->get();
        return view('santri.pembayaran', compact('pembayaran'));
    }

    public function profil()
    {
        $user = Auth::user();
        return view('santri.profil', compact('user'));
    }

}