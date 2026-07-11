import dotenv from 'dotenv';
import { createServer } from 'http';
import logger from 'jet-logger';
import prisma from './db/prisma';

import wsServer from './websocket/wsServer';

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || '.env' });

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = createServer(async (req, res) => {
  const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (req.method === 'POST' && (pathname === '/api' || pathname === '/')) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const log = await prisma.iotLog.create({
          data: {
            sessionId: (data.session || data.id) ? String(data.session || data.id) : null,
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

  if (req.method === 'GET' && (pathname === '/api' || pathname === '/api/logs')) {
    try {
      const page = Number(url.searchParams.get('page')) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;
      
      const search = url.searchParams.get('search') || undefined;
      const sortBy = url.searchParams.get('sortBy') || 'createdAt';
      const sortOrder = url.searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

      const where = search ? {
        OR: [
          { sessionId: { contains: search, mode: 'insensitive' as const } },
          { api: { contains: search, mode: 'insensitive' as const } },
          { status: { contains: search, mode: 'insensitive' as const } }
        ]
      } : {};

      const [logs, total] = await Promise.all([
        prisma.iotLog.findMany({
          where,
          take: limit,
          skip,
          orderBy: { [sortBy]: sortOrder }
        }),
        prisma.iotLog.count({ where })
      ]);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        status: "ok", 
        data: logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }));
    } catch (e: any) {
      logger.err(`[HTTP] Error processing GET: ${e.message}`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: "error", message: e.message }));
    }
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
