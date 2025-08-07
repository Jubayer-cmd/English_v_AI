import { Hono } from "hono";
import {
  getPlans,
  getPlanById,
  getUserSubscription,
  createSubscription,
  cancelSubscription,
  getUserUsage,
  updateUsage,
} from "./subscription.controller";
import { authMiddleware } from "../../middleware/auth";

export const subscriptionRouter = new Hono();

// Public routes (no auth required)
subscriptionRouter.get("/plans", getPlans);
subscriptionRouter.get("/plans/:planId", getPlanById);

// Protected routes (auth required)
subscriptionRouter.get("/subscription", authMiddleware, getUserSubscription);
subscriptionRouter.post("/subscription", authMiddleware, createSubscription);
subscriptionRouter.delete("/subscription", authMiddleware, cancelSubscription);
subscriptionRouter.get("/usage", authMiddleware, getUserUsage);
subscriptionRouter.post("/usage", authMiddleware, updateUsage);
