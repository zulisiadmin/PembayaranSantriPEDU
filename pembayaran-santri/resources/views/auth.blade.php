<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Login Santri</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Google Font -->
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@500;700&display=swap" rel="stylesheet">

    <style>
        * { box-sizing: border-box; }
        body {
            font-family: 'Cairo', sans-serif;
            background: linear-gradient(135deg, #e6f4ea, #fdfdfd);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .auth-container {
            width: 420px;
            background: #fff;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0,0,0,0.1);
            position: relative;
        }

        .form-wrapper {
            display: flex;
            width: 840px;
            transition: transform 0.5s ease;
        }

        .form-box {
            width: 420px;
            padding: 40px 30px;
        }

        .form-box h2 {
            margin-bottom: 25px;
            color: #2f4f4f;
            text-align: center;
        }

        .form-box input, .form-box label {
            display: block;
            width: 100%;
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #dcdcdc;
            border-radius: 8px;
        }

        .form-box button {
            width: 100%;
            padding: 12px;
            background: #38a169;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s ease;
        }

        .form-box button:hover {
            background: #2f855a;
        }

        .toggle-links {
            text-align: center;
            margin-top: 15px;
            font-size: 14px;
        }

        .toggle-links a {
            color: #38a169;
            cursor: pointer;
            text-decoration: underline;
        }

        .alert {
            padding: 10px;
            margin-bottom: 15px;
            border-radius: 5px;
        }

        .alert-success {
            background-color: #d4edda;
            color: #155724;
        }

        .alert-danger {
            background-color: #f8d7da;
            color: #721c24;
        }

        .logo-header {
            text-align: center;
            margin-bottom: 20px;
        }

        .logo-header img {
            width: 80px;
        }

        .logo-header h1 {
            margin-top: 10px;
            font-size: 20px;
            color: #2d3748;
        }
    </style>
</head>
<body>

<div class="auth-container">
    <div class="form-wrapper" id="formWrapper">
        <!-- Login Form -->
        <div class="form-box">
            <div class="logo-header">
                <img src="{{ asset('images/logopesantren.jpeg') }}" alt="LogoPesantren">
                <h1>Login Santri</h1>
            </div>

            @if (session('login_error'))
                <div class="alert alert-danger">
                    {{ session('login_error') }}
                </div>
            @endif

            <form method="POST" action="{{ route('login.submit') }}">
                @csrf
                <input type="email" name="email" placeholder="Email" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit">Masuk</button>
            </form>

            <div class="toggle-links">
                Belum punya akun? <a onclick="showRegister()">Daftar</a>
            </div>
        </div>

        <!-- Register Form -->
        <div class="form-box">
            <div class="logo-header">
            <img src="{{ asset('Images/logopesantren.jpeg') }}" alt="storage/app/public/kts/logo_pesantren.jpeg" width="150">

                <h1>Daftar Santri</h1>
            </div>

            @if ($errors->any())
                <div class="alert alert-danger">
                    @foreach ($errors->all() as $error)
                        <div>{{ $error }}</div>
                    @endforeach
                </div>
            @endif

            @if (session('success'))
                <div class="alert alert-success">
                    {{ session('success') }}
                </div>
            @endif

            <form method="POST" action="{{ route('register.submit') }}" enctype="multipart/form-data">
                @csrf
                <input type="text" name="name" placeholder="Nama Lengkap" required>
                <input type="email" name="email" placeholder="Email" required>
                <input type="password" name="password" placeholder="Password" required>

                <label for="kts">Upload KTS (PDF atau Gambar):</label>
                <input type="file" name="kts" accept=".pdf,image/*" required>

                <button type="submit">Daftar</button>
            </form>

            <div class="toggle-links">
                Sudah punya akun? <a onclick="showLogin()">Login</a>
            </div>
        </div>
    </div>
</div>

<script>
    function showRegister() {
        document.getElementById('formWrapper').style.transform = 'translateX(-420px)';
    }

    function showLogin() {
        document.getElementById('formWrapper').style.transform = 'translateX(0)';
    }
</script>

</body>
</html>
