import 'package:flutter/material.dart';

class MetricCard extends StatelessWidget {
  final Widget icon;
  final String title;
  final Widget content;
  final Widget? trailing;
  final Color borderColor;
  final Color backgroundColor;

  const MetricCard({
    super.key,
    required this.icon,
    required this.title,
    required this.content,
    this.trailing,
    this.borderColor = Colors.transparent,
    this.backgroundColor = Colors.white,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: backgroundColor,
        borderRadius: BorderRadius.circular(12),
        border: Border(left: BorderSide(color: borderColor, width: 4)),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0D000000), // rgba(0, 0, 0, 0.05)
            offset: Offset(0, 2),
            blurRadius: 8,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [icon, ?trailing],
          ),
          const SizedBox(height: 12),
          Text(title, style: Theme.of(context).textTheme.bodyMedium),
          const SizedBox(height: 4),
          content,
        ],
      ),
    );
  }
}
