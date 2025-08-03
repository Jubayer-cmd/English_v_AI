import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
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
  // Allow requests from the frontend development server
  trustedOrigins: ["http://localhost:5173"],
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "your-super-secret-key-here-at-least-32-chars",
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
      // TODO: Implement email sending logic
      console.log(`Sending welcome email to ${user.email}`);
    },
  },
});

export type Auth = typeof auth;
