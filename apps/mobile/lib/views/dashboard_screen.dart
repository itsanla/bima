import 'package:flutter/material.dart';
import '../config/app_colors.dart';
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: 'Monitoring Alat Kukusan',
        hasNotification: true,
        onMenuPressed: () {},
        onNotificationPressed: () {},
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.only(top: 16, bottom: 100), // padding bottom for nav bar
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _buildMachineStatusCard(context),
            const SizedBox(height: 16),
            _buildMetricGrid(context),
            const SizedBox(height: 16),
            _buildDailySummaryCard(context),
            const SizedBox(height: 16),
            _buildVisualContextImage(context),
          ],
        ),
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

  Widget _buildMachineStatusCard(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Card(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: AppColors.primaryGreen, width: 4),
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
                            decoration: const BoxDecoration(
                              color: AppColors.primaryGreen,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Running',
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                        ],
                      ),
                    ],
                  ),
                  const StatusBadge(
                    text: 'Optimal',
                    backgroundColor: AppColors.lightGreenBg,
                    textColor: AppColors.darkGreenText,
                    icon: Icons.check_circle_outline,
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
                      Text('STEAM-V2-042', style: Theme.of(context).textTheme.titleLarge),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text('Active Since', style: Theme.of(context).textTheme.bodyMedium),
                      const SizedBox(height: 4),
                      Text('08:15 AM', style: Theme.of(context).textTheme.titleLarge),
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

  Widget _buildMetricGrid(BuildContext context) {
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
                  decoration: const BoxDecoration(
                    color: AppColors.lightOrangeBg,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.local_fire_department, color: AppColors.orangeBrown),
                ),
                const SizedBox(width: 16),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Fire Status', style: Theme.of(context).textTheme.bodyMedium),
                    Text(
                      'ON',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            color: AppColors.orangeBrown,
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
                Text('92', style: Theme.of(context).textTheme.displayLarge),
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
            trailing: const StatusBadge(
              text: 'In Progress',
              backgroundColor: AppColors.lightGreenBg,
              textColor: AppColors.primaryGreen,
            ),
            title: 'Elapsed Time',
            content: Text(
              '01:45:32',
              style: Theme.of(context).textTheme.displayMedium, // Mono font
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDailySummaryCard(BuildContext context) {
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
                  Text('Today, Oct 24', style: Theme.of(context).textTheme.bodyMedium),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SummaryItem(
                    value: '12',
                    label: 'Total\nSessions',
                    valueColor: AppColors.blueTextStroke,
                  ),
                  const SizedBox(width: 12),
                  const SummaryItem(
                    value: '95°',
                    label: 'Avg Temp',
                    valueColor: AppColors.darkGreenText,
                    hasBackground: true,
                  ),
                  const SizedBox(width: 12),
                  SummaryItem(
                    value: '10',
                    label: 'Cycles\nDone',
                    valueColor: const Color(0xFF693C00), // Brown from Figma
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
            image: NetworkImage('https://picsum.photos/400/200'),
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
