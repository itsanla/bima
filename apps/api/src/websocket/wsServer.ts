import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import logger from 'jet-logger';
import prisma from '../db/prisma';

interface IExtWebSocket extends WebSocket {
  isAlive: boolean;
}

class WsServer {
  private wss: WebSocketServer | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private persistInterval: NodeJS.Timeout | null = null;
  private pendingLogs: Map<string | null, Record<string, unknown>> = new Map();

  public initialize(server: Server): void {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws: WebSocket) => {
      const extWs = ws as IExtWebSocket;
      logger.info('[WebSocket] New client connected');
      extWs.isAlive = true;

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
    }, 30000);

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
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

export default new WsServer();
