// Heorhi Davydau
import fs from 'fs';

const CSV_FILE = 'src/data.csv';

// Structure of the CSV file:
// login, email, password, max score, max speed
// if data don't exist, it's replaced by none

const LOGIN_FIELD = 0;
const EMAIL_FIELD = 1;
const PASSWORD_FIELD = 2;
const MAX_SCORE_FIELD = 3;
const MAX_SPEED_FIELD = 4;

export default class CSV {
  constructor() {
    this.CSVfile = this.readAndParseCSV();
  }

  readAndParseCSV() {
    const data = fs.readFileSync(CSV_FILE, 'utf8');
    return data
      .split('\n')
      .map((line) => line.split(','))
      .filter((line) => line.length > 1);
  }

  saveCSV() {
    const data = this.CSVfile.map((line) => line.join(',')).join('\n');
    fs.writeFileSync(CSV_FILE, data);
  }

  getUser(login, email, password) {
    const data = this.CSVfile.find(
      (line) =>
        line[LOGIN_FIELD] === login &&
        line[EMAIL_FIELD] === email &&
        line[PASSWORD_FIELD] === password,
    );
    return data
      ? {
          login: data[LOGIN_FIELD],
          email: data[EMAIL_FIELD],
          password: data[PASSWORD_FIELD],
          maxScore: data[MAX_SCORE_FIELD],
          maxSpeed: data[MAX_SPEED_FIELD],
        }
      : undefined;
  }

  checkUserLoginAndEmail(login, email) {
    return this.CSVfile.some(
      (line) => line[LOGIN_FIELD] === login || line[EMAIL_FIELD] === email,
    );
  }

  setUser(login, email, password, maxScore = 'none', maxSpeed = 'none') {
    const user = this.getUser(login, email);
    if (user) {
      user[PASSWORD_FIELD] = password;
      user[MAX_SCORE_FIELD] = maxScore;
      user[MAX_SPEED_FIELD] = maxSpeed;
    } else {
      this.CSVfile.push([login, email, password, maxScore, maxSpeed]);
    }
    this.saveCSV();
  }
}
