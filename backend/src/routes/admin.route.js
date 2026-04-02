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
import fs from 'fs/promises';

const router = Router();

const deleteLocalUploadFiles = async (req) => {
  const filesToDelete = [];

  if (Array.isArray(req.files)) {
    filesToDelete.push(...req.files);
  } else if (req.files && typeof req.files === 'object') {
    Object.values(req.files).forEach((value) => {
      if (Array.isArray(value)) {
        filesToDelete.push(...value);
      }
    });
  }

  if (req.file) {
    filesToDelete.push(req.file);
  }

  await Promise.all(
    filesToDelete.map((file) =>
      fs.unlink(file.path).catch(() => {
        // Ignore cleanup errors so response handling remains predictable.
      })
    )
  );
};

const handleProductImageUpload = (req, res, next) => {
  upload.array('images', 3)(req, res, async (err) => {
    if (!err) return next();

    await deleteLocalUploadFiles(req);

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
