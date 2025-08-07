import { Hono } from "hono";
import { auth } from "./auth";
import { authGetUser, authGetMe, authSignOut } from "./auth.controller";
import { UserController } from "./user.controller";
import { authMiddleware, requireAdmin } from "../../middleware/auth";

export const authRouter = new Hono();
const userController = new UserController();

// Better Auth raw handlers under /auth/*
authRouter.all("/auth/*", (c) => auth.handler(c.req.raw));

// Convenience endpoints
authRouter.get("/user", authGetUser);
authRouter.get("/me", authGetMe);
authRouter.post("/signout", authSignOut);

// Protected user endpoints
authRouter.put(
  "/me",
  authMiddleware,
  userController.updateProfile.bind(userController),
);

// Admin only user management endpoints
authRouter.get(
  "/admin/users",
  authMiddleware,
  requireAdmin,
  userController.getAllUsers.bind(userController),
);
authRouter.put(
  "/admin/users/:userId/promote",
  authMiddleware,
  requireAdmin,
  userController.promoteToAdmin.bind(userController),
);
authRouter.put(
  "/admin/users/:userId/demote",
  authMiddleware,
  requireAdmin,
  userController.demoteToUser.bind(userController),
);
