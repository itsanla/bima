class DeviceModel {
  final String session;
  final String api;
  final double suhu;
  final String timer;
  final String status;
  final bool airHabis;
  final bool isOnline;
  final DateTime? lastActive;

  DeviceModel({
    required this.session,
    required this.api,
    required this.suhu,
    required this.timer,
    required this.status,
    required this.airHabis,
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
      session: json['session']?.toString() ?? '',
      api: json['api']?.toString() ?? 'OFF',
      suhu: parseDouble(json['suhu']),
      timer: json['timer']?.toString() ?? '00:00:00',
      status: json['status']?.toString() ?? 'IDLE',
      airHabis: json['air_habis'] == true || json['air_habis'] == 'true',
      isOnline: json['isOnline'] == true || json['isOnline'] == 'true',
      lastActive: json['lastActive'] != null ? DateTime.tryParse(json['lastActive'].toString()) : null,
    );
  }

  DeviceModel copyWith({
    String? session,
    String? api,
    double? suhu,
    String? timer,
    String? status,
    bool? airHabis,
    bool? isOnline,
    DateTime? lastActive,
  }) {
    return DeviceModel(
      session: session ?? this.session,
      api: api ?? this.api,
      suhu: suhu ?? this.suhu,
      timer: timer ?? this.timer,
      status: status ?? this.status,
      airHabis: airHabis ?? this.airHabis,
      isOnline: isOnline ?? this.isOnline,
      lastActive: lastActive ?? this.lastActive,
    );
  }
}
