import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'config/app_theme.dart';
import 'views/dashboard_screen.dart';

import 'viewmodels/dashboard_viewmodel.dart';
import 'services/api_service.dart';
import 'services/websocket_service.dart';

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider<ApiService>(create: (_) => ApiService()),
        Provider<WebSocketService>(create: (_) => WebSocketService()),
        ChangeNotifierProxyProvider2<ApiService, WebSocketService, DashboardViewModel>(
          create: (context) => DashboardViewModel(
            apiService: context.read<ApiService>(),
            wsService: context.read<WebSocketService>(),
          )..init(),
          update: (context, apiService, wsService, previous) =>
              previous ??
              DashboardViewModel(
                apiService: apiService,
                wsService: wsService,
              )..init(),
        ),
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
