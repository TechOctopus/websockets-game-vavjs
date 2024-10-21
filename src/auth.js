// Heorhi Davydau
import CSV from './csv.js';
import { v4 as uuidv4 } from 'uuid';

export default class Auth {
  constructor() {
    this.users = new Map();
    this.CSV = new CSV();
  }

  login(login, email, password) {
    const user = this.CSV.getUser(login, email, password);

    if (!user) {
      return undefined;
    }

    const newToken = uuidv4();
    this.users.set(newToken, user);
    return newToken;
  }

  logout(token) {
    this.users.delete(token);
  }

  register(login, email, password) {
    if (this.CSV.checkUserLoginAndEmail(login, email)) {
      return false;
    }

    const user = this.CSV.getUser(login, email, password);

    if (user) {
      return false;
    }

    this.CSV.setUser(login, email, password);
    return true;
  }

  getUser(token) {
    return this.users.get(token);
  }
}
