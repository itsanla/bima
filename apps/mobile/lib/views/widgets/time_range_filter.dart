import 'package:flutter/material.dart';
import '../../config/app_colors.dart';

class TimeRangeFilter extends StatelessWidget {
  final int selectedIndex;
  final Function(int) onSelected;

  const TimeRangeFilter({
    super.key,
    required this.selectedIndex,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    final List<String> labels = ['Hari Ini', 'Minggu Ini', 'Bulan Ini', 'Pilih Tanggal'];

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: List.generate(labels.length, (index) {
          final isSelected = index == selectedIndex;
          final isCustomDate = index == 3;

          return Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: InkWell(
              onTap: () => onSelected(index),
              borderRadius: BorderRadius.circular(9999),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.blueTextStroke : AppColors.lightGrayStroke.withValues(alpha: 0.3),
                  borderRadius: BorderRadius.circular(9999),
                  boxShadow: isSelected
                      ? [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.05),
                            offset: const Offset(0, 1),
                            blurRadius: 2,
                          )
                        ]
                      : null,
                ),
                child: Row(
                  children: [
                    if (isCustomDate) ...[
                      Icon(
                        Icons.calendar_today_outlined,
                        size: 14,
                        color: isSelected ? Colors.white : AppColors.textDark,
                      ),
                      const SizedBox(width: 4),
                    ],
                    Text(
                      labels[index],
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            fontWeight: FontWeight.w500,
                            letterSpacing: 0.05,
                            color: isSelected ? Colors.white : AppColors.textDark,
                          ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }),
      ),
    );
  }
}
