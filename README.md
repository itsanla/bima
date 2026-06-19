# Bima Steamlog

Sistem monitoring IoT untuk proses sterilisasi steam pada budidaya jamur. Perangkat keras berbasis ESP32 dengan modem GSM SIM800 mengirim data ke server cloud, lalu dimonitor oleh petani melalui aplikasi mobile.

## Arsitektur

```
┌─────────────────────┐        GPRS/4G         ┌──────────────────────┐
│   IoT Device        │ ─────────────────────► │   API (Express.js)   │
│   ESP32 + SIM800    │   HTTPS ke server      │   bima.anla.works    │
└─────────────────────┘                         └──────────┬───────────┘
                                                           │
                                                ┌──────────▼───────────┐
                                                │   Mobile App         │
                                                │   (perangkat utama)  │
                                                └──────────────────────┘

┌─────────────────────┐
│   Web Landing Page  │  ── Iklan + link download Mobile App
│   (Next.js)         │
└─────────────────────┘
```

| App       | Teknologi                       | Keterangan                                     |
|-----------|---------------------------------|------------------------------------------------|
| `api`     | Express.js 5, TypeScript 6      | REST API, manajemen data, logging              |
| `mobile`  | *(planned)*                     | Aplikasi utama petani — monitoring & kontrol   |
| `iot`     | ESP32, SIM800, TinyGSM          | Sensor + transmisi data via GPRS               |
| `web`     | Next.js 16, React 19, Tailwind  | Landing page — iklan & link download app       |

## Struktur Project

```
bima/
├── apps/
│   ├── api/          # Backend Express.js
│   │   ├── config/   # Environment variables
│   │   └── src/
│   │       ├── common/       # Konstanta, tipe, utilitas
│   │       ├── models/       # Model data (User, dll)
│   │       ├── repos/        # Akses data (MockORM)
│   │       ├── routes/       # Route handler
│   │       ├── services/     # Business logic
│   │       └── views/        # HTML views
│   ├── web/          # Frontend Next.js
│   ├── iot/          # Firmware ESP32
│   └── mobile/       # (planned)
├── docs/             # Dokumentasi teknis
└── package.json      # Root scripts
```

## Prasyarat

- Node.js >= 16
- [pnpm](https://pnpm.io/) >= 11
- ESP32 + modem SIM800 (untuk IoT)
- Kartu SIM dengan paket data GPRS

## Instalasi

```bash
# Clone repository
git clone <url-repo>
cd bima

# Install dependensi backend
pnpm --dir apps/api install

# Install dependensi frontend
pnpm --dir apps/web install
```

## Menjalankan Development

```bash
# Jalankan backend dan landing page sekaligus
pnpm run dev

# Atau jalankan terpisah di terminal berbeda
pnpm run dev:api   # Backend → http://localhost:<PORT>
pnpm run dev:web   # Landing page → http://localhost:3000
```

Konfigurasi port dan environment ada di `apps/api/config/.env.development`.

## API Endpoints

Base URL: `/api`

| Method   | Endpoint              | Keterangan          |
|----------|-----------------------|---------------------|
| `GET`    | `/api/users/all`      | Ambil semua user    |
| `POST`   | `/api/users/add`      | Tambah user baru    |
| `PUT`    | `/api/users/update`   | Update data user    |
| `DELETE` | `/api/users/delete/:id` | Hapus user        |

## IoT — Firmware ESP32

Firmware menggunakan library [TinyGSM](https://github.com/vshymanskyy/TinyGSM) untuk koneksi GPRS via modem SIM800.

**Konfigurasi hardware:**
- RX/TX modem: pin 16/17 (Serial2)
- Baud rate modem: 9600
- APN: `internet` (sesuaikan dengan provider)

**Alur kerja firmware:**
1. Inisialisasi modem SIM800
2. Koneksi GPRS via APN
3. Koneksi SSL ke `bima.anla.works:443`
4. Kirim data sensor via HTTP

Untuk mengembangkan firmware, buka `apps/iot/` menggunakan Arduino IDE atau PlatformIO.

## Testing

```bash
cd apps/api
pnpm test
```

Test menggunakan [Vitest](https://vitest.dev/) dan [Supertest](https://github.com/ladjs/supertest) untuk integration test endpoint.

## Build Production

```bash
# Build backend
cd apps/api
pnpm build

# Build frontend
cd apps/web
pnpm build
```

## Deployment

Server production berjalan di `bima.anla.works`. Pastikan environment variable di `config/.env.production` sudah terkonfigurasi sebelum build.

## Lisensi

ISC
