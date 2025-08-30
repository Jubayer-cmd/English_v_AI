import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dashboardAPI, queryKeys, authAPI } from "@/lib/api";
import {
  Mic,
  MessageSquare,
  Settings,
  BarChart3,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  GraduationCap,
  Map,
  Target,
  MessageCircle,
  BookOpen,
  Users as UsersIcon,
  Phone,
  Theater,
  UserCheck,
  MessageSquare as MessageSquareIcon,
  Camera,
  TrendingUp,
  Shield,
  Layers,
  UserCog,
  Users,
  CreditCard,
} from "lucide-react";
import { useSession, signOut } from "@/lib/better-auth";
import { cn } from "@/lib/utils";
import type { PracticeMode } from "shared";

// Icon mapping for practice modes
const iconMap: Record<string, any> = {
  "graduation-cap": GraduationCap,
  map: Map,
  target: Target,
  "message-circle": MessageCircle,
  "book-open": BookOpen,
  users: UsersIcon,
  phone: Phone,
  theater: Theater,
  "user-check": UserCheck,
  "message-square": MessageSquareIcon,
  camera: Camera,
  "trending-up": TrendingUp,
  "bar-chart-3": BarChart3,
  user: User,
};

// Menu item types
type MenuItem = {
  icon: any;
  label: string;
  path: string;
  isActive: boolean;
};

type SeparatorItem = {
  type: "separator";
  label: string;
};

type MenuItemType = MenuItem | SeparatorItem;

// Default menu items (static) - only for regular users
const defaultMenuItems: MenuItem[] = [
  {
    icon: GraduationCap,
    label: "Courses",
    path: "/dashboard/courses",
    isActive: true,
  },
  {
    icon: Map,
    label: "Explore",
    path: "/dashboard/explore",
    isActive: true,
  },
  {
    icon: TrendingUp,
    label: "Progress",
    path: "/dashboard/progress",
    isActive: true,
  },
  {
    icon: CreditCard,
    label: "Subscription",
    path: "/dashboard/subscription",
    isActive: true,
  },
];

// Admin menu items - only for admin users
const adminMenuItems: MenuItem[] = [
  {
    icon: Shield,
    label: "Admin Panel",
    path: "/dashboard/admin",
    isActive: true,
  },
  {
    icon: UsersIcon, // Renamed from Users to UsersIcon to avoid conflict
    label: "User Management",
    path: "/dashboard/admin/users",
    isActive: true,
  },
  {
    icon: Layers,
    label: "Content Management",
    path: "/dashboard/admin/modes",
    isActive: true,
  },
  {
    icon: BarChart3,
    label: "Analytics",
    path: "/dashboard/admin/analytics",
    isActive: true,
  },
  {
    icon: Settings,
    label: "System Settings",
    path: "/dashboard/admin/settings",
    isActive: true,
  },
];

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: session } = useSession();

  // Get current user with role information
  const { data: currentUser, error: userError } = useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: authAPI.getCurrentUser,
    enabled: !!session,
    retry: false,
    staleTime: 0, // Force fresh data
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Force refetch on mount
  });

  // Fetch practice modes from backend
  const {
    data: practiceModes = [],
    isLoading: modesLoading,
    error: modesError,
  } = useQuery({
    queryKey: queryKeys.dashboard.modes,
    queryFn: dashboardAPI.getPracticeModes,
    staleTime: 1000 * 60 * 5,
    enabled: !!session, // Only fetch when user is authenticated
  });

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileSidebarOpen(false);
  };

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate("/login");
        },
      },
    });
  };

  const isActiveRoute = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    if (path === "/dashboard/admin") {
      // Only show admin panel as active when exactly on /dashboard/admin
      return location.pathname === "/dashboard/admin";
    }
    return location.pathname.startsWith(path);
  };

  const sessionUser = session?.user;
  const isAdmin = currentUser?.role === "ADMIN" && !userError;

  // Debug logging
  console.log("🔍 Practice modes debug:", {
    session: !!session,
    practiceModes,
    modesLoading,
    modesError,
    isAdmin,
  });

  // Debug user data
  console.log("👤 User debug:", {
    sessionUser,
    currentUser,
    userError,
    tier: currentUser?.tier,
    tierType: currentUser?.tierType,
  });

  // Combine menu items based on user role
  const allMenuItems: MenuItemType[] = isAdmin
    ? [
        // Admin users ONLY see admin menu items
        ...adminMenuItems,
      ]
    : [
        // Regular users see default menu items + practice modes
        ...defaultMenuItems,
        // Show practice modes for regular users only
        ...(practiceModes.length > 0
          ? [
              {
                type: "separator",
                label: "Practice Modes",
              } as SeparatorItem,
              ...practiceModes.map((mode: PracticeMode) => ({
                icon: iconMap[mode.icon] || MessageSquare,
                label: mode.name,
                path: `/dashboard/modes/${mode.id}`,
                description: mode.description,
                isActive: mode.isActive,
              })),
            ]
          : []),
      ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 z-50 group",
          sidebarCollapsed ? "w-20" : "w-64",
          mobileSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div
              className={cn(
                "flex items-center space-x-2",
                sidebarCollapsed && "justify-center",
              )}
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-primary-foreground" />
              </div>
              {!sidebarCollapsed && (
                <span className="font-bold text-lg">ENGLA</span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileSidebarOpen(false)}
              className="h-8 w-8 p-0 lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {allMenuItems.map((item, index) => {
              if ("type" in item && item.type === "separator") {
                return (
                  <div key={`separator-${index}`} className="my-4">
                    {!sidebarCollapsed && (
                      <div className="px-3 py-2">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {item.label}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // At this point, item is guaranteed to be a MenuItem
              const menuItem = item as MenuItem;
              return (
                <div
                  key={menuItem.path}
                  className="relative group/item"
                  title={sidebarCollapsed ? menuItem.label : undefined}
                >
                  <Button
                    variant={
                      isActiveRoute(menuItem.path) ? "secondary" : "ghost"
                    }
                    className={cn(
                      "w-full justify-start h-12 transition-all",
                      isActiveRoute(menuItem.path) &&
                        "bg-secondary text-secondary-foreground",
                      sidebarCollapsed && "justify-center px-0 w-full",
                    )}
                    onClick={() => handleNavigation(menuItem.path)}
                  >
                    <menuItem.icon className="w-5 h-5" />
                    {!sidebarCollapsed && (
                      <span className="ml-3 font-medium">{menuItem.label}</span>
                    )}
                  </Button>

                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none z-50">
                      {menuItem.label}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading state for practice modes */}
            {modesLoading && (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-muted animate-pulse rounded-md"
                  />
                ))}
              </div>
            )}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            <div className="space-y-3">
              {/* User Info */}
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3 hover:bg-secondary/50"
                onClick={() => handleNavigation("/dashboard/settings")}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  {!sidebarCollapsed && (
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium truncate">
                        {sessionUser?.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {sessionUser?.email}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {isAdmin && (
                          <Badge variant="secondary" className="text-xs">
                            Admin
                          </Badge>
                        )}
                        {currentUser?.tier && (
                          <Badge
                            variant={
                              currentUser.tierType === "FREE"
                                ? "outline"
                                : "default"
                            }
                            className="text-xs"
                          >
                            {currentUser.tier}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Button>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className={cn(
                  "w-full justify-start",
                  sidebarCollapsed && "justify-center px-0",
                )}
                title="Sign out"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {!sidebarCollapsed && <span>Sign out</span>}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64",
        )}
      >
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden lg:flex"
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)] p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
