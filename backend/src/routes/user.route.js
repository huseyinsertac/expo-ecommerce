import { Router } from 'express';
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from '../controllers/user.controller.js';

import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protectRoute);

//address routes
router.post('/addresses', protectRoute, addAddress);
router.get('/addresses', protectRoute, getAddresses);
router.put('/addresses/:addressId', protectRoute, updateAddress);
router.delete('/addresses/:addressId', protectRoute, deleteAddress);

//wishlist routes
router.post('/wishlist', protectRoute, addToWishlist);
router.get('/wishlist', protectRoute, getWishlist);
router.delete('/wishlist/:productId', protectRoute, removeFromWishlist);

export default router;
