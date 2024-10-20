// Heorhi Davydau
import express from 'express';
import { WebSocketServer } from 'ws';

import Game from './game.js';
import pages from './pages.js';

const HTTP_PORT = 8080;
const WS_PORT = 8082;

const app = express();
const wss = new WebSocketServer({ port: WS_PORT });
const games = {};

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url} ${req.headers.userid}`);
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
  const userID = req.headers.userid;
  if (games[userID]) games[userID].rotateShip(req.body.direction);
  res.status(200).send({ status: 'ok' });
});

app.post('/api/laser', (req, res) => {
  const userID = req.headers.userid;
  if (games[userID]) games[userID].addLaser();
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

  ws.on('message', (data) => {
    const message = JSON.parse(data);
    console.log(message.userID);
    if (!games[message.userID]) {
      games[message.userID] = new Game(ws);
      games[message.userID].preGame();
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
