import 'dart:convert';
import 'package:flutter/foundation.dart';
import '../models/history_model.dart';
import '../services/api_service.dart';

class HistoryDetailViewModel extends ChangeNotifier {
  final ApiService _apiService;

  HistoryDetailViewModel({required ApiService apiService}) : _apiService = apiService;

  bool isLoading = true;
  String? errorMessage;
  HistoryDetailResponse? detailResponse;
  
  double avgTemp = 0.0;
  double maxTemp = 0.0;
  String duration = '00:00:00';

  Future<void> fetchHistoryDetail(String sessionId) async {
    isLoading = true;
    errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiService.get('/logs/$sessionId');
      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        if (jsonResponse['status'] == 'ok') {
          detailResponse = HistoryDetailResponse.fromJson(jsonResponse);
          _calculateMetrics();
        } else {
          errorMessage = 'Gagal memuat detail riwayat';
        }
      } else {
        errorMessage = 'HTTP Error: ${response.statusCode}';
      }
    } catch (e) {
      debugPrint('Error fetching history detail: $e');
      errorMessage = e.toString();
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  void _calculateMetrics() {
    if (detailResponse == null || detailResponse!.history.isEmpty) return;
    
    double sumTemp = 0.0;
    double maximumTemp = 0.0;
    
    for (var log in detailResponse!.history) {
      sumTemp += log.suhu;
      if (log.suhu > maximumTemp) {
        maximumTemp = log.suhu;
      }
    }
    
    avgTemp = sumTemp / detailResponse!.history.length;
    maxTemp = maximumTemp;
    
    // Get the last log's timer for total duration
    duration = detailResponse!.history.last.timer;
  }
}
