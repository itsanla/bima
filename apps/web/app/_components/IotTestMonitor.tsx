'use client';

import { useEffect, useState, useRef } from 'react';

type IotData = {
  session?: string;
  sessionId?: string;
  suhu: number;
  timer: string;
  api: string;
  status: string;
  air_habis: boolean;
};

export default function IotTestMonitor() {
  const [wsData, setWsData] = useState<IotData | null>(null);
  const [httpData, setHttpData] = useState<IotData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const wsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const httpTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Use environment variable or default to the production WS URL
    const wsUrl = process.env.NEXT_PUBLIC_API_URL 
      ? process.env.NEXT_PUBLIC_API_URL.replace('http', 'ws') 
      : 'wss://api.steamlog.cloud/';
      
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      console.log('[TestMonitor] WebSocket Connected to', wsUrl);
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        
        // Data dari koneksi WSS
        if (parsed.type === 'dashboard_update' && parsed.data) {
          setWsData(parsed.data);
          
          if (wsTimeoutRef.current) clearTimeout(wsTimeoutRef.current);
          wsTimeoutRef.current = setTimeout(() => {
            setWsData(null);
          }, 10000);
        } 
        // Data dari koneksi HTTPS/HTTP POST
        else if (parsed.type === 'http_dashboard_update' && parsed.data) {
          setHttpData(parsed.data);
          
          if (httpTimeoutRef.current) clearTimeout(httpTimeoutRef.current);
          httpTimeoutRef.current = setTimeout(() => {
            setHttpData(null);
          }, 10000);
        }
      } catch (e) {
        console.error('Error parsing WS message', e);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('[TestMonitor] WebSocket Disconnected');
    };

    return () => {
      ws.close();
      if (wsTimeoutRef.current) clearTimeout(wsTimeoutRef.current);
      if (httpTimeoutRef.current) clearTimeout(httpTimeoutRef.current);
    };
  }, []);

  const renderTable = (title: string, data: IotData | null, colorClass: string, headerClass: string) => {
    if (!data) return null;
    return (
      <div className="w-full md:w-1/2 p-4">
        <div className={`rounded-xl shadow-lg border-2 ${colorClass} overflow-hidden bg-white`}>
          <div className={`p-4 ${headerClass} text-white font-bold text-lg`}>
            {title}
          </div>
          <div className="p-0">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <th className="py-3 px-4 font-semibold text-gray-700 w-1/3">Session ID</th>
                  <td className="py-3 px-4 text-gray-600 break-all">{data.sessionId || data.session}</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <th className="py-3 px-4 font-semibold text-gray-700">Suhu</th>
                  <td className="py-3 px-4">
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold shadow-sm">
                      {data.suhu} &deg;C
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <th className="py-3 px-4 font-semibold text-gray-700">Timer</th>
                  <td className="py-3 px-4 text-gray-600">{data.timer}</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <th className="py-3 px-4 font-semibold text-gray-700">API Status</th>
                  <td className="py-3 px-4 text-gray-600">{data.api}</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <th className="py-3 px-4 font-semibold text-gray-700">Mesin Status</th>
                  <td className="py-3 px-4 text-gray-600">{data.status}</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <th className="py-3 px-4 font-semibold text-gray-700">Air Habis</th>
                  <td className="py-3 px-4">
                    {data.air_habis ? (
                      <span className="text-red-600 font-medium flex items-center gap-1">
                        Ya <span className="text-xl">⚠️</span>
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        Tidak <span className="text-xl">✅</span>
                      </span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="w-full">
      <div className="flex flex-col items-center">
        <div className="text-center mb-10 mt-6 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4 flex items-center justify-center gap-3">
            <span className="text-4xl">📡</span> Live IoT Test Monitor
          </h2>
          <div className="flex items-center justify-center gap-3 mb-4 text-lg">
            <span className="text-gray-600 font-medium">Status Koneksi Server:</span>
            <span 
              className={`px-4 py-1 rounded-full text-white font-bold text-sm shadow-sm transition-colors duration-300 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
            >
              {isConnected ? 'TERHUBUNG' : 'TERPUTUS'}
            </span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Alat pengujian tim IoT. Tabel hanya akan muncul saat ada data masuk dan akan otomatis hilang jika tidak ada data baru dalam 10 detik terakhir.
          </p>
        </div>

        <div className="flex flex-wrap justify-center w-full max-w-5xl">
          {!wsData && !httpData ? (
             <div className="w-full text-center py-16 flex flex-col items-center animate-pulse">
               <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-6"></div>
               <h5 className="text-xl text-gray-500 font-medium">Menunggu data dari alat IoT...</h5>
             </div>
          ) : (
             <div className="flex flex-col md:flex-row w-full justify-center gap-4">
               {renderTable('🟢 Live Data (WebSocket)', wsData, 'border-green-500', 'bg-green-600')}
               {renderTable('🔵 Live Data (HTTP POST)', httpData, 'border-blue-500', 'bg-blue-600')}
             </div>
          )}
        </div>
      </div>
    </section>
  );
}
