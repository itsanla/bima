import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../config/app_colors.dart';
import '../viewmodels/dashboard_viewmodel.dart';
import '../models/dashboard_summary_model.dart';
import 'widgets/custom_app_bar.dart';
import 'widgets/status_badge.dart';
import 'widgets/metric_card.dart';
import 'widgets/summary_item.dart';
import 'widgets/custom_bottom_nav.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentIndex = 0;

  String _formatTimer(int seconds) {
    int h = seconds ~/ 3600;
    int m = (seconds % 3600) ~/ 60;
    int s = seconds % 60;
    return '${h.toString().padLeft(2, '0')}:${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: 'Monitoring Alat Kukusan',
        hasNotification: true,
        onMenuPressed: () {},
        onNotificationPressed: () {},
      ),
      body: Selector<DashboardViewModel, ({bool isLoading, String? errorMessage})>(
        selector: (_, viewModel) => (isLoading: viewModel.isLoading, errorMessage: viewModel.errorMessage),
        builder: (context, state, child) {
          if (state.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (state.errorMessage != null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('Error: ${state.errorMessage}', style: const TextStyle(color: Colors.red)),
                  ElevatedButton(
                    onPressed: () => context.read<DashboardViewModel>().init(),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.only(top: 16, bottom: 100),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Selector<DashboardViewModel, ({bool isRunning, String deviceId, bool isWsConnected, DateTime? lastActive})>(
                  selector: (_, viewModel) {
                    final device = viewModel.currentDevice;
                    return (
                      isRunning: device?.statusApi ?? false,
                      deviceId: device?.deviceId ?? 'Unknown',
                      isWsConnected: viewModel.isWsConnected,
                      lastActive: device?.lastActive,
                    );
                  },
                  builder: (context, data, _) => _buildMachineStatusCard(
                    context,
                    isRunning: data.isRunning,
                    deviceId: data.deviceId,
                    isWsConnected: data.isWsConnected,
                    lastActive: data.lastActive,
                  ),
                ),
                const SizedBox(height: 16),
                Selector<DashboardViewModel, ({double temp, int timer, bool isFireOn})>(
                  selector: (_, viewModel) {
                    final device = viewModel.currentDevice;
                    return (
                      temp: device?.temperature ?? 0.0,
                      timer: device?.timer ?? 0,
                      isFireOn: device?.statusApi ?? false,
                    );
                  },
                  builder: (context, data, _) => _buildMetricGrid(
                    context,
                    isFireOn: data.isFireOn,
                    temperature: data.temp,
                    timer: data.timer,
                  ),
                ),
                const SizedBox(height: 16),
                Selector<DashboardViewModel, DashboardSummaryModel?>(
                  selector: (_, viewModel) => viewModel.summary,
                  builder: (context, summary, _) => _buildDailySummaryCard(context, summary),
                ),
                const SizedBox(height: 16),
                _buildVisualContextImage(context),
              ],
            ),
          );
        },
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

  Widget _buildMachineStatusCard(
    BuildContext context, {
    required bool isRunning,
    required String deviceId,
    required bool isWsConnected,
    DateTime? lastActive,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(
            color: isRunning ? AppColors.primaryGreen : AppColors.lightGrayStroke, 
            width: 4
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'CURRENT STATUS',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              letterSpacing: 0.05,
                            ),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Container(
                            width: 12,
                            height: 12,
                            decoration: BoxDecoration(
                              color: isRunning ? AppColors.primaryGreen : Colors.grey,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            isRunning ? 'Running' : 'Stopped',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                        ],
                      ),
                    ],
                  ),
                  if (isWsConnected)
                    const StatusBadge(
                      text: 'Live',
                      backgroundColor: AppColors.lightGreenBg,
                      textColor: AppColors.darkGreenText,
                      icon: Icons.wifi,
                    )
                  else
                    const StatusBadge(
                      text: 'Offline',
                      backgroundColor: Color(0xFFFFEBEE), // Light red
                      textColor: Colors.red,
                      icon: Icons.wifi_off,
                    ),
                ],
              ),
              const SizedBox(height: 24),
              const Divider(color: AppColors.borderLight, height: 1),
              const SizedBox(height: 12),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Machine ID', style: Theme.of(context).textTheme.bodyMedium),
                      const SizedBox(height: 4),
                      Text(deviceId, style: Theme.of(context).textTheme.titleLarge),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text('Last Active', style: Theme.of(context).textTheme.bodyMedium),
                      const SizedBox(height: 4),
                      Text(
                        lastActive != null 
                          ? '${lastActive.hour.toString().padLeft(2,'0')}:${lastActive.minute.toString().padLeft(2,'0')}'
                          : 'N/A', 
                        style: Theme.of(context).textTheme.titleLarge
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMetricGrid(
    BuildContext context, {
    required bool isFireOn,
    required double temperature,
    required int timer,
  }) {
    final timerString = _formatTimer(timer);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Fire Status
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(12),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x0D000000),
                  offset: Offset(0, 2),
                  blurRadius: 8,
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: isFireOn ? AppColors.lightOrangeBg : AppColors.lightGrayStroke.withValues(alpha: 0.3),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.local_fire_department, 
                    color: isFireOn ? AppColors.orangeBrown : AppColors.darkGrayNavIcon
                  ),
                ),
                const SizedBox(width: 16),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Fire Status', style: Theme.of(context).textTheme.bodyMedium),
                    Text(
                      isFireOn ? 'ON' : 'OFF',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            color: isFireOn ? AppColors.orangeBrown : AppColors.darkGrayNavIcon,
                          ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Temperature
          MetricCard(
            borderColor: AppColors.blueTextStroke,
            icon: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: AppColors.lightBlueBg,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.thermostat, color: AppColors.blueTextStroke),
            ),
            title: 'Current Temperature',
            content: Row(
              crossAxisAlignment: CrossAxisAlignment.baseline,
              textBaseline: TextBaseline.alphabetic,
              children: [
                Text(temperature.toStringAsFixed(1), style: Theme.of(context).textTheme.displayLarge),
                const SizedBox(width: 4),
                Text('°C', style: Theme.of(context).textTheme.titleMedium?.copyWith(color: AppColors.lightGrayStroke)),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Steaming Time
          MetricCard(
            borderColor: AppColors.darkGreenStroke,
            icon: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: AppColors.lightGreenBg,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.timer_outlined, color: AppColors.darkGreenStroke),
            ),
            trailing: isFireOn 
              ? const StatusBadge(
                  text: 'In Progress',
                  backgroundColor: AppColors.lightGreenBg,
                  textColor: AppColors.primaryGreen,
                )
              : const SizedBox.shrink(),
            title: 'Elapsed Time',
            content: Text(
              timerString,
              style: Theme.of(context).textTheme.displayMedium, // Mono font
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDailySummaryCard(BuildContext context, DashboardSummaryModel? summary) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Daily Summary', style: Theme.of(context).textTheme.titleSmall),
                  Text('Today', style: Theme.of(context).textTheme.bodyMedium),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SummaryItem(
                    value: summary?.totalDevices.toString() ?? '0',
                    label: 'Total\nDevices',
                    valueColor: AppColors.blueTextStroke,
                  ),
                  const SizedBox(width: 12),
                  SummaryItem(
                    value: summary?.onlineDevices.toString() ?? '0',
                    label: 'Online',
                    valueColor: AppColors.darkGreenText,
                    hasBackground: true,
                  ),
                  const SizedBox(width: 12),
                  SummaryItem(
                    value: summary?.offlineDevices.toString() ?? '0',
                    label: 'Offline',
                    valueColor: const Color(0xFF693C00), 
                  ),
                ],
              ),
              const SizedBox(height: 16),
              OutlinedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.history, color: AppColors.blueTextStroke, size: 14),
                label: const Text('View Detailed History'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.blueTextStroke,
                  side: const BorderSide(color: AppColors.lightGrayStroke),
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(9999),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildVisualContextImage(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Container(
        height: 192,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          image: const DecorationImage(
            image: CachedNetworkImageProvider('https://picsum.photos/400/200'),
            fit: BoxFit.cover,
          ),
          boxShadow: const [
            BoxShadow(
              color: Color(0x0D000000),
              offset: Offset(0, 2),
              blurRadius: 4,
            ),
          ],
        ),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            gradient: LinearGradient(
              begin: Alignment.bottomCenter,
              end: Alignment.topCenter,
              colors: [
                const Color(0xFF1A1C1C).withValues(alpha: 0.6),
                const Color(0xFF1A1C1C).withValues(alpha: 0),
              ],
            ),
          ),
          padding: const EdgeInsets.all(16),
          alignment: Alignment.bottomLeft,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                color: AppColors.textDark.withValues(alpha: 0.8),
                child: Text(
                  'Steam Quality Monitor',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: AppColors.surface,
                      ),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Zone A-12 Production Line',
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      color: AppColors.surface,
                    ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
