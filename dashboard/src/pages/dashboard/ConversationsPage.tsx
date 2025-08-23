import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  MessageSquare,
  Clock,
  User,
  Calendar,
  Play,
  Download,
  Trash2,
} from "lucide-react";

const conversations = [
  {
    id: "1",
    title: "Project Planning Discussion",
    duration: "12:34",
    date: "2024-01-15",
    time: "2 hours ago",
    status: "completed",
    participants: ["John Doe", "Jane Smith"],
    tags: ["project", "planning"],
  },
  {
    id: "2",
    title: "Code Review Session",
    duration: "8:45",
    date: "2024-01-14",
    time: "1 day ago",
    status: "completed",
    participants: ["Mike Johnson"],
    tags: ["code", "review"],
  },
  {
    id: "3",
    title: "Meeting Notes",
    duration: "15:20",
    date: "2024-01-13",
    time: "2 days ago",
    status: "completed",
    participants: ["Team Lead", "Developers"],
    tags: ["meeting", "notes"],
  },
  {
    id: "4",
    title: "Client Call Recording",
    duration: "22:15",
    date: "2024-01-12",
    time: "3 days ago",
    status: "completed",
    participants: ["Client", "Sales Team"],
    tags: ["client", "sales"],
  },
  {
    id: "5",
    title: "Brainstorming Session",
    duration: "18:30",
    date: "2024-01-11",
    time: "4 days ago",
    status: "completed",
    participants: ["Design Team"],
    tags: ["brainstorming", "design"],
  },
];

export default function ConversationsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Conversations</h2>
          <p className="text-muted-foreground">
            Manage and review your voice conversations
          </p>
        </div>
        <Button>
          <MessageSquare className="w-4 h-4 mr-2" />
          New Conversation
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <div className="space-y-4">
        {conversations.map((conversation) => (
          <Card
            key={conversation.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">
                        {conversation.title}
                      </h3>
                      <Badge
                        variant={
                          conversation.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {conversation.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{conversation.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{conversation.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>
                          {conversation.participants.length} participants
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {conversation.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1-5 of 25 conversations
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
