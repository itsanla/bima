import dotenv from 'dotenv';
import { createServer } from 'http';
import logger from 'jet-logger';
import prisma from './db/prisma';

import wsServer from './websocket/wsServer';

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || '.env' });

const PORT = process.env.PORT || 3000;

async function setupMaterializedViews() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS iot_log_summary_10m AS
      SELECT 
        "sessionId",
        to_timestamp(floor(extract(epoch from "createdAt") / 600) * 600) AT TIME ZONE 'UTC' as bucket,
        AVG(suhu) as avg_suhu
      FROM "IotLog"
      GROUP BY "sessionId", bucket
    `);
    
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS iot_log_summary_10m_idx 
      ON iot_log_summary_10m("sessionId", bucket)
    `);

    await prisma.$executeRawUnsafe(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS iot_log_summary_1h AS
      SELECT 
        "sessionId",
        date_trunc('hour', "createdAt") as bucket,
        AVG(suhu) as avg_suhu
      FROM "IotLog"
      GROUP BY "sessionId", bucket
    `);

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS iot_log_summary_1h_idx 
      ON iot_log_summary_1h("sessionId", bucket)
    `);

    logger.info("[DB] Materialized views initialized");
  } catch (err: any) {
    logger.err(`[DB] Failed to setup views: ${err.message}`);
  }
}

// Refresh logic every 5 minutes
setInterval(async () => {
  try {
    await prisma.$executeRawUnsafe(`REFRESH MATERIALIZED VIEW CONCURRENTLY iot_log_summary_10m`);
    await prisma.$executeRawUnsafe(`REFRESH MATERIALIZED VIEW CONCURRENTLY iot_log_summary_1h`);
  } catch (err) {
    try {
      await prisma.$executeRawUnsafe(`REFRESH MATERIALIZED VIEW iot_log_summary_10m`);
      await prisma.$executeRawUnsafe(`REFRESH MATERIALIZED VIEW iot_log_summary_1h`);
    } catch (fallbackErr: any) {
      logger.err(`[DB] Failed to refresh views: ${fallbackErr.message}`);
    }
  }
}, 5 * 60 * 1000);

// Create HTTP server
const server = createServer(async (req, res) => {
  const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (req.method === 'POST' && (pathname === '/api' || pathname === '/')) {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        const log = await prisma.iotLog.create({
          data: {
            sessionId: (payload.session || payload.id) ? String(payload.session || payload.id) : null,
            suhu: Number(payload.suhu) || 0,
            timer: payload.timer || "00:00:00",
            api: payload.api || "OFF",
            status: payload.status || "UNKNOWN",
            air_habis: Boolean(payload.air_habis)
          }
        });

        // Broadcast the HTTP-received data to all WS clients for the UI testing table
        wsServer.broadcastToDashboard({
          type: 'http_dashboard_update',
          data: log
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

      const search = url.searchParams.get('search') || null;
      const sortBy = url.searchParams.get('sortBy') === 'sessionId' ? 'sessionId' : 'createdAt';
      const sortOrder = url.searchParams.get('sortOrder') === 'asc' ? 'ASC' : 'DESC';
      const searchPattern = search ? `%${search}%` : null;

      const orderByClause = sortBy === 'sessionId'
        ? `"sessionId" ${sortOrder}`
        : `MIN("createdAt") ${sortOrder}`;

      const sessions: any[] = await prisma.$queryRawUnsafe(`
        SELECT "sessionId", MIN("createdAt") as "createdAt", COUNT(*) OVER() as "totalSessions"
        FROM "IotLog"
        WHERE $1::text IS NULL OR "sessionId" ILIKE $1
        GROUP BY "sessionId"
        ORDER BY ${orderByClause}
        LIMIT $2 OFFSET $3
      `, searchPattern, limit, skip);

      const total = sessions.length > 0 ? Number(sessions[0].totalSessions) : 0;
      const data = sessions.map(s => ({ sessionId: s.sessionId, createdAt: s.createdAt }));

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: "ok",
        data,
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

  if (req.method === 'GET' && pathname === '/api/logs/chart') {
    try {
      const sessionId = url.searchParams.get('sessionId');
      const interval = url.searchParams.get('interval') || '10m'; // 10m, 1h, all
      
      if (!sessionId) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "error", message: "sessionId query parameter is required" }));
        return;
      }

      let data: any[] = [];
      
      if (interval === '10m') {
        data = await prisma.$queryRawUnsafe(`
          SELECT bucket, avg_suhu 
          FROM iot_log_summary_10m 
          WHERE "sessionId" = $1 
          ORDER BY bucket ASC
        `, sessionId);
      } else if (interval === '1h') {
        data = await prisma.$queryRawUnsafe(`
          SELECT bucket, avg_suhu 
          FROM iot_log_summary_1h 
          WHERE "sessionId" = $1 
          ORDER BY bucket ASC
        `, sessionId);
      } else {
        // all (raw data fallback)
        data = await prisma.$queryRawUnsafe(`
          SELECT "createdAt" as bucket, suhu as avg_suhu 
          FROM "IotLog" 
          WHERE "sessionId" = $1 
          ORDER BY "createdAt" ASC
        `, sessionId);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: "ok", data }));
    } catch (e: any) {
      logger.err(`[HTTP] Error processing GET chart: ${e.message}`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: "error", message: e.message }));
    }
    return;
  }

  const logsDetailMatch = req.method === 'GET' ? pathname.match(/^\/api\/logs\/([^/]+)$/) : null;
  if (logsDetailMatch) {
    try {
      const sessionId = decodeURIComponent(logsDetailMatch[1]);

      const history = await prisma.iotLog.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' }
      });

      if (history.length === 0) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "error", message: "Session not found" }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: "ok",
        data: {
          sessionId,
          history,
          createdAt: history[0].createdAt
        }
      }));
    } catch (e: any) {
      logger.err(`[HTTP] Error processing GET session detail: ${e.message}`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: "error", message: e.message }));
    }
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: "ok", message: "Bima API and WebSocket server is running" }));
});

// Initialize DB views
setupMaterializedViews();

// Initialize WebSocket server attached to the HTTP server
wsServer.initialize(server);

// Start server
server.listen(PORT, () => {
  logger.info(`[Server] Running on http://0.0.0.0:${PORT}`);
  logger.info(`[WebSocket] Listening on ws://0.0.0.0:${PORT}`);
});
