import 'package:flutter/material.dart';
import '../services/startup_service.dart';
import 'widgets/update_dialog.dart';
import 'main_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  final _startupService = StartupService();

  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    // Artificial delay for splash screen visibility
    await Future.delayed(const Duration(seconds: 2));

    if (!mounted) return;

    final updateInfo = await _startupService.runStartupSequence();

    if (!mounted) return;

    if (updateInfo != null) {
      // Show update dialog
      await showDialog(
        context: context,
        barrierDismissible: !updateInfo.forceUpdate,
        builder: (context) => UpdateDialog(updateInfo: updateInfo),
      );
      
      if (!mounted) return;

      // If force update, we shouldn't proceed to main screen.
      // But if it's not force update and user dismissed it, we can proceed.
      if (updateInfo.forceUpdate) {
        return; // Stop here, don't navigate
      }
    }

    if (!mounted) return;
    
    // Navigate to main screen
    Navigator.of(context).pushReplacement(
      MaterialPageRoute(builder: (context) => const MainScreen()),
    );
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.monitor_heart, size: 80, color: Colors.blue),
            SizedBox(height: 16),
            Text(
              'Bima Steamlog',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 32),
            CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}
