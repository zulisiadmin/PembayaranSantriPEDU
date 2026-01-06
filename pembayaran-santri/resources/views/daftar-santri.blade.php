<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Daftar Santri</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet">

    <style>
        body {
            background: linear-gradient(135deg, #d4f8e8, #c8f1e4);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .register-card {
            background-color: #fff;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 500px;
        }

        .register-header {
            font-weight: bold;
            color: #28a745;
        }

        .form-label i {
            margin-right: 6px;
        }
    </style>
</head>
<body>

<div class="register-card">
    <h3 class="text-center register-header mb-4"><i class="bi bi-person-plus-fill me-2"></i>Daftar Santri</h3>

    @if ($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    @if (session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif

    <form method="POST" action="{{ route('register.submit') }}" enctype="multipart/form-data">
        @csrf

        <div class="mb-3">
            <label class="form-label" for="name"><i class="bi bi-person-fill"></i>Nama Lengkap</label>
            <input type="text" class="form-control" id="name" name="name" placeholder="Contoh: Ahmad Zaki" required>
        </div>

        <div class="mb-3">
            <label class="form-label" for="email"><i class="bi bi-envelope-fill"></i>Email</label>
            <input type="email" class="form-control" id="email" name="email" placeholder="nama@email.com" required>
        </div>

        <div class="mb-3">
            <label class="form-label" for="password"><i class="bi bi-lock-fill"></i>Password</label>
            <input type="password" class="form-control" id="password" name="password" placeholder="********" required>
        </div>

        <div class="mb-3">
            <label class="form-label" for="kts"><i class="bi bi-file-earmark-arrow-up-fill"></i>Upload KTS</label>
            <input type="file" class="form-control" id="kts" name="kts" accept=".pdf,image/*" required>
            <div class="form-text">Hanya PDF atau Gambar (JPG, PNG).</div>
        </div>

        <button type="submit" class="btn btn-success w-100"><i class="bi bi-send-fill me-1"></i>Daftar</button>
    </form>
</div>

<!-- Bootstrap Bundle JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
