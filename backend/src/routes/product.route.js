import { Router } from 'express';
<<<<<<< coderabbitai/autofix/07a1404
import { protectRoute } from '../middleware/auth.middleware';
=======
import { protectRoute } from '../middleware/auth.middleware.js';
>>>>>>> review-product-routes
import { getProductById } from '../controllers/product.controller.js';
import { getAllProducts } from '../controllers/admin.controller.js';

const router = Router();

router.get('/', protectRoute, getAllProducts);
router.get('/:id', getProductById);

export default router;