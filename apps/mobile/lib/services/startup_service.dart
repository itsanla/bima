import 'patch_service.dart';
import 'update_service.dart';

class StartupService {
  final PatchService _patchService = PatchService();
  final UpdateService _updateService = UpdateService();

  /// Runs the startup sequence:
  /// 1. Checks and applies Shorebird patches.
  /// 2. Checks backend for new APK update.
  /// Returns [UpdateInfo] if an update is available, null otherwise.
  Future<UpdateInfo?> runStartupSequence() async {
    // Step 1 & 2: Check and wait for Shorebird patch
    await _patchService.checkAndApplyPatch();

    // Step 3: Check update from API
    final updateInfo = await _updateService.checkForUpdate();
    if (updateInfo != null) {
      final isAvailable = await _updateService.isUpdateAvailable(updateInfo);
      if (isAvailable) {
        // Step 4 is to show the dialog, we return the info so UI can show it.
        return updateInfo;
      }
    }
    
    return null;
  }
}
