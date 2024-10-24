// Heorhi Davydau
const xFields = 59;
const yFields = 59;
const mid = {
  x: Math.floor(xFields / 2),
  y: Math.floor(yFields / 2),
};

function resetUserID() {
  localStorage.removeItem('user');
}

function setUserID(userID) {
  localStorage.setItem('user', userID);
}

function getUserID() {
  const userID = localStorage.getItem('user');
  if (userID) return userID;
  const newUserID = crypto.randomUUID();
  localStorage.setItem('user', newUserID);
  return newUserID;
}

const userID = getUserID();

const root = document.body;

async function api(endpoint, method = 'GET', body = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (method !== 'GET') options.body = JSON.stringify(body);
  if (userID) options.headers.Authorization = userID;

  return await fetch(endpoint, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Invalid data');
      }
      return response.json();
    })
    .catch((error) => {
      throw new Error(error.message);
    });
}

function renderTag(data) {
  if (data.tag === 'link') {
    const link = document.createElement('button');
    link.style = `
      background: none;
      border: none;
      color: blue;
      cursor: pointer;
      text-decoration: underline;
    `;
    link.addEventListener('click', async () => await switchPage(data.to));
    link.innerText = data.innerText;
    return link;
  }

  const tag = document.createElement(data.tag);

  if (data.id) tag.id = data.id;
  if (data.style) tag.style = data.style;
  if (data.width) tag.width = data.width;
  if (data.height) tag.height = data.height;
  if (data.type) tag.type = data.type;
  if (data.placeholder) tag.placeholder = data.placeholder;
  if (data.action) tag.action = data.action;
  if (data.method) tag.method = data.method;
  if (data.name) tag.name = data.name;
  if (data.required) tag.required = data.required;
  if (data.href) tag.href = data.href;
  if (data.innerText) tag.innerText = data.innerText;
  if (data.innerHtml) {
    data.innerHtml.forEach((element) => {
      tag.appendChild(renderTag(element));
    });
  }
  return tag;
}

function render(data) {
  data.forEach((element) => {
    root.appendChild(renderTag(element));
  });
}

function getPath() {
  return window.location.pathname;
}

async function renderPage(page) {
  await api(`page/${page}`).then((data) => {
    root.innerHTML = '';
    data.forEach((element) => {
      root.appendChild(renderTag(element));
    });
  });
}

async function switchPage(page = 'home') {
  console.log('page', page);
  await renderPage(page);
  switch (page) {
    case 'admin':
      admin();
      break;
    case 'login':
      login();
      break;
    case 'register':
      register();
      break;
    case 'home':
      index();
      break;
    default:
      index();
  }
}

switchPage();

function game() {
  async function rotateShip(direction) {
    await api('api/rotate', 'POST', { direction });
  }

  async function addLaser() {
    await api('api/laser', 'POST');
  }

  window.addEventListener('keydown', async (ev) => {
    if (ev.code === 'ArrowLeft') await rotateShip(-1);
    else if (ev.code === 'ArrowRight') await rotateShip(1);
    else if (ev.code === 'Space') await addLaser();
  });

  const CELLSIZE = 10;

  const canvas = document.getElementById('game');
  canvas.width = (xFields - 1) * CELLSIZE;
  canvas.height = (yFields - 1) * CELLSIZE;
  const ctx = canvas.getContext('2d');

  let xShip = mid.x;
  let yShip = mid.y;
  let rShip = 0;
  let missiles = [];
  let lasers = [];
  let score = 0;
  let speed = 1000;

  const spaceShipImage = new Image();
  const asteroidImage = new Image();
  const snowBallImage = new Image();

  // Source: https://opengameart.org/content/spaceship-1
  // License(s): http://www.gnu.org/licenses/gpl-3.0.html
  spaceShipImage.src =
    'https://opengameart.org/sites/default/files/styles/medium/public/pitrizzo-SpaceShip-gpl3-opengameart-24x24-prev.png';

  // Source: https://opengameart.org/content/brown-asteroid
  // License(s): CC-BY 4.0, CC-BY 3.0, CC-BY-SA 4.0, CC-BY-SA 3.0
  asteroidImage.src =
    'https://opengameart.org/sites/default/files/styles/medium/public/Asteroid%20Brown.png';

  // Source: https://opengameart.org/content/snowball-pixel-art
  // License(s): CC
  snowBallImage.src =
    'https://opengameart.org/sites/default/files/styles/medium/public/snowball.png';

  const shipCells = 3;
  const shipMargin = 2;

  function displayShip() {
    drawRotatedImage(
      spaceShipImage,
      xShip * CELLSIZE - CELLSIZE,
      yShip * CELLSIZE - CELLSIZE,
      shipCells * CELLSIZE,
      shipCells * CELLSIZE,
      (rShip % 8) * 45,
    );
  }

  spaceShipImage.onload = () => displayShip();

  function displayMissiles() {
    missiles.forEach((missile) => {
      ctx.drawImage(
        asteroidImage,
        missile.x * CELLSIZE,
        missile.y * CELLSIZE,
        CELLSIZE,
        CELLSIZE,
      );
    });
  }

  function displayLasers() {
    lasers.forEach((laser) => {
      ctx.drawImage(
        snowBallImage,
        laser.x * CELLSIZE,
        laser.y * CELLSIZE,
        CELLSIZE,
        CELLSIZE,
      );
    });
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // THIS IS MODIFICATED FUNCTION FROM: https://stackoverflow.com/a/43927355
  function drawRotatedImage(image, x, y, width, height, angle) {
    ctx.save();
    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.translate(-x - width / 2, -y - height / 2);
    ctx.drawImage(image, x, y, width, height);
    ctx.restore();
  }

  const speedElement = document.getElementById('speed');
  const scoreElement = document.getElementById('score');

  function displayInfo() {
    speedElement.innerText = `Speed: ${speed}`;
    scoreElement.innerText = `Score: ${score}`;
  }

  const ws = new WebSocket('ws://localhost:8082');

  ws.addEventListener('open', () => {
    console.log('Connected to server');
    ws.send(
      JSON.stringify({
        type: 'connect',
        userID,
      }),
    );
  });

  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    clearCanvas();
    xShip = data.xShip;
    yShip = data.yShip;
    rShip = data.rShip;
    missiles = data.missiles;
    lasers = data.lasers;
    score = data.score;
    speed = data.speed;
    displayShip();
    displayMissiles();
    displayLasers();
    displayInfo();
  });
}

async function index() {
  const userElement = document.getElementById('user');

  let user = null;

  await api('api/auth')
    .then((responce) => {
      user = responce.user;

      const logoutBtnElement = document.createElement('button');
      logoutBtnElement.innerText = 'Logout';
      logoutBtnElement.addEventListener('click', async () => {
        await api('api/logout');
        resetUserID();
        window.location.href = '/';
      });

      const newUserElement = document.createElement('p');
      newUserElement.innerText = `
        User: ${user.login}
        Max score: ${user.maxScore}
        Max speed: ${user.maxSpeed}
      `;

      userElement.innerHTML = '';
      userElement.appendChild(logoutBtnElement);
      userElement.appendChild(newUserElement);
    })
    .catch((error) => {
      console.error(error);
    });

  game();
}

async function admin() {
  const usersTableElement = document.getElementById('users-table');
  await api('api/users')
    .then((responce) => {
      responce.users.forEach((user) => {
        const rowElement = document.createElement('tr');
        const loginElement = document.createElement('td');
        const emailElement = document.createElement('td');
        const scoreElement = document.createElement('td');
        const speedElement = document.createElement('td');
        const deleteElement = document.createElement('td');

        loginElement.innerText = user.login;
        emailElement.innerText = user.email;
        scoreElement.innerText = user.maxScore;
        speedElement.innerText = user.maxSpeed;

        const deleteButtonElement = document.createElement('button');
        deleteButtonElement.innerText = 'Delete';
        deleteButtonElement.addEventListener('click', async () => {
          await api('api/delete', 'POST', {
            login: user.login,
            email: user.email,
          });
          window.location.href = '/admin';
        });

        deleteElement.appendChild(deleteButtonElement);

        rowElement.appendChild(loginElement);
        rowElement.appendChild(emailElement);
        rowElement.appendChild(scoreElement);
        rowElement.appendChild(speedElement);
        rowElement.appendChild(deleteElement);

        usersTableElement.appendChild(rowElement);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

function login() {
  const formElement = document.getElementById('login-form');
  const loginElement = document.getElementById('login');
  const passwordElement = document.getElementById('password');
  const errorElement = document.getElementById('error');

  formElement.addEventListener('submit', async (event) => {
    event.preventDefault();

    const login = loginElement.value;
    const password = passwordElement.value;

    await api('api/login', 'POST', { login, password })
      .then((responce) => {
        setUserID(responce.token);
        switchPage('home');
      })
      .catch((error) => {
        errorElement.innerText = error.message;
      });
  });
}

function register() {
  const formElement = document.getElementById('register-form');
  const loginElement = document.getElementById('login');
  const emailElement = document.getElementById('email');
  const passwordElement = document.getElementById('password');
  const confirmPasswordElement = document.getElementById('password_confirm');

  const errorElement = document.getElementById('error');

  function validatePassword() {
    if (passwordElement.value !== confirmPasswordElement.value) {
      confirmPasswordElement.setCustomValidity('Passwords do not match');
    } else {
      confirmPasswordElement.setCustomValidity('');
    }
  }

  passwordElement.addEventListener('input', validatePassword);
  confirmPasswordElement.addEventListener('input', validatePassword);

  formElement.addEventListener('submit', async (event) => {
    event.preventDefault();

    const login = loginElement.value;
    const email = emailElement.value;
    const password = passwordElement.value;
    const confirmPassword = confirmPasswordElement.value;

    api('api/register', 'POST', { login, email, password, confirmPassword })
      .then((responce) => {
        setUserID(responce.token);
        switchPage('home');
      })
      .catch((error) => {
        errorElement.innerText = 'Something went wrong';
      });
  });
}
