import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  createPaymentIntent,
} from '../controllers/order.controller';
import { optionalAuthJWT, authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.post('/', optionalAuthJWT, createOrder);
router.get('/my-orders', authenticateJWT, getUserOrders);
router.post('/create-payment-intent', optionalAuthJWT, createPaymentIntent);
router.get('/:id', optionalAuthJWT, getOrderById);

export default router;
