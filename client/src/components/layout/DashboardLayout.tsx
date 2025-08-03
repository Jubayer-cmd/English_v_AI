import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  Home,
  MessageSquare,
  Settings,
  Users,
  BarChart3,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useSession, signOut } from "@/lib/better-auth";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    icon: Home,
    label: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: MessageSquare,
    label: "Conversations",
    path: "/dashboard/conversations",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    path: "/dashboard/analytics",
  },
  {
    icon: Users,
    label: "Team",
    path: "/dashboard/team",
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/dashboard/settings",
  },
];

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { data: session } = useSession();

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
                <span className="font-bold text-lg">VoiceAI</span>
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
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => (
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
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-border space-y-2">
            {/* User Info */}
            <div
              className={cn(
                "flex items-center space-x-3",
                sidebarCollapsed && "justify-center",
              )}
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              {!sidebarCollapsed && currentUser && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentUser.email}
                  </p>
                </div>
              )}
            </div>

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
            "absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 hidden lg:flex",
            sidebarCollapsed && "opacity-100",
          )}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
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
                  {menuItems.find((item) => isActiveRoute(item.path))?.label ||
                    "Dashboard"}
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
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
