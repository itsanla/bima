import dotenv from 'dotenv';
import { createServer } from 'http';
import logger from 'jet-logger';

import wsServer from './websocket/wsServer';

dotenv.config({ path: process.env.DOTENV_CONFIG_PATH || '.env' });

const PORT = process.env.PORT || 3000;

// Create HTTP server
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server is running');
});

// Initialize WebSocket server attached to the HTTP server
wsServer.initialize(server);

// Start server
server.listen(PORT, () => {
  logger.info(`[Server] Running on http://0.0.0.0:${PORT}`);
  logger.info(`[WebSocket] Listening on ws://0.0.0.0:${PORT}`);
});
