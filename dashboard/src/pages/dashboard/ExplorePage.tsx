import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Globe, Users, TrendingUp } from "lucide-react";

export default function ExplorePage() {
  const topics = [
    {
      id: "1",
      title: "Travel & Tourism",
      description: "Learn to communicate while traveling",
      difficulty: "Beginner",
      participants: 1240,
      trending: true,
    },
    {
      id: "2",
      title: "Business & Work",
      description: "Professional communication skills",
      difficulty: "Intermediate",
      participants: 890,
      trending: false,
    },
    {
      id: "3",
      title: "Daily Conversations",
      description: "Everyday English conversations",
      difficulty: "Beginner",
      participants: 2100,
      trending: true,
    },
    {
      id: "4",
      title: "Academic English",
      description: "University and academic discussions",
      difficulty: "Advanced",
      participants: 456,
      trending: false,
    },
    {
      id: "5",
      title: "Technology & IT",
      description: "Tech-related conversations",
      difficulty: "Intermediate",
      participants: 678,
      trending: true,
    },
    {
      id: "6",
      title: "Health & Wellness",
      description: "Medical and health discussions",
      difficulty: "Intermediate",
      participants: 543,
      trending: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Explore</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Featured Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Trending Topics</span>
          </CardTitle>
          <CardDescription>
            Most popular conversation topics this week
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topics
              .filter((t) => t.trending)
              .map((topic) => (
                <div key={topic.id} className="bg-white/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{topic.title}</h3>
                    <Badge variant="secondary">{topic.difficulty}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {topic.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{topic.participants}</span>
                    </div>
                    <Button size="sm">Join</Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* All Topics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Topics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <Card key={topic.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>{topic.title}</span>
                  </CardTitle>
                  {topic.trending && (
                    <Badge variant="default" className="bg-orange-500">
                      Trending
                    </Badge>
                  )}
                </div>
                <CardDescription>{topic.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{topic.difficulty}</Badge>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{topic.participants} participants</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button className="flex-1">Start Learning</Button>
                  <Button variant="outline" size="sm">
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
