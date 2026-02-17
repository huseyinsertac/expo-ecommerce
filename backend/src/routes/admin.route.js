import { Router } from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
} from '../controllers/admin.controller.js';
import {
  getAllOrders,
  updateOrderStatus,
} from '../controllers/order.controller.js';
import { adminOnly, protectRoute } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const router = Router();

router.use(protectRoute, adminOnly);

router.post('/products', upload.array('images', 3), createProduct);

router.get('/products', getProducts);

router.put('/products/:id', upload.array('images', 3), updateProduct);

router.get('/orders', getAllOrders);

router.patch('/orders/:id/status', updateOrderStatus);

router.delete('/products/:id', deleteProduct);

export default router;
