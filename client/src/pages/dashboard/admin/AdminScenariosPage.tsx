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

const difficultyOptions = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const durationOptions = [
  { value: "5-10 min", label: "5-10 minutes" },
  { value: "10-15 min", label: "10-15 minutes" },
  { value: "15-20 min", label: "15-20 minutes" },
  { value: "20-25 min", label: "20-25 minutes" },
  { value: "25-30 min", label: "25-30 minutes" },
];

export default function AdminScenariosPage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState<any>(null);
  const [selectedModeId, setSelectedModeId] = useState<string>("");
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

  // Fetch practice modes for dropdown
  const { data: practiceModes = [] } = useQuery({
    queryKey: queryKeys.admin.modes,
    queryFn: adminAPI.getPracticeModes,
    enabled: currentUser?.role === "ADMIN",
  });

  // Fetch scenarios
  const { data: scenarios = [], isLoading: scenariosLoading } = useQuery({
    queryKey: queryKeys.admin.scenarios(selectedModeId),
    queryFn: () => adminAPI.getScenarios(selectedModeId),
    enabled: currentUser?.role === "ADMIN",
  });

  // Create scenario mutation
  const createScenarioMutation = useMutation({
    mutationFn: adminAPI.createScenario,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.scenarios(selectedModeId),
      });
      setIsCreateDialogOpen(false);
    },
  });

  // Update scenario mutation
  const updateScenarioMutation = useMutation({
    mutationFn: adminAPI.updateScenario,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.scenarios(selectedModeId),
      });
      setIsEditDialogOpen(false);
      setEditingScenario(null);
    },
  });

  // Delete scenario mutation
  const deleteScenarioMutation = useMutation({
    mutationFn: adminAPI.deleteScenario,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.scenarios(selectedModeId),
      });
    },
  });

  const isLoading = userLoading || scenariosLoading;
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

  const handleCreateScenario = (formData: FormData) => {
    const scenarioData = {
      modeId: formData.get("modeId") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      difficulty: formData.get("difficulty") as string,
      duration: formData.get("duration") as string,
      participants: parseInt(formData.get("participants") as string),
      prompt: formData.get("prompt") as string,
    };
    createScenarioMutation.mutate(scenarioData);
  };

  const handleEditScenario = (formData: FormData) => {
    if (!editingScenario) return;
    const scenarioData = {
      id: editingScenario.id,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      difficulty: formData.get("difficulty") as string,
      duration: formData.get("duration") as string,
      participants: parseInt(formData.get("participants") as string),
      prompt: formData.get("prompt") as string,
      isActive: formData.get("isActive") === "true",
    };
    updateScenarioMutation.mutate(scenarioData);
  };

  const handleDeleteScenario = (scenarioId: string) => {
    if (confirm("Are you sure you want to delete this scenario?")) {
      deleteScenarioMutation.mutate(scenarioId);
    }
  };

  const openEditDialog = (scenario: any) => {
    setEditingScenario(scenario);
    setIsEditDialogOpen(true);
  };

  // Filter scenarios based on search term
  const filteredScenarios = scenarios.filter(
    (scenario: any) =>
      scenario.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading scenarios...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Scenarios</h1>
          <p className="text-muted-foreground">
            Create and manage practice scenarios for each mode
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Create Scenario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Scenario</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateScenario(new FormData(e.currentTarget));
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="modeId">Mode</Label>
                  <Select name="modeId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {practiceModes.map((mode: any) => (
                        <SelectItem key={mode.id} value={mode.id}>
                          {mode.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select name="difficulty" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select name="duration" defaultValue="10-15 min">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participants">Participants</Label>
                  <Input
                    id="participants"
                    name="participants"
                    type="number"
                    defaultValue="2"
                    min="1"
                    max="10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prompt">AI Prompt (Optional)</Label>
                <Textarea
                  id="prompt"
                  name="prompt"
                  placeholder="Enter the AI prompt for this scenario..."
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createScenarioMutation.isPending}
                >
                  {createScenarioMutation.isPending
                    ? "Creating..."
                    : "Create Scenario"}
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

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search scenarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedModeId} onValueChange={setSelectedModeId}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Modes</SelectItem>
            {practiceModes.map((mode: any) => (
              <SelectItem key={mode.id} value={mode.id}>
                {mode.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Scenarios
            </CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scenarios.length}</div>
            <p className="text-xs text-muted-foreground">All scenarios</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Scenarios
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {scenarios.filter((s: any) => s.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Beginner Scenarios
            </CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {scenarios.filter((s: any) => s.difficulty === "Beginner").length}
            </div>
            <p className="text-xs text-muted-foreground">Easy level</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Advanced Scenarios
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {scenarios.filter((s: any) => s.difficulty === "Advanced").length}
            </div>
            <p className="text-xs text-muted-foreground">Hard level</p>
          </CardContent>
        </Card>
      </div>

      {/* Scenarios List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredScenarios.map((scenario: any) => (
              <div
                key={scenario.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{scenario.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {scenario.description}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Mode: {scenario.modeName || "Unknown"} •{" "}
                      {scenario.duration} • {scenario.participants} participants
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      scenario.difficulty === "Beginner"
                        ? "default"
                        : scenario.difficulty === "Intermediate"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {scenario.difficulty}
                  </Badge>
                  <Badge variant={scenario.isActive ? "default" : "secondary"}>
                    {scenario.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(scenario)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteScenario(scenario.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Scenario</DialogTitle>
          </DialogHeader>
          {editingScenario && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditScenario(new FormData(e.currentTarget));
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-difficulty">Difficulty</Label>
                  <Select
                    name="difficulty"
                    defaultValue={editingScenario.difficulty}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyOptions.map((option) => (
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
                    defaultValue={editingScenario.isActive.toString()}
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  defaultValue={editingScenario.title}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  defaultValue={editingScenario.description}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duration</Label>
                  <Select
                    name="duration"
                    defaultValue={editingScenario.duration}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-participants">Participants</Label>
                  <Input
                    id="edit-participants"
                    name="participants"
                    type="number"
                    defaultValue={editingScenario.participants}
                    min="1"
                    max="10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-prompt">AI Prompt (Optional)</Label>
                <Textarea
                  id="edit-prompt"
                  name="prompt"
                  defaultValue={editingScenario.prompt}
                  placeholder="Enter the AI prompt for this scenario..."
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={updateScenarioMutation.isPending}
                >
                  {updateScenarioMutation.isPending
                    ? "Updating..."
                    : "Update Scenario"}
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
