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
    return this.users.get(token);
  }

  updateShipVariant(userToken, shipVariant) {
    const user = this.users.get(userToken);
    if (!user) {
      return false;
    }

    store.setShipVariant(user, shipVariant);
    this.users.set(userToken, { ...user, shipVariant });

    return true;
  }

  getShipVariant(userToken) {
    const user = this.users.get(userToken);
    if (!user) {
      return 'white';
    }

    return user.shipVariant;
  }
}

export const auth = new Auth();
