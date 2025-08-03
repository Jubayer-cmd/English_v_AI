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
  Brain,
  Zap,
  Shield,
  Users,
  ArrowRight,
  Play,
  Sparkles,
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useSession } from "@/lib/better-auth";

function HomePage() {
  const { data: session, isPending } = useSession();

  // If user is authenticated, redirect to dashboard
  if (!isPending && session) {
    return <Navigate to="/dashboard" replace />;
  }

  // Show loading while checking authentication
  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">VoiceAI</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Next Generation Voice AI
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Transform Your Voice
            <br />
            Into Intelligence
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the future of voice interaction. Our AI-powered platform
            understands, responds, and learns from your conversations with
            unprecedented accuracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="text-lg px-8 py-6">
                <Play className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              <ArrowRight className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Modern Voice AI
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to build, deploy, and scale voice AI
            applications
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Advanced AI</CardTitle>
              <CardDescription>
                State-of-the-art language models that understand context and
                nuance
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Mic className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Voice Recognition</CardTitle>
              <CardDescription>
                Crystal clear voice processing with noise cancellation and
                accent support
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Real-time Processing</CardTitle>
              <CardDescription>
                Lightning-fast response times with streaming audio processing
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Enterprise Security</CardTitle>
              <CardDescription>
                Bank-level encryption and compliance with industry standards
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Team Collaboration</CardTitle>
              <CardDescription>
                Share conversations, collaborate on projects, and manage team
                access
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Custom Integrations</CardTitle>
              <CardDescription>
                Connect with your favorite tools and platforms via our API
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="text-center py-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Voice Experience?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already experiencing the future of
              voice AI
            </p>
            <Link to="/register">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/80">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Mic className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">VoiceAI</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 NexrBinary. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
