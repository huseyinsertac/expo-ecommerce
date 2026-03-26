import { Router } from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import { getProductById } from '../controllers/product.controller.js';
import { getAllProducts } from '../controllers/admin.controller.js';

const router = Router();

router.get('/', protectRoute, getAllProducts);
router.get('/:id', getProductById);

export default router;