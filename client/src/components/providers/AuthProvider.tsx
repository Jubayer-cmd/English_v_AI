import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Better Auth doesn't need a Provider wrapper in the latest version
  // The authClient handles everything internally
  return <>{children}</>;
} 