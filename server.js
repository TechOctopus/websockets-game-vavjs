// Heorhi Davydau
import express from 'express';
import { WebSocketServer } from 'ws';

import Game from './game.js';
import pages from './pages.js';

const HTTP_PORT = 8080;
const WS_PORT = 8082;

const app = express();
const wss = new WebSocketServer({ port: WS_PORT });

let game = null;

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

app.use(express.static('public'));
app.use(express.json());

app.get('/api/', (req, res) => {
  res.json(pages.index);
});

app.get('/api/login', (req, res) => {
  res.json(pages.login);
});

app.post('/api/rotate', (req, res) => {
  if (game) game.rotateShip(req.body.direction);
  res.status(200).send({ status: 'ok' });
});

app.post('/api/laser', (req, res) => {
  if (game) game.addLaser();
  res.status(200).send({ status: 'ok' });
});

app.get('/api/*', (req, res) => {
  res.json(pages.notFound);
});

app.get('/*', (req, res) => {
  res.sendFile('public/index.html', { root: '.' });
});

app.listen(HTTP_PORT, () => {
  console.log(`Server running at http://localhost:${HTTP_PORT}/`);
});

wss.on('connection', function connection(ws) {
  console.log('connected');

  game = new Game(ws);
  game.preGame();

  ws.on('message', (data) => {
    const message = JSON.parse(data);
    console.log(message);
  });

  ws.on('close', () => {
    console.log('disconnected');
    if (game) game.endGame();
    game = null;
  });

  ws.on('error', (err) => {
    console.error(err);
    if (game) game.endGame();
    game = null;
  });
});
