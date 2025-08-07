import type { Context } from "hono";
import { prisma } from "../../client";
import { PlanType, SubscriptionStatus } from "@prisma/client";

// Get all available plans
export const getPlans = async (c: Context) => {
  try {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });

    return c.json({ success: true, data: plans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return c.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
};

// Get plan by ID
export const getPlanById = async (c: Context) => {
  try {
    const planId = c.req.param("planId");

    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return c.json({ error: "Plan not found" }, { status: 404 });
    }

    return c.json({ success: true, data: plan });
  } catch (error) {
    console.error("Error fetching plan:", error);
    return c.json({ error: "Failed to fetch plan" }, { status: 500 });
  }
};

// Get user's current subscription
export const getUserSubscription = async (c: Context) => {
  try {
    const userId = c.get("user").id;

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL] },
      },
      include: {
        plan: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return c.json({ success: true, data: subscription });
  } catch (error) {
    console.error("Error fetching user subscription:", error);
    return c.json({ error: "Failed to fetch subscription" }, { status: 500 });
  }
};

// Create new subscription
export const createSubscription = async (c: Context) => {
  try {
    const userId = c.get("user").id;
    const { planId } = await c.req.json();

    if (!planId) {
      return c.json({ error: "Plan ID is required" }, { status: 400 });
    }

    // Check if plan exists
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return c.json({ error: "Plan not found" }, { status: 404 });
    }

    // Cancel any existing active subscription
    await prisma.subscription.updateMany({
      where: {
        userId,
        status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL] },
      },
      data: {
        status: SubscriptionStatus.CANCELLED,
        cancelAtPeriodEnd: true,
      },
    });

    // Create new subscription
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId,
        status:
          plan.type === PlanType.FREE
            ? SubscriptionStatus.ACTIVE
            : SubscriptionStatus.TRIAL,
        currentPeriodStart: now,
        currentPeriodEnd: nextMonth,
        trialStart: plan.type === PlanType.FREE ? null : now,
        trialEnd: plan.type === PlanType.FREE ? null : nextMonth,
      },
      include: {
        plan: true,
      },
    });

    return c.json({ success: true, data: subscription }, { status: 201 });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return c.json({ error: "Failed to create subscription" }, { status: 500 });
  }
};

// Cancel subscription
export const cancelSubscription = async (c: Context) => {
  try {
    const userId = c.get("user").id;
    const { subscriptionId } = await c.req.json();

    if (!subscriptionId) {
      return c.json({ error: "Subscription ID is required" }, { status: 400 });
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId,
        status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL] },
      },
    });

    if (!subscription) {
      return c.json({ error: "Subscription not found" }, { status: 404 });
    }

    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: SubscriptionStatus.CANCELLED,
        cancelAtPeriodEnd: true,
        canceledAt: new Date(),
      },
    });

    return c.json({
      success: true,
      message: "Subscription cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return c.json({ error: "Failed to cancel subscription" }, { status: 500 });
  }
};

// Get user usage
export const getUserUsage = async (c: Context) => {
  try {
    const userId = c.get("user").id;

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL] },
      },
      include: {
        plan: true,
      },
    });

    if (!subscription) {
      return c.json({
        success: true,
        data: {
          voiceMinutesUsed: 0,
          textMessagesUsed: 0,
          voiceMinutesLimit: 0,
          textMessagesLimit: 0,
        },
      });
    }

    return c.json({
      success: true,
      data: {
        voiceMinutesUsed: subscription.voiceMinutesUsed,
        textMessagesUsed: subscription.textMessagesUsed,
        voiceMinutesLimit: subscription.plan.voiceMinutes,
        textMessagesLimit: subscription.plan.textMessages,
      },
    });
  } catch (error) {
    console.error("Error fetching user usage:", error);
    return c.json({ error: "Failed to fetch usage" }, { status: 500 });
  }
};

// Update usage
export const updateUsage = async (c: Context) => {
  try {
    const userId = c.get("user").id;
    const { voiceMinutes = 0, textMessages = 0 } = await c.req.json();

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL] },
      },
    });

    if (!subscription) {
      return c.json({ error: "No active subscription found" }, { status: 404 });
    }

    // Update subscription usage
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        voiceMinutesUsed: {
          increment: voiceMinutes,
        },
        textMessagesUsed: {
          increment: textMessages,
        },
      },
    });

    // Create usage record
    await prisma.usage.create({
      data: {
        userId,
        subscriptionId: subscription.id,
        voiceMinutes,
        textMessages,
      },
    });

    return c.json({ success: true, message: "Usage updated successfully" });
  } catch (error) {
    console.error("Error updating usage:", error);
    return c.json({ error: "Failed to update usage" }, { status: 500 });
  }
};
