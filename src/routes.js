import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

// Controllers
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import FileController from './app/controllers/FileController';
import EmotionController from './app/controllers/EmotionController';

// Authentication
import authenticated from './middlewares/authenticated';

const routes = new Router();
const upload = multer(multerConfig);

// Session
routes.get('/session', authenticated, SessionController.getUserLoggedIn);
routes.post('/session', SessionController.newSession);

// User
routes.post('/users', UserController.create);
routes.put('/users', authenticated, UserController.update);

// Emotions
routes.post('/emotions', authenticated, EmotionController.create);
routes.get('/emotions/date', authenticated, EmotionController.emotionsByDate);
routes.get('/emotions/week', authenticated, EmotionController.weekEmotions);

// Files
routes.post('/files', upload.single('file'), authenticated, FileController.create);

export default routes;