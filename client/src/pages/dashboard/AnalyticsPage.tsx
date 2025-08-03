import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  MessageSquare,
  Volume2,
  Activity,
} from "lucide-react";

const stats = [
  {
    title: "Total Sessions",
    value: "1,234",
    change: "+20.1%",
    trend: "up",
    icon: MessageSquare,
  },
  {
    title: "Total Duration",
    value: "45.2h",
    change: "+12.3%",
    trend: "up",
    icon: Clock,
  },
  {
    title: "Active Users",
    value: "89",
    change: "+5.2%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Success Rate",
    value: "98.5%",
    change: "+2.1%",
    trend: "up",
    icon: Volume2,
  },
];

const weeklyData = [
  { day: "Mon", sessions: 45, duration: 3.2 },
  { day: "Tue", sessions: 52, duration: 4.1 },
  { day: "Wed", sessions: 38, duration: 2.8 },
  { day: "Thu", sessions: 61, duration: 4.5 },
  { day: "Fri", sessions: 48, duration: 3.6 },
  { day: "Sat", sessions: 25, duration: 2.1 },
  { day: "Sun", sessions: 30, duration: 2.3 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-muted-foreground">
          Detailed insights and performance metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
                <span
                  className={
                    stat.trend === "up" ? "text-green-500" : "text-red-500"
                  }
                >
                  {stat.change} from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>
              Sessions and duration over the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyData.map((data) => (
                <div
                  key={data.day}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 text-center font-medium">
                      {data.day}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(data.sessions / 61) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {data.sessions}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>Most used conversation categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: "Project Planning", count: 156, percentage: 35 },
                { category: "Code Review", count: 124, percentage: 28 },
                { category: "Meeting Notes", count: 98, percentage: 22 },
                { category: "Client Calls", count: 67, percentage: 15 },
              ].map((item) => (
                <div
                  key={item.category}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {item.count}
                    </span>
                    <Badge variant="outline">{item.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Average Session Duration</span>
              <span className="font-medium">12.5 min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Peak Usage Time</span>
              <span className="font-medium">2:00 PM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Most Active Day</span>
              <span className="font-medium">Thursday</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Success Rate</span>
              <span className="font-medium text-green-500">98.5%</span>
            </div>
          </CardContent>
        </Card>

        {/* User Engagement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Engagement</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Daily Active Users</span>
              <span className="font-medium">89</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Weekly Active Users</span>
              <span className="font-medium">234</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Monthly Active Users</span>
              <span className="font-medium">1,567</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Retention Rate</span>
              <span className="font-medium text-green-500">94.2%</span>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>System Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Uptime</span>
              <span className="font-medium text-green-500">99.9%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Response Time</span>
              <span className="font-medium">120ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Error Rate</span>
              <span className="font-medium text-green-500">0.1%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Last Updated</span>
              <span className="font-medium">2 min ago</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
