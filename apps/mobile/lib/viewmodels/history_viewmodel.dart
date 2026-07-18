import 'dart:convert';
import 'package:flutter/foundation.dart';
import '../models/history_model.dart';
import '../services/api_service.dart';

class HistoryViewModel extends ChangeNotifier {
  final ApiService _apiService;

  HistoryViewModel({required ApiService apiService}) : _apiService = apiService;

  bool isLoading = true;
  String? errorMessage;
  List<HistoryModel> records = [];
  List<HistoryModel> _allRecords = [];
  int totalRecords = 0;
  
  int _currentPage = 1;
  bool _hasMore = true;
  bool isFetchingMore = false;
  bool get hasMore => _hasMore;

  DateTime? _currentStartDate;
  DateTime? _currentEndDate;
  String? _currentSearch;
  String _currentSortBy = 'createdAt';
  String _currentSortOrder = 'desc';

  Future<void> init() async {
    await fetchHistory();
  }

  Future<void> fetchHistory({
    String? search,
    String sortBy = 'createdAt',
    String sortOrder = 'desc',
  }) async {
    isLoading = true;
    errorMessage = null;
    _currentPage = 1;
    _hasMore = true;
    _currentSearch = search;
    _currentSortBy = sortBy;
    _currentSortOrder = sortOrder;
    notifyListeners();

    try {
      String path = '/logs?page=$_currentPage&sortBy=$_currentSortBy&sortOrder=$_currentSortOrder';
      if (_currentSearch != null && _currentSearch!.isNotEmpty) {
        path += '&search=$_currentSearch';
      }
      
      final response = await _apiService.get(path);
      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        if (jsonResponse['status'] == 'ok') {
          final historyData = HistoryResponse.fromJson(jsonResponse);
          _allRecords = historyData.data;
          
          if (historyData.data.length < 10) {
            _hasMore = false;
          }
          
          _applyCurrentFilter();
          totalRecords = historyData.total;
        } else {
          errorMessage = 'Gagal memuat data riwayat';
        }
      } else {
        errorMessage = 'HTTP Error: ${response.statusCode}';
      }
    } catch (e) {
      debugPrint('Error fetching history: $e');
      errorMessage = e.toString();
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  Future<void> fetchMoreHistory() async {
    if (isFetchingMore || !_hasMore) return;
    
    isFetchingMore = true;
    notifyListeners();

    try {
      _currentPage++;
      String path = '/logs?page=$_currentPage&sortBy=$_currentSortBy&sortOrder=$_currentSortOrder';
      if (_currentSearch != null && _currentSearch!.isNotEmpty) {
        path += '&search=$_currentSearch';
      }
      
      final response = await _apiService.get(path);
      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        if (jsonResponse['status'] == 'ok') {
          final historyData = HistoryResponse.fromJson(jsonResponse);
          if (historyData.data.isEmpty) {
            _hasMore = false;
          } else {
            _allRecords.addAll(historyData.data);
            if (historyData.data.length < 10) {
              _hasMore = false;
            }
            _applyCurrentFilter();
          }
        }
      }
    } catch (e) {
      debugPrint('Error fetching more history: $e');
      _currentPage--; // Revert page on error
    } finally {
      isFetchingMore = false;
      notifyListeners();
    }
  }

  void filterByDateRange(DateTime? start, DateTime? end) {
    _currentStartDate = start;
    _currentEndDate = end;
    _applyCurrentFilter();
  }
  
  void _applyCurrentFilter() {
    if (_currentStartDate == null || _currentEndDate == null) {
      records = List.from(_allRecords);
    } else {
      records = _allRecords.where((record) {
        return record.createdAt.isAfter(_currentStartDate!) && record.createdAt.isBefore(_currentEndDate!);
      }).toList();
    }
    notifyListeners();
  }
}
