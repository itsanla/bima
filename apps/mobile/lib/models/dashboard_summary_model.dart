class DashboardSummaryModel {
  final int totalDevices;
  final int onlineDevices;
  final int offlineDevices;
  final int totalRecordsToday;

  DashboardSummaryModel({
    required this.totalDevices,
    required this.onlineDevices,
    required this.offlineDevices,
    required this.totalRecordsToday,
  });

  factory DashboardSummaryModel.fromJson(Map<String, dynamic> json) {
    return DashboardSummaryModel(
      totalDevices: json['totalDevices'] ?? 0,
      onlineDevices: json['onlineCount'] ?? 0,
      offlineDevices: json['offlineCount'] ?? 0,
      totalRecordsToday: json['todayRecords'] ?? 0,
    );
  }
}
