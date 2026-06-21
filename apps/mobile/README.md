# Bima Steamlog Mobile App

Aplikasi mobile untuk monitoring sistem IoT sterilisasi steam pada budidaya jamur. Dibangun menggunakan Flutter.

## Arsitektur

Project ini menggunakan arsitektur **MVVM (Model-View-ViewModel)** dengan dependency management yang sangat sederhana.

### Struktur Folder

```text
lib/
├── main.dart               # Entry point aplikasi & registrasi MultiProvider
├── config/                 # Konfigurasi aplikasi
│   ├── api_config.dart     # URL base API HTTP & WebSocket
│   └── app_theme.dart      # Tema Material 3
├── models/                 # [M] Data classes & JSON Serialization
├── services/               # Layanan eksternal (API / WebSocket)
│   ├── api_service.dart    # HTTP Client Wrapper (GET, POST, dll)
│   └── websocket_service.dart # WebSocket Client Wrapper
├── viewmodels/             # [VM] State management & business logic
└── views/                  # [V] Layar antarmuka UI (Widget)
```

### Aturan Pengembangan (Rules)

1. **No Clean Architecture Boilerplate:** 
   Jangan membuat layer `domain`, `usecase`, atau `repository`. Langsung gunakan alur yang ringkas.
2. **Alur Data:** 
   `View` (membaca) -> `ViewModel` (memproses & memanggil service) -> `Service` (request ke backend) -> kembalikan ke `ViewModel` -> `notifyListeners()` -> `View` ter-update.
3. **State Management:** 
   Wajib menggunakan package `provider` (`ChangeNotifierProvider`). Semua state dan *business logic* ditaruh di dalam ViewModel, jangan ditaruh di StatefulWidget jika membutuhkan data dari backend.
4. **Services:**
   - Semua request HTTP (REST API) wajib menggunakan instance dari `api_service.dart`.
   - Semua koneksi Real-time WebSocket wajib menggunakan instance dari `websocket_service.dart`.
   - Buat service spesifik untuk fitur (misal: `MonitoringService`) yang akan memanggil `api_service.dart` atau `websocket_service.dart`.
5. **Dependency Injection:**
   Tidak perlu tools DI khusus (seperti `get_it`). Instantiate Service dan ViewModel secara langsung di `main.dart` di dalam `MultiProvider`.

## Dependencies Utama

- `provider`: State Management (MVVM).
- `http`: Rest API Client.
- `web_socket_channel`: WebSocket Client.

## Menjalankan Project (Flavors)

Karena menggunakan *Environment Flavor*, pastikan menjalankan aplikasi dengan entry point yang benar.

**Untuk Development (Lokal):**
```bash
flutter run -t lib/main_dev.dart
```

**Untuk Production (Server Asli):**
```bash
flutter run -t lib/main_prod.dart
```
