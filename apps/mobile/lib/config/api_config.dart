import 'environment.dart';

/// Konfigurasi API untuk koneksi ke backend Bima Steamlog.
class ApiConfig {
  ApiConfig._();

  /// Base URL backend. Mengambil dari Environment flavor yang sedang aktif.
  static String get baseUrl => Environment.instance.apiBaseUrl;

  /// Base URL WebSocket backend.
  static String get wsBaseUrl => Environment.instance.wsBaseUrl;

  /// Timeout dalam detik.
  static const int timeout = 30;
}
