import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "@/lib/better-auth";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  auth?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  auth = true,
}: ProtectedRouteProps) {
  const { data: session, isPending: sessionPending } = useSession();

  if (sessionPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (auth) {
    if (!session) {
      return <Navigate to="/login" replace />;
    }

    // For now, temporarily disable admin checking to prevent loops
    // We'll check admin status in the individual admin components
    // if (requireAdmin && (session.user as any)?.role !== "ADMIN") {
    //   return <Navigate to="/dashboard" replace />;
    // }
  } else {
    if (session) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
