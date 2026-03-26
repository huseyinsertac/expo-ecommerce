import { Router } from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
  createReview,
  deleteReview,
} from '../controllers/review.controller.js';

const router = Router();

router.post('/', protectRoute, createReview);

// we did not implement this function in the mobile app - in the frontend
// but jic if you'd like the see the backend code here it is - i provided this.
router.delete('/:reviewId', protectRoute, deleteReview);

export default router;
