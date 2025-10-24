import { Router } from 'express';
import {
  createOrder,
  getOrder,
  updateOrderStatus,
  listOrders,
} from '../controllers/order.controller';

const router = Router();
router.post('/create', createOrder);
router.get('/:id', getOrder);
router.patch('/:id/status', updateOrderStatus);
router.get('/', listOrders);

export default router;
