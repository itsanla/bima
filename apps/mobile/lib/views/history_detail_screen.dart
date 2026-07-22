import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/app_colors.dart';
import '../viewmodels/history_detail_viewmodel.dart';
import '../models/history_model.dart';
import 'widgets/custom_app_bar.dart';
import 'widgets/metric_card.dart';
import 'widgets/status_badge.dart';

class HistoryDetailScreen extends StatefulWidget {
  final String sessionId;

  const HistoryDetailScreen({super.key, required this.sessionId});

  @override
  State<HistoryDetailScreen> createState() => _HistoryDetailScreenState();
}

class _HistoryDetailScreenState extends State<HistoryDetailScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<HistoryDetailViewModel>().fetchHistoryDetail(widget.sessionId);
    });
  }

  String _formatTime(DateTime time) {
    final gmt7Time = time.toUtc().add(const Duration(hours: 7));
    return '${gmt7Time.hour.toString().padLeft(2, '0')}:${gmt7Time.minute.toString().padLeft(2, '0')}:${gmt7Time.second.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        title: 'Detail Sesi ${widget.sessionId}',
      ),
      body: Consumer<HistoryDetailViewModel>(
        builder: (context, viewModel, child) {
          if (viewModel.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (viewModel.errorMessage != null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('Error: ${viewModel.errorMessage}', style: const TextStyle(color: Colors.red)),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => viewModel.fetchHistoryDetail(widget.sessionId),
                    child: const Text('Coba Lagi'),
                  ),
                ],
              ),
            );
          }

          if (viewModel.detailResponse == null || viewModel.detailResponse!.history.isEmpty) {
            return const Center(child: Text('Tidak ada log untuk sesi ini.'));
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _buildMetricsRow(context, viewModel),
                const SizedBox(height: 24),
                Text(
                  'Log Aktivitas',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 16),
                _buildLogList(viewModel.detailResponse!.history),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildMetricsRow(BuildContext context, HistoryDetailViewModel viewModel) {
    return Row(
      children: [
        Expanded(
          child: MetricCard(
            borderColor: AppColors.blueTextStroke,
            icon: Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: AppColors.lightBlueBg,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.thermostat, color: AppColors.blueTextStroke, size: 20),
            ),
            title: 'Rata-Rata Suhu',
            content: Row(
              crossAxisAlignment: CrossAxisAlignment.baseline,
              textBaseline: TextBaseline.alphabetic,
              children: [
                Text(viewModel.avgTemp.toStringAsFixed(1), style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
                const SizedBox(width: 2),
                Text('°C', style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.lightGrayStroke)),
              ],
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: MetricCard(
            borderColor: AppColors.orangeBrown,
            icon: Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: AppColors.lightOrangeBg,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.whatshot, color: AppColors.orangeBrown, size: 20),
            ),
            title: 'Suhu Maksimal',
            content: Row(
              crossAxisAlignment: CrossAxisAlignment.baseline,
              textBaseline: TextBaseline.alphabetic,
              children: [
                Text(viewModel.maxTemp.toStringAsFixed(1), style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold)),
                const SizedBox(width: 2),
                Text('°C', style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.lightGrayStroke)),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildLogList(List<HistoryLogModel> history) {
    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: history.length,
      separatorBuilder: (context, index) => const Divider(height: 1, color: AppColors.borderLight),
      itemBuilder: (context, index) {
        final log = history[index];
        final isFireOn = log.api == 'ON';
        
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 12.0),
          child: Row(
            children: [
              // Time
              SizedBox(
                width: 70,
                child: Text(
                  _formatTime(log.createdAt),
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    fontFeatures: const [FontFeature.tabularFigures()],
                  ),
                ),
              ),
              // Temp
              Container(
                width: 60,
                alignment: Alignment.center,
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppColors.borderLight),
                ),
                child: Text(
                  '${log.suhu}°C',
                  style: Theme.of(context).textTheme.labelMedium?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              // Status
              Expanded(
                child: Row(
                  children: [
                    Icon(
                      Icons.local_fire_department,
                      size: 16,
                      color: isFireOn ? AppColors.orangeBrown : AppColors.textGray,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      log.api,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: isFireOn ? AppColors.orangeBrown : AppColors.textGray,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    if (log.airHabis) ...[
                      const SizedBox(width: 8),
                      const StatusBadge(
                        text: 'Air Habis',
                        backgroundColor: Color(0xFFFFEBEE),
                        textColor: Colors.red,
                      ),
                    ],
                  ],
                ),
              ),
              // Timer
              Text(
                log.timer,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  fontFeatures: const [FontFeature.tabularFigures()],
                  color: AppColors.textGray,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
