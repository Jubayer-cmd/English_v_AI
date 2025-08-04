import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dashboardAPI, queryKeys } from "@/lib/api";
import {
  TrendingUp,
  Target,
  Award,
  ArrowRight,
  Info,
  Search,
  Calendar,
  BarChart3,
} from "lucide-react";

export default function ProgressPage() {
  const { data: userDetails, isLoading: userLoading } = useQuery({
    queryKey: queryKeys.dashboard.userDetails,
    queryFn: dashboardAPI.getUserDetails,
  });

  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: queryKeys.dashboard.progress,
    queryFn: dashboardAPI.getUserProgress,
  });

  if (userLoading || progressLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Progress</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Daily Feedback Card */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Daily Feedback</span>
              <ArrowRight className="w-5 h-5" />
            </CardTitle>
            <CardDescription>
              See your daily practice feedbacks here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Feedback
            </Button>
          </CardContent>
        </Card>

        {/* Practice Score Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>Practice score</span>
              <Info className="w-4 h-4 text-muted-foreground" />
            </CardTitle>
            <CardDescription>Your daily practice score chart</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center h-32">
            <Search className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-sm">No data</p>
            <p className="text-muted-foreground text-xs">
              Please try again later
            </p>
          </CardContent>
        </Card>

        {/* Level Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Level {userDetails?.level || 1}
            </CardTitle>
            <CardDescription>Your current level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Minutes left till the next level:
              </p>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {progress?.minutesToNextLevel || 0} minutes
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Overall Practice Time Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Overall practice time</CardTitle>
            <CardDescription>
              Aggregated amount of your practice time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button size="sm" variant="default">
                7 days
              </Button>
              <Button size="sm" variant="outline">
                28 days
              </Button>
              <Button size="sm" variant="outline">
                All time
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Last 7 days: 29 Jul - 4 Aug
                </span>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <div className="h-20 bg-muted rounded-lg flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Streak Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Current streak
            </CardTitle>
            <CardDescription>
              Practice at least 3 minutes a day to complete a session.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Ongoing streak:</span>
              <Badge variant="secondary">
                {progress?.currentStreak || 0} days
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Longest streak:</span>
              <Badge variant="secondary">
                {progress?.longestStreak || 0} days
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* User Stats Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Your Stats
            </CardTitle>
            <CardDescription>Quick overview of your progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total practice time:</span>
              <Badge variant="outline">
                {Math.round((progress?.totalPracticeTime || 0) / 60)}h
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Daily score:</span>
              <Badge variant="outline">{progress?.dailyScore || 0}%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Member since:</span>
              <Badge variant="outline">
                {userDetails?.joinDate
                  ? new Date(userDetails.joinDate).toLocaleDateString()
                  : "N/A"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
