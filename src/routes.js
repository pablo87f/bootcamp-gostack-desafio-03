import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer.config';
import SessionController from './app/controllers/session.controller';
import RecipientController from './app/controllers/recipient.controller';
import authMiddleware from './app/middlewares/auth.middleware';
import FileController from './app/controllers/file.controller';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/status', (req, res) => res.json({ status: 'ok' }));

routes.post('/sessions', SessionController.store);

// middleware que verifica token e injeta o id do usuário logado no obj request
routes.use(authMiddleware);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.get('/recipients/:id', RecipientController.show);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
