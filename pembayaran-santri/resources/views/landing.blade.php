 <!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sistem Pembayaran Santri - Pesantren Ekonomi Darul Ukhwah</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500&family=Scheherazade+New&display=swap" rel="stylesheet">
  <style>
    body {
      background: linear-gradient(to bottom right, #f3f8f3, #e8f0e8);
      font-family: 'Quicksand', sans-serif;
      color: #333;
    }

    .fade-in {
      animation: fadeIn 1.2s ease-in-out both;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .logo-circle {
      width: 150px;
      height: 150px;
      background: radial-gradient(circle, #4CAF50, #2e7d32);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      color: white;
      font-size: 42px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .arabic-quote {
      font-family: 'Scheherazade New', serif;
      font-size: 1.8rem;
      color: #2e7d32;
      margin-bottom: 10px;
    }

    footer {
      font-size: 0.9rem;
      color: #888;
      background-color: #f9f9f9;
      padding: 20px 0;
      border-top: 1px solid #ddd;
    }

    .ornament {
      width: 40px;
      opacity: 0.5;
    }

    .btn-success {
      background-color: #388e3c;
    }

    .section-title {
      font-weight: 700;
      color: #2e7d32;
      margin-top: 60px;
      margin-bottom: 20px;
    }

    .profile-box {
      background-color: #ffffffcc;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 0 15px rgba(0,0,0,0.05);
    }
  </style>
</head>
<body>

  <div class="container text-center py-5 fade-in">
  <<div class="logo-circle mb-3 p-2 fade-in">
  <img src="{{ asset('images/logopesantren.jpeg') }}" alt="LogoPesantren" style="max-width: 100%; max-height: 100%; border-radius: 50%;">
</div>



  <h1 class="fw-bold text-success mb-3 animated-text animated-delay-1">Sistem Pembayaran Santri</h1>
  <h5 class="text-muted mb-2 animated-text animated-delay-2">Pesantren Ekonomi Darul Ukhwah</h5>
  <p class="lead text-muted mb-4 animated-text animated-delay-3">Kelola tagihan dan pembayaran santri dengan mudah, aman, dan terpercaya.</p>


    <div class="arabic-quote">
      خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ
    </div>
    <blockquote class="blockquote text-muted mb-5" style="font-style: italic;">
      "Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lain." <br><small>- HR. Ahmad</small>
    </blockquote>

    <div class="d-flex justify-content-center gap-3 mb-5">
      <a href="/login/santri" class="btn btn-success">Masuk sebagai Santri</a>
      <a href="/login/admin" class="btn btn-outline-success">Masuk sebagai Admin</a>
      <a href="{{ route('auth') }}" class="btn btn-outline-success px-4">Daftar</a>
    </div>

    <!-- PROFIL PESANTREN SECTION -->
    <div class="profile-box text-start">
      <h3 class="section-title text-center">Profil Pesantren</h3>
      <p><strong>Nama Pesantren:</strong> Pesantren Ekonomi Darul Ukhwah</p>
      <p><strong>Didirikan:</strong> Tahun 2013</p>
      <p><strong>Visi:</strong> Mewujudkan generasi Islami yang mandiri, berakhlak mulia, dan unggul dalam bidang ekonomi serta teknologi.</p>
      <p><strong>Misi:</strong></p>
      <ul>
        <li>Mendidik santri dengan kurikulum terpadu antara agama dan kewirausahaan.</li>
        <li>Mengembangkan potensi ekonomi umat melalui pendidikan pesantren.</li>
        <li>Mencetak generasi pemimpin yang berlandaskan nilai-nilai Islam.</li>
      </ul>
      <p><strong>Alamat:</strong> Jl. Kedoya Duri Raya No.13 28B, RT.13/RW.1, Kedoya Selatan, Kebonjeruk,  Jakarta Barat , Jakarta 11520</p>
    </div>
    <!-- GALERI FOTO PESANTREN -->
    <div class="mt-5">
      <h3 class="section-title text-center">Galeri Pesantren</h3>
      <div class="row g-3">
        <div class="col-sm-6 col-md-4">
          <img src="{{ asset('images/pesantren10.jpeg') }}" class="img-fluid rounded shadow-sm" alt="Foto Pesantren 1">
        </div>
        <div class="col-sm-6 col-md-4">
          <img src="{{ asset('images/pesantren2.jpg') }}" class="img-fluid rounded shadow-sm" alt="Foto Pesantren 2">
        </div>
        <div class="col-sm-6 col-md-4">
          <img src="{{ asset('images/pesantren3.jpg') }}" class="img-fluid rounded shadow-sm" alt="Foto Pesantren 3">
        </div>
        <div class="col-sm-6 col-md-4">
          <img src="{{ asset('images/pesantren5.jpeg') }}" class="img-fluid rounded shadow-sm" alt="Foto Pesantren 4">
      </div>
      <div class="col-sm-6 col-md-4">
          <img src="{{ asset('images/pesantren8.jpg') }}" class="img-fluid rounded shadow-sm" alt="Foto Pesantren 5">
      </div>
      <div class="col-sm-6 col-md-4">
          <img src="{{ asset('images/pesantren6.jpeg') }}" class="img-fluid rounded shadow-sm" alt="Foto Pesantren 6">
    </div>
    <!-- PENDIDIKAN TERSEDIA -->
    <div class="mt-5">
      <h3 class="section-title text-center">Pendidikan yang Tersedia</h3>
      <div class="row g-4 justify-content-center">

        
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 border-0 shadow-sm">
            <img src="{{ asset('images/smk.jpeg') }}" class="card-img-top" alt="SMK Ekonomi">
            <div class="card-body">
              <h5 class="card-title text-success fw-bold">SMK Digital</h5>
              <p class="card-text text-muted">
                Program pendidikan formal setingkat SMK dengan kurikulum berbasis ekonomi dan bisnis syariah, mempersiapkan santri menjadi wirausahawan muslim yang profesional.
              </p>
            </div>
          </div>
        </div>

        
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 border-0 shadow-sm">
            <img src="{{ asset('images/mahasiswa.jpg') }}" class="card-img-top" alt="Mahasiswa Kuliah">
            <div class="card-body">
              <h5 class="card-title text-success fw-bold">Perguruan Tinggi</h5>
              <p class="card-text text-muted">
                Program pembinaan khusus mahasiswa, dengan pendekatan integratif antara studi akademik dan penguatan nilai-nilai keislaman serta kepemimpinan.
              </p>
            </div>
          </div>
        </div>

        
        <div class="col-md-6 col-lg-4">
          <div class="card h-1000 border-100 shadow-sm">
            <img src="{{ asset('images/tpqmdt.jpeg') }}" class="card-img-top" alt="Tahfidz Al-Qur'an">
            <div class="card-body">
              <h5 class="card-title text-success fw-bold">Tahfidz Al-Qur'an</h5>
              <p class="card-text text-muted">
                Program unggulan hafalan Al-Qur'an 30 juz dengan metode yang sistematis dan bimbingan intensif dari para penghafal Al-Qur'an bersanad.
              </p>
            </div>
          </div>
        </div>

        <
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 border-0 shadow-sm">
            <img src="{{ asset('images/pesantren4.jpeg') }}" class="card-img-top" alt="Kewirausahaan">
            <div class="card-body">
              <h5 class="card-title text-success fw-bold">Pencak Silat</h5>
              <p class="card-text text-muted">
                Seni bela diri pencak silat adalah salah satu kegiatan ekskhul di pesantren ekonomi darul ukhwah yang mana ekskhul ini sangat diminati para santri selain sebagai kegiatan rohani pencak silat juga bagus untuk pengembangan diri di bidang bela diri.
              </p>
            </div>
          </div>
        </div>

        
        <div class="col-md-6 col-lg-4">
          <div class="card h-100 border-0 shadow-sm">
            <img src="{{ asset('images/kitabkuning.jpg') }}" class="card-img-top" alt="Diniyah & Kitab Kuning">
            <div class="card-body">
              <h5 class="card-title text-success fw-bold">Diniyah & Kitab Kuning</h5>
              <p class="card-text text-muted">
                Kajian kitab-kitab salafiyah seperti Fathul Qarib, Ta’lim Muta’allim, dan lainnya yang menguatkan dasar ilmu agama santri secara klasik.
              </p>
            </div>
          </div>
        </div>

  </div>
</div>


  </div>
</div>


  </div>

  <footer class="text-center mt-5">
    &copy; {{ date('Y') }} Pesantren Ekonomi Darul Ukhwah. Seluruh hak cipta dilindungi.
  </footer>

</body>
</html>