// Heorhi Davydau
import express from 'express';
import { WebSocketServer } from 'ws';

import Game from './game.js';
import { auth } from './auth.js';
import { store } from './store.js';
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

app.use('/page', pageRouter);

app.get('/api/auth', (req, res) => {
  const user = auth.getUser(req.headers.authorization);
  res.status(200).send({ user: user ?? null });
});

app.get('/api/logout', (req, res) => {
  const token = req.headers.authorization;
  auth.logout(token);
  res.status(200).send({ status: 'ok' });
});

app.post('/api/login', (req, res) => {
  const password = req.body.password;
  const login = req.body.login;

  if (!login || !password) {
    return res.status(401).send({ message: 'Invalid data' });
  }

  const token = auth.login(login, password);

  if (!token) {
    return res.status(401).send({ message: 'Invalid data' });
  }

  res.status(200).send({ token });
});

app.post('/api/register', (req, res) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const login = req.body.login;
  const email = req.body.email;

  if (
    !login ||
    !email ||
    !password ||
    !confirmPassword ||
    password !== confirmPassword
  ) {
    return res.status(401).send({ error: 'Invalid data' });
  }

  const token = auth.register(login, email, password);

  if (!token) {
    return res.status(401).send({ error: 'Invalid data' });
  }

  res.status(200).send({ token });
});

app.post('/api/delete', (req, res) => {
  const token = req.headers.authorization;
  const user = auth.getUser(token);
  if (!user || user.login !== 'admin') {
    return res.status(401).send({ error: 'Invalid token' });
  }

  const login = req.body.login;
  const email = req.body.email;

  if (!login || !email) {
    return res.status(401).send({ error: 'Invalid data' });
  }

  store.deleteUser(login, email);
  res.status(200).send({ status: 'ok' });
});

app.get('/api/users', (req, res) => {
  const token = req.headers.authorization;
  const user = auth.getUser(token);
  if (!user || user.login !== 'admin') {
    return res.status(401).send({ error: 'Invalid token' });
  }
  res.status(200).send(store.getUsers());
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

app.post('/api/ship', (req, res) => {
  const userToken = req.headers.authorization;
  const shipVariant = req.body.shipVariant;

  if (!auth.updateShipVariant(userToken, shipVariant)) {
    return res.status(401).send({ error: 'Invalid token' });
  }

  res.status(200).send({ status: 'ok' });
});

app.post('/api/restart', (req, res) => {
  const userID = req.headers.authorization;
  if (games.has(userID)) games.get(userID).restart();
  res.status(200).send({ status: 'ok' });
});

app.get('/api/statistics', (req, res) => {
  const userToken = req.headers.authorization;

  if (!games.has(userToken)) {
    return res.status(404).send({ status: 'not found' });
  }

  const game = games.get(userToken);

  res.json({
    maxScore: game.maxScore,
    maxSpeed: game.maxSpeed,
  });
});

app.get('/api/games', (req, res) => {
  const tokens = Array.from(games.keys());

  const usersTokens = tokens.map((token) => {
    const user = auth.getUser(token);
    return {
      user: user ? user.login : 'null',
      token,
    };
  });

  res.json(usersTokens);
});

wss.on('connection', function connection(ws) {
  console.log(`WebSocket connected: ${ws.protocol}`);

  const userToken = ws.protocol;
  if (!games.has(userToken)) {
    const user = auth.getUser(userToken);
    games.set(userToken, new Game(ws, user));
  } else {
    games.get(userToken).updateWs(ws);
  }

  ws.on('close', () => {
    console.log(`WebSocket closed ${ws.protocol}`);
    games.get(userToken).updateWs(null);
  });

  ws.on('error', (err) => {
    console.error(err);
  });
});

app.listen(HTTP_PORT, () => {
  console.log(`Server running at http://localhost:${HTTP_PORT}/`);
});
