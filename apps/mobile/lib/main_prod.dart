import 'package:flutter/material.dart';

import 'app.dart';
import 'config/environment.dart';

void main() {
  // Inisialisasi Environment untuk Production
  Environment.init(
    const Environment(
      type: EnvType.prod,
      // URL Server Asli
      apiBaseUrl: 'https://bima.anla.works/api', 
      wsBaseUrl: 'wss://bima.anla.works/ws',
    ),
  );

  runApp(const MainApp());
}
