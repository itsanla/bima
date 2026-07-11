import 'package:flutter/material.dart';
import '../../config/app_colors.dart';

class SummaryItem extends StatelessWidget {
  final String value;
  final String label;
  final Color valueColor;
  final bool hasBackground;

  const SummaryItem({
    super.key,
    required this.value,
    required this.label,
    required this.valueColor,
    this.hasBackground = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 100.67,
      padding: hasBackground
          ? const EdgeInsets.fromLTRB(12, 12, 12, 27)
          : const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: hasBackground ? AppColors.background : Colors.transparent,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            value,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: valueColor,
                  fontSize: 28, // Inter Regular 28
                ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                  color: AppColors.textGray,
                ),
          ),
        ],
      ),
    );
  }
}
