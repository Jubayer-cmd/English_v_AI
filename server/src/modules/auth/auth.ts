import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { PlanType, SubscriptionStatus } from "@prisma/client";
import type { User } from "shared";

// Initialize Prisma client
const prisma = new PrismaClient();

// Define the user type that matches our shared types
export type AuthUser = User;

// Create the auth instance with Prisma adapter
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: ["http://localhost:5173"],
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: true, // Require email verification
    sendResetPassword: async ({ user, url }) => {
      // TODO: Implement email sending logic
      console.log(
        `Sending password reset email to ${user.email} with link: ${url}`,
      );
    },
    onPasswordReset: async ({ user }) => {
      // TODO: Implement any post-password reset logic
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // TODO: Implement email sending logic
      console.log(
        `Sending verification email to ${user.email} with link: ${url}`,
      );
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  events: {
    onRegister: async ({ user }: { user: AuthUser }) => {
      try {
        // Get the free plan
        const freePlan = await prisma.plan.findUnique({
          where: { type: PlanType.FREE },
        });

        if (freePlan) {
          // Create free subscription for new user
          const now = new Date();
          const nextMonth = new Date(now);
          nextMonth.setMonth(nextMonth.getMonth() + 1);

          await prisma.subscription.create({
            data: {
              userId: user.id,
              planId: freePlan.id,
              status: SubscriptionStatus.ACTIVE,
              currentPeriodStart: now,
              currentPeriodEnd: nextMonth,
              voiceMinutesUsed: 0,
              textMessagesUsed: 0,
            },
          });

          console.log(`✅ Created free subscription for user ${user.email}`);
        } else {
          console.error("❌ Free plan not found in database");
        }
      } catch (error) {
        console.error("❌ Error creating free subscription:", error);
      }

      // TODO: Implement email sending logic
      console.log(`Sending welcome email to ${user.email}`);
    },
  },
});

export type Auth = typeof auth;
