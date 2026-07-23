import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:package_info_plus/package_info_plus.dart';
import '../config/api_config.dart';
import 'api_service.dart';

class UpdateInfo {
  final String versionName;
  final int buildNumber;
  final String apkUrl;
  final String releaseNotes;
  final bool forceUpdate;

  UpdateInfo({
    required this.versionName,
    required this.buildNumber,
    required this.apkUrl,
    required this.releaseNotes,
    required this.forceUpdate,
  });

  factory UpdateInfo.fromJson(Map<String, dynamic> json) {
    return UpdateInfo(
      versionName: json['version_name'] ?? '',
      buildNumber: json['build_number'] ?? 0,
      apkUrl: json['apk_url'] ?? '',
      releaseNotes: json['release_notes'] ?? '',
      forceUpdate: json['force_update'] ?? false,
    );
  }
}

class UpdateService {
  final ApiService _apiService;

  UpdateService({ApiService? apiService}) : _apiService = apiService ?? ApiService();

  /// 4.1.2 HTTP GET ke /api/v1/app/update, parse JSON response
  Future<UpdateInfo?> checkForUpdate() async {
    try {
      final response = await _apiService.get('/api/v1/app/update', customBaseUrl: ApiConfig.updateBaseUrl);
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data != null) {
          // Assuming the data is wrapped in a 'data' field or is the direct object
          // Let's handle both cases just in case, but usually our backend returns { status: 'success', data: { ... } }
          // Let's assume standard { version_name, ... } directly as per prompt, but if wrapped, we will adjust.
          // Wait, phase 1 docs show standard response structure: { status: 'success', data: { version_name: '1.0.0', ... } }
          // Let's check `data['data']` if it exists.
          final updateData = data['data'] ?? data;
          return UpdateInfo.fromJson(updateData);
        }
      }
      return null;
    } catch (e) {
      debugPrint('Error checking for update: $e');
      return null;
    }
  }

  /// 4.1.3 Gunakan package_info_plus untuk mendapatkan build number saat ini
  Future<int> getCurrentBuildNumber() async {
    final PackageInfo packageInfo = await PackageInfo.fromPlatform();
    return int.tryParse(packageInfo.buildNumber) ?? 0;
  }

  /// 4.1.4 Bandingkan build_number dari server dengan getCurrentBuildNumber()
  Future<bool> isUpdateAvailable(UpdateInfo serverUpdateInfo) async {
    final currentBuild = await getCurrentBuildNumber();
    return serverUpdateInfo.buildNumber > currentBuild;
  }
}
