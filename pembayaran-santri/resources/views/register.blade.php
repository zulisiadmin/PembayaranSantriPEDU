<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Register Santri</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- TailwindCSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Font Awesome CDN -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>

    <style>
        body {
            background: linear-gradient(to right, #38b2ac, #81e6d9);
        }

        .form-box {
            display: none;
        }

        .form-box.active {
            display: block;
        }

        .form-wrapper {
            max-width: 400px;
            margin: auto;
            padding: 2rem;
            background-color: white;
            border-radius: 1rem;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }

        .logo-header img {
            width: 80px;
            height: auto;
            margin: auto;
        }
    </style>
</head>
<body class="flex items-center justify-center min-h-screen">

    <div class="form-wrapper">

        <!-- Logo + Judul -->
        <div class="logo-header text-center mb-4">
            <img src="{{ asset('images/logopesantren.jpeg') }}" alt="LogoPesantren">
            <h1 class="text-2xl font-bold text-gray-700 mt-2">Pesantren Darul Ukhwah</h1>
        </div>

        {{-- Flash Error --}}
        @if (session('login_error'))
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                {{ session('login_error') }}
            </div>
        @endif

        {{-- LOGIN FORM --}}
        <div class="form-box active" id="loginForm">
            <form method="POST" action="{{ route('login.submit') }}">
                @csrf
                <div class="mb-4">
                    <input type="email" name="email" placeholder="Email"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required>
                </div>
                <div class="mb-4">
                    <input type="password" name="password" placeholder="Password"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" required>
                
               </div>
                <button type="submit"
                    class="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-lg transition">
                    <i class="fas fa-sign-in-alt mr-2"></i> Masuk
                </button>
            </form>
            <div class="mt-4 text-sm text-center">
                Belum punya akun?
                <button onclick="toggleForm('register')" class="text-teal-700 underline font-medium">Daftar</button>
            </div>
        </div>

        {{-- REGISTER FORM --}}
        <div class="form-box" id="registerForm">
            <form method="POST" action="{{ route('register.submit') }}">
                @csrf
                <div class="mb-3">
                    <input type="text" name="name" placeholder="Nama Lengkap"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div class="mb-3">
                    <input type="email" name="email" placeholder="Email"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <div class="mb-3">
                    <input type="password" name="password" placeholder="Password"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                
                 </div>
                 <div class="mb-3">
                    <label for="kts">Upload Kartu KTS (PDF / JPG / PNG)</label>
                    <input type="file" name="kts" id="kts" class="form-control" accept=".pdf,.jpg,.jpeg,.png" required>
                </div>
                <div class="mb-4">
                    <input type="password" name="password_confirmation" placeholder="Konfirmasi Password"
                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                </div>
                <button type="submit"
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
                    <i class="fas fa-user-plus mr-2"></i> Daftar
                </button>
            </form>
            <div class="mt-4 text-sm text-center">
                Sudah punya akun?
                <button onclick="toggleForm('login')" class="text-blue-700 underline font-medium">Login</button>
            </div>
        </div>
    </div>

    <script>
        function toggleForm(form) {
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');

            if (form === 'register') {
                loginForm.classList.remove('active');
                registerForm.classList.add('active');
            } else {
                registerForm.classList.remove('active');
                loginForm.classList.add('active');
            }
        }
    </script>
</body>
</html>
