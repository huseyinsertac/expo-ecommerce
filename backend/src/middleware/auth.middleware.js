import { requireAuth } from "@clerk/express";
import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

export const protectRoute = [
requireAuth({ apiKey: ENV.CLERK_API_KEY }),
async (req, res, next) => {
  try {
    const { clerkId } = req.auth.userId;
    if (!clerkId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internalserver error" });
  }
}
];

export const adminOnly = (req, res, next) => {
 if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  } 

  if (req.user.email !== ENV.ADMIN_EMAIL) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};      