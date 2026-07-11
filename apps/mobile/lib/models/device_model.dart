class DeviceModel {
  final String deviceId;
  final bool statusApi;
  final double temperature;
  final int timer;
  final bool isOnline;
  final DateTime? lastActive;

  DeviceModel({
    required this.deviceId,
    required this.statusApi,
    required this.temperature,
    required this.timer,
    this.isOnline = false,
    this.lastActive,
  });

  factory DeviceModel.fromJson(Map<String, dynamic> json) {
    double parseDouble(dynamic value) {
      if (value == null) return 0.0;
      if (value is double) return value;
      if (value is int) return value.toDouble();
      if (value is String) return double.tryParse(value) ?? 0.0;
      return 0.0;
    }

    return DeviceModel(
      deviceId: json['deviceId']?.toString() ?? '',
      statusApi: json['statusApi'] == true || json['statusApi'] == 'true',
      temperature: parseDouble(json['temperature']),
      timer: int.tryParse(json['timer']?.toString() ?? '0') ?? 0,
      isOnline: json['isOnline'] == true || json['isOnline'] == 'true',
      lastActive: json['lastActive'] != null ? DateTime.tryParse(json['lastActive'].toString()) : null,
    );
  }

  DeviceModel copyWith({
    String? deviceId,
    bool? statusApi,
    double? temperature,
    int? timer,
    bool? isOnline,
    DateTime? lastActive,
  }) {
    return DeviceModel(
      deviceId: deviceId ?? this.deviceId,
      statusApi: statusApi ?? this.statusApi,
      temperature: temperature ?? this.temperature,
      timer: timer ?? this.timer,
      isOnline: isOnline ?? this.isOnline,
      lastActive: lastActive ?? this.lastActive,
    );
  }
}
