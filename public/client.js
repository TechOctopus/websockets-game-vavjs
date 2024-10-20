// Heorhi Davydau
const xFields = 59;
const yFields = 59;
const mid = {
  x: Math.floor(xFields / 2),
  y: Math.floor(yFields / 2),
};

const root = document.body;

async function api(endpoint, method = 'GET', body = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (method !== 'GET') options.body = JSON.stringify(body);

  const response = await fetch(`/api${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

function renderTag(data) {
  const tag = document.createElement(data.tag);
  if (data.id) tag.id = data.id;
  if (data.style) tag.style = data.style;
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

function getHref() {
  return window.location.pathname;
}

const data = await api(getHref());
render(data);

async function rotateShip(direction) {
  await api('/rotate', 'POST', { direction });
}

async function addLaser() {
  await api('/laser', 'POST');
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

function getUserID() {
  const userID = localStorage.getItem('user');
  if (userID) return userID;
  const newUserID = crypto.randomUUID();
  localStorage.setItem('user', newUserID);
  return newUserID;
}

const userID = getUserID();
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
