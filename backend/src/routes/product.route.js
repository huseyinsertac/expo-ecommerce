import { Router } from 'express';
import { getProductById } from '../controllers/product.controller.js';
import { getAllProducts } from '../controllers/admin.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protectRoute, getAllProducts);
router.get('/:id', protectRoute, getProductById);

export default router;
