const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', function open() {
  console.log('Test script connected to WS');
  ws.send(JSON.stringify({ type: 'device_update', deviceId: 'test-123', status: 'online' }));
});

ws.on('message', function message(data) {
  console.log('Test script received from WS:', data.toString());
  process.exit(0);
});

ws.on('error', function error(err) {
  console.error('Test script WS Error:', err);
  process.exit(1);
});

setTimeout(() => {
  console.error('Test script timed out waiting for response');
  process.exit(1);
}, 5000);
