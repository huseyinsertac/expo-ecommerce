import { Router } from 'express';
import { protectiveRoute } from '../middleware/auth.middleware.js';
import {
  createReview,
  getProductReviews,
  deleteReview,
} from '../controllers/review.controller.js';

const router = Router();

router.post('/', protectiveRoute, createReview);

router.get('/product/:productId', getProductReviews);

router.delete('/:id', protectiveRoute, deleteReview);

export default router;
