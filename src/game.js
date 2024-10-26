// Heorhi Davydau
import { store } from './store.js';

const xFields = 59;
const yFields = 59;
const fields = 59;
const mid = {
  x: Math.floor(xFields / 2),
  y: Math.floor(yFields / 2),
};

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default class Game {
  constructor(ws, user) {
    this.ws = ws;
    this.watchersWs = [];
    this.user = user;

    if (this.user) {
      this.maxScore = store.getUserMaxScore(this.user);
      this.maxSpeed = store.getUserMaxSpeed(this.user);
    } else {
      this.maxScore = 'none';
      this.maxSpeed = 'none';
    }

    this.init();
    this.preGame();
  }

  init() {
    this.xShip = mid.x;
    this.yShip = mid.y;
    this.rShip = 0;
    this.missiles = [];
    this.lasers = [];
    this.counter = 0;
    this.ival = null;
    this.score = 0;
    this.speed = 1000;
  }

  rotateShip(rotation) {
    // calculate new ship points
    if (rotation > 0) this.rShip = (this.rShip + 1) % 8;
    else if (rotation < 0) {
      if (this.rShip === 0) this.rShip = 7;
      else this.rShip = this.rShip - 1;
    }

    // render new ship
    this.sendGameState();
  }

  addMissile() {
    const rand = random(0, 7);
    // 7 0 1
    // 6   2
    // 5 4 3
    if (rand === 0) this.missiles.push({ x: mid.x, y: 0 });
    else if (rand === 1) this.missiles.push({ x: xFields - 1, y: 0 });
    else if (rand === 2) this.missiles.push({ x: xFields - 1, y: mid.y });
    else if (rand === 3) this.missiles.push({ x: xFields - 1, y: yFields - 1 });
    else if (rand === 4) this.missiles.push({ x: mid.x, y: yFields - 1 });
    else if (rand === 5) this.missiles.push({ x: 0, y: yFields - 1 });
    else if (rand === 6) this.missiles.push({ x: 0, y: mid.y });
    else if (rand === 7) this.missiles.push({ x: 0, y: 0 });
  }

  moveMissiles() {
    this.missiles = this.missiles.map((missile) => {
      const m = (missile.y - mid.y) / (missile.x - mid.x);
      const b = missile.y - m * missile.x;

      if (missile.x === mid.x) {
        if (missile.y > mid.y) return { x: missile.x, y: missile.y - 1 };
        else return { x: missile.x, y: missile.y + 1 };
      } else if (missile.y === mid.y) {
        if (missile.x < mid.x) return { x: missile.x + 1, y: missile.y };
        else return { x: missile.x - 1, y: missile.y };
      } else {
        let retX = missile.x;
        let retY = missile.y;
        if (missile.y < mid.y) retY++;
        else retY--;
        if (missile.x < mid.x) retX++;
        else retX--;
        return { x: retX, y: retY };
      }
    });

    if (this.collision()) {
      this.endGame();
    }

    // displayMissiles
    this.sendGameState();
  }

  collision() {
    for (var i = 0; i < this.missiles.length; i++) {
      var missile = this.missiles[i];
      if (
        missile.x === mid.x + 1 ||
        missile.x === mid.x - 1 ||
        missile.y === mid.y + 1 ||
        missile.y === mid.y - 1
      ) {
        return true;
      }
    }
    return false;
  }

  addLaser() {
    // 7 0 1
    // 6   2
    // 5 4 3
    let retObj = { x: mid.x, y: mid.y, r: this.rShip };

    if (this.rShip === 0) {
      retObj.y = mid.y - 2;
    } else if (this.rShip === 1) {
      retObj.x = mid.x + 2;
      retObj.y = mid.y - 2;
    } else if (this.rShip === 2) {
      retObj.x = mid.x + 2;
    } else if (this.rShip === 3) {
      retObj.x = mid.x + 2;
      retObj.y = mid.y + 2;
    } else if (this.rShip === 4) {
      retObj.y = mid.y + 2;
    } else if (this.rShip === 5) {
      retObj.x = mid.x - 2;
      retObj.y = mid.y + 2;
    } else if (this.rShip === 6) {
      retObj.x = mid.x - 2;
    } else if (this.rShip === 7) {
      retObj.x = mid.x - 2;
      retObj.y = mid.y - 2;
    }

    this.lasers.push(retObj);
  }

  moveLasers() {
    // move lasers
    this.lasers = this.lasers.map((laser) => {
      if (laser.r === 0) {
        laser.y--;
      } else if (laser.r === 1) {
        laser.x++;
        laser.y--;
      } else if (laser.r === 2) {
        laser.x++;
      } else if (laser.r === 3) {
        laser.x++;
        laser.y++;
      } else if (laser.r === 4) {
        laser.y++;
      } else if (laser.r === 5) {
        laser.x--;
        laser.y++;
      } else if (laser.r === 6) {
        laser.x--;
      } else if (laser.r === 7) {
        laser.x--;
        laser.y--;
      }
      return laser;
    });

    this.lasers = this.lasers.filter((laser) => {
      if (laser.x < 0) return false;
      else if (laser.x > fields - 1) return false;
      else if (laser.y < 0) return false;
      else if (laser.y > fields - 1) return false;

      let laserXMissile = false;
      let removes = [];
      for (var i = 0; i < this.missiles.length; i++) {
        var missile = this.missiles[i];
        if (
          (missile.x === laser.x ||
            missile.x === laser.x + 1 ||
            missile.x === laser.x - 1) &&
          (missile.y === laser.y ||
            missile.y === laser.y + 1 ||
            missile.y === laser.y - 1)
        ) {
          laserXMissile = true;
          removes.push(i);
          break;
        }
      }

      if (removes.length > 0) {
        removes.forEach((remove) => {
          this.missiles.splice(remove, 1);
        });
        this.sendGameState();
      }

      return !laserXMissile;
    });

    this.sendGameState();
  }

  incrementScore(hm) {
    this.score = this.score + hm;
  }

  startGame() {
    this.score = 0;
    this.mainLoop();
  }

  endGame() {
    if (this.score > this.maxScore || this.maxScore === 'none') {
      if (this.user) {
        store.setUserMaxScore(this.user, this.score);
      }
      this.maxScore = this.score;
    }

    if (this.speed < this.maxSpeed || this.maxSpeed === 'none') {
      if (this.user) {
        store.setUserMaxSpeed(this.user, this.speed);
      }
      this.maxSpeed = this.speed;
    }

    clearInterval(this.ival);
    this.ival = null;
  }

  mainLoop() {
    this.ival = setInterval(() => {
      this.moveMissiles();
      this.moveLasers();
      this.counter++;
      this.incrementScore(10);
      if (this.counter % 5 === 0) this.addMissile();
      if (this.counter % 20 === 0) {
        clearInterval(this.ival);
        this.speed = Math.round(this.speed / 2);
        this.mainLoop();
      }
    }, this.speed);
  }

  preGame() {
    var countdown = 5;
    for (var i = 0; i < countdown; i++) {
      ((i) => {
        setTimeout(() => {}, i * 1000);
      })(i);
    }
    setTimeout(() => {
      this.startGame();
    }, (countdown + 1) * 1000);
  }

  restart() {
    clearInterval(this.ival);
    this.init();
    this.sendGameState();
    this.preGame();
  }

  sendGameState() {
    this.watchersWs.forEach((ws) => {
      ws.send(
        JSON.stringify({
          xShip: this.xShip,
          yShip: this.yShip,
          rShip: this.rShip,
          missiles: this.missiles,
          lasers: this.lasers,
          score: this.score,
          speed: this.speed,
        }),
      );
    });

    if (!this.ws) return;
    this.ws.send(
      JSON.stringify({
        xShip: this.xShip,
        yShip: this.yShip,
        rShip: this.rShip,
        missiles: this.missiles,
        lasers: this.lasers,
        score: this.score,
        speed: this.speed,
      }),
    );
  }

  setWathchersWS(ws) {
    this.watchersWs.push(ws);
  }

  deleteWatcherWS(ws) {
    this.watchersWs = this.watchersWs.filter((w) => w !== ws);
  }

  updateWs(ws) {
    this.ws = ws;
    this.sendGameState();
  }
}
