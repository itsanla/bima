import 'package:flutter/foundation.dart';
import 'package:shorebird_code_push/shorebird_code_push.dart';

class PatchService {
  final _shorebirdUpdater = ShorebirdUpdater();

  /// Checks for a Shorebird patch and applies it if available.
  Future<void> checkAndApplyPatch() async {
    try {
      final status = await _shorebirdUpdater.checkForUpdate();
      if (status == UpdateStatus.outdated) {
        debugPrint('Shorebird patch available. Downloading...');
        await _shorebirdUpdater.update();
        debugPrint('Shorebird patch downloaded. It will be applied on next restart.');
      } else {
        debugPrint('No Shorebird patch available. Status: $status');
      }
    } catch (e) {
      debugPrint('Error checking/applying Shorebird patch: $e');
    }
  }
}
