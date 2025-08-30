import type { User, UserDetails, UserProgress, PracticeMode } from 'shared';

// Local subscription types (will be moved to shared later)
interface Plan {
  id: string;
  name: string;
  type: 'FREE' | 'BASIC' | 'STANDARD' | 'PREMIUM';
  price: number;
  currency: string;
  billingCycle: string;
  voiceMinutes: number;
  textMessages: number;
  features: string[];
  isActive: boolean;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAST_DUE' | 'TRIAL';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  trialStart?: string;
  trialEnd?: string;
  voiceMinutesUsed: number;
  textMessagesUsed: number;
  createdAt: string;
  updatedAt: string;
  plan: Plan;
}

interface Usage {
  voiceMinutesUsed: number;
  textMessagesUsed: number;
  voiceMinutesLimit: number;
  textMessagesLimit: number;
}

const API_BASE_URL = 'http://localhost:3000';

// API client with credentials
const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    console.log(`Making request to: ${API_BASE_URL}${endpoint}`);

    // Don't set Content-Type for FormData - let browser set it with boundary
    const isFormData = options.body instanceof FormData;
    const headers = isFormData
      ? options.headers
      : {
          'Content-Type': 'application/json',
          ...options.headers,
        };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers,
    });

    console.log(`Response status: ${response.status} for ${endpoint}`);

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: 'Network error' }));
      console.error(`API Error for ${endpoint}:`, error);
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  },
};

// Type definitions for auth
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}

// Authentication API functions
export const authAPI = {
  // Login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.request<AuthResponse>('/api/auth/sign-in', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Register
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return apiClient.request<AuthResponse>('/api/auth/sign-up', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Logout
  async logout(): Promise<void> {
    return apiClient.request<void>('/api/auth/sign-out', {
      method: 'POST',
    });
  },

  // Get current session
  async getSession(): Promise<{ user: User } | null> {
    try {
      return await apiClient.request<{ user: User }>('/api/auth/session');
    } catch {
      return null;
    }
  },

  // Get user profile
  async getUserProfile(): Promise<User> {
    return apiClient.request<User>('/api/user');
  },

  // Get current user with role information
  async getCurrentUser(): Promise<any> {
    try {
      const response = await apiClient.request<{ success: boolean; data: any }>(
        '/api/me',
      );
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      // Return null instead of throwing to prevent loops
      return null;
    }
  },
};

// Dashboard API functions
export const dashboardAPI = {
  // Get practice modes
  async getPracticeModes(): Promise<PracticeMode[]> {
    return apiClient.request<PracticeMode[]>('/api/dashboard/modes');
  },

  // Get specific mode by ID
  async getModeById(modeId: string): Promise<any> {
    return apiClient.request<any>(`/api/dashboard/modes/${modeId}`);
  },

  // Get scenarios for a specific mode
  async getScenariosByMode(modeId: string): Promise<any[]> {
    return apiClient.request<any[]>(`/api/dashboard/modes/${modeId}/scenarios`);
  },

  // Get specific scenario by ID
  async getScenarioById(scenarioId: string): Promise<any> {
    return apiClient.request<any>(`/api/dashboard/scenarios/${scenarioId}`);
  },

  // Get user details
  async getUserDetails(): Promise<UserDetails> {
    return apiClient.request<UserDetails>('/api/dashboard/user-details');
  },

  // Get user progress
  async getUserProgress(): Promise<UserProgress> {
    return apiClient.request<UserProgress>('/api/dashboard/progress');
  },
};

// Admin API functions
export const adminAPI = {
  // Users management
  async getAllUsers(): Promise<any[]> {
    return apiClient
      .request<{ success: boolean; data: any[] }>('/api/admin/users')
      .then((res) => res.data);
  },

  async promoteUser(userId: string): Promise<void> {
    return apiClient.request<void>(`/api/admin/users/${userId}/promote`, {
      method: 'PUT',
    });
  },

  async demoteUser(userId: string): Promise<void> {
    return apiClient.request<void>(`/api/admin/users/${userId}/demote`, {
      method: 'PUT',
    });
  },

  // Practice modes management
  async getPracticeModes(): Promise<any[]> {
    return apiClient.request<any[]>('/api/dashboard/admin/modes');
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
      .request<{ success: boolean; data: any }>('/api/dashboard/admin/modes', {
        method: 'POST',
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
      .request<{ success: boolean; data: any }>('/api/dashboard/admin/modes', {
        method: 'PUT',
        body: JSON.stringify(mode),
      })
      .then((res) => res.data);
  },

  async deletePracticeMode(id: string): Promise<void> {
    return apiClient.request<void>('/api/dashboard/admin/modes', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    });
  },

  // Scenario management - using practice routes now
  async getScenarios(modeId?: string): Promise<any[]> {
    const url = modeId
      ? `/api/practice/admin/scenarios?modeId=${modeId}`
      : '/api/practice/admin/scenarios';
    const response = await apiClient.request<{ success: boolean; data: any[] }>(
      url,
    );
    return response.data;
  },

  async createScenario(formData: FormData): Promise<any> {
    return apiClient.request<{ success: boolean; data: any }>(
      '/api/practice/admin/scenarios',
      {
        method: 'POST',
        body: formData,
        headers: {}, // Remove Content-Type to let browser set it with boundary
      },
    );
  },

  async updateScenario(scenarioId: string, formData: FormData): Promise<any> {
    const response = await apiClient.request<{ success: boolean; data: any }>(
      `/api/practice/admin/scenarios/${scenarioId}`,
      {
        method: 'PUT',
        body: formData,
        headers: {}, // Remove Content-Type to let browser set it with boundary
      },
    );
    return response;
  },

  async deleteScenario(scenarioId: string): Promise<void> {
    await apiClient.request<{ success: boolean; message?: string }>(
      `/api/practice/admin/scenarios/${scenarioId}`,
      {
        method: 'DELETE',
      },
    );
  },

  // Stats
  async getStats(): Promise<any> {
    return apiClient.request<any>('/api/dashboard/admin/stats');
  },
};

// Subscription API functions
export const subscriptionAPI = {
  // Get all plans
  async getPlans(): Promise<Plan[]> {
    return apiClient
      .request<{ success: boolean; data: Plan[] }>('/api/subscription/plans')
      .then((res) => res.data);
  },

  // Get plan by ID
  async getPlanById(planId: string): Promise<Plan> {
    return apiClient
      .request<{ success: boolean; data: Plan }>(
        `/api/subscription/plans/${planId}`,
      )
      .then((res) => res.data);
  },

  // Get user's current subscription
  async getUserSubscription(): Promise<Subscription | null> {
    return apiClient
      .request<{ success: boolean; data: Subscription | null }>(
        '/api/subscription/subscription',
      )
      .then((res) => res.data);
  },

  // Create new subscription
  async createSubscription(planId: string): Promise<Subscription> {
    return apiClient
      .request<{ success: boolean; data: Subscription }>(
        '/api/subscription/subscription',
        {
          method: 'POST',
          body: JSON.stringify({ planId }),
        },
      )
      .then((res) => res.data);
  },

  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<void> {
    return apiClient.request<void>('/api/subscription/subscription', {
      method: 'DELETE',
      body: JSON.stringify({ subscriptionId }),
    });
  },

  // Get user usage
  async getUserUsage(): Promise<Usage> {
    return apiClient
      .request<{ success: boolean; data: Usage }>('/api/subscription/usage')
      .then((res) => res.data);
  },

  // Update usage
  async updateUsage(voiceMinutes: number, textMessages: number): Promise<void> {
    return apiClient.request<void>('/api/subscription/usage', {
      method: 'POST',
      body: JSON.stringify({ voiceMinutes, textMessages }),
    });
  },
};

// TanStack Query keys
export const queryKeys = {
  auth: {
    session: ['auth', 'session'] as const,
    user: ['auth', 'user'] as const,
  },
  dashboard: {
    modes: ['dashboard', 'modes'] as const,
    mode: (modeId: string) => ['dashboard', 'mode', modeId] as const,
    scenarios: (modeId: string) => ['dashboard', 'scenarios', modeId] as const,
    scenario: (scenarioId: string) =>
      ['dashboard', 'scenario', scenarioId] as const,
    userDetails: ['dashboard', 'userDetails'] as const,
    progress: ['dashboard', 'progress'] as const,
  },
  admin: {
    users: ['admin', 'users'] as const,
    modes: ['admin', 'modes'] as const,
    mode: (id: string) => ['admin', 'mode', id] as const,
    scenarios: (modeId?: string) => ['admin', 'scenarios', modeId] as const,
    stats: ['admin', 'stats'] as const,
  },
  subscription: {
    plans: ['subscription', 'plans'] as const,
    plan: (id: string) => ['subscription', 'plan', id] as const,
    userSubscription: ['subscription', 'user'] as const,
    usage: ['subscription', 'usage'] as const,
  },
} as const;
