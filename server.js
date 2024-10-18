const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');

const HTTP_PORT = 8080;
const WS_PORT = 8082;

const server = http.createServer((req, res) => {
  if (req.url === '/favicon.ico') {
    const f = fs.readFileSync('public/favicon.ico');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'image/x-icon');
    res.end(f);
  }
  if (req.url === '/index.html' || req.url === '/') {
    const f = fs.readFileSync('public/index.html', 'utf-8');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(f);
  }
  if (req.url === '/client.js') {
    const f = fs.readFileSync('public/client.js', 'utf-8');
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/javascript');
    res.end(f);
  }
});

server.listen(HTTP_PORT, () => {
  console.log(`Server running at http://localhost:${HTTP_PORT}/`);
});

const wss = new WebSocket.Server({ port: WS_PORT });

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  ws.on('message', async (message) => {
    console.log(`Received: ${message}`);
    ws.send(`Postgres: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
