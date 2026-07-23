# Backend Mobile Version

Ini adalah backend untuk mengelola rilis dan pembaruan APK.

## Setup & Menjalankan secara Lokal

### Prasyarat
- Node.js (v18+)
- npm / pnpm / yarn

### Instalasi
1. Clone repositori dan arahkan ke `apps/backend-mobile-version/`.
2. Jalankan `npm install` (atau `pnpm install`) untuk menginstal dependensi.
3. Salin `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```
4. Konfigurasikan variabel `.env` Anda (lihat di bawah).

### Variabel Lingkungan (Environment Variables)
- `PORT`: Port untuk menjalankan API (default `3000`).
- `API_TOKEN`: Token rahasia yang digunakan untuk mengautentikasi request POST (contoh: `your-super-secret-token`).

### Menjalankan Server
- Development: `npm run dev`
- Production: `npm start`

---

## Dokumentasi API

### 1. Mendaftarkan Rilis (POST)
**Endpoint:** `/api/releases`
**Headers:**
- `Authorization: Bearer <API_TOKEN>`
- `Content-Type: application/json`

**Body:**
```json
{
  "version": "1.0.1",
  "build_number": 2,
  "download_url": "https://example.com/apk/app-1.0.1.apk",
  "release_notes": "Perbaikan bug dan peningkatan performa",
  "checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "version": "1.0.1",
  "build_number": 2,
  "download_url": "https://example.com/apk/app-1.0.1.apk",
  "release_notes": "Perbaikan bug dan peningkatan performa",
  "checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

### 2. Cek Pembaruan (GET)
**Endpoint:** `/api/releases/latest?build_number=1`

**Query Parameters:**
- `build_number` (opsional): Nomor build aplikasi saat ini. Digunakan untuk menentukan apakah pembaruan diperlukan.

**Response (200 OK) - Jika ada pembaruan:**
```json
{
  "update_available": true,
  "latest_version": "1.0.1",
  "latest_build_number": 2,
  "download_url": "https://example.com/apk/app-1.0.1.apk",
  "release_notes": "Perbaikan bug dan peningkatan performa",
  "checksum": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

**Response (200 OK) - Jika sudah versi terbaru:**
```json
{
  "update_available": false
}
```

---

## Deployment ke VPS

1. **Setup Folder Server:**
   Buat direktori `/opt/app-update/api/`, `/opt/app-update/storage/apk/`, dan `/opt/app-update/data/` di VPS Anda.
2. **Salin Aplikasi:**
   Salin folder `apps/backend-mobile-version/` ke dalam `/opt/app-update/api/`.
3. **Instal Dependensi:**
   Jalankan `cd /opt/app-update/api/ && npm install --production`.
4. **Setup Environment:**
   Buat file `.env` di `/opt/app-update/api/` dan atur `PORT` serta `API_TOKEN` yang aman.
5. **Process Manager (PM2):**
   Instal PM2 (`npm install -g pm2`), buat file `ecosystem.config.js`, jalankan aplikasi, dan atur auto-start (`pm2 startup && pm2 save`).
6. **Reverse Proxy & SSL:**
   - **PENTING**: HTTPS wajib dikonfigurasi melalui Nginx di environment production untuk melindungi pengiriman `API_TOKEN` dan data pembaruan.
   - Konfigurasi Nginx untuk meneruskan (proxy) request API ke `localhost:PORT` dan menyajikan (serve) file APK statis dari `/opt/app-update/storage/apk/`.
   - Siapkan SSL menggunakan Certbot / Let's Encrypt.

---

## Aturan Rilis: Patch vs Full Release

- **Shorebird Patch:**
  Gunakan Shorebird patch untuk pembaruan kode Dart/Flutter (logic, UI, bug fix di level Flutter) yang **tidak** melibatkan perubahan di level *native* (Android/iOS) atau penambahan dependensi *native* baru.
- **Full Release (APK):**
  Lakukan rilis APK secara penuh dan daftarkan ke Backend (melalui `/api/releases`) jika ada:
  - Penambahan atau perubahan pada dependensi *native* (contoh: pembaruan di folder `android/` atau `ios/`).
  - Perubahan pada file konfigurasi *native* (contoh: `AndroidManifest.xml`, `Info.plist`).
  - Perubahan *asset* besar yang perlu dibundle ke dalam APK baru.
  - Perubahan versi (version) besar/utama yang membutuhkan instalasi APK baru dari awal.
