import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dashboardAPI, queryKeys } from "@/lib/api";
import {
  Mic,
  MessageSquare,
  Play,
  Pause,
  Square,
  Volume2,
  Settings,
  ArrowLeft,
  Clock,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  Map,
  GraduationCap,
  Phone,
  Theater,
  UserCheck,
  Camera,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Icon mapping for practice modes
const iconMap: Record<string, any> = {
  "graduation-cap": GraduationCap,
  map: Map,
  target: Target,
  "message-circle": MessageSquare,
  "book-open": BookOpen,
  users: Users,
  phone: Phone,
  theater: Theater,
  "user-check": UserCheck,
  "message-square": MessageSquare,
  camera: Camera,
  "trending-up": TrendingUp,
  "bar-chart-3": BarChart3,
};

export default function PracticeModePage() {
  const { modeId } = useParams<{ modeId: string }>();
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Fetch specific mode details
  const { data: currentMode, isLoading: modeLoading } = useQuery({
    queryKey: queryKeys.dashboard.mode(modeId!),
    queryFn: () => dashboardAPI.getModeById(modeId!),
    enabled: !!modeId,
  });

  // Fetch scenarios for this mode
  const { data: scenarios = [], isLoading: scenariosLoading } = useQuery({
    queryKey: queryKeys.dashboard.scenarios(modeId!),
    queryFn: () => dashboardAPI.getScenariosByMode(modeId!),
    enabled: !!modeId,
  });

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPlaying(false);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPlaying(false);
  };

  const handleStartPractice = (scenarioId: string) => {
    // Navigate to the specific scenario practice
    navigate(`/dashboard/modes/${modeId}/scenarios/${scenarioId}`);
  };

  if (modeLoading || scenariosLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading practice mode...</div>
        </div>
      </div>
    );
  }

  if (!currentMode) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">
            Practice Mode Not Found
          </h1>
          <p className="text-muted-foreground">
            The requested practice mode could not be found.
          </p>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[currentMode.icon] || MessageSquare;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{currentMode.name}</h1>
              <p className="text-muted-foreground">{currentMode.description}</p>
            </div>
          </div>
        </div>
        <Badge variant={currentMode.isActive ? "default" : "secondary"}>
          {currentMode.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      {/* Quick Start */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            Quick Start
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground mb-4">
                Start practicing immediately with voice recording
              </p>
              <div className="flex items-center gap-4">
                <Button
                  size="lg"
                  onClick={
                    isRecording ? handleStopRecording : handleStartRecording
                  }
                  className={
                    isRecording ? "bg-destructive hover:bg-destructive/90" : ""
                  }
                >
                  {isRecording ? (
                    <>
                      <Square className="w-5 h-5 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-5 h-5 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
                {isRecording && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm text-muted-foreground">
                      Recording...
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">0:00</div>
              <div className="text-sm text-muted-foreground">Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Scenarios */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((scenario) => (
          <Card key={scenario.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{scenario.title}</CardTitle>
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
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {scenario.description}
              </p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {scenario.duration}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {scenario.participants}
                </div>
              </div>
              <Button
                onClick={() => handleStartPractice(scenario.id)}
                className="w-full"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Practice
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sessions
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5h</div>
            <p className="text-xs text-muted-foreground">Practice time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Average score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Practice Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Voice Speed</Label>
              <Select defaultValue="normal">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slow">Slow</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="fast">Fast</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Difficulty</Label>
              <Select defaultValue="intermediate">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Voice Type</Label>
              <Select defaultValue="ai">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai">AI Assistant</SelectItem>
                  <SelectItem value="native">Native Speaker</SelectItem>
                  <SelectItem value="teacher">English Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
