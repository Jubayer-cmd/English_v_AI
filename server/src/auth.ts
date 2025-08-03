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
    requireEmailVerification: false,
  },
  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      return {
        ...session,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || "user",
          avatar: user.image,
          createdAt: user.createdAt || new Date().toISOString(),
          updatedAt: user.updatedAt || new Date().toISOString(),
        },
      };
    },
  },
});

export type Auth = typeof auth;
