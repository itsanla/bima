import 'package:flutter/material.dart';

import 'app.dart';
import 'config/environment.dart';

void main() {
  // Inisialisasi Environment untuk Development
  Environment.init(
    const Environment(
      type: EnvType.dev,
      // Gunakan localhost (10.0.2.2 untuk emulator Android) atau IP lokal
      apiBaseUrl: 'https://api.steamlog.cloud/api',
      wsBaseUrl: 'wss://api.steamlog.cloud/',
      // URL khusus untuk backend update
      updateBaseUrl: 'https://bima-version.steamlog.cloud',
    ),
  );

  runApp(const MainApp());
}
