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

const games = {};

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

app.use(express.static('src/public'));
app.use(express.json());

app.post('/api/rotate', (req, res) => {
  const userID = req.headers.authorization;
  if (games[userID]) games[userID].rotateShip(req.body.direction);
  res.status(200).send({ status: 'ok' });
});

app.post('/api/laser', (req, res) => {
  const userID = req.headers.authorization;
  if (games[userID]) games[userID].addLaser();
  res.status(200).send({ status: 'ok' });
});

app.use('/api', apiRouter);
app.use('/page', pageRouter);

app.get('/*', (req, res) => {
  res.sendFile('src/public/index.html', { root: '.' });
});

app.listen(HTTP_PORT, () => {
  console.log(`Server running at http://localhost:${HTTP_PORT}/`);
});

wss.on('connection', function connection(ws) {
  console.log('connected');

  ws.on('message', (data) => {
    const message = JSON.parse(data);
    const userID = message.userID;

    if (!games[userID]) {
      games[userID] = new Game(ws);
      games[userID].preGame();
    }
  });

  ws.on('close', () => {
    console.log('disconnected');
    const userID = Object.keys(games).find(
      (key) => games[key].getGameWSocket() === ws,
    );
    if (userID) {
      games[userID].endGame();
      delete games[userID];
    }
  });

  ws.on('error', (err) => {
    console.error(err);
    const userID = Object.keys(games).find(
      (key) => games[key].getGameWSocket() === ws,
    );
    if (userID) {
      games[userID].endGame();
      delete games[userID];
    }
  });
});
