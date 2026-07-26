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
    return Scaffold(
      backgroundColor: const Color(0xFFFAF9F9),
      body: Stack(
        children: [
          // Subtle radial background gradient
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  colors: [
                    const Color(0xFFE3E2E2).withValues(alpha: 0.3),
                    const Color(0xFFE3E2E2).withValues(alpha: 0.0),
                  ],
                  radius: 1.0,
                ),
              ),
            ),
          ),

          SafeArea(
            child: Column(
              children: [
                const SizedBox(height: 59), // Margin from top based on Figma
                // Header - Top: Logo Cluster
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.asset(
                      'assets/images/tut-wuri-handayani.png',
                      width: 56,
                      height: 56,
                    ),
                    const SizedBox(width: 24),
                    Image.asset(
                      'assets/images/bima.png',
                      width: 56,
                      height: 56,
                    ),
                    const SizedBox(width: 24),
                    Image.asset(
                      'assets/images/politeknik.png',
                      width: 56,
                      height: 56,
                    ),
                  ],
                ),

                const Spacer(),

                // Center: Main App Title & Identity
                Column(
                  children: [
                    Text(
                      'STEAMLOG',
                      style: const TextStyle(
                        fontFamily:
                            'Inter', // Assuming Inter is default or available
                        fontWeight: FontWeight.w800,
                        fontSize: 48,
                        height: 56 / 48,
                        letterSpacing: -2.4, // -0.05em * 48
                        color: Color(0xFF0061A4),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Container(
                      width: 48,
                      height: 4,
                      decoration: BoxDecoration(
                        color: const Color(0xFF0061A4),
                        borderRadius: BorderRadius.circular(9999),
                      ),
                    ),
                    const SizedBox(height: 24),

                    const Text(
                      'Sistem Terintegrasi untuk stEAM\nSterilisasi dan Monitoring BagLOG Jamur',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontWeight: FontWeight.w600,
                        fontSize: 18,
                        height: 24.75 / 18,
                        color: Color(0xFF1A1C1C),
                      ),
                    ),
                    const SizedBox(height: 12),

                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFF91F78E),
                        borderRadius: BorderRadius.circular(9999),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            Icons.cloud_queue,
                            size: 14,
                            color: Color(0xFF00731E),
                          ),
                          const SizedBox(width: 8),
                          const Text(
                            'IOT PLATFORM',
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontWeight: FontWeight.w500,
                              fontSize: 12,
                              height: 16 / 12,
                              letterSpacing: 1.2, // 0.1em * 12
                              color: Color(0xFF00731E),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                const Spacer(),

                // Footer - Bottom: Branding & Versioning
                const Padding(
                  padding: EdgeInsets.only(bottom: 24),
                  child: Text(
                    'BIMA POLITEKNIK NEGERI PADANG 2026',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontWeight: FontWeight.w500,
                      fontSize: 12,
                      height: 16 / 12,
                      letterSpacing: 2.4, // 0.2em * 12
                      color: Color(0xFFBFC7D4),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
