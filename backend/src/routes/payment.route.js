import { Router } from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createPaymentIntent } from '../controllers/payment.controller.js';
import { handleWebhook } from '../controllers/payment.controller.js';

const router = Router();

router.post('/create-intent', protectRoute, createPaymentIntent);

//!! Webhook route should not be protected, as Stripe needs to access it without authentication

router.post('/webhook', handleWebhook);

export default router;
