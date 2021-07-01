import { Router } from 'express';

// Controllers
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

// Authentication
import authenticated from './middlewares/authenticated';

const routes = new Router();

// Session
routes.post('/session', SessionController.newSession);

// User
routes.get('/users', UserController.getAll);
routes.post('/users', UserController.register);

export default routes;