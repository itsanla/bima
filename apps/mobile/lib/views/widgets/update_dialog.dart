import 'package:flutter/material.dart';
import '../../services/apk_downloader.dart';
import '../../services/apk_installer.dart';
import '../../services/update_service.dart';

class UpdateDialog extends StatefulWidget {
  final UpdateInfo updateInfo;

  const UpdateDialog({super.key, required this.updateInfo});

  @override
  State<UpdateDialog> createState() => _UpdateDialogState();
}

class _UpdateDialogState extends State<UpdateDialog> {
  bool _isDownloading = false;
  double _progress = 0.0;
  String _statusMessage = '';

  final _apkDownloader = ApkDownloader();
  final _apkInstaller = ApkInstaller();

  Future<void> _startUpdate() async {
    setState(() {
      _isDownloading = true;
      _statusMessage = 'Downloading...';
    });

    final filePath = await _apkDownloader.downloadApk(
      widget.updateInfo.apkUrl,
      onProgress: (progress) {
        setState(() {
          _progress = progress;
        });
      },
    );

    if (filePath != null) {
      setState(() {
        _statusMessage = 'Installing...';
      });
      await _apkInstaller.installApk(filePath);
      
      // We don't hide the dialog if it's force update, but normally the app might get killed during install anyway
      if (!widget.updateInfo.forceUpdate) {
        if (mounted) {
          Navigator.of(context).pop();
        }
      } else {
        setState(() {
           _statusMessage = 'Please complete installation.';
           _isDownloading = false;
        });
      }
    } else {
      setState(() {
        _isDownloading = false;
        _statusMessage = 'Download failed.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: !widget.updateInfo.forceUpdate,
      child: AlertDialog(
        title: Text('Update Available'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Version ${widget.updateInfo.versionName} is available.'),
            const SizedBox(height: 8),
            const Text('Release Notes:', style: TextStyle(fontWeight: FontWeight.bold)),
            Text(widget.updateInfo.releaseNotes),
            if (_isDownloading || _statusMessage.isNotEmpty) ...[
              const SizedBox(height: 16),
              if (_isDownloading) LinearProgressIndicator(value: _progress),
              const SizedBox(height: 8),
              Text(_statusMessage, style: const TextStyle(fontSize: 12)),
            ],
          ],
        ),
        actions: [
          if (!widget.updateInfo.forceUpdate && !_isDownloading)
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Nanti'),
            ),
          if (!_isDownloading)
            ElevatedButton(
              onPressed: _startUpdate,
              child: const Text('Update Sekarang'),
            ),
        ],
      ),
    );
  }
}
