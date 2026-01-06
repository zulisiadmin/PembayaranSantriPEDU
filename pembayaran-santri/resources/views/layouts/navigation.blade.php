<ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">

    <!-- Sidebar - Brand -->
    <a class="sidebar-brand d-flex align-items-center justify-content-center" href="#">
        <div class="sidebar-brand-icon">
            <i class="fas fa-school"></i>
        </div>
        <div class="sidebar-brand-text mx-3">Admin</div>
    </a>

    <hr class="sidebar-divider my-0">

    <!-- Sidebar Menu Dinamis -->
    @foreach (config('menu') as $item)
        <li class="nav-item {{ request()->routeIs($item['route']) ? 'active' : '' }}">
            <a class="nav-link" href="{{ route($item['route']) }}">
                <i class="{{ $item['icon'] }}"></i>
                <span>{{ $item['title'] }}</span>
            </a>
        </li>
    @endforeach

    <hr class="sidebar-divider d-none d-md-block">

</ul>
