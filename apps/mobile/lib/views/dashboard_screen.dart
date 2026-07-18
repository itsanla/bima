import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/app_colors.dart';
import '../viewmodels/dashboard_viewmodel.dart';
import '../models/dashboard_summary_model.dart';
import 'widgets/custom_app_bar.dart';
import 'widgets/status_badge.dart';
import 'widgets/metric_card.dart';
import 'widgets/summary_item.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(
        title: 'Monitoring Alat Kukusan',
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
                      isRunning: device?.api == 'ON',
                      deviceId: device?.session ?? 'Unknown',
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
                Selector<DashboardViewModel, ({double temp, String timer, bool isFireOn})>(
                  selector: (_, viewModel) {
                    final device = viewModel.currentDevice;
                    return (
                      temp: device?.suhu ?? 0.0,
                      timer: device?.timer ?? '00:00:00',
                      isFireOn: device?.api == 'ON',
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
                        'STATUS SAAT INI',
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
                            isRunning ? 'Berjalan' : 'Berhenti',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                        ],
                      ),
                    ],
                  ),
                  if (isWsConnected)
                    const StatusBadge(
                      text: 'Aktif',
                      backgroundColor: AppColors.lightGreenBg,
                      textColor: AppColors.darkGreenText,
                      icon: Icons.wifi,
                    )
                  else
                    const StatusBadge(
                      text: 'Luring',
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
                      Text('ID Mesin', style: Theme.of(context).textTheme.bodyMedium),
                      const SizedBox(height: 4),
                      Text(deviceId, style: Theme.of(context).textTheme.titleLarge),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text('Terakhir Aktif', style: Theme.of(context).textTheme.bodyMedium),
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
    required String timer,
  }) {
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
                    Text('Status Api', style: Theme.of(context).textTheme.bodyMedium),
                    Text(
                      isFireOn ? 'NYALA' : 'MATI',
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
            title: 'Suhu Saat Ini',
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
                  text: 'Berjalan',
                  backgroundColor: AppColors.lightGreenBg,
                  textColor: AppColors.primaryGreen,
                )
              : const SizedBox.shrink(),
            title: 'Waktu Berjalan',
            content: Text(
              timer,
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
                  Text('Ringkasan Harian', style: Theme.of(context).textTheme.titleSmall),
                  Text('Hari Ini', style: Theme.of(context).textTheme.bodyMedium),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SummaryItem(
                    value: summary?.totalDevices.toString() ?? '0',
                    label: 'Total\nPerangkat',
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
                label: const Text('Lihat Detail Riwayat'),
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
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(12),
          boxShadow: const [
            BoxShadow(
              color: Color(0x0D000000),
              offset: Offset(0, 2),
              blurRadius: 4,
            ),
          ],
        ),
        alignment: Alignment.center,
        child: Text(
          'BIMA POLITEKNIK NEGERI PADANG 2026',
          textAlign: TextAlign.center,
          style: Theme.of(context).textTheme.titleSmall?.copyWith(
                color: AppColors.textDark,
                fontWeight: FontWeight.bold,
              ),
        ),
      ),
    );
  }
}
