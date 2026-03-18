import Router from 'express';
const router = Router();

export default router;

import { protectRoute } from '../middleware/auth.middleware.js';
import {
  createOrder,
  getAllOrders,
  getOrderById,
} from '../controllers/order.controller.js';

router.post('/', protectRoute, createOrder);
router.get('/', protectRoute, getAllOrders);
router.get('/:id', protectRoute, getOrderById);
