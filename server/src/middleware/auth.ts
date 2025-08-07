import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { prisma } from "../client";
import { UserRole } from "@prisma/client";
import { auth } from "../modules/auth/auth";

// Extend the Context type to include user information
declare module "hono" {
  interface ContextVariableMap {
    user: {
      id: string;
      email: string;
      name: string;
      role: UserRole;
    };
  }
}

// Authentication middleware - verifies if user is logged in using Better Auth
export const authMiddleware = async (c: Context, next: Next) => {
  try {
    // Use Better Auth to get session
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      return c.json({ error: "Authentication required" }, 401);
    }

    // Get user details from database including role
    const userDetails = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!userDetails) {
      return c.json({ error: "User not found" }, 401);
    }

    // Set user in context
    c.set("user", userDetails);

    await next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return c.json({ error: "Authentication failed" }, 401);
  }
};

// Role-based authorization middleware
export const requireRole = (requiredRole: UserRole) => {
  return async (c: Context, next: Next) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }

    if (user.role !== requiredRole) {
      return c.json(
        {
          error: `Access denied. ${requiredRole} role required`,
        },
        403,
      );
    }

    await next();
  };
};

// Admin role middleware
export const requireAdmin = requireRole(UserRole.ADMIN);

// User role middleware (allows both USER and ADMIN)
export const requireUser = async (c: Context, next: Next) => {
  const user = c.get("user");

  if (!user) {
    return c.json({ error: "Authentication required" }, 401);
  }

  if (user.role !== UserRole.USER && user.role !== UserRole.ADMIN) {
    return c.json({ error: "User access required" }, 403);
  }

  await next();
};

// Optional auth middleware - doesn't fail if no auth, but sets user if available
export const optionalAuth = async (c: Context, next: Next) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (session) {
      const userDetails = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      if (userDetails) {
        c.set("user", userDetails);
      }
    }

    await next();
  } catch (error) {
    // Don't fail on optional auth errors, just continue without user
    await next();
  }
};
