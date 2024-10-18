import express from 'express';

const PORT = 8080;

const app = express();

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

app.use(express.static('public'));
app.use(express.json());

app.get('/api/', (req, res) => {
  res.json([
    {
      tag: 'p',
      innerText: 'Hello from the server!',
    },
    {
      tag: 'div',
      innerHtml: [
        {
          tag: 'button',
          innerText: 'button',
        },
        {
          tag: 'p',
          innerText: 'Lorem ipsim',
        },
      ],
    },
  ]);
});

app.get('/api/login', (req, res) => {
  res.json([
    {
      tag: 'form',
      innerHtml: [
        {
          tag: 'input',
          id: 'username',
          class: 'input',
          innerText: 'Username',
        },
        {
          tag: 'input',
          id: 'password',
          class: 'input',
          innerText: 'Password',
        },
        {
          tag: 'button',
          innerText: 'Login',
        },
      ],
    },
  ]);
});

app.get('/api/*', (req, res) => {
  res.json([
    {
      tag: 'p',
      innerText: '404 Not Found',
    },
  ]);
});

app.get('/*', (req, res) => {
  res.sendFile('public/index.html', { root: '.' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
