import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User } from "shared";
import { authClient, getSession } from "./better-auth";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) =>
        set(
          {
            user,
            isAuthenticated: !!user,
            error: null,
          },
          false,
          "auth/setUser",
        ),

      setLoading: (isLoading) => set({ isLoading }, false, "auth/setLoading"),

      setError: (error) => set({ error }, false, "auth/setError"),

      logout: async () => {
        try {
          set({ isLoading: true }, false, "auth/logout");
          await authClient.signOut();
          set(
            {
              user: null,
              isAuthenticated: false,
              error: null,
              isLoading: false,
            },
            false,
            "auth/logout",
          );
        } catch (error) {
          set(
            {
              error: error instanceof Error ? error.message : "Logout failed",
              isLoading: false,
            },
            false,
            "auth/logout",
          );
        }
      },

      clearError: () => set({ error: null }, false, "auth/clearError"),

      checkAuth: async () => {
        try {
          set({ isLoading: true }, false, "auth/checkAuth");
          const session = await getSession();
          if (session && "data" in session && session.data?.user) {
            const user = session.data.user;
            set(
              {
                user: {
                  id: user.id,
                  email: user.email,
                  name: user.name || "",
                  role: (user as any).role || "user",
                  avatar: user.image || undefined,
                  createdAt: user.createdAt.toISOString(),
                  updatedAt: user.updatedAt.toISOString(),
                },
                isAuthenticated: true,
                error: null,
                isLoading: false,
              },
              false,
              "auth/checkAuth",
            );
          } else {
            set(
              {
                user: null,
                isAuthenticated: false,
                error: null,
                isLoading: false,
              },
              false,
              "auth/checkAuth",
            );
          }
        } catch (error) {
          set(
            {
              user: null,
              isAuthenticated: false,
              error:
                error instanceof Error ? error.message : "Auth check failed",
              isLoading: false,
            },
            false,
            "auth/checkAuth",
          );
        }
      },
    }),
    {
      name: "auth-store",
    },
  ),
);
