import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'dashboard_screen.dart';
import 'history_screen.dart';
import 'widgets/custom_bottom_nav.dart';
import '../viewmodels/dashboard_viewmodel.dart';
import '../viewmodels/history_viewmodel.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const DashboardScreen(),
    const HistoryScreen(),
  ];

  @override
  void initState() {
    super.initState();
    // Initialize data for both screens
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<DashboardViewModel>().init();
      context.read<HistoryViewModel>().init();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: CustomBottomNav(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }
}
