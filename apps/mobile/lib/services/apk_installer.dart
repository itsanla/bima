import 'package:flutter/foundation.dart';
import 'package:open_filex/open_filex.dart';

class ApkInstaller {
  /// Opens the APK file using Android's default package installer.
  Future<void> installApk(String filePath) async {
    try {
      final result = await OpenFilex.open(
        filePath,
        type: 'application/vnd.android.package-archive',
      );
      debugPrint('Install result: ${result.message}');
    } catch (e) {
      debugPrint('Error installing APK: $e');
    }
  }
}
