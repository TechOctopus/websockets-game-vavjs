// Heorhi Davydau
import fs from 'fs';
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

// I take and modify this code from https://stackoverflow.com/a/67038052
function hash(password) {
  const salt = randomBytes(16).toString('hex');
  const buf = scryptSync(password, salt, 32);
  return `${buf.toString('hex')}.${salt}`;
}

function verify(password, hash) {
  const [hashedPassword, salt] = hash.split('.');
  const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex');
  const suppliedPasswordBuf = scryptSync(password, salt, 32);
  return timingSafeEqual(hashedPasswordBuf, suppliedPasswordBuf);
}
// -----------------------------------------------

// Structure of the CSV file:
let index = 0;
const LOGIN_FIELD = index++;
const EMAIL_FIELD = index++;
const PASSWORD_FIELD = index++;
const MAX_SCORE_FIELD = index++;
const MAX_SPEED_FIELD = index++;

class Store {
  constructor() {
    this.users = [];
    this.createUser('admin', 'admin@mail.com', 'admin');
  }

  import(data) {
    this.users = data
      .split('\n')
      .map((line) => line.split(','))
      .filter((line) => line.length > 1)
      .map((line) => {
        return {
          login: line[LOGIN_FIELD],
          email: line[EMAIL_FIELD],
          password: line[PASSWORD_FIELD],
          maxScore: line[MAX_SCORE_FIELD],
          maxSpeed: line[MAX_SPEED_FIELD],
          shipVariant: 'white',
        };
      });
  }

  export() {
    return this.users
      .map(
        (user) =>
          `${user.login},${user.email},${user.password},${user.maxScore},${user.maxSpeed}`,
      )
      .join('\n');
  }

  getUser(login, password) {
    const user = this.users.find((user) => {
      const isPasswordsMatch = verify(password, user.password);
      const isLoginMatch = login === user.login;
      return isPasswordsMatch && isLoginMatch;
    });

    return user
      ? {
          login: user.login,
          email: user.email,
          maxScore: user.maxScore,
          maxSpeed: user.maxSpeed,
          shipVariant: user.shipVariant,
        }
      : undefined;
  }

  isLoginExist(login) {
    return this.users.some((user) => user.login === login);
  }

  isEmailExist(email) {
    return this.users.some((user) => user.email === email);
  }

  createUser(
    login,
    email,
    password,
    maxScore = 'none',
    maxSpeed = 'none',
    shipVariant = 'white',
  ) {
    if (this.isLoginExist(login) || this.isEmailExist(email)) {
      return false;
    }

    this.users.push({
      login,
      email,
      password: hash(password),
      maxScore,
      maxSpeed,
      shipVariant,
    });

    return true;
  }

  deleteUser(login, email) {
    this.users = this.users.filter(
      (user) => user.login !== login && user.email !== email,
    );
  }

  setUserMaxScore(userToUpdate, maxScore) {
    this.users.forEach((user) => {
      if (user.login === userToUpdate.login) {
        user.maxScore = maxScore;
      }
    });
  }

  setUserMaxSpeed(userToUpdate, maxSpeed) {
    this.users.forEach((user) => {
      if (user.login === userToUpdate.login) {
        user.maxSpeed = maxSpeed;
      }
    });
  }

  setShipVariant(userToUpdate, shipVariant) {
    this.users.forEach((user) => {
      if (user.login === userToUpdate.login) {
        user.shipVariant = shipVariant;
      }
    });
  }

  getUserMaxScore(userToFind) {
    return this.users.find((user) => user.login === userToFind.login).maxScore;
  }

  getUserMaxSpeed(userToFind) {
    return this.users.find((user) => user.login === userToFind.login).maxSpeed;
  }

  getUsers() {
    return this.users.map((user) => {
      return {
        login: user.login,
        email: user.email,
        maxScore: user.maxScore,
        maxSpeed: user.maxSpeed,
      };
    });
  }
}

export const store = new Store();
