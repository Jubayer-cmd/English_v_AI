import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "@/lib/hooks/use-auth";
import { useAuthStore } from "@/lib/auth-store";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { data: session, isLoading } = useSession();
  const { user, isAuthenticated } = useAuthStore();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication
  const isAuthenticatedUser = isAuthenticated || !!session?.user;
  const currentUser = session?.user || user;

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticatedUser) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to dashboard if user is authenticated but trying to access login/register
  if (!requireAuth && isAuthenticatedUser) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check admin requirement
  if (requireAdmin && currentUser?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
