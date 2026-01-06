<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class CekDataLengkap
{
    public function handle($request, Closure $next)
    {
        $user = Auth::user();

        // Izinkan akses ke halaman-halaman berikut tanpa cek status
        $allowedRoutes = [
            'santri.index',
            'santri.lengkapi',
            'santri.lengkapi.simpan',
            'dashboard.santri', 
        ];

        // Jika route saat ini tidak dalam daftar yang diizinkan
        if (!in_array($request->route()->getName(), $allowedRoutes)) {
            if ($user->approval_status !== 'accepted') {
                return redirect()->route('santri.index')
                    ->with('error', 'Akses ditolak. Data Anda belum disetujui oleh admin.');
            }
        }

        return $next($request);
    }
}
