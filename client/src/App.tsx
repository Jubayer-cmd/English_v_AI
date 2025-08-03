import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ConversationsPage from "./pages/dashboard/ConversationsPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import TeamPage from "./pages/dashboard/TeamPage";
import SettingsPage from "./pages/dashboard/SettingsPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute requireAuth={false}>
        <LoginPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <ProtectedRoute requireAuth={false}>
        <RegisterPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "conversations",
        element: <ConversationsPage />,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "team",
        element: (
          <ProtectedRoute requireAdmin>
            <TeamPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
