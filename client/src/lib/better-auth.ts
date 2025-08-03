import { createAuthClient } from "better-auth/client";

// Create the client-side auth instance
export const authClient = createAuthClient({
  baseURL: "http://localhost:3000/api/auth",
  autoRefresh: true,
  autoRefreshInterval: 5 * 60 * 1000, // 5 minutes
});

// Export types for convenience
export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
};

export type Session = {
  user: AuthUser;
  expires: string;
};

// Export auth methods for easy access
export const {
  signIn,
  signUp,
  signOut,
  getSession,
  resetPassword,
  verifyEmail,
} = authClient;
