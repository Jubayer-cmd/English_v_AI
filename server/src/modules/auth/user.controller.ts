import type { Context } from "hono";
import { prisma } from "../../client";
import { UserRole } from "@prisma/client";

export class UserController {
  // Get current user information
  async getCurrentUser(c: Context) {
    try {
      const user = c.get("user");

      if (!user) {
        return c.json({ error: "Not authenticated" }, 401);
      }

      // Get user information with subscription details
      const userDetails = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          subscriptions: {
            where: {
              status: "ACTIVE",
            },
            take: 1,
            orderBy: {
              createdAt: "desc",
            },
            select: {
              id: true,
              status: true,
              plan: {
                select: {
                  id: true,
                  name: true,
                  type: true,
                },
              },
            },
          },
        },
      });

      // Format the response with tier information
      const currentSubscription = userDetails?.subscriptions?.[0];
      const userWithTier = {
        ...userDetails,
        tier: currentSubscription?.plan?.name || "Free",
        tierType: currentSubscription?.plan?.type || "FREE",
        subscriptionStatus: currentSubscription?.status || "FREE",
      };

      // Remove the subscriptions array from the response as we've flattened it
      const { subscriptions, ...userResponse } = userWithTier;

      return c.json({ success: true, data: userResponse });
    } catch (error) {
      console.error("Error getting current user:", error);
      return c.json({ success: false, error: "Failed to get user" }, 500);
    }
  }

  // Update user profile
  async updateProfile(c: Context) {
    try {
      const user = c.get("user");
      const { name, image } = await c.req.json();

      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          name,
          image,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return c.json({ success: true, data: updatedUser });
    } catch (error) {
      return c.json({ success: false, error: "Failed to update profile" }, 500);
    }
  }

  // Admin only: Promote user to admin
  async promoteToAdmin(c: Context) {
    try {
      const { userId } = c.req.param();
      const currentUser = c.get("user");

      // Double check admin role
      if (currentUser.role !== UserRole.ADMIN) {
        return c.json({ error: "Admin access required" }, 403);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: UserRole.ADMIN },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      return c.json({
        success: true,
        data: updatedUser,
        message: "User promoted to admin successfully",
      });
    } catch (error) {
      return c.json({ success: false, error: "Failed to promote user" }, 500);
    }
  }

  // Admin only: Demote admin to user
  async demoteToUser(c: Context) {
    try {
      const { userId } = c.req.param();
      const currentUser = c.get("user");

      // Double check admin role
      if (currentUser.role !== UserRole.ADMIN) {
        return c.json({ error: "Admin access required" }, 403);
      }

      // Prevent self-demotion
      if (currentUser.id === userId) {
        return c.json({ error: "Cannot demote yourself" }, 400);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: UserRole.USER },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      return c.json({
        success: true,
        data: updatedUser,
        message: "User demoted to regular user successfully",
      });
    } catch (error) {
      return c.json({ success: false, error: "Failed to demote user" }, 500);
    }
  }

  // Admin only: Get all users
  async getAllUsers(c: Context) {
    try {
      const currentUser = c.get("user");

      if (currentUser.role !== UserRole.ADMIN) {
        return c.json({ error: "Admin access required" }, 403);
      }

      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: {
              chatSessions: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return c.json({ success: true, data: users });
    } catch (error) {
      return c.json({ success: false, error: "Failed to get users" }, 500);
    }
  }
}
