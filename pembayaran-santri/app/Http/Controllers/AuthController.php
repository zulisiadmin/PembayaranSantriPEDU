<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    // ===========================
    // 📌 TAMPILAN FORM LOGIN
    // ===========================
    public function loginsantri()
    {
        return view('loginsantri');
    }

    public function showAdminLoginForm()
    {
        return view('login-admin');

    }
    public function dashboard()
    {
        return view('dashboard.santri'); 

    }
        public function index()
    {
        return view('admin.dashboard'); 
    }



    public function showSantriRegisterForm()
    {
    return view('daftar-santri');
    }


    // ===========================
    // 📌 PROSES LOGIN SANTRI
    // ===========================
    public function santriLogin (Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            if (Auth::user()->role === 'santri') {
                return view('santri.dashboard');

            } else {
                Auth::logout();
                return back()->with('error', 'Akun ini bukan akun santri.');
            }
        }

        return back()->with('error', 'Login gagal, periksa kembali email dan password Anda.');
    }

    // ===========================
    // 📌 PROSES LOGIN ADMIN
    // ============================
    public function adminLogin(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            if (Auth::user()->role === 'admin') {
                return redirect('/dashboard/admin');
            } else {
                Auth::logout();
                return back()->withErrors(['email' => 'Anda bukan admin.']);
            }
        }

        return back()->withErrors(['email' => 'Login gagal, cek kembali email & password.']);
    }

    // ===========================
    // 📌 REGISTER
    // ===========================
    public function register(Request $request)
{
    $request->validate([
        'name'     => 'required',
        'email'    => 'required|email|unique:users',
        'password' => 'required|min:6',
        'kts'      => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
    ]);

    if ($request->hasFile('kts')) {
        $filename = $request->file('kts')->store('kts', 'public');
    }

    User::create([
        'name'     => $request->name,
        'email'    => $request->email,
        'password' => Hash::make($request->password),
        'role'     => 'santri',
        'kts'      => basename($filename),
    ]);

    return view('loginsantri')->with('success', 'Berhasil daftar! Silakan login.');
}


    public function showRegister()
    {
        return view('register');
    
    
        $request->validate([
            'name'     => 'required',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:1',
            'kts'      => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('kts')) {
            $filename = $request->file('kts')->store('kts', 'public');
        }

        User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'santri',
            'kts'      => basename($filename),
        ]);

        return redirect()->route('register')->with('success', 'Berhasil daftar! Silakan login.');
    }
    

    // ===========================
    // 📌 LENGKAPI DATA
    // ===========================
    public function lengkapiData()
    {
        return view('santri.lengkapi', ['user' => Auth::user()]);
    }

    public function simpanData(Request $request)
    {
        $request->validate([
            'no_kts' => 'required',
            'nik' => 'required',
            'no_kk' => 'required',
            'alamat' => 'required',
            'kelas' => 'required',
            'status' => 'required|in:kerja,mahasiswa,smk',
            'no_hp' => 'required',
        ]);

        $user = Auth::user();
        $user->update($request->only([
            'no_kts', 'nik', 'no_kk', 'alamat', 'kelas', 'status', 'no_hp'
        ]));

        return redirect()->route('santri.index')->with('success', 'Data berhasil dilengkapi. Tunggu persetujuan admin.');
    }

    // ===========================
    // 📌 UPDATE PROFIL
    // ===========================
    public function updateProfil(Request $request)
    {
        $request->validate([
            'name'     => 'required',
            'no_kts'   => 'required',
            'nik'      => 'required',
            'no_kk'    => 'required',
            'alamat'   => 'required',
            'kelas'    => 'required',
            'status'   => 'required|in:kerja,mahasiswa,smk',
            'no_hp'    => 'required',
        ]);

        $user = Auth::user();
        $user->update($request->only([
            'name', 'no_kts', 'nik', 'no_kk', 'alamat',
            'kelas', 'status', 'no_hp'
        ]));

        return redirect()->route('santri.profil')->with('success', 'Data profil berhasil diperbarui.');
    }

}