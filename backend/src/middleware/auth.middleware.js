import { requireAuth } from '@clerk/express';
import User from '../models/user.model.js';
import { ENV } from '../config/env.js';

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const auth = req.auth();
      console.log(
        'Auth middleware - Full auth object:',
        JSON.stringify(auth, null, 2)
      );
      const clerkId = auth?.userId;
      console.log('Auth middleware - Clerk userId:', clerkId);

      if (!clerkId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await User.findOne({ clerkId });
      console.log(
        'Auth middleware - Found user:',
        user ? user.email : 'NOT FOUND'
      );

      if (!user) {
        // For development, create user automatically if they don't exist
        console.log('Creating user automatically for clerkId:', clerkId);
        const newUser = await User.create({
          clerkId,
          email:
            auth?.emailAddresses?.[0]?.emailAddress ||
            `user_${clerkId}@example.com`,
          name:
            auth?.firstName && auth?.lastName
              ? `${auth?.firstName} ${auth?.lastName}`
              : auth?.firstName || 'Unknown User',
        });
        console.log('Created new user:', newUser.email);
        req.user = newUser;
      } else {
        // Update user information if it has changed
        const updatedEmail = auth?.emailAddresses?.[0]?.emailAddress;
        const updatedName =
          auth?.firstName && auth?.lastName
            ? `${auth?.firstName} ${auth?.lastName}`
            : auth?.firstName || 'Unknown User';

        if (updatedEmail && user.email !== updatedEmail) {
          console.log(
            `Updating user email from ${user.email} to ${updatedEmail}`
          );
          user.email = updatedEmail;
        }
        if (updatedName && user.name !== updatedName) {
          console.log(`Updating user name from ${user.name} to ${updatedName}`);
          user.name = updatedName;
        }
        if (user.isModified()) {
          await user.save();
        }
        req.user = user;
      }

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

  console.log('Admin check - User email:', JSON.stringify(req.user.email));
  console.log('Admin check - Admin email:', JSON.stringify(ENV.ADMIN_EMAIL));
  console.log(
    'Admin check - Emails equal:',
    req.user.email === ENV.ADMIN_EMAIL
  );

  if (req.user.email !== ENV.ADMIN_EMAIL) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
};
