// Heorhi Davydau
import express from 'express';
import { WebSocketServer } from 'ws';

import Game from './game.js';
import pages from './pages.js';
import Auth from './auth.js';

const HTTP_PORT = 8080;
const WS_PORT = 8082;

const app = express();
const wss = new WebSocketServer({ port: WS_PORT });
const auth = new Auth();
const games = {};

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

app.post('/api/login', (req, res) => {
  const password = req.body.password;
  const login = req.body.login;
  const email = req.body.email;

  if (
    login === 'none' ||
    email === 'none' ||
    password === 'none' ||
    !login ||
    !email ||
    !password
  ) {
    return res.status(401).send({ error: 'Invalid data' });
  }

  const token = auth.login(login, email, password);

  if (!token) {
    return res.status(401).send({ error: 'Invalid data' });
  }

  res.status(200).send({ token });
});

app.get('/api/register', (req, res) => {
  res.json(pages.register);
});

app.post('/api/register', (req, res) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const login = req.body.login;
  const email = req.body.email;

  if (
    login === 'none' ||
    email === 'none' ||
    password === 'none' ||
    confirmPassword === 'none' ||
    !login ||
    !email ||
    !password ||
    !confirmPassword ||
    password !== confirmPassword
  ) {
    return res.status(401).send({ error: 'Invalid data' });
  }

  const result = auth.register(login, email, password);

  if (!result) {
    return res.status(401).send({ error: 'Invalid data' });
  }

  res.status(200).send({ status: 'ok' });
});

app.get('/api/admin', (req, res) => {
  res.json(pages.admin);
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
