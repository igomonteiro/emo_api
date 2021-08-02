import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

// Controllers
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';

// Authentication
import authenticated from './middlewares/authenticated';

const routes = new Router();
const upload = multer(multerConfig);

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

// Files
routes.post('/files', upload.single('file'), authenticated, FileController.create);

export default routes;