// Heorhi Davydau
const index = [
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
        action: '/login',
        style: 'display: grid; place-items: center; gap: 1rem;',
        innerHtml: [
          {
            tag: 'input',
            id: 'login',
            type: 'text',
            placeholder: 'Login',
            required: true,
          },
          {
            tag: 'input',
            id: 'email',
            type: 'email',
            placeholder: 'Email',
            required: true,
          },
          {
            tag: 'input',
            id: 'password',
            type: 'password',
            placeholder: 'Password',
            required: true,
          },
          {
            tag: 'input',
            id: 'password_confirm',
            type: 'password',
            placeholder: 'Confirm Password',
            required: true,
          },
          {
            tag: 'button',
            type: 'submit',
            innerText: 'Login',
            required: true,
          },
        ],
      },
      {
        tag: 'a',
        href: '/register',
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
        action: '/register',
        style: 'display: grid; place-items: center; gap: 1rem;',
        innerHtml: [
          {
            tag: 'input',
            id: 'login',
            type: 'text',
            placeholder: 'Login',
            required: true,
          },
          {
            tag: 'input',
            id: 'email',
            type: 'email',
            placeholder: 'Email',
            required: true,
          },
          {
            tag: 'input',
            id: 'password',
            type: 'password',
            placeholder: 'Password',
            required: true,
          },
          {
            tag: 'button',
            type: 'submit',
            innerText: 'Login',
            required: true,
          },
        ],
      },
      {
        tag: 'a',
        href: '/login',
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
  notFound,
};
