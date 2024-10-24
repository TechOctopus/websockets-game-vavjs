// Heorhi Davydau
import { store } from './store.js';
import { v4 as uuidv4 } from 'uuid';

class Auth {
  constructor() {
    this.users = new Map();
  }

  login(login, password) {
    const user = store.getUser(login, password);

    if (!user) {
      return undefined;
    }

    // TODO: cheak is not already logged in other device, if yes retrun error and say to user to logout from other device

    const newToken = uuidv4();
    this.users.set(newToken, user);
    return newToken;
  }

  register(login, email, password) {
    if (store.createUser(login, email, password)) {
      return this.login(login, password);
    }
    return undefined;
  }

  logout(token) {
    this.users.delete(token);
  }

  getUser(token) {
    return this.users.get(token) || this.users.get('admin');
  }
}

export const auth = new Auth();
