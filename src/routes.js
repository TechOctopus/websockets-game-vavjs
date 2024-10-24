// Heorhi Davydau
import { Router } from 'express';
import { auth } from './auth.js';
import { store } from './store.js';

export const apiRouter = Router();

apiRouter.get('/auth', (req, res) => {
  const token = req.headers.authorization;
  const user = auth.getUser(token);
  if (!user) return res.status(401).send({ error: 'Invalid token' });
  res.status(200).send({ user });
});

apiRouter.get('/logout', (req, res) => {
  const token = req.headers.authorization;
  auth.logout(token);
  res.status(200).send({ status: 'ok' });
});

apiRouter.post('/login', (req, res) => {
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

apiRouter.post('/register', (req, res) => {
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

apiRouter.get('/users', (req, res) => {
  const token = req.headers.authorization;
  const user = auth.getUser(token);
  if (!user || user.login !== 'admin') {
    return res.status(401).send({ error: 'Invalid token' });
  }
  res.status(200).send(store.getUsers());
});
