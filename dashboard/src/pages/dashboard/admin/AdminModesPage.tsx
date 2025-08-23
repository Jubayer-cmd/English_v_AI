import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminAPI, queryKeys, authAPI } from "@/lib/api";
import { useSession } from "@/lib/better-auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  MessageSquare,
  Target,
  BookOpen,
  Users,
  Phone,
  Theater,
  UserCheck,
  Camera,
  TrendingUp,
  BarChart3,
  GraduationCap,
  Map,
  MessageCircle,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Search,
  Filter,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const iconMap: Record<string, any> = {
  MessageSquare,
  Target,
  BookOpen,
  Users,
  Phone,
  Theater,
  UserCheck,
  Camera,
  TrendingUp,
  BarChart3,
  GraduationCap,
  Map,
  MessageCircle,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Search,
  Filter,
  Layers,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
};

const iconOptions = [
  { value: "MessageSquare", label: "Message Square" },
  { value: "Target", label: "Target" },
  { value: "BookOpen", label: "Book Open" },
  { value: "Users", label: "Users" },
  { value: "Phone", label: "Phone" },
  { value: "Theater", label: "Theater" },
  { value: "UserCheck", label: "User Check" },
  { value: "Camera", label: "Camera" },
  { value: "TrendingUp", label: "Trending Up" },
  { value: "BarChart3", label: "Bar Chart" },
  { value: "GraduationCap", label: "Graduation Cap" },
  { value: "Map", label: "Map" },
  { value: "MessageCircle", label: "Message Circle" },
  { value: "User", label: "User" },
  { value: "Shield", label: "Shield" },
  { value: "AlertTriangle", label: "Alert Triangle" },
  { value: "CheckCircle", label: "Check Circle" },
  { value: "Clock", label: "Clock" },
  { value: "Zap", label: "Zap" },
  { value: "Search", label: "Search" },
  { value: "Filter", label: "Filter" },
  { value: "Layers", label: "Layers" },
  { value: "Settings", label: "Settings" },
  { value: "Eye", label: "Eye" },
];

export default function AdminModesPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMode, setEditingMode] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Get current user with role information
  const {
    data: currentUser,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: authAPI.getCurrentUser,
    enabled: !!session,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch practice modes
  const { data: practiceModes = [], isLoading: modesLoading } = useQuery({
    queryKey: queryKeys.admin.modes,
    queryFn: adminAPI.getPracticeModes,
    enabled: currentUser?.role === "ADMIN",
  });

  // Create mode mutation
  const createModeMutation = useMutation({
    mutationFn: adminAPI.createPracticeMode,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.modes });
      setIsCreateDialogOpen(false);
      toast.success("Practice mode created successfully!", {
        description: `${data.data.name} has been added to the platform.`,
      });
    },
    onError: (error: any) => {
      toast.error("Failed to create practice mode", {
        description: error.message || "Please try again.",
      });
    },
  });

  // Update mode mutation
  const updateModeMutation = useMutation({
    mutationFn: adminAPI.updatePracticeMode,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.modes });
      setIsEditDialogOpen(false);
      setEditingMode(null);
      toast.success("Practice mode updated successfully!", {
        description: `${data.data.name} has been updated.`,
      });
    },
    onError: (error: any) => {
      toast.error("Failed to update practice mode", {
        description: error.message || "Please try again.",
      });
    },
  });

  // Delete mode mutation
  const deleteModeMutation = useMutation({
    mutationFn: adminAPI.deletePracticeMode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.modes });
      toast.success("Practice mode deleted successfully!", {
        description: "The mode has been removed from the platform.",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to delete practice mode", {
        description: error.message || "Please try again.",
      });
    },
  });

  const isLoading = userLoading || modesLoading;
  const isAdmin = currentUser?.role === "ADMIN" && !userError;

  // Show access denied if not admin
  if (!userLoading && (userError || !isAdmin)) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  const handleCreateMode = (formData: FormData) => {
    const modeData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      icon: formData.get("icon") as string,
      isActive: formData.get("isActive") === "true",
    };
    createModeMutation.mutate(modeData);
  };

  const handleEditMode = (formData: FormData) => {
    if (!editingMode) return;
    const modeData = {
      id: editingMode.id,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      icon: formData.get("icon") as string,
      isActive: formData.get("isActive") === "true",
    };
    updateModeMutation.mutate(modeData);
  };

  const handleDeleteMode = (modeId: string) => {
    if (confirm("Are you sure you want to delete this mode?")) {
      deleteModeMutation.mutate(modeId);
    }
  };

  const openEditDialog = (mode: any) => {
    setEditingMode(mode);
    setIsEditDialogOpen(true);
  };

  const handleViewScenarios = (modeId: string) => {
    navigate(`/dashboard/admin/modes/${modeId}/scenarios`);
  };

  // Filter modes based on search term
  const filteredModes = practiceModes.filter(
    (mode: any) =>
      mode.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mode.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading modes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Practice Modes</h1>
          <p className="text-muted-foreground">
            Create and manage practice modes for the platform
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Mode
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Practice Mode</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateMode(new FormData(e.currentTarget));
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Select name="icon" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isActive">Status</Label>
                <Select name="isActive" defaultValue="true">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createModeMutation.isPending}
                >
                  {createModeMutation.isPending ? "Creating..." : "Create Mode"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search modes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Modes</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{practiceModes.length}</div>
            <p className="text-xs text-muted-foreground">All modes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Modes</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {practiceModes.filter((m: any) => m.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Modes
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {practiceModes.filter((m: any) => !m.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">Currently inactive</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Scenarios
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {practiceModes.reduce(
                (total: number, mode: any) =>
                  total + (mode.scenarios?.length || 0),
                0,
              )}
            </div>
            <p className="text-xs text-muted-foreground">Across all modes</p>
          </CardContent>
        </Card>
      </div>

      {/* Modes List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Practice Modes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredModes.map((mode: any) => {
              const IconComponent = iconMap[mode.icon] || MessageSquare;
              return (
                <div
                  key={mode.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{mode.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {mode.description}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Path: {mode.path} • Created:{" "}
                        {new Date(mode.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={mode.isActive ? "default" : "secondary"}>
                      {mode.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewScenarios(mode.id)}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Scenarios
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(mode)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMode(mode.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Practice Mode</DialogTitle>
          </DialogHeader>
          {editingMode && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditMode(new FormData(e.currentTarget));
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  defaultValue={editingMode.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editingMode.description}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-icon">Icon</Label>
                <Select name="icon" defaultValue={editingMode.icon}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-isActive">Status</Label>
                <Select
                  name="isActive"
                  defaultValue={editingMode.isActive.toString()}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={updateModeMutation.isPending}
                >
                  {updateModeMutation.isPending ? "Updating..." : "Update Mode"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
