// Heorhi Davydau
import { csv } from './csv.js';
import { v4 as uuidv4 } from 'uuid';

class Auth {
  constructor() {
    this.users = new Map();
    this.csv = csv;
  }

  login(login, email, password) {
    const user = this.csv.getUser(login, email, password);

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
    if (this.csv.checkUserLoginAndEmail(login, email)) {
      return false;
    }

    const user = this.csv.getUser(login, email, password);

    if (user) {
      return false;
    }

    this.csv.setUser(login, email, password);
    return true;
  }

  getUser(token) {
    return this.users.get(token) || this.csv.getUser();
  }
}

export const auth = new Auth();
