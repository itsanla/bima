/// Mendefinisikan tipe environment.
enum EnvType { dev, prod }

/// Class untuk menyimpan konfigurasi spesifik per-environment (Flavor).
class Environment {
  final EnvType type;
  final String apiBaseUrl;
  final String wsBaseUrl;
  final String updateBaseUrl;

  const Environment({
    required this.type,
    required this.apiBaseUrl,
    required this.wsBaseUrl,
    required this.updateBaseUrl,
  });

  /// Singleton instance yang akan di-inject saat aplikasi start.
  static late Environment instance;

  /// Inisialisasi environment. Wajib dipanggil sebelum runApp().
  static void init(Environment env) {
    instance = env;
  }

  /// Helper untuk mengecek apakah sedang di mode dev.
  static bool get isDev => instance.type == EnvType.dev;
}
