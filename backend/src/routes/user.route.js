import { Router } from 'express';
import { addAddress } from '../controllers/user.controller.js';

const router = Router();

router.use(protectRoute);

router.post('/addresses', addAddress);
router.get('/addresses', (req, res) => {
  res.status(200).json({ message: 'Get addresses endpoint' });
});
router.put('/addresses/:id', (req, res) => {
  res.status(200).json({ message: 'Update address endpoint' });
});
router.delete('/addresses/:id', (req, res) => {
  res.status(200).json({ message: 'Delete address endpoint' });
});

router.post('/wishlist', (req, res) => {
  res.status(200).json({ message: 'Add to wishlist endpoint' });
});
router.get('/wishlist', (req, res) => {
  res.status(200).json({ message: 'Get wishlist endpoint' });
});
router.delete('/wishlist/:productId', (req, res) => {
  res.status(200).json({ message: 'Remove from wishlist endpoint' });
});

export default router;

import { addAddress } from '../controllers/user.controller.js';
