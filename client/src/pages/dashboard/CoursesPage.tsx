import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Play, Clock, Star } from "lucide-react";

export default function CoursesPage() {
  const courses = [
    {
      id: "1",
      title: "Beginner English",
      description: "Learn the basics of English conversation",
      duration: "4 weeks",
      lessons: 12,
      progress: 0,
      rating: 4.8,
      isActive: true,
    },
    {
      id: "2",
      title: "Intermediate Speaking",
      description: "Improve your speaking skills",
      duration: "6 weeks",
      lessons: 18,
      progress: 0,
      rating: 4.6,
      isActive: true,
    },
    {
      id: "3",
      title: "Advanced Business English",
      description: "Master business communication",
      duration: "8 weeks",
      lessons: 24,
      progress: 0,
      rating: 4.9,
      isActive: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Courses</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5" />
                  <span>{course.title}</span>
                </CardTitle>
                <Badge variant={course.isActive ? "default" : "secondary"}>
                  {course.isActive ? "Available" : "Coming Soon"}
                </Badge>
              </div>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4" />
                  <span>{course.rating}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  className="flex-1" 
                  disabled={!course.isActive}
                >
                  <Play className="w-4 h-4 mr-2" />
                  {course.progress > 0 ? "Continue" : "Start"}
                </Button>
                <Button variant="outline" size="sm">
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 