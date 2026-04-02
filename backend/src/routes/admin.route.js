import { Router } from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  updateOrderStatus,
  getAllCustomers,
  getDashboardStats,
  getAllOrders,
} from '../controllers/admin.controller.js';
import { adminOnly, protectRoute } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const router = Router();

const handleProductImageUpload = (req, res, next) => {
  upload.array('images', 3)(req, res, (err) => {
    if (!err) return next();

    if (err.name === 'MulterError') {
      return res.status(400).json({ message: err.message });
    }

    return res
      .status(400)
      .json({ message: err.message || 'Invalid image upload' });
  });
};

router.use(protectRoute, adminOnly);

router.post('/products', handleProductImageUpload, createProduct);

router.get('/products', getAllProducts);

router.put('/products/:id', handleProductImageUpload, updateProduct);

router.delete('/products/:id', deleteProduct);

router.get('/orders', getAllOrders);

router.patch('/orders/:orderId/status', updateOrderStatus);

router.get('/customers', getAllCustomers);

router.get('/stats', getDashboardStats);

export default router;
