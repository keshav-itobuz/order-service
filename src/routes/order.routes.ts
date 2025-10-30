import { Router } from 'express';
import OrderController from '../controllers/order.controller';

const router = Router();
router.post('/create', OrderController.createOrder);
router.get('/:id', OrderController.getOrder);
router.patch('/:id/status', OrderController.updateOrderStatus);
router.get('/', OrderController.listOrders);

export default router;
