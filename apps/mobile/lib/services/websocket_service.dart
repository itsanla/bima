import 'dart:convert';
import 'package:web_socket_channel/web_socket_channel.dart';
import '../config/api_config.dart';

/// Service untuk komunikasi WebSocket (real-time).
class WebSocketService {
  WebSocketChannel? _channel;

  /// Membuka koneksi WebSocket ke endpoint tertentu.
  void connect(String endpoint) {
    if (_channel != null) return; // Sudah terkoneksi

    final wsUrl = Uri.parse('${ApiConfig.wsBaseUrl}$endpoint');
    _channel = WebSocketChannel.connect(wsUrl);
  }

  /// Mendengarkan pesan dari server (Stream).
  Stream<dynamic>? get stream => _channel?.stream;

  /// Mengirim pesan (dalam bentuk JSON string) ke server.
  void sendMessage(Map<String, dynamic> data) {
    if (_channel != null) {
      _channel!.sink.add(jsonEncode(data));
    }
  }

  /// Menutup koneksi WebSocket.
  void disconnect() {
    _channel?.sink.close();
    _channel = null;
  }
}
