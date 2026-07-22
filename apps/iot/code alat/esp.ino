#include <SPI.h>
#include <MAX6675.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <WiFi.h>
#include <ArduinoWebsockets.h>
#include <time.h>

String sessionId = "";
unsigned long lastSend = 0;
unsigned long lastNetworkCheck = 0;

bool wifiConnected = false;
bool wsConnected = false;

using namespace websockets;
WebsocketsClient client;

const char* ssid = "4G-MIFI-105";
const char* password = "1234567890";

const char* WS_URL = "ws://187.127.121.123:8081/";

// ================= LCD =================
LiquidCrystal_I2C lcd(0x27, 16, 2);

// ================= MAX6675 =================
const int thermoCS = 5;
MAX6675 thermoCouple(thermoCS, &SPI);

// ================= FLAME SENSOR =================
const int flamePin = 4;

// ================= BUZZER =================
const int buzzerPin = 15;

// ================= PUSH BUTTON =================
const int buttonMute = 13;
const int buttonReset = 33;

// ================= TIMER =================
bool timerStarted = false;
bool timerPaused = false;

unsigned long startTime = 0;
unsigned long pauseStart = 0;
unsigned long totalPauseTime = 0;

// ================= ALARM =================
bool alarmMute = false;

bool alarmAirHabis = false;

// ================= LED MERAH =================
const int ledMerah = 26;

void connectWiFi() {

  Serial.print("Menghubungkan WiFi");

  WiFi.begin(ssid, password);

  unsigned long start = millis();

  while (WiFi.status() != WL_CONNECTED && millis() - start < 15000) {

    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {

    Serial.println();
    Serial.println("WiFi Connected");
    Serial.println(WiFi.localIP());

    if (!wifiConnected) {
      wifiConnected = true;
    }

  } else {

    Serial.println();
    Serial.println("Gagal connect WiFi");

    if (wifiConnected) {
      wifiConnected = false;
    }
  }
}

void cekWiFi() {

  if (WiFi.status() == WL_CONNECTED) {

    if (!wifiConnected) {
      wifiConnected = true;
    }

    return;
  }

  Serial.println("WiFi Terputus");

  if (wifiConnected) {
    wifiConnected = false;
  }

  WiFi.disconnect();
  WiFi.begin(ssid, password);

  unsigned long start = millis();

  while (WiFi.status() != WL_CONNECTED && millis() - start < 15000) {

    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {

    Serial.println();
    Serial.println("WiFi Connected Kembali");

    if (!wifiConnected) {
      wifiConnected = true;
    }

    connectWebSocket();

  } else {

    Serial.println();
    Serial.println("Reconnect gagal");
  }
}

void connectWebSocket() {

  if (WiFi.status() != WL_CONNECTED)
    return;

  client.close();

  Serial.println("Socket ditutup");

  delay(100);
  Serial.println("Menghubungkan WebSocket...");


  if (client.connect(WS_URL)) {

    Serial.println("WebSocket Connected");

    // hanya tampil jika sebelumnya belum connect
    if (!wsConnected) {
      wsConnected = true;
    }

  } else {

    Serial.println("WebSocket Failed");

    // hanya tampil jika sebelumnya connect
    if (wsConnected) {
      wsConnected = false;
    }
  }
}

void setup() {
  pinMode(ledMerah, OUTPUT);
  digitalWrite(ledMerah, LOW);

  Serial.begin(115200);
  delay(1000);

  lcd.init();
  lcd.backlight();

  lcd.setCursor(0, 0);
  lcd.print("MONITORING");
  lcd.setCursor(0, 1);
  lcd.print("PENGUKUSAN");

  delay(2000);
  lcd.clear();
  connectWiFi();

  if (WiFi.status() == WL_CONNECTED) {

    lcd.clear();

    lcd.setCursor(0, 0);
    lcd.print("WIFI TERHUBUNG");

    lcd.setCursor(0, 1);
    lcd.print(WiFi.localIP());

    delay(2000);
  }


  configTime(0, 0, "pool.ntp.org");

  unsigned long start = millis();

  time_t now = time(nullptr);

  while (now < 100000 && millis() - start < 10000) {

    delay(500);

    now = time(nullptr);
  }

  if (now >= 100000) {

    sessionId = String((unsigned long)now);

  } else {

    sessionId = String((uint32_t)millis());

    Serial.println("NTP gagal");
  }

  Serial.print("Session : ");
  Serial.println(sessionId);

  client.onMessage([](WebsocketsMessage message) {
    Serial.println("==========");

    Serial.print("Server : ");

    Serial.println(message.data());

    Serial.println("==========");
  });

  client.onEvent([](WebsocketsEvent event, String data) {
    Serial.print("Event : ");
    Serial.println((int)event);
    switch (event) {
      case WebsocketsEvent::ConnectionOpened:

        Serial.println("WebSocket Opened");

        if (!wsConnected) {
          wsConnected = true;
        }

        break;

      case WebsocketsEvent::ConnectionClosed:

        Serial.println("WebSocket Closed");

        if (wsConnected) {
          wsConnected = false;
        }

        break;

      case WebsocketsEvent::GotPing:
        Serial.println("Ping");
        break;

      case WebsocketsEvent::GotPong:
        Serial.println("Pong");
        break;
    }
    if (data.length() > 0) {

      Serial.print("Event Data : ");

      Serial.println(data);
    }
  });
  if (WiFi.status() == WL_CONNECTED) {
    connectWebSocket();
  }

  // SPI MAX6675
  SPI.begin(18, 19, 23, 5);
  thermoCouple.begin();

  pinMode(flamePin, INPUT);

  pinMode(buzzerPin, OUTPUT);

  pinMode(buttonMute, INPUT_PULLUP);
  pinMode(buttonReset, INPUT_PULLUP);

  digitalWrite(buzzerPin, LOW);

  // LCD
}

void kirimDataWiFi(float suhu,
                   String timerStr,
                   bool apiMenyala,
                   bool airHabis,
                   String status) {
  if (!client.available()) {
    Serial.println("WebSocket belum terhubung");
    return;
  }

  String json = "{";
  json += "\"session\":\"" + sessionId + "\",";
  json += "\"suhu\":" + String(suhu, 1) + ",";
  json += "\"timer\":\"" + timerStr + "\",";
  json += "\"api\":\"" + String(apiMenyala ? "ON" : "OFF") + "\",";
  json += "\"status\":\"" + status + "\",";
  json += "\"air_habis\":" + String(airHabis ? "true" : "false");
  json += "}";

  Serial.println("=== JSON DIKIRIM ===");
  Serial.println(json);

  bool ok = client.send(json);
  if (ok) {
    client.poll();
  }

  Serial.print("Send Result : ");
  Serial.println(ok);

  if (ok) {

    Serial.println("Data terkirim");

  } else {

    Serial.println("Gagal mengirim");
  }
}
void loop()

{
  client.poll();

  static unsigned long lastReconnect = 0;

  if (WiFi.status() == WL_CONNECTED) {

    if (!wsConnected) {

      if (millis() - lastReconnect >= 5000) {

        lastReconnect = millis();

        connectWebSocket();
      }
    }
  }

  // ================= BACA SUHU =================
  thermoCouple.read();
  float suhu = thermoCouple.getCelsius();

  // ================= DETEKSI AIR HABIS =================
  if (timerStarted && suhu >= 115) {
    alarmAirHabis = true;
  }

  // ================= START TIMER =================
  if (suhu >= 95 && !timerStarted) {
    timerStarted = true;
    startTime = millis();

    Serial.println("STOPWATCH DIMULAI");
  }

  // ================= BACA FLAME =================
  int flame = digitalRead(flamePin);

  // ================= TOMBOL MUTE =================
  if (digitalRead(buttonMute) == LOW) {
    alarmMute = true;
    digitalWrite(buzzerPin, LOW);

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("ALARM DIMUTE");

    delay(500);

    while (digitalRead(buttonMute) == LOW)
      ;

    lcd.clear();
  }

  // ================= TOMBOL RESET =================
  if (digitalRead(buttonReset) == LOW) {
    timerStarted = false;
    timerPaused = false;

    startTime = 0;
    pauseStart = 0;
    totalPauseTime = 0;

    alarmMute = false;
    alarmAirHabis = false;

    digitalWrite(buzzerPin, LOW);
    digitalWrite(ledMerah, LOW);

    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("SYSTEM RESET");
    lcd.setCursor(0, 1);
    lcd.print("MENUNGGU 95C");

    delay(1000);

    while (digitalRead(buttonReset) == LOW)
      ;

    lcd.clear();
  }

  // ================= LOGIKA ALARM =================
  if (timerStarted) {
    if (flame == LOW)  // API MENYALA
    {
      digitalWrite(buzzerPin, LOW);
      digitalWrite(ledMerah, LOW);

      alarmMute = false;

      // lanjut stopwatch
      if (timerPaused) {
        totalPauseTime += millis() - pauseStart;
        timerPaused = false;

        Serial.println("STOPWATCH LANJUT");
      }
    } else  // API PADAM
    {
      // LED tetap menyala selama api padam
      digitalWrite(ledMerah, HIGH);

      // pause stopwatch
      if (!timerPaused) {
        pauseStart = millis();
        timerPaused = true;

        Serial.println("STOPWATCH PAUSE");
      }

      // buzzer hanya bunyi jika belum dimute
      if (!alarmMute) {
        digitalWrite(buzzerPin, HIGH);
      } else {
        digitalWrite(buzzerPin, LOW);
      }
    }
  } else {
    digitalWrite(buzzerPin, LOW);
    digitalWrite(ledMerah, LOW);
  }
  // ================= HITUNG TIMER =================
  unsigned long elapsed = 0;

  if (timerStarted) {
    if (timerPaused) {
      elapsed = (pauseStart - startTime - totalPauseTime) / 1000;
    } else {
      elapsed = (millis() - startTime - totalPauseTime) / 1000;
    }
  }

  int jam = elapsed / 3600;
  int menit = (elapsed % 3600) / 60;
  int detik = elapsed % 60;

  // ================= LCD =================

  if (WiFi.status() != WL_CONNECTED) {

    lcd.setCursor(0, 0);
    lcd.print("                ");
    lcd.setCursor(0, 1);
    lcd.print("                ");

    lcd.setCursor(0, 0);
    lcd.print("WIFI");

    lcd.setCursor(0, 1);
    lcd.print("MENGHUBUNGKAN");
  }

  else if (!wsConnected) {

    lcd.setCursor(0, 0);
    lcd.print("                ");
    lcd.setCursor(0, 1);
    lcd.print("                ");

    lcd.setCursor(0, 0);
    lcd.print("WEBSOCKET");

    lcd.setCursor(0, 1);
    lcd.print("MENGHUBUNGKAN");
  }

  else {

    if (alarmAirHabis) {
      digitalWrite(ledMerah, HIGH);

      if (!alarmMute) {
        digitalWrite(buzzerPin, HIGH);
      }

      lcd.setCursor(0, 0);
      lcd.print("!!!AIR HABIS!!!");

      lcd.setCursor(0, 1);
      lcd.print("ISI ULANG AIR  ");

    } else {

      lcd.setCursor(0, 0);
      lcd.print("                ");

      lcd.setCursor(0, 0);
      lcd.print("T:");
      lcd.print(suhu, 1);
      lcd.print("C");

      if (flame == LOW) {
        lcd.setCursor(12, 0);
        lcd.print("ON ");
      } else {
        lcd.setCursor(12, 0);
        lcd.print("OFF");
      }

      lcd.setCursor(0, 1);
      lcd.print("                ");

      lcd.setCursor(0, 1);

      if (jam < 10) lcd.print("0");
      lcd.print(jam);
      lcd.print(":");

      if (menit < 10) lcd.print("0");
      lcd.print(menit);
      lcd.print(":");

      if (detik < 10) lcd.print("0");
      lcd.print(detik);

      lcd.print(" ");

      if (!timerStarted) {
        lcd.print("---");
      } else if (timerPaused) {
        lcd.print("PAU");
      } else {
        lcd.print("RUN");
      }
    }
  }

  // ================= SERIAL DEBUG =================
  Serial.print("Suhu=");
  Serial.print(suhu);

  Serial.print(" | Api=");
  Serial.print(flame == LOW ? "ON" : "OFF");

  Serial.print(" | Timer=");
  Serial.print(jam);
  Serial.print(":");
  Serial.print(menit);
  Serial.print(":");
  Serial.print(detik);

  Serial.print(" | Pause=");
  Serial.print(timerPaused);

  Serial.print(" | Mute=");
  Serial.println(alarmMute);

  if (millis() - lastSend >= 1000) {
    lastSend = millis();

    char timerStr[20];

    sprintf(timerStr,
            "%02d:%02d:%02d",
            jam,
            menit,
            detik);

    String statusProses;

    if (alarmAirHabis) {
      statusProses = "AIR_HABIS";
    } else if (timerPaused) {
      statusProses = "PAUSE";
    } else if (timerStarted) {
      statusProses = "RUN";
    } else {
      statusProses = "READY";
    }

    if (millis() - lastNetworkCheck > 5000) {
      lastNetworkCheck = millis();
      cekWiFi();
    }

    kirimDataWiFi(
      suhu,
      String(timerStr),
      flame == LOW,
      alarmAirHabis,
      statusProses);
  }

  delay(100);
}
