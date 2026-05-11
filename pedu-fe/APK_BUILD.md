# Build APK PEDU Frontend

Frontend PEDU sudah disiapkan menjadi APK Android menggunakan Capacitor.

## Status Saat Ini

- Project Android ada di folder `android/`.
- Asset frontend diambil dari hasil build Vite folder `dist/`.
- App ID Android: `id.pedu.app`.
- Nama aplikasi: `PEDU`.
- HTTP sementara diizinkan untuk testing lokal lewat `android:usesCleartextTraffic="true"`.

## Kebutuhan Di Laptop

Install:

1. Android Studio
2. Android SDK
3. JDK 21
4. Android SDK Platform minimal API 35
5. Android SDK Build Tools
6. Android Emulator, atau HP Android dengan USB debugging

Setelah Android Studio terinstall, pastikan file ini ada:

```text
C:\Users\Jesica\AppData\Local\Android\Sdk
```

Jika Gradle belum mendeteksi SDK otomatis, buat file:

```text
pedu-fe\android\local.properties
```

Isi:

```properties
sdk.dir=C\:\\Users\\Jesica\\AppData\\Local\\Android\\Sdk
```

## Build APK Debug

Dari folder `pedu-fe`:

```powershell
npm.cmd run build
npx.cmd cap sync android
cd android
$env:GRADLE_USER_HOME="$PWD\.gradle-home"
.\gradlew.bat assembleDebug
```

Hasil APK debug:

```text
pedu-fe\android\app\build\outputs\apk\debug\app-debug.apk
```

## Build APK Tanpa Android Studio

Jika laptop tidak kuat untuk install Android Studio, gunakan GitHub Actions.

Workflow sudah disiapkan di:

```text
.github\workflows\build-android-apk.yml
```

Cara pakai:

1. Push perubahan ke GitHub.
2. Buka repository GitHub.
3. Masuk tab `Actions`.
4. Pilih workflow `Build Android APK`.
5. Klik `Run workflow`.
6. Setelah selesai, download artifact `pedu-debug-apk`.

Isi artifact tersebut adalah APK debug:

```text
app-debug.apk
```

## Catatan Backend

Karena backend belum ada server, fitur yang memanggil API belum akan berjalan penuh.
Saat backend sudah online, set URL API frontend lewat environment:

```text
VITE_API_BASE_URL=https://domain-backend-kamu.com/api
```

Lalu build ulang frontend dan sync Android lagi.
