const index = [
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
  notFound,
};
