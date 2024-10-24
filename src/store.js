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

const CSV_FILE = 'src/data.csv';

// Structure of the CSV file:
let index = 0;
const LOGIN_FIELD = index++;
const EMAIL_FIELD = index++;
const PASSWORD_FIELD = index++;
const MAX_SCORE_FIELD = index++;
const MAX_SPEED_FIELD = index++;

class Store {
  constructor() {
    this.users = this.readAndParseCSV();
  }

  readAndParseCSV() {
    const dataFromFile = fs.readFileSync(CSV_FILE, 'utf8');
    return dataFromFile
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
        };
      });
  }

  saveCSV() {
    const dataToSave = this.users
      .map((user) => Object.values(user).join(','))
      .join('\n');
    fs.writeFileSync(CSV_FILE, dataToSave);
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
        }
      : undefined;
  }

  isLoginExist(login) {
    return this.users.some((user) => user.login === login);
  }

  isEmailExist(email) {
    return this.users.some((user) => user.email === email);
  }

  createUser(login, email, password, maxScore = 'none', maxSpeed = 'none') {
    if (this.isLoginExist(login) || this.isEmailExist(email)) {
      return false;
    }

    this.users.push({
      login,
      email,
      password: hash(password),
      maxScore,
      maxSpeed,
    });
    this.saveCSV();

    return true;
  }

  updateUserStats(login, maxScore, maxSpeed) {
    const user = this.users.find((user) => user.login === login);
    if (user.maxScore < maxScore || user.maxScore === 'none') {
      user.maxScore = maxScore;
    }
    if (user.maxSpeed < maxSpeed || user.maxSpeed === 'none') {
      user.maxSpeed = maxSpeed;
    }
    this.saveCSV();
  }

  getUsers() {
    return this.users;
  }
}

export const store = new Store();
