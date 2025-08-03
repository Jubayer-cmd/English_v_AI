export type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  token: string;
  success: boolean;
  message?: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
};

export type AuthResponse = {
  success: boolean;
  message: string;
  data?: any;
}; 