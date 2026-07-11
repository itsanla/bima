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

  const renderTable = (title: string, data: IotData | null, color: string) => {
    if (!data) return null;
    return (
      <div className="col-12 col-md-6 mb-4">
        <div className={`card shadow-sm border-${color}`} style={{ borderRadius: '12px', overflow: 'hidden', border: `2px solid var(--bs-${color})` }}>
          <div className={`card-header text-white font-weight-bold p-3`} style={{ backgroundColor: color === 'success' ? '#28a745' : '#007bff' }}>
            <h5 className="mb-0 text-white m-0" style={{ fontSize: '18px' }}>{title}</h5>
          </div>
          <div className="card-body p-0">
            <table className="table table-striped table-hover mb-0">
              <tbody>
                <tr><th className="pl-3">Session ID</th><td>{data.sessionId || data.session}</td></tr>
                <tr><th className="pl-3">Suhu</th><td><span className="badge bg-warning text-dark p-2" style={{ fontSize: '14px' }}>{data.suhu} &deg;C</span></td></tr>
                <tr><th className="pl-3">Timer</th><td>{data.timer}</td></tr>
                <tr><th className="pl-3">API Status</th><td>{data.api}</td></tr>
                <tr><th className="pl-3">Mesin Status</th><td>{data.status}</td></tr>
                <tr><th className="pl-3">Air Habis</th><td>{data.air_habis ? 'Ya ⚠️' : 'Tidak ✅'}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="iot-test-monitor" className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-12 text-center mb-5">
            <h2 className="mb-2 font-weight-bold" style={{ color: '#333' }}>📡 Live IoT Test Monitor</h2>
            <p className="text-muted" style={{ fontSize: '16px' }}>
              Status Koneksi Server: 
              <span 
                className={`badge ml-2 p-2 ${isConnected ? 'bg-success' : 'bg-danger'}`} 
                style={{ marginLeft: '10px', color: 'white', borderRadius: '8px' }}
              >
                {isConnected ? 'TERHUBUNG' : 'TERPUTUS'}
              </span>
            </p>
            <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '14px', color: '#666' }}>
              Alat pengujian tim IoT. Tabel hanya akan muncul saat ada data masuk dan akan otomatis hilang jika tidak ada data baru dalam 10 detik terakhir.
            </p>
          </div>
        </div>
        <div className="row justify-content-center">
          {!wsData && !httpData ? (
             <div className="col-12 text-center text-muted my-5">
               <i className="fas fa-spinner fa-spin fa-3x mb-3" style={{ opacity: 0.3 }}></i>
               <h5>Menunggu data dari alat IoT...</h5>
             </div>
          ) : (
             <>
               {renderTable('🟢 Live Data (WebSocket)', wsData, 'success')}
               {renderTable('🔵 Live Data (HTTP POST)', httpData, 'primary')}
             </>
          )}
        </div>
      </div>
    </section>
  );
}
