<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Admin Panel</title>
    <link href="{{ asset('admin/vendor/fontawesome-free/css/all.min.css') }}" rel="stylesheet">
    <link href="{{ asset('admin/css/sb-admin-2.min.css') }}" rel="stylesheet">

    <style>
        body {
            background:rgba(244, 253, 246, 0.31);
        }
        .bg-gradient-primary {
            background: linear-gradient(180deg, #2e8b57, #1c5d3a) !important;
        }
        .sidebar .nav-item.active .nav-link {
            background-color: #47b177;
        }
        .topbar {
            background:rgba(255, 255, 255, 0.36) !important;
        }
        .btn-success {
            background-color:rgb(29, 92, 56);
            border-color:rgb(24, 87, 51);
        }
        .btn-success:hover {
            background-color:rgb(45, 194, 112);
            border-color:rgb(41, 187, 107);
        }
    </style>
</head>

<body id="page-top">
    <div id="wrapper">

        {{-- Sidebar --}}
        <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
            <a class="sidebar-brand d-flex align-items-center justify-content-center" href="#">
                <div class="sidebar-brand-text mx-3">🌿 Pesantren Ekonomi Darul Ukhwah</div>
            </a>

            <hr class="sidebar-divider my-0">

            <li class="nav-item">
                <a class="nav-link" href="{{ route('dashboard.admin') }}">
                    <i class="fas fa-fw fa-tachometer-alt"></i>
                    <span>Dashboard</span>
                </a>
            </li>

            <li class="nav-item {{ request()->routeIs('admin.santri') ? 'active' : '' }}">
                <a class="nav-link" href="{{ route('admin.santri') }}">
                    <i class="fas fa-user-graduate"></i>
                    <span>Manajemen Santri</span>
                </a>
            </li>

            <li class="nav-item">
                <a class="nav-link" href="{{ route('admin.pendaftar') }}">
                    <i class="fas fa-file-alt"></i>
                    <span>Pendaftaran</span>
                </a>
            </li>

            <li class="nav-item">
                <a class="nav-link" href="{{ route('admin.tagihan.index') }}">
                    <i class="fas fa-wallet"></i>
                    <span>Keuangan</span>
                </a>
            </li>

            <hr class="sidebar-divider d-none d-md-block">
        </ul>

        {{-- Content Wrapper --}}
        <div id="content-wrapper" class="d-flex flex-column">
            <div id="content">

                {{-- Topbar --}}
                <nav class="navbar navbar-expand navbar-light topbar mb-4 shadow">
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item dropdown no-arrow">
                            <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                               data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="mr-2 d-none d-lg-inline text-gray-600 small">{{ Auth::user()->name ?? 'Admin' }}</span>
                                <i class="fas fa-user-circle fa-lg text-success"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                 aria-labelledby="userDropdown">
                                <a class="dropdown-item" href="#">
                                    <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Pengaturan
                                </a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="{{ route('logout') }}"
                                   onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                                    <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Logout
                                </a>
                                <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                                    @csrf
                                </form>
                            </div>
                        </li>
                    </ul>
                </nav>

                {{-- Main Content --}}
                <div class="container-fluid">
                    @yield('konten')
                </div>

            </div>
        </div>

    </div>

    <script src="{{ asset('admin/vendor/jquery/jquery.min.js') }}"></script>
    <script src="{{ asset('admin/vendor/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('admin/js/sb-admin-2.min.js') }}"></script>
</body>
</html>
