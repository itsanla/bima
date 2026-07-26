import { Server, IncomingMessage } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import logger from 'jet-logger';
import prisma from '../db/prisma';
import { NAMA_COOKIE, penggunaDariToken } from '../lib/auth';
import { bacaCookie } from '../lib/http';

interface IExtWebSocket extends WebSocket {
  isAlive: boolean;
  /** Hanya klien yang cookie sesinya sah yang menerima siaran data alat.
   *  Modul IoT tidak pernah butuh menerima siaran, ia hanya mengirim, jadi
   *  pembatasan ini tidak menyentuh firmware sama sekali. */
  bolehTerima: boolean;
}

class WsServer {
  private wss: WebSocketServer | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private persistInterval: NodeJS.Timeout | null = null;
  private pendingLogs: Map<string | null, Record<string, unknown>> = new Map();
  private readonly logFlushIntervalMs = Number(process.env.IOT_LOG_FLUSH_INTERVAL_MS) || 30000;

  public initialize(server: Server): void {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      const extWs = ws as IExtWebSocket;
      extWs.isAlive = true;
      extWs.bolehTerima = false;

      // Cookie sesi ikut terkirim saat jabat tangan karena web dan API berbagi
      // domain induk yang sama, jadi tidak perlu pesan auth terpisah.
      const token = bacaCookie(req.headers.cookie)[NAMA_COOKIE];
      void penggunaDariToken(token)
        .then((pengguna) => {
          if (pengguna) {
            extWs.bolehTerima = true;
            logger.info(`[WebSocket] Klien masuk sebagai ${pengguna.email}`);
          } else {
            logger.info('[WebSocket] Klien tanpa sesi (mode kirim saja)');
          }
        })
        .catch((err: Error) => {
          logger.err(`[WebSocket] Gagal memeriksa sesi: ${err.message}`);
        });

      extWs.on('pong', () => {
        extWs.isAlive = true;
      });

      extWs.on('message', async (message: Buffer | string) => {
        try {
          const parsed = JSON.parse(message.toString()) as Record<string, unknown>;
          const messageType = typeof parsed.type === 'string' ? parsed.type : 'device_update';

          if (messageType === 'device_update') {
            const { type, ...payload } = parsed;

            logger.info(`[WebSocket] Received device_update: ${JSON.stringify(payload)}`);

            const sessionId = (payload.session || payload.id) ? String(payload.session || payload.id) : null;
            this.pendingLogs.set(sessionId, payload);

            extWs.send(JSON.stringify({
              type: 'ack',
              success: true,
              message: 'Update received'
            }));

            this.broadcastToDashboard({
              type: 'dashboard_update',
              data: payload
            });
          }
        } catch (err: unknown) {
          const error = err as Error;
          logger.err(`[WebSocket] Error processing message: ${error.message}`);
          extWs.send(JSON.stringify({
            type: 'error',
            success: false,
            message: error.message
          }));
        }
      });

      extWs.on('close', () => {
        logger.info('[WebSocket] Client disconnected');
      });

      extWs.on('error', (error: Error) => {
        logger.err(`[WebSocket] Client error: ${error.message}`);
      });
    });

    this.pingInterval = setInterval(() => {
      if (!this.wss) return;
      this.wss.clients.forEach((client) => {
        const extClient = client as IExtWebSocket;
        if (extClient.isAlive === false) {
          logger.info('[WebSocket] Terminating inactive client');
          return extClient.terminate();
        }
        extClient.isAlive = false;
        extClient.ping();
      });
    }, 30000);

    this.persistInterval = setInterval(() => {
      this.flushPendingLogs();
    }, this.logFlushIntervalMs);

    this.wss.on('close', () => {
      if (this.pingInterval) {
        clearInterval(this.pingInterval);
      }
      if (this.persistInterval) {
        clearInterval(this.persistInterval);
      }
    });
  }

  private async flushPendingLogs(): Promise<void> {
    if (this.pendingLogs.size === 0) return;

    const entries = Array.from(this.pendingLogs.entries());
    this.pendingLogs.clear();

    for (const [sessionId, payload] of entries) {
      try {
        await prisma.iotLog.create({
          data: {
            sessionId,
            suhu: Number(payload.suhu) || 0,
            timer: typeof payload.timer === 'string' ? payload.timer : "00:00:00",
            api: typeof payload.api === 'string' ? payload.api : "OFF",
            status: typeof payload.status === 'string' ? payload.status : "UNKNOWN",
            air_habis: Boolean(payload.air_habis)
          }
        });
      } catch (dbErr: any) {
        logger.err(`[WebSocket] DB Error while flushing session ${sessionId}: ${dbErr.message}`);
      }
    }

    logger.info(`[WebSocket] Flushed ${entries.length} session(s) to DB`);
  }

  public broadcastToDashboard(data: Record<string, unknown>): void {
    if (!this.wss) return;

    const message = JSON.stringify(data);
    this.wss.clients.forEach((client) => {
      const extClient = client as IExtWebSocket;
      if (client.readyState === WebSocket.OPEN && extClient.bolehTerima) {
        client.send(message);
      }
    });
  }
}

export default new WsServer();
