import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dashboardAPI, queryKeys } from "@/lib/api";
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
  settings: Settings,
  user: User,
};

// Default menu items (static)
const defaultMenuItems = [
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
];

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: session } = useSession();

  // Fetch practice modes from backend
  const { data: practiceModes = [] } = useQuery({
    queryKey: queryKeys.dashboard.modes,
    queryFn: dashboardAPI.getPracticeModes,
    staleTime: 1000 * 60 * 5, // 5 minutes
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
    return location.pathname.startsWith(path);
  };

  const currentUser = session?.user;

  // Combine default menu items with dynamic practice modes
  const allMenuItems = [
    ...defaultMenuItems,
    ...practiceModes.map((mode: PracticeMode) => ({
      icon: iconMap[mode.icon] || MessageSquare,
      label: mode.name,
      path: mode.path,
      description: mode.description,
      isActive: mode.isActive,
    })),
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
                sidebarCollapsed && "justify-center w-full",
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
            {/* Main Sections */}
            <div className="space-y-1">
              {allMenuItems.slice(0, 3).map((item) => (
                <div
                  key={item.path}
                  className="relative group/item"
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Button
                    variant={isActiveRoute(item.path) ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start h-12 transition-all",
                      isActiveRoute(item.path) &&
                        "bg-secondary text-secondary-foreground",
                      sidebarCollapsed && "justify-center px-0 w-full",
                    )}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <item.icon className="w-5 h-5" />
                    {!sidebarCollapsed && (
                      <span className="ml-3 font-medium">{item.label}</span>
                    )}
                  </Button>

                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Practice Modes */}
            {practiceModes.length > 0 && (
              <div className="pt-4 border-t border-border">
                <div
                  className={cn(
                    "text-xs font-medium text-muted-foreground mb-2",
                    sidebarCollapsed && "text-center",
                  )}
                >
                  {!sidebarCollapsed && "Practice Modes"}
                </div>
                <div className="space-y-1">
                  {allMenuItems.slice(3, -1).map((item) => (
                    <div
                      key={item.path}
                      className="relative group/item"
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <Button
                        variant={
                          isActiveRoute(item.path) ? "secondary" : "ghost"
                        }
                        className={cn(
                          "w-full justify-start h-10 text-sm transition-all",
                          isActiveRoute(item.path) &&
                            "bg-secondary text-secondary-foreground",
                          sidebarCollapsed && "justify-center px-0 w-full",
                        )}
                        onClick={() => handleNavigation(item.path)}
                        disabled={!item.isActive}
                      >
                        <item.icon className="w-4 h-4" />
                        {!sidebarCollapsed && (
                          <span className="ml-3">{item.label}</span>
                        )}
                      </Button>

                      {/* Tooltip for collapsed state */}
                      {sidebarCollapsed && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          {item.label}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-border space-y-2">
            {/* User Info */}
            <button
              onClick={() => handleNavigation("/dashboard/settings")}
              className={cn(
                "flex items-center space-x-3 w-full py-2 bg-transparent border-none hover:bg-muted/50 rounded-lg transition-colors cursor-pointer relative group",
                sidebarCollapsed && "justify-center",
              )}
            >
              {/* Hover effect overlay */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              {!sidebarCollapsed && currentUser && (
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentUser.email}
                  </p>
                </div>
              )}
            </button>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className={cn(
                "w-full justify-start h-10",
                sidebarCollapsed && "justify-center px-0 w-full",
              )}
              title={sidebarCollapsed ? "Logout" : undefined}
            >
              <LogOut className="w-4 h-4" />
              {!sidebarCollapsed && <span className="ml-3">Logout</span>}
            </Button>
          </div>
        </div>

        {/* Collapse Arrow - Positioned on the right border */}
        <div
          className={cn(
            "absolute top-1/2 -right-4 transform -translate-y-1/2 size-8 bg-card border border-border rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 hidden lg:flex",
            sidebarCollapsed && "opacity-100",
          )}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="size-5" />
          ) : (
            <ChevronLeft className="size-5" />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64",
        )}
      >
        {/* Top Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold">
                  {allMenuItems.find((item) => isActiveRoute(item.path))
                    ?.label || "Dashboard"}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {currentUser && (
                <Badge variant="secondary">
                  {(currentUser as any).role === "admin" ? "Admin" : "User"}
                </Badge>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="px-4 py-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
