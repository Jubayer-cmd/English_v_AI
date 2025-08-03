import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MessageSquare,
  BarChart3,
  Play,
  Square,
  Volume2,
  Users,
  Clock,
  TrendingUp,
} from "lucide-react";

export default function DashboardHome() {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="space-y-6">
      {/* Voice Recording Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mic className="w-5 h-5" />
            <span>Voice Recording</span>
          </CardTitle>
          <CardDescription>
            Start a new voice conversation with AI
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sessions
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span>+20.1% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Duration
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2h</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span>+12.3% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span>+5.2% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span>+2.1% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Conversations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Conversations</CardTitle>
            <CardDescription>Your latest voice AI interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "Project Planning Discussion",
                  duration: "12:34",
                  date: "2 hours ago",
                  status: "completed",
                },
                {
                  title: "Code Review Session",
                  duration: "8:45",
                  date: "1 day ago",
                  status: "completed",
                },
                {
                  title: "Meeting Notes",
                  duration: "15:20",
                  date: "2 days ago",
                  status: "completed",
                },
              ].map((conversation, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{conversation.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {conversation.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{conversation.duration}</Badge>
                    <Button variant="ghost" size="sm">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Mic className="w-6 h-6" />
                <span>New Recording</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <MessageSquare className="w-6 h-6" />
                <span>View All</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <BarChart3 className="w-6 h-6" />
                <span>Analytics</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Users className="w-6 h-6" />
                <span>Team</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
