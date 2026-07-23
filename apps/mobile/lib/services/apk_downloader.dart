import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';

class ApkDownloader {
  /// Downloads an APK from the given [url] and reports progress through [onProgress].
  /// Returns the absolute path to the downloaded APK file.
  Future<String?> downloadApk(String url, {required Function(double) onProgress}) async {
    try {
      final client = http.Client();
      final request = http.Request('GET', Uri.parse(url));
      final response = await client.send(request);

      if (response.statusCode != 200) {
        throw Exception('Failed to download APK. Status code: ${response.statusCode}');
      }

      final contentLength = response.contentLength ?? 0;
      
      // Get temporary directory
      final tempDir = await getTemporaryDirectory();
      // Generate a unique filename or use a standard one
      final filePath = '${tempDir.path}/update.apk';
      final file = File(filePath);

      // Open a sink to write the file
      final sink = file.openWrite();
      
      int downloadedBytes = 0;

      await for (final chunk in response.stream) {
        sink.add(chunk);
        downloadedBytes += chunk.length;
        if (contentLength > 0) {
          final progress = downloadedBytes / contentLength;
          onProgress(progress);
        }
      }

      await sink.close();
      client.close();

      return filePath;
    } catch (e) {
      debugPrint('Error downloading APK: $e');
      return null;
    }
  }
}
