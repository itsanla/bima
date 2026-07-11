import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import '../models/device_model.dart';
import '../models/dashboard_summary_model.dart';
import '../services/api_service.dart';
import '../services/websocket_service.dart';

class DashboardViewModel extends ChangeNotifier {
  final ApiService _apiService;
  final WebSocketService _wsService;

  DashboardViewModel({
    required ApiService apiService,
    required WebSocketService wsService,
  })  : _apiService = apiService,
        _wsService = wsService;

  DashboardSummaryModel? summary;
  DeviceModel? currentDevice;
  bool isLoading = true;
  String? errorMessage;
  bool isWsConnected = false;
  bool _isDisposed = false;
  StreamSubscription? _wsSubscription;

  Future<void> init() async {
    isLoading = true;
    errorMessage = null;
    notifyListeners();

    try {
      await _fetchSummary();
      _connectWebSocket();
    } catch (e) {
      errorMessage = e.toString();
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  Future<void> _fetchSummary() async {
    try {
      final response = await _apiService.get('/dashboard');
      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body);
        if (jsonResponse['success'] == true) {
          summary = DashboardSummaryModel.fromJson(jsonResponse['data']);
        }
      } else {
        throw Exception('Failed to load summary: HTTP ${response.statusCode}');
      }
    } catch (e) {
      debugPrint('Error fetching summary: $e');
      rethrow;
    }
  }

  void _connectWebSocket() {
    if (_isDisposed) return;
    try {
      _wsService.connect(''); // Endpoint empty as WS URL handles it
      isWsConnected = true;
      notifyListeners();

      _wsSubscription?.cancel();
      _wsSubscription = _wsService.stream?.listen(
        (message) {
          try {
            final json = jsonDecode(message);

            if (json['type'] == 'dashboard_update' &&
                json.containsKey('data')) {
              final data = json['data'];
              // Use data from WS directly
              if (currentDevice == null ||
                  (data.containsKey('deviceId') &&
                      data['deviceId'] == currentDevice!.deviceId)) {
                currentDevice = DeviceModel(
                  deviceId:
                      data['deviceId'] ?? currentDevice?.deviceId ?? 'Unknown',
                  statusApi: data.containsKey('statusApi')
                      ? data['statusApi']
                      : (currentDevice?.statusApi ?? false),
                  temperature: data.containsKey('temperature')
                      ? (data['temperature'] as num).toDouble()
                      : (currentDevice?.temperature ?? 0.0),
                  timer: data.containsKey('timer')
                      ? data['timer']
                      : (currentDevice?.timer ?? 0),
                  isOnline: true,
                  lastActive: DateTime.now(),
                );
                notifyListeners();
              }
            }
          } catch (e) {
            debugPrint('Error parsing WS message: $e');
          }
        },
        onError: (error) {
          debugPrint('WebSocket Error: $error');
          _handleWsDisconnect();
        },
        onDone: () {
          debugPrint('WebSocket connection closed');
          _handleWsDisconnect();
        },
      );
    } catch (e) {
      debugPrint('Error connecting to WebSocket: $e');
      _handleWsDisconnect();
    }
  }

  void _handleWsDisconnect() {
    if (_isDisposed) return;
    isWsConnected = false;
    notifyListeners();
    _wsService.disconnect();
    
    // Auto reconnect after 3 seconds
    Future.delayed(const Duration(seconds: 3), () {
      if (!_isDisposed) {
        debugPrint('Attempting to reconnect WebSocket...');
        _connectWebSocket();
      }
    });
  }

  @override
  void dispose() {
    _isDisposed = true;
    _wsSubscription?.cancel();
    _wsService.disconnect();
    super.dispose();
  }
}
