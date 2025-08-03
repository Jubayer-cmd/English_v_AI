import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authAPI, queryKeys } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import type { LoginRequest, RegisterRequest } from "shared";

export function useSession() {
  return useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: authAPI.getSession,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setUser, setLoading, setError, clearError } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authAPI.login(credentials),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (data) => {
      if (data.success && data.data?.user) {
        setUser(data.data.user);
        queryClient.setQueryData(queryKeys.auth.session, {
          user: data.data.user,
        });
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    },
    onError: (error: Error) => {
      setError(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setUser, setLoading, setError, clearError } = useAuthStore();

  return useMutation({
    mutationFn: (userData: RegisterRequest) => authAPI.register(userData),
    onMutate: () => {
      setLoading(true);
      clearError();
    },
    onSuccess: (data) => {
      if (data.success && data.data?.user) {
        setUser(data.data.user);
        queryClient.setQueryData(queryKeys.auth.session, {
          user: data.data.user,
        });
        navigate("/dashboard");
      } else {
        setError(data.message || "Registration failed");
      }
    },
    onError: (error: Error) => {
      setError(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
      navigate("/");
    },
    onError: (error: Error) => {
      console.error("Logout error:", error);
      // Still logout locally even if server logout fails
      logout();
      queryClient.clear();
      navigate("/");
    },
  });
}
