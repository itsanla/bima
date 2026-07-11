# Bima IoT API Documentation

Dokumentasi ini berisi daftar seluruh _endpoint_ API dan WebSocket yang tersedia di sistem Bima beserta cara penggunaannya. Semua *endpoint* ini berpusat di domain utama: `https://api.steamlog.cloud/`

---

## 1. HTTP POST: Menyimpan Data Sensor
Digunakan oleh alat IoT (sebagai alternatif jika tidak ingin menggunakan WebSocket) untuk menyimpan data ke *database*.

**Endpoint:** 
`POST https://api.steamlog.cloud/api`

**Headers:**
`Content-Type: application/json`

**Body Payload:**
```json
{
  "session": "1720703810",
  "suhu": 29.5,
  "timer": "00:10:00",
  "api": "ON",
  "status": "HEATING",
  "air_habis": false
}
```
*(Catatan: Atribut `session` dapat juga dikirim menggunakan nama `id` demi menjaga kompatibilitas dengan firmware lama).*

**Contoh Request (CURL):**
```bash
curl -X POST https://api.steamlog.cloud/api \
  -H "Content-Type: application/json" \
  -d '{"session": "1720703810", "suhu": 30.1, "timer": "00:00:10", "api": "ON", "status": "RUNNING", "air_habis": false}'
```

---

## 2. HTTP GET: Mengambil Riwayat Logs (Tabel)
Digunakan oleh Aplikasi Mobile atau Web Dashboard untuk menampilkan tabel riwayat log dengan dukungan *pagination* (halaman), *search* (pencarian), dan *sorting* (pengurutan).

**Endpoint:** 
`GET https://api.steamlog.cloud/api/logs`

**Query Parameters (Opsional):**
- `page` : Nomor halaman (Default: 1, dengan limit 10 baris per halaman)
- `search` : Mencari kata kunci pada kolom `sessionId`, `api`, dan `status`. (Contoh: `ON` atau `ERROR`)
- `sortBy` : Kolom yang ingin diurutkan. (Contoh: `suhu`, `createdAt`, `status`. Default: `createdAt`)
- `sortOrder` : Arah urutan. (`asc` = menaik, `desc` = menurun. Default: `desc`)

**Contoh Request:**
```
https://api.steamlog.cloud/api/logs?page=1&search=RUNNING&sortBy=suhu&sortOrder=desc
```

---

## 3. HTTP GET: Mengambil Data Grafik Mobile (Chart Summary)
Digunakan HANYA oleh pustaka grafik (*Chart Library*) di Aplikasi Mobile untuk mendapatkan data *downsampled* (dirangkum) secara instan, sehingga HP tidak _hang_ saat merender ribuan titik.

**Endpoint:** 
`GET https://api.steamlog.cloud/api/logs/chart`

**Query Parameters:**
- `sessionId` (Wajib): ID sesi pengukusan yang ingin di-_render_ grafiknya (contoh: `1720703810`).
- `interval` (Opsional): Tingkat kerapatan data. (Default: `10m`)
  - `10m` -> Merangkum rata-rata suhu per 10 menit (Direkomendasikan untuk melihat grafik sesi 3 - 7 jam).
  - `1h` -> Merangkum rata-rata suhu per 1 jam (Direkomendasikan jika ingin melihat rentang 1 hari).
  - `all` -> Mengambil data mentah per-detik tanpa rangkuman (Awas: berat jika data banyak).

**Contoh Request:**
```
https://api.steamlog.cloud/api/logs/chart?sessionId=1720703810&interval=10m
```

**Contoh Output:**
```json
{
  "status": "ok",
  "data": [
    { "bucket": "2026-07-11T13:00:00Z", "avg_suhu": 30.5 },
    { "bucket": "2026-07-11T13:10:00Z", "avg_suhu": 45.2 },
    { "bucket": "2026-07-11T13:20:00Z", "avg_suhu": 70.1 }
  ]
}
```

---

## 4. WebSocket (WSS): Komunikasi Real-time (Alat IoT & Dashboard)
Digunakan untuk komunikasi dua arah *real-time* yang cepat antara alat pengukus dan aplikasi pemantau tanpa delay.

**Endpoint:** 
`wss://api.steamlog.cloud/`

### A. Pengiriman Data dari Alat IoT (*Publish*)
Saat alat IoT mengirimkan data ini, *backend* akan **secara otomatis** menyimpannya ke database dan melakukan *broadcast* ke seluruh aplikasi klien yang sedang terbuka.

**Format Pengiriman (Kirim String JSON):**
```json
{
  "type": "device_update",
  "session": "1720703810",
  "suhu": 85.5,
  "timer": "01:30:00",
  "api": "ON",
  "status": "RUNNING",
  "air_habis": false
}
```

### B. Menerima Data di Aplikasi Mobile/Web (*Subscribe*)
Aplikasi pemantau hanya perlu melakukan koneksi ke WSS dan menunggu secara pasif. Apabila ada data masuk dari alat, *backend* akan menyebarkannya dengan format berikut:

**Format Penerimaan Data di UI:**
```json
{
  "type": "dashboard_update",
  "data": {
    "session": "1720703810",
    "suhu": 85.5,
    "timer": "01:30:00",
    "api": "ON",
    "status": "RUNNING",
    "air_habis": false
  }
}
```

**Cara Mengetes WebSocket secara Manual via Terminal:**
Jika Anda ingin mencoba interaksi WebSocket langsung dari Terminal lokal, jalankan script Node.js berikut:
```bash
node -e "
const WebSocket = require('ws');
const ws = new WebSocket('wss://api.steamlog.cloud/');
ws.on('open', () => {
  ws.send(JSON.stringify({ type: 'device_update', session: '1720703810', suhu: 55, api: 'ON' }));
});
ws.on('message', data => console.log('Diterima:', data.toString()));
"
```
