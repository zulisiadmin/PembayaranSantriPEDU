<!DOCTYPE html>
<html lang="id" x-data="{ sidebarOpen: false }" class="h-100">
<head>
    <meta charset="UTF-8">
    <title>Dashboard Santri</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap & Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>

    <style>
        body {
            font-family: 'Segoe UI', sans-serif;
            background-color: #f9fdfb;
        }
        .sidebar {
            background: linear-gradient(135deg, #2e7d32, #4caf50);
            color: white;
            width: 250px;
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            transition: transform 0.3s ease;
            z-index: 1000;
        }
        .sidebar a {
            color: #e0f2f1;
            text-decoration: none;
            display: block;
            padding: 10px 20px;
            font-weight: 500;
        }
        .sidebar a:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        .sidebar-header {
            padding: 20px;
            background-color: #1b5e20;
        }
        .main {
            margin-left: 250px;
            padding: 30px;
            transition: margin-left 0.3s ease;
        }
        .toggle-btn {
            display: none;
            background: none;
            border: none;
            color: #2e7d32;
            font-size: 24px;
            margin: 10px;
        }
        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
            }
            .sidebar[aria-expanded="true"] {
                transform: translateX(0);
            }
            .main {
                margin-left: 0;
            }
            .toggle-btn {
                display: inline-block;
            }
        }
    </style>
</head>
<body>

@php
    $user = Auth::user();
@endphp

<!-- Sidebar -->
<div class="sidebar" :aria-expanded="sidebarOpen">
    <div class="sidebar-header text-center">
        <h4 class="mb-0">🌿 Darul Ukhwah</h4>
        <small>Dashboard Santri</small>
    </div>

    <div class="px-3 mt-3">
        <p>👋 Halo, <strong>{{ $user->name }}</strong></p>
    </div>

    <a href="{{ route('santri.index') }}"><i class="bi bi-house-door"></i> Beranda</a>

    @if($user->approval_status === 'accepted')
        <a href="{{ route('santri.keuangan') }}"><i class="bi bi-wallet2"></i> Keuangan</a>
        <a href="{{ route('santri.profil') }}"><i class="bi bi-person-circle"></i> Profil</a>
    @endif

    <a href="{{ route('logout') }}"><i class="bi bi-box-arrow-right"></i> Logout</a>
</div>

<!-- Toggle Sidebar -->
<button class="toggle-btn position-fixed" style="z-index: 1100;" @click="sidebarOpen = !sidebarOpen">
    <i class="bi bi-list"></i>
</button>

<!-- Main Content -->
<div class="main">
    {{-- Notifikasi tagihan --}}
    @if(session('show_tagihan_popup'))
        <script>
            alert('Anda memiliki tagihan yang perlu dibayar. Silakan cek menu Keuangan.');
        </script>
    @endif

    {{-- Status verifikasi --}}
    @if($user->approval_status === 'pending')
        <div class="alert alert-warning shadow-sm">
            <strong>Menunggu Persetujuan</strong><br>
            Data Anda sedang diverifikasi oleh admin.
        </div>
    @elseif($user->approval_status === 'rejected')
        <div class="alert alert-danger shadow-sm">
            <strong>Pendaftaran Ditolak</strong><br>
            Silakan hubungi admin untuk informasi lebih lanjut.
        </div>
    @elseif($user->approval_status === 'accepted')
        <div class="alert alert-success shadow-sm">
            <strong>Data Disetujui</strong><br>
            Anda telah diterima. Silakan gunakan menu di samping.
        </div>
    @endif

    {{-- Konten halaman --}}
    @yield('konten')
</div>

</body>
</html>
