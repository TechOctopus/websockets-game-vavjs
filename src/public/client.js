// Heorhi Davydau
const xFields = 59;
const yFields = 59;
const mid = {
  x: Math.floor(xFields / 2),
  y: Math.floor(yFields / 2),
};

const rootElement = document.body;

function removeUserToken() {
  localStorage.removeItem('user');
}

function setUserToken(userToken) {
  localStorage.setItem('user', userToken);
}

function getUserToken() {
  const userToken = localStorage.getItem('user');
  if (userToken) return userToken;
  const newUserToken = crypto.randomUUID();
  localStorage.setItem('user', newUserToken);
  return newUserToken;
}

async function api(endpoint, method = 'GET', body = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: getUserToken(),
    },
  };

  if (method !== 'GET') options.body = JSON.stringify(body);

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
  // Special case for links to switch pages
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

async function renderPage(page) {
  await api(`page/${page}`).then((data) => {
    rootElement.innerHTML = '';
    data.forEach((element) => {
      rootElement.appendChild(renderTag(element));
    });
  });
}

async function switchPage(page = 'home') {
  await renderPage(page);
  window.removeEventListener('keydown', handleKeyInput);

  switch (page) {
    case 'admin':
      adminPageLogic();
      break;
    case 'login':
      loginPageLogic();
      break;
    case 'register':
      registerPageLogic();
      break;
    case 'home':
      gamePageLogic();
      break;
    default:
      gamePageLogic();
  }
}

switchPage();

// Pages logic

function adminPageLogic() {
  const usersTableElement = document.getElementById('users-table');
  api('api/users')
    .then((responce) => {
      responce.forEach((user) => {
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
        deleteButtonElement.addEventListener('click', () => {
          api('api/delete', 'POST', {
            login: user.login,
            email: user.email,
          });
          switchPage('admin');
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

function loginPageLogic() {
  const formElement = document.getElementById('login-form');
  const loginElement = document.getElementById('login');
  const passwordElement = document.getElementById('password');
  const errorElement = document.getElementById('error');

  formElement.addEventListener('submit', async (event) => {
    event.preventDefault();

    const login = loginElement.value;
    const password = passwordElement.value;

    api('api/login', 'POST', { login, password })
      .then((responce) => {
        setUserToken(responce.token);
        switchPage('home');
      })
      .catch((error) => {
        errorElement.innerText = error.message;
      });
  });
}

function registerPageLogic() {
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
        setUserToken(responce.token);
        switchPage('home');
      })
      .catch((error) => {
        errorElement.innerText = 'Something went wrong';
      });
  });
}

function gamePageLogic() {
  const userElement = document.getElementById('user');

  let user = null;

  api('api/auth')
    .then((responce) => {
      user = responce.user;

      const logoutBtnElement = document.createElement('button');
      logoutBtnElement.innerText = 'Logout';
      logoutBtnElement.addEventListener('click', async () => {
        api('api/logout');
        removeUserToken();
        switchPage('login');
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

      if (user.login === 'admin') {
        const adminLinkElement = document.createElement('button');
        adminLinkElement.innerText = 'Admin';
        adminLinkElement.addEventListener('click', async () => {
          switchPage('admin');
        });

        userElement.appendChild(adminLinkElement);
      }
    })
    .catch((error) => {
      console.error(error);
    });

  const restartGameButtonElement = document.getElementById('restart');
  restartGameButtonElement.addEventListener('click', () =>
    api('api/restart', 'POST'),
  );

  game();
}

// Game logic
function rotateShip(direction) {
  api('api/rotate', 'POST', { direction });
}

function addLaser() {
  api('api/laser', 'POST');
}

function handleKeyInput(ev) {
  if (ev.code === 'ArrowLeft' || ev.code === 'keyA') rotateShip(-1);
  else if (ev.code === 'ArrowRight' || ev.code === 'keyA') rotateShip(1);
  else if (ev.code === 'Space') addLaser();
}

function game() {
  window.addEventListener('keydown', handleKeyInput);

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
        userID: getUserToken(),
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
