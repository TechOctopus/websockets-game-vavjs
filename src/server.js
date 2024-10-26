// Heorhi Davydau
import express from 'express';
import { WebSocketServer } from 'ws';

import Game from './game.js';
import { apiRouter } from './routes.js';
import { pageRouter } from './pages.js';

const HTTP_PORT = 8080;
const WS_PORT = 8082;

const app = express();
const wss = new WebSocketServer({ port: WS_PORT });

const games = new Map();

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

app.use(express.static('src/public'));
app.use(express.json());

app.use('/api', apiRouter);
app.use('/page', pageRouter);

app.listen(HTTP_PORT, () => {
  console.log(`Server running at http://localhost:${HTTP_PORT}/`);
});

app.post('/api/rotate', (req, res) => {
  const userID = req.headers.authorization;
  if (games.has(userID)) games.get(userID).rotateShip(req.body.direction);
  res.status(200).send({ status: 'ok' });
});

app.post('/api/laser', (req, res) => {
  const userID = req.headers.authorization;
  if (games.has(userID)) games.get(userID).addLaser();
  res.status(200).send({ status: 'ok' });
});

app.post('/api/restart', (req, res) => {
  const userID = req.headers.authorization;
  if (games.has(userID)) games.get(userID).restart();
  res.status(200).send({ status: 'ok' });
});

wss.on('connection', function connection(ws) {
  console.log('connected');

  ws.on('message', (data) => {
    const message = JSON.parse(data);
    const userID = message.userID;

    if (!games.has(userID)) {
      games.set(userID, new Game(ws));
    } else {
      games.get(userID).updateWs(ws);
    }
  });

  ws.on('close', () => {
    console.log('disconnected');
  });

  ws.on('error', (err) => {
    console.error(err);
  });
});
