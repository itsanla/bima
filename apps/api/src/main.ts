import dotenv from 'dotenv';
import { createServer } from 'http';
import logger from 'jet-logger';
import prisma from './db/prisma';

import wsServer from './websocket/wsServer';

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || '.env' });

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = createServer(async (req, res) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const log = await prisma.iotLog.create({
          data: {
            deviceId: data.id ? String(data.id) : null,
            suhu: Number(data.suhu) || 0,
            timer: data.timer || "00:00:00",
            api: data.api || "OFF",
            status: data.status || "UNKNOWN",
            air_habis: Boolean(data.air_habis)
          }
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "ok", message: "Data saved successfully", data: log }));
      } catch (e: any) {
        logger.err(`[HTTP] Error processing POST: ${e.message}`);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "error", message: e.message }));
      }
    });
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: "ok", message: "Bima API and WebSocket server is running" }));
});

// Initialize WebSocket server attached to the HTTP server
wsServer.initialize(server);

// Start server
server.listen(PORT, () => {
  logger.info(`[Server] Running on http://0.0.0.0:${PORT}`);
  logger.info(`[WebSocket] Listening on ws://0.0.0.0:${PORT}`);
});
