import 'package:flutter/material.dart';

import 'app.dart';
import 'config/environment.dart';

void main() {
  // Inisialisasi Environment untuk Production
  Environment.init(
    const Environment(
      type: EnvType.prod,
      // URL Server Asli
      apiBaseUrl: 'https://api.steamlog.cloud/api',
      wsBaseUrl: 'wss://api.steamlog.cloud/',
      // URL khusus untuk backend update
      updateBaseUrl: 'https://bima-version.steamlog.cloud',
    ),
  );

  runApp(const MainApp());
}
