import 'package:flutter/material.dart';
import '../../config/app_colors.dart';
import '../../models/history_model.dart';
import '../history_detail_screen.dart';
import 'status_badge.dart';

class HistoryCard extends StatelessWidget {
  final HistoryModel record;

  const HistoryCard({super.key, required this.record});

  String _formatTime(DateTime time) {
    final gmt7Time = time.toUtc().add(const Duration(hours: 7));
    return '${gmt7Time.hour.toString().padLeft(2, '0')}:${gmt7Time.minute.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final timeStr = _formatTime(record.createdAt);
    final gmt7Date = record.createdAt.toUtc().add(const Duration(hours: 7));
    final dateStr = '${gmt7Date.day}/${gmt7Date.month}/${gmt7Date.year}';
    final durationStr = 'Sesi ${record.sessionId}';

    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: const BorderSide(color: AppColors.blueTextStroke, width: 4),
      ),
      elevation: 2,
      shadowColor: Colors.black.withValues(alpha: 0.1),
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
                    Row(
                      children: [
                        const Icon(Icons.schedule, size: 16, color: AppColors.textDark),
                        const SizedBox(width: 8),
                        Text(
                          timeStr,
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.w600,
                              ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      durationStr,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.textGray,
                          ),
                    ),
                  ],
                ),
                StatusBadge(
                  text: 'Terekam',
                  backgroundColor: AppColors.lightGreenBg,
                  textColor: AppColors.primaryGreen,
                  icon: Icons.check_circle,
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Divider(color: AppColors.lightGrayStroke, height: 1),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: _buildGridItem(
                    context,
                    title: 'Tanggal',
                    value: dateStr,
                    icon: Icons.calendar_today,
                    iconColor: AppColors.blueTextStroke,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildGridItem(
                    context,
                    title: 'Status Api',
                    value: 'N/A',
                    icon: Icons.local_fire_department,
                    iconColor: AppColors.textGray,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildGridItem(
                    context,
                    title: 'ID Sesi',
                    value: record.sessionId,
                    icon: Icons.developer_board,
                    iconColor: AppColors.blueTextStroke,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => HistoryDetailScreen(
                            sessionId: record.sessionId,
                          ),
                        ),
                      );
                    },
                    borderRadius: BorderRadius.circular(8),
                    child: _buildGridItem(
                      context,
                      title: 'Aksi',
                      value: 'Lihat Detail',
                      icon: Icons.arrow_forward_ios,
                      iconColor: AppColors.textGray,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGridItem(
    BuildContext context, {
    required String title,
    required String value,
    required IconData icon,
    required Color iconColor,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: AppColors.lightGrayStroke),
          ),
          child: Icon(icon, color: iconColor, size: 20),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: AppColors.textDark,
                      fontWeight: FontWeight.w500,
                    ),
              ),
              Text(
                value,
                style: Theme.of(context).textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ],
    );
  }
}
