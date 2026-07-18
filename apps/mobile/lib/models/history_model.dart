class HistoryModel {
  final String sessionId;
  final DateTime createdAt;

  HistoryModel({
    required this.sessionId,
    required this.createdAt,
  });

  factory HistoryModel.fromJson(Map<String, dynamic> json) {
    return HistoryModel(
      sessionId: json['sessionId']?.toString() ?? '',
      createdAt: json['createdAt'] != null 
          ? DateTime.tryParse(json['createdAt'].toString()) ?? DateTime.now() 
          : DateTime.now(),
    );
  }
}

class HistoryResponse {
  final int total;
  final int page;
  final int limit;
  final int totalPages;
  final List<HistoryModel> data;

  HistoryResponse({
    required this.total,
    required this.page,
    required this.limit,
    required this.totalPages,
    required this.data,
  });

  factory HistoryResponse.fromJson(Map<String, dynamic> json) {
    var dataList = json['data'] as List? ?? [];
    List<HistoryModel> historyList = dataList.map((e) => HistoryModel.fromJson(e)).toList();

    var pagination = json['pagination'] as Map<String, dynamic>? ?? {};

    return HistoryResponse(
      total: pagination['total'] ?? 0,
      page: pagination['page'] ?? 1,
      limit: pagination['limit'] ?? 10,
      totalPages: pagination['totalPages'] ?? 1,
      data: historyList,
    );
  }
}

class HistoryLogModel {
  final String id;
  final double suhu;
  final String timer;
  final String api;
  final String status;
  final bool airHabis;
  final DateTime createdAt;

  HistoryLogModel({
    required this.id,
    required this.suhu,
    required this.timer,
    required this.api,
    required this.status,
    required this.airHabis,
    required this.createdAt,
  });

  factory HistoryLogModel.fromJson(Map<String, dynamic> json) {
    double parseDouble(dynamic value) {
      if (value == null) return 0.0;
      if (value is double) return value;
      if (value is int) return value.toDouble();
      if (value is String) return double.tryParse(value) ?? 0.0;
      return 0.0;
    }

    return HistoryLogModel(
      id: json['id']?.toString() ?? '',
      suhu: parseDouble(json['suhu']),
      timer: json['timer']?.toString() ?? '00:00:00',
      api: json['api']?.toString() ?? 'OFF',
      status: json['status']?.toString() ?? 'IDLE',
      airHabis: json['air_habis'] == true || json['air_habis'] == 'true',
      createdAt: json['createdAt'] != null 
          ? DateTime.tryParse(json['createdAt'].toString()) ?? DateTime.now() 
          : DateTime.now(),
    );
  }
}

class HistoryDetailResponse {
  final String sessionId;
  final DateTime createdAt;
  final List<HistoryLogModel> history;
  final int total;
  final int page;
  final int limit;
  final int totalPages;

  HistoryDetailResponse({
    required this.sessionId,
    required this.createdAt,
    required this.history,
    required this.total,
    required this.page,
    required this.limit,
    required this.totalPages,
  });

  factory HistoryDetailResponse.fromJson(Map<String, dynamic> json) {
    var data = json['data'] as Map<String, dynamic>? ?? {};
    var historyListRaw = data['history'] as List? ?? [];
    List<HistoryLogModel> historyList = historyListRaw.map((e) => HistoryLogModel.fromJson(e)).toList();
    
    var pagination = json['pagination'] as Map<String, dynamic>? ?? {};

    return HistoryDetailResponse(
      sessionId: data['sessionId']?.toString() ?? '',
      createdAt: data['createdAt'] != null 
          ? DateTime.tryParse(data['createdAt'].toString()) ?? DateTime.now() 
          : DateTime.now(),
      history: historyList,
      total: pagination['total'] ?? 0,
      page: pagination['page'] ?? 1,
      limit: pagination['limit'] ?? 10,
      totalPages: pagination['totalPages'] ?? 1,
    );
  }
}
