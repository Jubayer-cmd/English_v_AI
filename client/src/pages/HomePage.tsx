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
  Check,
  X,
  Star,
  MessageCircle,
  Headphones,
  Globe,
  Settings,
  Crown,
  Phone,
  MessageSquare,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Mail,
  Download,
  Code,
  Palette,
  BarChart3,
  Clock,
  Award,
  Heart,
  Quote,
  User,
  Building,
  Bot,
  Smartphone,
  Monitor,
  Tablet,
  Cloud,
  Lock,
  RefreshCw,
  TrendingUp,
  Users2,
  Volume2,
  Languages,
  Target,
  Lightbulb,
  Rocket,
  Database,
  Cpu,
  Wifi,
  Twitter,
  Linkedin,
  Github,
  Youtube,
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useSession } from "@/lib/better-auth";
import { useState, useEffect } from "react";

function HomePage() {
  const { data: session, isPending } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollElements, setScrollElements] = useState<Set<Element>>(new Set());
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            setScrollElements((prev) => new Set(prev.add(entry.target)));
          }
        });
      },
      { threshold: 0.1 },
    );

    // Observe all elements with scroll-fade-in class
    const elements = document.querySelectorAll(".scroll-fade-in");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

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

  const pricingPlans = [
    {
      name: "Free",
      price: "0",
      currency: "৳",
      voiceMinutes: "15",
      textMessages: "100",
      idealFor: "New users, trial & learning",
      features: [
        "1 free 15-min voice session",
        "Basic chat",
        "Limited voice commands",
        "Email support",
      ],
      popular: false,
      icon: <Sparkles className="w-6 h-6" />,
    },
    {
      name: "Basic",
      price: "200",
      currency: "৳",
      voiceMinutes: "56",
      textMessages: "875",
      idealFor: "Light users",
      features: [
        "Voice + chat",
        "Real-time transcription",
        "Basic voice commands",
        "Text chat",
        "Email support",
      ],
      popular: false,
      icon: <MessageCircle className="w-6 h-6" />,
    },
    {
      name: "Standard",
      price: "300",
      currency: "৳",
      voiceMinutes: "84",
      textMessages: "1312",
      idealFor: "Regular users",
      features: [
        "Enhanced voice recognition",
        "Custom wake words",
        "Multilingual support",
        "Sentiment analysis",
        "Email + Discord support",
      ],
      popular: true,
      icon: <Headphones className="w-6 h-6" />,
    },
    {
      name: "Premium",
      price: "500",
      currency: "৳",
      voiceMinutes: "140",
      textMessages: "382",
      idealFor: "Power users, GPT-4 access",
      features: [
        "Priority support (call/WhatsApp)",
        "Advanced voice modulation",
        "Custom voice personas",
        "GPT-4 powered chat",
      ],
      popular: false,
      icon: <Crown className="w-6 h-6" />,
    },
  ];

  const featureComparison = [
    {
      feature: "Real-time Speech-to-Text (STT)",
      free: true,
      basic: true,
      standard: true,
      premium: true,
    },
    {
      feature: "Text-to-Speech (TTS)",
      free: true,
      basic: true,
      standard: true,
      premium: true,
    },
    {
      feature: "Custom Wake Word",
      free: false,
      basic: false,
      standard: true,
      premium: true,
    },
    {
      feature: "Multilingual Voice Support",
      free: false,
      basic: false,
      standard: true,
      premium: true,
    },
    {
      feature: "Custom Voice Personas",
      free: false,
      basic: false,
      standard: false,
      premium: true,
    },
    {
      feature: "Real-time Chat with GPT",
      free: false,
      basic: true,
      standard: true,
      premium: "GPT-4",
    },
    {
      feature: "Sentiment & Emotion Analysis",
      free: false,
      basic: false,
      standard: true,
      premium: true,
    },
    {
      feature: "Conversation History & Analytics",
      free: "Basic",
      basic: "Basic",
      standard: "Advanced",
      premium: "Advanced",
    },
    {
      feature: "API Access",
      free: false,
      basic: false,
      standard: false,
      premium: "Optional",
    },
    {
      feature: "Custom Branding & White-labeling",
      free: false,
      basic: false,
      standard: false,
      premium: "Optional",
    },
    {
      feature: "Priority Customer Support",
      free: "Email",
      basic: "Email",
      standard: "Email + Discord",
      premium: "Call/WhatsApp",
    },
  ];

  const stats = [
    {
      number: "10K+",
      label: "Active Users",
      icon: <Users2 className="w-6 h-6" />,
    },
    {
      number: "1M+",
      label: "Voice Minutes",
      icon: <Volume2 className="w-6 h-6" />,
    },
    {
      number: "50+",
      label: "Languages",
      icon: <Languages className="w-6 h-6" />,
    },
    { number: "99.9%", label: "Uptime", icon: <Zap className="w-6 h-6" /> },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechCorp",
      content:
        "Engla has revolutionized how we handle customer support. The voice AI understands context perfectly and provides accurate responses.",
      rating: 5,
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      company: "StartupXYZ",
      content:
        "The multilingual support and custom wake words have made our product truly global. Our users love the natural voice interactions.",
      rating: 5,
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "UX Designer",
      company: "DesignStudio",
      content:
        "The sentiment analysis feature helps us understand user emotions in real-time. It's like having an AI that truly understands people.",
      rating: 5,
      avatar: "ER",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Connect Your Device",
      description:
        "Simply connect your microphone and start speaking. Our AI works with any device - desktop, mobile, or tablet.",
      icon: <Smartphone className="w-8 h-8" />,
    },
    {
      step: "02",
      title: "Speak Naturally",
      description:
        "Talk to our AI in your natural voice. It understands context, emotions, and responds intelligently.",
      icon: <Mic className="w-8 h-8" />,
    },
    {
      step: "03",
      title: "Get Instant Responses",
      description:
        "Receive real-time responses with advanced language processing and custom voice personas.",
      icon: <MessageSquare className="w-8 h-8" />,
    },
  ];

  const integrations = [
    {
      name: "Slack",
      icon: <MessageSquare className="w-8 h-8" />,
      color: "bg-purple-500",
    },
    {
      name: "Discord",
      icon: <MessageSquare className="w-8 h-8" />,
      color: "bg-indigo-500",
    },
    {
      name: "Zapier",
      icon: <Zap className="w-8 h-8" />,
      color: "bg-orange-500",
    },
    {
      name: "Notion",
      icon: <Database className="w-8 h-8" />,
      color: "bg-gray-500",
    },
    {
      name: "Trello",
      icon: <Target className="w-8 h-8" />,
      color: "bg-blue-500",
    },
    {
      name: "GitHub",
      icon: <Code className="w-8 h-8" />,
      color: "bg-gray-800",
    },
  ];

  const faqs = [
    {
      question: "How accurate is the voice recognition?",
      answer:
        "Our voice recognition technology achieves 95%+ accuracy across multiple languages and accents. We use advanced AI models that continuously learn and improve.",
    },
    {
      question: "Can I use custom wake words?",
      answer:
        "Yes! Standard and Premium plans include custom wake word functionality. You can set any phrase to activate your AI assistant.",
    },
    {
      question: "What languages are supported?",
      answer:
        "We support 50+ languages including English, Spanish, French, German, Chinese, Japanese, and many more. New languages are added regularly.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Absolutely. We use enterprise-grade encryption and comply with GDPR, CCPA, and other privacy regulations. Your data never leaves our secure infrastructure.",
    },
    {
      question: "Can I integrate with my existing tools?",
      answer:
        "Yes! We offer API access and integrations with popular platforms like Slack, Discord, Zapier, and many others.",
    },
    {
      question: "What's the difference between plans?",
      answer:
        "Free offers basic features, Basic adds real-time chat, Standard includes custom wake words and multilingual support, while Premium provides GPT-4 access and custom voice personas.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] relative">
      {/* Cosmic Aurora */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 30%, rgba(56, 189, 248, 0.4) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 70%),
            radial-gradient(ellipse at 60% 20%, rgba(236, 72, 153, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse at 40% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 65%)
          `,
        }}
      />

      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50 glass relative z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center animate-float">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">Engla</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="btn-hover-effect">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="btn-hover-effect">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div
          className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <Badge variant="secondary" className="mb-4 animate-pulse-slow">
            <Sparkles className="w-4 h-4 mr-2" />
            Next Generation Voice AI
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text animate-fade-in">
            Transform Your Voice
            <br />
            Into Intelligence
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in stagger-1">
            Experience the future of voice interaction. Our AI-powered platform
            understands, responds, and learns from your conversations with
            unprecedented accuracy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in stagger-2">
            <Link to="/register">
              <Button
                size="lg"
                className="text-lg px-8 py-6 hover:scale-105 transition-transform btn-hover-effect"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Free Trial
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 hover:scale-105 transition-transform btn-hover-effect"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center scroll-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto animate-float">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16 scroll-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for Modern Voice AI
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to build, deploy, and scale voice AI
            applications
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Brain className="w-6 h-6 text-primary" />,
              title: "Advanced AI",
              description:
                "State-of-the-art language models that understand context and nuance",
            },
            {
              icon: <Mic className="w-6 h-6 text-primary" />,
              title: "Voice Recognition",
              description:
                "Crystal clear voice processing with noise cancellation and accent support",
            },
            {
              icon: <Zap className="w-6 h-6 text-primary" />,
              title: "Real-time Processing",
              description:
                "Lightning-fast response times with streaming audio processing",
            },
            {
              icon: <Shield className="w-6 h-6 text-primary" />,
              title: "Enterprise Security",
              description:
                "Bank-level encryption and compliance with industry standards",
            },
            {
              icon: <Users className="w-6 h-6 text-primary" />,
              title: "Team Collaboration",
              description:
                "Share conversations, collaborate on projects, and manage team access",
            },
            {
              icon: <Sparkles className="w-6 h-6 text-primary" />,
              title: "Custom Integrations",
              description:
                "Connect with your favorite tools and platforms via our API",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg scroll-fade-in hover-lift bg-background/50 backdrop-blur-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 animate-float">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16 scroll-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get started in minutes with our simple three-step process
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {howItWorks.map((step, index) => (
            <Card
              key={index}
              className="text-center scroll-fade-in hover-lift bg-background/50 backdrop-blur-sm"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto animate-float">
                  {step.icon}
                </div>
                <div className="text-sm text-primary font-semibold mb-2">
                  {step.step}
                </div>
                <CardTitle className="text-xl">{step.title}</CardTitle>
                <CardDescription className="text-base">
                  {step.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16 scroll-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            What Our Users Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of satisfied users who trust Engla for their voice AI
            needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="scroll-fade-in hover-lift bg-background/50 backdrop-blur-sm"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                    <span className="font-semibold text-primary">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <blockquote className="text-muted-foreground italic">
                  "{testimonial.content}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16 scroll-fade-in">
          <Badge variant="outline" className="mb-4">
            <Star className="w-4 h-4 mr-2" />
            Pricing Plans
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Choose Your Perfect Plan
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start with our free tier and scale as you grow. All plans include
            our core voice AI features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative transition-all duration-300 hover:scale-105 hover:shadow-xl scroll-fade-in pricing-card bg-background/50 backdrop-blur-sm ${
                plan.popular
                  ? "border-primary shadow-lg scale-105"
                  : "border-border/50 hover:border-primary/50"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground animate-pulse-slow">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto animate-float">
                  {plan.icon}
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center space-x-1">
                  <span className="text-3xl font-bold">{plan.currency}</span>
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription className="text-sm">
                  {plan.voiceMinutes} voice minutes • {plan.textMessages} text
                  messages
                </CardDescription>
                <p className="text-xs text-muted-foreground mt-2">
                  Ideal for: {plan.idealFor}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center text-sm"
                    >
                      <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full mt-6 btn-hover-effect ${
                    plan.popular ? "bg-primary hover:bg-primary/90" : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.name === "Free" ? "Get Started" : "Choose Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-background/50 backdrop-blur-sm border rounded-lg p-6 scroll-fade-in">
          <h3 className="text-xl font-bold mb-6 text-center">
            Feature Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Features</th>
                  <th className="text-center py-3 px-4 font-medium">Free</th>
                  <th className="text-center py-3 px-4 font-medium">Basic</th>
                  <th className="text-center py-3 px-4 font-medium">
                    Standard
                  </th>
                  <th className="text-center py-3 px-4 font-medium">Premium</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-border/50 feature-row"
                  >
                    <td className="py-3 px-4 font-medium">{item.feature}</td>
                    <td className="py-3 px-4 text-center">
                      {item.free === true ? (
                        <Check className="w-5 h-5 text-primary mx-auto" />
                      ) : item.free === false ? (
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {item.free}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.basic === true ? (
                        <Check className="w-5 h-5 text-primary mx-auto" />
                      ) : item.basic === false ? (
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {item.basic}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.standard === true ? (
                        <Check className="w-5 h-5 text-primary mx-auto" />
                      ) : item.standard === false ? (
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {item.standard}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {item.premium === true ? (
                        <Check className="w-5 h-5 text-primary mx-auto" />
                      ) : item.premium === false ? (
                        <X className="w-5 h-5 text-muted-foreground mx-auto" />
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {item.premium}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16 scroll-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to know about Engla Voice AI
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className="scroll-fade-in bg-background/50 backdrop-blur-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              {openFaq === index && (
                <CardContent className="pt-0">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Merged CTA & Newsletter Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <Card className="bg-background/50 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-shadow scroll-fade-in">
          <CardContent className="text-center py-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
                Ready to Transform Your Voice Experience?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already experiencing the future
                of voice AI. Get the latest updates, new features, and voice AI
                insights delivered to your inbox.
              </p>

              {/* Newsletter Signup */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg border border-border bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-sm"
                  />
                  <Button className="btn-hover-effect">Subscribe</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  No spam, unsubscribe at any time.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 hover:scale-105 transition-transform btn-hover-effect"
                  >
                    Get Started Today
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 hover:scale-105 transition-transform btn-hover-effect"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Sales
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/80 glass relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center animate-float">
                  <Mic className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold gradient-text">Engla</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Transform your voice into intelligence with our advanced
                AI-powered platform. Experience the future of voice interaction.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    API
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Integrations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Partners
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Status
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-border/40 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-muted-foreground mb-4 md:mb-0">
                © 2025 NexrBinary. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Cookie Policy
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  GDPR
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
