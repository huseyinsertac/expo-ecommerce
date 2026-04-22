import express from 'express';
import path from 'path';
import { ENV } from './config/env.js';
import connectDB from './config/db.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import { inngest, functions } from './config/inngest.js';

import adminRoutes from './routes/admin.route.js';
import userRoutes from './routes/user.route.js';
import orderRoutes from './routes/order.route.js';
import reviewRoutes from './routes/review.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import paymentRoutes from './routes/payment.route.js';
import cors from 'cors';

const app = express();

const __dirname = path.resolve();

app.use(
  '/api/payment',
  (req, res, next) => {
    if (req.originalUrl === '/api/payment/webhook') {
      express.raw({ type: 'application/json' })(req, res, next);
    } else {
      express.json()(req, res, next); //parse json or non-webhook routes
    }
  },
  paymentRoutes
);

app.use(express.json());

if (!ENV.CLIENT_URL) {
  throw new Error('CLIENT_URL environment variable is required');
}

/*app.use(cors({
  origin: [ENV.CLIENT_URL, 'http://192.168.1.106:3000', 'http://localhost:8081', 'http://localhost:5173'],
  credentials: true
}));*/

app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use(clerkMiddleware());

app.use('/api/inngest', serve({ client: inngest, functions }));

app.use('/api/admin', adminRoutes);

app.use('/api/users', userRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/reviews', reviewRoutes);

app.use('/api/products', productRoutes);

app.use('/api/cart', cartRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Success' });
});

if (ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../admin/dist')));

  app.get('/{*any}', (req, res) => {
    res.sendFile(path.join(__dirname, '../admin', 'dist', 'index.html'));
  });
}

const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log('Server is up and running on port', ENV.PORT);
  });
};

startServer();
