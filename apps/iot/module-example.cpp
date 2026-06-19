#define TINY_GSM_MODEM_SIM800

#include <TinyGsmClient.h>
#include <HardwareSerial.h>

HardwareSerial SerialAT(2);

TinyGsm modem(SerialAT);
TinyGsmClientSecure client(modem);

const char apn[] = "internet";

void setup() {

  Serial.begin(115200);

  SerialAT.begin(9600, SERIAL_8N1, 16, 17);

  modem.restart();

  Serial.println("Info Modem:");
  Serial.println(modem.getModemInfo());

  if (!modem.gprsConnect(apn, "", "")) {
    Serial.println("GPRS gagal");
    return;
  }

  Serial.println("Menunggu jaringan...");
  if (!modem.waitForNetwork()) {
    Serial.println("Jaringan tidak ditemukan");
    return;
  }

Serial.println("Jaringan ditemukan");

  Serial.println("GPRS sukses");

  if (!client.connect("bima.anla.works", 443)) {
    Serial.println("SSL gagal");
    return;
  }

  Serial.println("SSL terhubung");

  client.println("GET /api HTTP/1.1");
  client.println("Host: bima.anla.works");
  client.println("Connection: close");
  client.println();
}

void loop() {

  while (client.available()) {
    Serial.write(client.read());
  }
}
ini codingan nya baru buat ngetes gsm nya sih bg