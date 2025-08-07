import type { User, LoginRequest, RegisterRequest, AuthResponse } from "shared";
import type { PracticeMode, UserDetails, UserProgress } from "shared";

const API_BASE_URL = "http://localhost:3000";

// API client with credentials
const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    console.log(`Making request to: ${API_BASE_URL}${endpoint}`);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    console.log(`Response status: ${response.status} for ${endpoint}`);

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Network error" }));
      console.error(`API Error for ${endpoint}:`, error);
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

  // Get current user with role information
  async getCurrentUser(): Promise<any> {
    try {
      const response = await apiClient.request<{ success: boolean; data: any }>(
        "/api/me",
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get current user:", error);
      // Return null instead of throwing to prevent loops
      return null;
    }
  },
};

// Dashboard API functions
export const dashboardAPI = {
  // Get practice modes
  async getPracticeModes(): Promise<PracticeMode[]> {
    return apiClient.request<PracticeMode[]>("/api/dashboard/modes");
  },

  // Get specific mode by ID
  async getModeById(modeId: string): Promise<any> {
    return apiClient.request<any>(`/api/dashboard/modes/${modeId}`);
  },

  // Get scenarios for a specific mode
  async getScenariosByMode(modeId: string): Promise<any[]> {
    return apiClient.request<any[]>(`/api/dashboard/modes/${modeId}/scenarios`);
  },

  // Get user details
  async getUserDetails(): Promise<UserDetails> {
    return apiClient.request<UserDetails>("/api/dashboard/user-details");
  },

  // Get user progress
  async getUserProgress(): Promise<UserProgress> {
    return apiClient.request<UserProgress>("/api/dashboard/progress");
  },
};

// Admin API functions
export const adminAPI = {
  // Users management
  async getAllUsers(): Promise<any[]> {
    return apiClient
      .request<{ success: boolean; data: any[] }>("/api/admin/users")
      .then((res) => res.data);
  },

  async promoteUser(userId: string): Promise<void> {
    return apiClient.request<void>(`/api/admin/users/${userId}/promote`, {
      method: "PUT",
    });
  },

  async demoteUser(userId: string): Promise<void> {
    return apiClient.request<void>(`/api/admin/users/${userId}/demote`, {
      method: "PUT",
    });
  },

  // Practice modes management
  async getPracticeModes(): Promise<any[]> {
    return apiClient.request<any[]>("/api/dashboard/admin/modes");
  },

  async getModeById(modeId: string): Promise<any> {
    return apiClient.request<any>(`/api/dashboard/modes/${modeId}`);
  },

  async createPracticeMode(mode: {
    name: string;
    description: string;
    icon: string;
    isActive: boolean;
  }): Promise<any> {
    return apiClient
      .request<{ success: boolean; data: any }>("/api/dashboard/admin/modes", {
        method: "POST",
        body: JSON.stringify(mode),
      })
      .then((res) => res.data);
  },

  async updatePracticeMode(mode: {
    id: string;
    name: string;
    description: string;
    icon: string;
    isActive: boolean;
  }): Promise<any> {
    return apiClient
      .request<{ success: boolean; data: any }>("/api/dashboard/admin/modes", {
        method: "PUT",
        body: JSON.stringify(mode),
      })
      .then((res) => res.data);
  },

  async deletePracticeMode(id: string): Promise<void> {
    return apiClient.request<void>("/api/dashboard/admin/modes", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
  },

  // Scenario management
  async getScenarios(modeId?: string): Promise<any[]> {
    const url = modeId
      ? `/api/dashboard/admin/scenarios?modeId=${modeId}`
      : "/api/dashboard/admin/scenarios";
    return apiClient.request<any[]>(url);
  },

  async createScenario(scenario: {
    modeId: string;
    title: string;
    description: string;
    difficulty: string;
    duration: string;
    participants: number;
    prompt?: string;
  }): Promise<any> {
    return apiClient
      .request<{ success: boolean; data: any }>(
        "/api/dashboard/admin/scenarios",
        {
          method: "POST",
          body: JSON.stringify(scenario),
        },
      )
      .then((res) => res.data);
  },

  async updateScenario(scenario: {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    duration: string;
    participants: number;
    prompt?: string;
    isActive: boolean;
  }): Promise<any> {
    return apiClient
      .request<{ success: boolean; data: any }>(
        "/api/dashboard/admin/scenarios",
        {
          method: "PUT",
          body: JSON.stringify(scenario),
        },
      )
      .then((res) => res.data);
  },

  async deleteScenario(id: string): Promise<void> {
    return apiClient.request<void>("/api/dashboard/admin/scenarios", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
  },

  // Stats
  async getStats(): Promise<any> {
    return apiClient.request<any>("/api/dashboard/admin/stats");
  },
};

// TanStack Query keys
export const queryKeys = {
  auth: {
    session: ["auth", "session"] as const,
    user: ["auth", "user"] as const,
  },
  dashboard: {
    modes: ["dashboard", "modes"] as const,
    mode: (modeId: string) => ["dashboard", "mode", modeId] as const,
    scenarios: (modeId: string) => ["dashboard", "scenarios", modeId] as const,
    userDetails: ["dashboard", "userDetails"] as const,
    progress: ["dashboard", "progress"] as const,
  },
  admin: {
    users: ["admin", "users"] as const,
    modes: ["admin", "modes"] as const,
    mode: (id: string) => ["admin", "mode", id] as const,
    scenarios: (modeId?: string) => ["admin", "scenarios", modeId] as const,
    stats: ["admin", "stats"] as const,
  },
} as const;
