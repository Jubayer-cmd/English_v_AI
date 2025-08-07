import type { Context } from "hono";
import { auth } from "./auth";
import { prisma } from "../../client";

export const authGetUser = async (c: Context) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "Unauthorized" }, { status: 401 });
  return c.json({ user: session.user, success: true });
};

export const authGetMe = async (c: Context) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Get user information with subscription details
    const userDetails = await prisma.user.findUnique({
      where: { id: session.user.id },
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
    return c.json(
      { success: false, error: "Failed to get user" },
      { status: 500 },
    );
  }
};

export const authSignOut = async (c: Context) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "Not authenticated" }, { status: 401 });
  await auth.api.signOut({ headers: c.req.raw.headers });
  return c.json({ success: true, message: "Signed out successfully" });
};
