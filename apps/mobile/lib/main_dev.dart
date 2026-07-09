import 'package:flutter/material.dart';

import 'app.dart';
import 'config/environment.dart';

void main() {
  // Inisialisasi Environment untuk Development
  Environment.init(
    const Environment(
      type: EnvType.dev,
      // Gunakan localhost (10.0.2.2 untuk emulator Android) atau IP lokal
      apiBaseUrl: 'https://bima-websocket.furqonaugust.site/api',
      wsBaseUrl: 'wss://bima-websocket.furqonaugust.site',
    ),
  );

  runApp(const MainApp());
}
