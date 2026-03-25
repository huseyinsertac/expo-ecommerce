import { Router } from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import { get } from 'mongoose';

const router = Router();

router.get('/', protectRoute, getAllProducts);
router.get('/:id', getProductById);

export default router;
