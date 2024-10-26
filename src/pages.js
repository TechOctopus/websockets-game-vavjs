// Heorhi Davydau
import { Router } from 'express';
import { auth } from './auth.js';

const index = [
  {
    tag: 'section',
    innerHtml: [
      {
        tag: 'div',
        id: 'user',
        innerHtml: [
          {
            tag: 'link',
            to: 'login',
            innerText: 'Login',
          },
          {
            tag: 'br',
          },
          {
            tag: 'link',
            to: 'register',
            innerText: 'Register',
          },
        ],
      },
      {
        tag: 'p',
        id: 'score',
        innerText: 'Score: 0',
      },
      {
        tag: 'p',
        id: 'speed',
        innerText: 'Speed: 1000',
      },
      {
        tag: 'p',
        id: 'max-score',
        innerText: 'Max score: 0',
      },
      {
        tag: 'p',
        id: 'max-speed',
        innerText: 'Max speed: 1000',
      },
      {
        tag: 'canvas',
        width: '580',
        height: '580',
        id: 'game',
        style: 'border: 1px solid black;',
      },
      { tag: 'br' },
      {
        tag: 'div',
        innerHtml: [
          {
            tag: 'button',
            id: 'restart',
            innerText: 'Restart',
          },
        ],
      },
      {
        tag: 'table',
        id: 'games-table',
        innerHtml: [
          {
            tag: 'tr',
            innerHtml: [
              {
                tag: 'th',
                innerText: 'Login',
              },
              {
                tag: 'th',
                innerText: 'Online',
              },
            ],
          },
        ],
      },
    ],
  },
];

const login = [
  {
    tag: 'section',
    style: 'display: grid; place-items: center; gap: 1rem;',
    innerHtml: [
      {
        tag: 'h1',
        innerText: 'Login',
      },
      {
        tag: 'form',
        id: 'login-form',
        style: 'display: grid; place-items: center; gap: 1rem;',
        innerHtml: [
          {
            tag: 'input',
            id: 'login',
            name: 'login',
            type: 'text',
            maxLength: '10',
            placeholder: 'Login',
            required: true,
          },
          {
            tag: 'input',
            id: 'password',
            name: 'password',
            type: 'password',
            maxLength: '20',
            placeholder: 'Password',
            required: true,
          },
          {
            tag: 'button',
            type: 'submit',
            innerText: 'Login',
          },
        ],
      },
      {
        tag: 'p',
        id: 'error',
        style: 'color: red;',
        innerText: '',
      },
      {
        tag: 'link',
        to: 'register',
        innerText: "Don't have an account?",
      },
      {
        tag: 'link',
        href: 'home',
        innerText: 'Play without registration',
      },
    ],
  },
];

const register = [
  {
    tag: 'section',
    style: 'display: grid; place-items: center; gap: 1rem;',
    innerHtml: [
      {
        tag: 'h1',
        innerText: 'Register',
      },
      {
        tag: 'form',
        id: 'register-form',
        style: 'display: grid; place-items: center; gap: 1rem;',
        innerHtml: [
          {
            tag: 'input',
            id: 'login',
            name: 'login',
            type: 'text',
            minLength: '3',
            maxLength: '10',
            placeholder: 'Login',
            required: true,
          },
          {
            tag: 'input',
            id: 'email',
            name: 'email',
            type: 'email',
            placeholder: 'Email',
            required: true,
          },
          {
            tag: 'input',
            id: 'password',
            name: 'password',
            type: 'password',
            minLength: '4',
            maxLength: '20',
            placeholder: 'Password',
            required: true,
          },
          {
            tag: 'input',
            id: 'password_confirm',
            name: 'confirmPassword',
            type: 'password',
            placeholder: 'Confirm Password',
            required: true,
          },
          {
            tag: 'button',
            type: 'submit',
            innerText: 'Login',
          },
        ],
      },
      {
        tag: 'p',
        id: 'error',
        style: 'color: red;',
        innerText: '',
      },
      {
        tag: 'link',
        to: 'login',
        innerText: 'Already have an account?',
      },
      {
        tag: 'link',
        href: 'home',
        innerText: 'Play without registration',
      },
    ],
  },
];

const admin = [
  {
    tag: 'h1',
    innerText: 'Admin',
  },
  {
    tag: 'link',
    to: 'home',
    innerText: 'Game',
  },
  {
    tag: 'table',
    id: 'users-table',
    innerHtml: [
      {
        tag: 'tr',
        innerHtml: [
          {
            tag: 'th',
            innerText: 'Login',
          },
          {
            tag: 'th',
            innerText: 'Email',
          },
          {
            tag: 'th',
            innerText: 'Score',
          },
          {
            tag: 'th',
            innerText: 'Speed',
          },
          {
            tag: 'th',
            innerText: 'Action',
          },
        ],
      },
    ],
  },
];

const notFound = [
  {
    tag: 'p',
    innerText: '404 Not Found',
  },
];

const watch = [
  {
    tag: 'section',
    innerHtml: [
      {
        tag: 'h1',
        innerText: 'Watch',
      },
      {
        tag: 'canvas',
        width: '580',
        height: '580',
        id: 'game',
        style: 'border: 1px solid black;',
      },
      { tag: 'br' },
      {
        tag: 'link',
        to: 'home',
        innerText: 'Game',
      },
    ],
  },
];

export const pageRouter = Router();

pageRouter.get('/home', (req, res) => {
  res.json(index);
});

pageRouter.get('/login', (req, res) => {
  res.json(login);
});

pageRouter.get('/register', (req, res) => {
  res.json(register);
});

pageRouter.get('/admin', (req, res) => {
  const userID = req.headers.authorization;
  const user = auth.getUser(userID);
  if (!user || user.login !== 'admin') return res.json(notFound);
  res.json(admin);
});

pageRouter.get('/watch', (req, res) => {
  res.json(watch);
});
