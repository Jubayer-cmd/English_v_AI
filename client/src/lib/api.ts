import type { User, LoginRequest, RegisterRequest, AuthResponse } from "shared";

const API_BASE_URL = "http://localhost:3000";

// API client with credentials
const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  },
};

// Authentication API functions
export const authAPI = {
  // Login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.request<AuthResponse>("/api/auth/sign-in", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  // Register
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return apiClient.request<AuthResponse>("/api/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  // Logout
  async logout(): Promise<void> {
    return apiClient.request<void>("/api/auth/sign-out", {
      method: "POST",
    });
  },

  // Get current session
  async getSession(): Promise<{ user: User } | null> {
    try {
      return await apiClient.request<{ user: User }>("/api/auth/session");
    } catch {
      return null;
    }
  },

  // Get user profile
  async getUserProfile(): Promise<User> {
    return apiClient.request<User>("/api/user");
  },
};

// TanStack Query keys
export const queryKeys = {
  auth: {
    session: ["auth", "session"] as const,
    user: ["auth", "user"] as const,
  },
} as const;
