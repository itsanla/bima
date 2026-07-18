import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../config/app_colors.dart';
import '../viewmodels/history_viewmodel.dart';
import 'widgets/custom_app_bar.dart';
import 'widgets/time_range_filter.dart';
import 'widgets/history_card.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  final ScrollController _scrollController = ScrollController();
  int _selectedFilterIndex = 0;
  DateTime? _startDate;
  DateTime? _endDate;

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
      context.read<HistoryViewModel>().fetchMoreHistory();
    }
  }

  void _onFilterSelected(int index) async {
    final now = DateTime.now();
    DateTime? start;
    DateTime? end;

    if (index == 0) {
      // Hari Ini
      start = DateTime(now.year, now.month, now.day);
      end = DateTime(now.year, now.month, now.day, 23, 59, 59);
    } else if (index == 1) {
      // Minggu Ini
      final startOfWeek = now.subtract(Duration(days: now.weekday - 1));
      start = DateTime(startOfWeek.year, startOfWeek.month, startOfWeek.day);
      end = DateTime(now.year, now.month, now.day, 23, 59, 59);
    } else if (index == 2) {
      // Bulan Ini
      start = DateTime(now.year, now.month, 1);
      end = DateTime(now.year, now.month + 1, 0, 23, 59, 59);
    } else if (index == 3) {
      // Pilih Tanggal
      final picked = await showDateRangePicker(
        context: context,
        firstDate: DateTime(2020),
        lastDate: now,
      );
      if (picked != null) {
        start = picked.start;
        end = DateTime(picked.end.year, picked.end.month, picked.end.day, 23, 59, 59);
      } else {
        return; // cancelled
      }
    }

    setState(() {
      _selectedFilterIndex = index;
      _startDate = start;
      _endDate = end;
    });

    if (mounted) {
      context.read<HistoryViewModel>().filterByDateRange(_startDate, _endDate);
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const CustomAppBar(
        title: 'Riwayat Kukusan',
      ),
      backgroundColor: AppColors.background,
      body: Consumer<HistoryViewModel>(
        builder: (context, viewModel, child) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const SizedBox(height: 16),
              // Filter Section
              TimeRangeFilter(
                selectedIndex: _selectedFilterIndex,
                onSelected: _onFilterSelected,
              ),
              const SizedBox(height: 24),
              
              // Header
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Log Aktivitas',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                    ),
                    Text(
                      '${viewModel.totalRecords} data',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppColors.textGray,
                          ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 16),
                child: Divider(color: AppColors.lightGrayStroke, height: 1),
              ),
              const SizedBox(height: 16),
              
              // List Content
              Expanded(
                child: _buildListContent(viewModel),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildListContent(HistoryViewModel viewModel) {
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
              onPressed: () => viewModel.fetchHistory(),
              child: const Text('Coba Lagi'),
            ),
          ],
        ),
      );
    }

    if (viewModel.records.isEmpty) {
      return const Center(child: Text('Belum ada riwayat aktivitas.'));
    }

    return ListView.separated(
      controller: _scrollController,
      padding: const EdgeInsets.only(left: 16, right: 16, bottom: 100),
      itemCount: viewModel.records.length + (viewModel.isFetchingMore ? 1 : 0),
      separatorBuilder: (context, index) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        if (index == viewModel.records.length) {
          return const Padding(
            padding: EdgeInsets.symmetric(vertical: 16.0),
            child: Center(child: CircularProgressIndicator()),
          );
        }
        final record = viewModel.records[index];
        return HistoryCard(record: record);
      },
    );
  }
}
