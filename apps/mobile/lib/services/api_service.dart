import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

/// Service utama untuk komunikasi HTTP ke backend.
/// Semua request API melewati class ini.
class ApiService {
  final http.Client _client;

  ApiService({http.Client? client}) : _client = client ?? http.Client();

  final Duration _timeout = const Duration(seconds: 10);

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

  /// GET request.
  Future<http.Response> get(String endpoint) {
    final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint');
    return _client.get(uri, headers: _headers).timeout(_timeout);
  }

  /// POST request.
  Future<http.Response> post(String endpoint, {Map<String, dynamic>? body}) {
    final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint');
    return _client.post(uri, headers: _headers, body: jsonEncode(body)).timeout(_timeout);
  }

  /// PUT request.
  Future<http.Response> put(String endpoint, {Map<String, dynamic>? body}) {
    final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint');
    return _client.put(uri, headers: _headers, body: jsonEncode(body)).timeout(_timeout);
  }

  /// DELETE request.
  Future<http.Response> delete(String endpoint) {
    final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint');
    return _client.delete(uri, headers: _headers).timeout(_timeout);
  }
}
