import { Router } from 'express';
<<<<<<< HEAD
import { protectRoute } from '../middleware/auth.middleware';
import { getAllProducts } from '../controllers/admin.controller.js';
import { getProductById } from '../controllers/product.controller.js';
=======
import { protectRoute } from '../middleware/auth.middleware.js';
import { getProductById } from '../controllers/product.controller.js';
import { getAllProducts } from '../controllers/admin.controller.js';
>>>>>>> 42ab8ba2f5b958b46f38d008967a79df6a620ee2

const router = Router();

router.get('/', protectRoute, getAllProducts);
router.get('/:id', getProductById);

export default router;