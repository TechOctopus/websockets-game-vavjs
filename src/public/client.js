// Heorhi Davydau
const xFields = 59;
const yFields = 59;
const mid = {
  x: Math.floor(xFields / 2),
  y: Math.floor(yFields / 2),
};

const shipVariants = ['white', 'orange', 'purple'];
let shipVariant = 'white';
let gameWatchToken = undefined;

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
  if (data.maxLength) tag.maxLength = data.maxLength;
  if (data.minLength) tag.minLength = data.minLength;
  if (data.for) tag.for = data.for;
  if (data.accept) tag.accept = data.accept;
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
    case 'watch':
      watchPageLogic();
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

  const exportButtonElement = document.getElementById('export');
  exportButtonElement.addEventListener('click', async () => {
    const csv = await api('api/export');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  const importElement = document.getElementById('import');
  importElement.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const data = await file.text();
    api('api/import', 'POST', { data });
    switchPage('admin');
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

function watchPageLogic() {
  game('watcher', gameWatchToken);
}

function gamePageLogic() {
  const userElement = document.getElementById('user');

  api('api/auth')
    .then((responce) => {
      const user = responce.user;

      if (!user) {
        return;
      }

      shipVariant = user.shipVariant;

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
      `;

      userElement.innerHTML = '';
      userElement.appendChild(logoutBtnElement);
      userElement.appendChild(newUserElement);

      const selectShipVariantElement = document.createElement('select');
      selectShipVariantElement.addEventListener('change', (event) => {
        shipVariant = event.target.value;
        api('api/ship', 'POST', { shipVariant });
      });

      shipVariants.forEach((shipVariantOption) => {
        const optionElement = document.createElement('option');
        if (shipVariant === shipVariantOption) {
          optionElement.selected = true;
        }
        optionElement.value = shipVariantOption;
        optionElement.innerText = `${shipVariantOption} ship`;
        selectShipVariantElement.appendChild(optionElement);
      });

      userElement.appendChild(selectShipVariantElement);

      if (user.login === 'admin') {
        const adminLinkElement = document.createElement('button');
        adminLinkElement.innerText = 'Admin';
        adminLinkElement.addEventListener('click', async () => {
          switchPage('admin');
        });

        userElement.appendChild(document.createElement('br'));
        userElement.appendChild(adminLinkElement);
      }
    })
    .catch((error) => {
      console.error(error);
    });

  const restartGameButtonElement = document.getElementById('restart');
  restartGameButtonElement.addEventListener('click', () => {
    api('api/restart', 'POST');
    updateStatistics();
  });

  const gamesTableElement = document.getElementById('games-table');

  api('api/games').then((games) => {
    games.forEach((game) => {
      const rowElement = document.createElement('tr');
      const userElement = document.createElement('td');
      const watchElement = document.createElement('td');

      userElement.innerText = game.user;

      const watchButtonElement = document.createElement('button');
      watchButtonElement.innerText = 'Watch';
      watchButtonElement.addEventListener('click', () => {
        gameWatchToken = game.token;
        switchPage('watch');
      });
      watchElement.appendChild(watchButtonElement);

      rowElement.appendChild(userElement);
      rowElement.appendChild(watchElement);

      gamesTableElement.appendChild(rowElement);
    });
  });

  window.addEventListener('keydown', handleKeyInput);
  game('player', getUserToken());
  updateStatistics();
}

// Game logic
function updateStatistics() {
  const maxScoreElement = document.getElementById('max-score');
  const maxSpeedElement = document.getElementById('max-speed');

  api('api/statistics').then((data) => {
    maxScoreElement.innerText = `Max score: ${data.maxScore}`;
    maxSpeedElement.innerText = `Max speed: ${data.maxSpeed}`;
  });
}

function rotateShip(direction) {
  api('api/rotate', 'POST', { direction });
}

function addLaser() {
  api('api/laser', 'POST');
}

function handleKeyInput(ev) {
  if (ev.code === 'ArrowLeft' || ev.code === 'KeyA') rotateShip(-1);
  else if (ev.code === 'ArrowRight' || ev.code === 'KeyD') rotateShip(1);
  else if (ev.code === 'Space') addLaser();
}

function game(type, token) {
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

  const spaceShipImages = new Map();

  const asteroidImage = new Image();
  const snowBallImage = new Image();

  const whiteSpaceShipImage = new Image();
  // Source: https://opengameart.org/content/spaceship-1
  // License(s): http://www.gnu.org/licenses/gpl-3.0.html
  whiteSpaceShipImage.src =
    'https://opengameart.org/sites/default/files/styles/medium/public/pitrizzo-SpaceShip-gpl3-opengameart-24x24-prev.png';
  spaceShipImages.set('white', whiteSpaceShipImage);

  const orangeSpaceShipImage = new Image();
  // Source: https://opengameart.org/content/asteroids-game-sprites-atlas
  // License(s): CC0 1.0 Universal
  orangeSpaceShipImage.src =
    'https://opengameart.org/sites/default/files/styles/medium/public/Preview_1.gif';
  spaceShipImages.set('orange', orangeSpaceShipImage);

  const purpleSpaceShipImage = new Image();
  // Source: https://opengameart.org/content/purple-space-ship
  // License(s): CC0 1.0 Universal
  purpleSpaceShipImage.src =
    'https://opengameart.org/sites/default/files/styles/medium/public/DurrrSpaceShip_0.png';
  spaceShipImages.set('purple', purpleSpaceShipImage);

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
    const image = spaceShipImages.get(shipVariant);

    // cheak if image is loaded
    if (!image.complete) {
      image.onload = () => {
        drawRotatedImage(
          image,
          xShip * CELLSIZE - CELLSIZE,
          yShip * CELLSIZE - CELLSIZE,
          shipCells * CELLSIZE,
          shipCells * CELLSIZE,
          (rShip % 8) * 45,
        );
      };
    }

    drawRotatedImage(
      image,
      xShip * CELLSIZE - CELLSIZE,
      yShip * CELLSIZE - CELLSIZE,
      shipCells * CELLSIZE,
      shipCells * CELLSIZE,
      (rShip % 8) * 45,
    );
  }

  displayShip();

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

  ws.onopen = () => {
    ws.send(JSON.stringify({ type, token }));
  };

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
