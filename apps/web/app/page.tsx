import type { Metadata } from 'next';
import IotTestMonitor from './_components/IotTestMonitor';

export const metadata: Metadata = {
  title: 'Bima - Live IoT Test Monitor',
  description: 'Bima Live IoT Test Monitor',
};

export default function Page() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Live IoT Test Monitor</h1>
        <p className="text-gray-600 mb-8">
          Monitor koneksi WebSocket (WSS/WS) dan HTTP/HTTPS perangkat IoT secara real-time.
        </p>
        <IotTestMonitor />
      </div>
    </main>
  );
}
