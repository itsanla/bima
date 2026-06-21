import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/api_config.dart';

/// Service utama untuk komunikasi HTTP ke backend.
/// Semua request API melewati class ini.
class ApiService {
  final http.Client _client;

  ApiService({http.Client? client}) : _client = client ?? http.Client();

  Map<String, String> get _headers => {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

  /// GET request.
  Future<http.Response> get(String endpoint) {
    final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint');
    return _client.get(uri, headers: _headers);
  }

  /// POST request.
  Future<http.Response> post(String endpoint, {Map<String, dynamic>? body}) {
    final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint');
    return _client.post(uri, headers: _headers, body: jsonEncode(body));
  }

  /// PUT request.
  Future<http.Response> put(String endpoint, {Map<String, dynamic>? body}) {
    final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint');
    return _client.put(uri, headers: _headers, body: jsonEncode(body));
  }

  /// DELETE request.
  Future<http.Response> delete(String endpoint) {
    final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint');
    return _client.delete(uri, headers: _headers);
  }
}
