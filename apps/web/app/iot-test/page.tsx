import type { Metadata } from "next";
import IotTestMonitor from "../_components/IotTestMonitor";

export const metadata: Metadata = {
  title: "Steamlog - Live IoT Test Monitor",
  description:
    "Monitor koneksi WebSocket (WSS/WS) dan HTTP/HTTPS perangkat IoT secara real-time.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 p-4 font-sans text-gray-900 sm:p-8">
      <div className="w-full max-w-6xl">
        <a
          href="/"
          className="text-sm text-gray-500 underline underline-offset-4 hover:text-gray-900"
        >
          Kembali ke halaman utama
        </a>
        <h1 className="mt-6 mb-2 text-3xl font-bold text-gray-900">
          Live IoT Test Monitor
        </h1>
        <p className="mb-8 text-gray-600">
          Monitor koneksi WebSocket (WSS/WS) dan HTTP/HTTPS perangkat IoT secara
          real-time.
        </p>
        <IotTestMonitor />
      </div>
    </main>
  );
}
