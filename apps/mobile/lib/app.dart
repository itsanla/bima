import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'config/app_theme.dart';
import 'views/dashboard_screen.dart';

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        // Silakan tambah/ganti dengan ViewModel asli di bawah ini:
        Provider.value(value: 'dummy'),
        // ChangeNotifierProvider(create: (_) => ExampleViewModel()),
      ],
      child: MaterialApp(
        title: 'Bima Steamlog',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        home: const DashboardScreen(),
      ),
    );
  }
}
