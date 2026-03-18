import { Router } from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  updateOrderStatus,
  getAllCustomers,
  getDashboardStats,
} from '../controllers/admin.controller.js';
import { getAllOrders } from '../controllers/order.controller.js';
import { adminOnly, protectRoute } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';
import { get } from 'http';

const router = Router();

router.use(protectRoute, adminOnly);

router.post('/products', upload.array('images', 3), createProduct);

router.get('/products', getAllProducts);

router.put('/products/:id', upload.array('images', 3), updateProduct);

router.get('/orders', getAllOrders);

router.patch('/orders/:orderId/status', updateOrderStatus);

router.get('/customers', getAllCustomers);

router.get('/stats', getDashboardStats);

router.delete('/products/:id', deleteProduct);

export default router;
