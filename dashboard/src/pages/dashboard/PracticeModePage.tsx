import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dashboardAPI, queryKeys } from "@/lib/api";
import { Play, ArrowLeft, Clock, Users } from "lucide-react";

export default function PracticeModePage() {
  const { modeId } = useParams<{ modeId: string }>();
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center gap-4 z-10">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">{currentMode.name}</h1>
          <p className="text-sm text-muted-foreground">
            {currentMode.description}
          </p>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="p-6">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 max-w-7xl mx-auto">
          {scenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className="hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-primary/20 bg-gradient-to-br from-card to-card/50"
            >
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
              <CardContent className="space-y-4 flex flex-col h-full">
                <p className="text-sm text-muted-foreground flex-grow">
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
                  className="w-full bg-primary hover:bg-primary/90 transition-colors"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Practice
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
