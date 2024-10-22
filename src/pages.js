// Heorhi Davydau
const index = [
  {
    tag: 'section',
    id: 'user',
    innerHtml: [
      {
        tag: 'a',
        href: '/login',
        innerText: 'Login',
      },
      {
        tag: 'br',
      },
      {
        tag: 'a',
        href: '/register',
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
    tag: 'canvas',
    id: 'game',
    style: 'border: 1px solid black;',
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
        tag: 'a',
        href: '/register',
        innerText: "Don't have an account?",
      },
      {
        tag: 'a',
        href: '/',
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
        tag: 'a',
        href: '/login',
        innerText: 'Already have an account?',
      },
      {
        tag: 'a',
        href: '/',
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
];

const notFound = [
  {
    tag: 'p',
    innerText: '404 Not Found',
  },
];

export default {
  index,
  login,
  register,
  admin,
  notFound,
};
