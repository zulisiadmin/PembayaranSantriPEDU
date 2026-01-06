<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SantriController;
use App\Http\Controllers\TagihanController;
use App\Http\Controllers\SantriTagihanController;
use App\Http\Controllers\XenditWebhookController;
use App\Http\Controllers\AdminController;


// =====================
// 🔓 LANDING & LOGIN
// =====================
Route::get('/', fn() => view('landing'))->name('landing');
Route::get('/auth', fn() => view('auth'))->name('auth');

Route::middleware(['auth', 'cekdata'])->group(function () {
    Route::get('/dashboard/santri', [SantriController::class, 'dashboardSantri'])->name('dashboard.santri');
    Route::get('/dashboard/admin', [AdminController::class, 'index'])->name('dashboard.admin');
});


// 🟢 LOGIN SANTRI
Route::get('/login/santri', [AuthController::class, 'loginsantri'])->name('loginsantri'); 
Route::post('/login/santri', [AuthController::class, 'santriLogin'])->name('login.santri.submit'); // PROSES login santri

// 🔴 LOGIN ADMIN
Route::get('/login/admin', [AuthController::class, 'showAdminLoginForm'])->name('loginadmin'); // FORM login admin
Route::post('/login/admin', [AuthController::class, 'adminLogin'])->name('login.admin.submit'); // PROSES login admin

// DAFTAR SANTRI
Route::get('/daftar/santri', [AuthController::class, 'showDaftarSantriForm'])->name('daftarsantri'); // FORM daftar santri
Route::post('/daftar/santri', [AuthController::class, 'daftarsantri'])->name('daftar.santri.submit'); // PROSES daftar santri

// ✅ Redirect berdasarkan role setelah login
Route::get('/redirect-after-login', function () {
    $user = Auth::user();
    if ($user->role === 'admin') {
        return redirect()->route('dashboard.admin');
    } elseif ($user->role === 'santri') {
        return redirect()->route('dashboard.santri');
    }
    return redirect('/');

});



// ======================
// 🧠 DASHBOARD SANTRI
// ======================
Route::middleware(['auth','cekdata'])->group(function () {
    Route::get('/lengkapi-data', [AuthController::class, 'lengkapiData'])->name('santri.lengkapi');
    Route::post('/lengkapi-data', [AuthController::class, 'simpanData'])->name('santri.lengkapi.simpan');

    Route::middleware(['cekdata'])->group(function () {
        Route::get('/santri/index', fn() => view('santri.index'))->name('santri.index');
        Route::get('/profil', fn() => view('santri.profil'))->name('santri.profil');
        Route::get('/keuangan', [SantriTagihanController::class, 'index'])->name('santri.keuangan');
        Route::get('/tagihan/{id}/bayar', [SantriTagihanController::class, 'bayar'])->name('santri.tagihan.bayar');
        Route::get('/tagihan/{id}/detail', [SantriTagihanController::class, 'show'])->name('santri.tagihan.show');
    });

    Route::put('/profil/update', [AuthController::class, 'updateProfil'])->name('santri.profil.update');
    Route::get('/tagihan/success', [SantriTagihanController::class, 'success'])->name('santri.tagihan.success');
    Route::get('/santri/tagihan/{id}/invoice', [SantriTagihanController::class, 'invoice'])->name('santri.tagihan.invoice');
});

// ======================
// 🧠 DASHBOARD ADMIN
// ======================
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard/admin', fn() => view('admin.dashboard'))->name('dashboard.admin');
    Route::get('/users', fn() => view('admin.users'))->name('users');
    Route::get('/keuangan', [TagihanController::class, 'index'])->name('keuangan');

    // Santri
    Route::get('/santri', [SantriController::class, 'index'])->name('santri');
    Route::get('/santri/create', [SantriController::class, 'create'])->name('santri.create');
    Route::post('/santri', [SantriController::class, 'store'])->name('santri.store');
    Route::get('/santri/{id}/edit', [SantriController::class, 'edit'])->name('santri.edit');
    Route::put('/santri/{id}', [SantriController::class, 'update'])->name('santri.update');
    Route::get('/santri/{id}/show', [SantriController::class, 'show'])->name('santri.show');
    Route::delete('/santri/{id}', [SantriController::class, 'destroy'])->name('santri.destroy');
    Route::get('/santri/export-excel', [SantriController::class, 'exportExcel'])->name('santri.export');

    // Pendaftar
    Route::get('/pendaftar', [SantriController::class, 'pendaftar'])->name('pendaftar');
    Route::post('/pendaftar/{id}/acc', [SantriController::class, 'acc'])->name('pendaftar.acc');
    Route::post('/pendaftar/{id}/tolak', [SantriController::class, 'tolak'])->name('pendaftar.tolak');
    Route::get('/pendaftar/{id}', [SantriController::class, 'showPendaftar'])->name('pendaftar.show');

    // Tagihan
    Route::resource('tagihan', TagihanController::class);
    Route::get('tagihan/{tagihan}/export', [TagihanController::class, 'export'])->name('tagihan.export');
    Route::get('tagihan/{tagihan}/pembayaran', [TagihanController::class, 'pembayaran'])->name('tagihan.pembayaran');
});

// ======================
// ❌ LOGOUT
// ======================
Route::match(['get', 'post'], '/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/');
})->name('logout');

//REGISTER
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/dashboard/admin', [AdminController::class, 'index'])->name('dashboard.admin');
});

Route::middleware(['auth', 'role:santri'])->group(function () {
    Route::get('/dashboard/santri', [SantriController::class, 'dashboard'])->name('dashboard.santri');
});

Route::get('/register', [AuthController::class, 'showRegister'])->name('register.');
Route::post('/login', [AuthController::class, 'login'])->name('login.submit');
Route::post('/register', [AuthController::class, 'register'])->name('register.submit');

// ======================
// 🌐 XENDIT Webhook
// ======================
Route::post('/webhook/xendit', [XenditWebhookController::class, 'handle']);
