import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Play, Square, ArrowLeft, Crown } from "lucide-react";
import { useState } from "react";

export default function PracticeModePage() {
  const { mode } = useParams();
  const [isRecording, setIsRecording] = useState(false);

  // Convert mode param to display name
  const getModeDisplayName = (modeParam: string | undefined) => {
    if (!modeParam) return "Practice Mode";

    return modeParam
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const displayName = getModeDisplayName(mode);

  // Check if this is a selection-based mode (like Dialogue Mode)
  const isSelectionMode = [
    "dialogue-mode",
    "word-mode",
    "sentence-mode",
    "roleplays",
    "characters",
    "debates",
    "photo-mode",
  ].includes(mode || "");

  // Check if this is a direct practice mode (like Chat or Call)
  const isDirectMode = ["chat", "call-mode"].includes(mode || "");

  // Debug: Log the mode parameter
  console.log("Current mode:", mode);
  console.log("Is selection mode:", isSelectionMode);
  console.log("Is direct mode:", isDirectMode);
  console.log("Mode type:", typeof mode);

  // Dialogue scenarios for selection-based modes
  const dialogueScenarios = [
    {
      id: "1",
      title: "Ordering a taxi",
      image:
        "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop",
      difficulty: "Basics",
      description: "Practice ordering a taxi in English",
    },
    {
      id: "2",
      title: "Booking a hotel",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      difficulty: "Basics",
      description: "Learn to book hotel rooms",
    },
    {
      id: "3",
      title: "Buying clothes",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      difficulty: "Basics",
      description: "Practice shopping for clothes",
    },
    {
      id: "4",
      title: "At a supermarket",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      difficulty: "Basics",
      description: "Shopping at the grocery store",
    },
    {
      id: "5",
      title: "Ordering food in a restaurant",
      image:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      difficulty: "Basics",
      description: "Practice ordering at restaurants",
    },
    {
      id: "6",
      title: "Coffee shop",
      image:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=300&fit=crop",
      difficulty: "Basics",
      description: "Ordering coffee and drinks",
    },
  ];

  // Premium banner for some modes
  const isPremiumMode = ["dialogue-mode", "call-mode"].includes(mode || "");

  if (isSelectionMode) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">{displayName}</h1>
        </div>

        {/* Premium Banner */}
        {isPremiumMode && (
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-pink-600" />
                  <span className="font-medium text-pink-800">
                    {displayName} is a premium feature. Upgrade now to unlock
                    it.
                  </span>
                </div>
                <Button className="bg-pink-600 hover:bg-pink-700">
                  Get premium
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dialogueScenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="aspect-video bg-muted relative">
                <img
                  src={scenario.image}
                  alt={scenario.title}
                  className="w-full h-full object-cover"
                />
                <Badge
                  variant="secondary"
                  className="absolute bottom-2 left-2 bg-white/90 text-black"
                >
                  {scenario.difficulty}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{scenario.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {scenario.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isDirectMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{displayName}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Practice Session Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mic className="w-5 h-5" />
                <span>Start Practice Session</span>
              </CardTitle>
              <CardDescription>
                Begin your {displayName.toLowerCase()} practice session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Button
                  size="lg"
                  onClick={() => setIsRecording(!isRecording)}
                  className={`${
                    isRecording
                      ? "bg-destructive hover:bg-destructive/90"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-5 h-5 mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
                {isRecording && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-sm text-muted-foreground">
                      Recording...
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mode Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>About {displayName}</CardTitle>
              <CardDescription>
                Learn more about this practice mode
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  This is a placeholder for the {displayName.toLowerCase()}{" "}
                  practice mode. The actual functionality will be implemented
                  based on the specific mode requirements.
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline">View Tutorial</Button>
                  <Button variant="outline">Practice History</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sessions Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Start practicing to see your progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0m</div>
              <p className="text-xs text-muted-foreground">
                Track your practice time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">
                Complete sessions to get scores
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Default fallback - show selection interface for any other mode
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">{displayName}</h1>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dialogueScenarios.map((scenario) => (
          <Card
            key={scenario.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="aspect-video bg-muted relative">
              <img
                src={scenario.image}
                alt={scenario.title}
                className="w-full h-full object-cover"
              />
              <Badge
                variant="secondary"
                className="absolute bottom-2 left-2 bg-white/90 text-black"
              >
                {scenario.difficulty}
              </Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-1">{scenario.title}</h3>
              <p className="text-sm text-muted-foreground">
                {scenario.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
