import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer.config';

import SessionController from './app/controllers/session.controller';
import RecipientController from './app/controllers/recipient.controller';
import authMiddleware from './app/middlewares/auth.middleware';
import FileController from './app/controllers/file.controller';
import DelivererController from './app/controllers/deliverer.controller';
import OrderController from './app/controllers/order.controller';
import OrderWithdrawalController from './app/controllers/order-withdrawal.controller';
import AssignedOrdersController from './app/controllers/assigned-orders.controller';
import DeliveredOrdersController from './app/controllers/delivered-orders.controller';
import OrderDeliverController from './app/controllers/order-deliver.controller';

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

routes.get('/deliverers', DelivererController.index);
routes.post('/deliverers', DelivererController.store);
routes.get('/deliverers/:id', DelivererController.show);
routes.put('/deliverers/:id', DelivererController.update);
routes.delete('/deliverers/:id', DelivererController.delete);

routes.get('/deliverers/:id/assigned-orders', AssignedOrdersController.index);
routes.get('/deliverers/:id/delivered-orders', DeliveredOrdersController.index);

routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.store);
routes.get('/orders/:id', OrderController.show);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

routes.post('/orders/:id/withdrawal', OrderWithdrawalController.store);
routes.post('/orders/:id/deliver', OrderDeliverController.store);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
