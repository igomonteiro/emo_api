import { Router } from 'express';

// Controllers
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

// Authentication
import authenticated from './middlewares/authenticated';

const routes = new Router();

// Test
routes.get('/', (req, res) => {
  res.json({ ok: true });
})

// Session
routes.get('/session', authenticated, SessionController.getUserLoggedIn);
routes.post('/session', SessionController.newSession);

// User
routes.post('/users', UserController.create);
routes.put('/users', authenticated, UserController.update);

export default routes;