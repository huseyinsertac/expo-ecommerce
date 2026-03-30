import { requireAuth } from '@clerk/express';
import { clerkClient } from '@clerk/express';
import User from '../models/user.model.js';
import { ENV } from '../config/env.js';

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const auth = req.auth();
      const clerkId = auth?.userId;

      if (!clerkId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Fetch full user data from Clerk backend
      const clerkUser = await clerkClient.users.getUser(clerkId);
      const clerkEmail =
        clerkUser?.emailAddresses?.[0]?.emailAddress ||
        `user_${clerkId}@example.com`;
      const clerkName =
        clerkUser?.firstName && clerkUser?.lastName
          ? `${clerkUser.firstName} ${clerkUser.lastName}`
          : clerkUser?.firstName || 'Unknown User';

      // Determine role: admin if email matches ADMIN_EMAIL, otherwise customer
      const role = clerkEmail === ENV.ADMIN_EMAIL ? 'admin' : 'customer';

      // Atomic upsert: create or update user in one operation
      const user = await User.findOneAndUpdate(
        { clerkId },
        {
          clerkId,
          email: clerkEmail,
          name: clerkName,
          role,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      req.user = user;
      next();
    } catch (error) {
      console.error('Error in protectRoute middleware:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
];

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.user.email !== ENV.ADMIN_EMAIL) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
};
