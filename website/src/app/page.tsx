'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  Crown,
  Phone,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Users2,
  Volume2,
  Languages,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  BookOpen,
  GraduationCap,
  Repeat,
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { WatchDemoModal } from '@/components/ui/WatchDemoModal';

function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setIsVisible(true);

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 },
    );

    // Observe all elements with scroll-fade-in class
    const elements = document.querySelectorAll('.scroll-fade-in');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const pricingPlans = [
    {
      name: 'Free',
      price: '0',
      currency: '৳',
      voiceMinutes: '15',
      textMessages: '100',
      idealFor: 'Getting started with AI conversation',
      features: [
        '5 practice sessions per month',
        'Basic conversation topics',
        'Standard AI voice',
        'Email support',
      ],
      popular: false,
      icon: <Sparkles className='w-6 h-6' />,
    },
    {
      name: 'Basic',
      price: '200',
      currency: '৳',
      voiceMinutes: '56',
      textMessages: '875',
      idealFor: 'Consistent daily practice',
      features: [
        '25 practice sessions per month',
        'Access to all conversation topics',
        'Premium AI voices',
        'Priority email support',
      ],
      popular: true,
      icon: <MessageCircle className='w-6 h-6' />,
    },
    {
      name: 'Standard',
      price: '300',
      currency: '৳',
      voiceMinutes: '84',
      textMessages: '1312',
      idealFor: 'Serious learners',
      features: [
        '50 practice sessions per month',
        'Advanced grammar feedback',
        'In-depth performance analytics',
        'Email + Discord support',
      ],
      popular: false,
      icon: <Headphones className='w-6 h-6' />,
    },
    {
      name: 'Premium',
      price: '500',
      currency: '৳',
      voiceMinutes: '140',
      textMessages: '382',
      idealFor: 'Achieving fluency fast',
      features: [
        'Unlimited practice sessions',
        'Personalized learning paths',
        'Live feedback sessions (beta)',
        'Dedicated support channel',
      ],
      popular: false,
      icon: <Crown className='w-6 h-6' />,
    },
  ];

  const featureComparison = [
    {
      feature: 'AI Conversations',
      free: '5/mo',
      basic: '25/mo',
      standard: '50/mo',
      premium: 'Unlimited',
    },
    {
      feature: 'Conversation Topics',
      free: 'Basic',
      basic: 'All',
      standard: 'All',
      premium: 'All',
    },
    {
      feature: 'Grammar Feedback',
      free: true,
      basic: true,
      standard: 'Advanced',
      premium: 'Advanced',
    },
    {
      feature: 'Pronunciation Score',
      free: true,
      basic: true,
      standard: true,
      premium: true,
    },
    {
      feature: 'Performance Analytics',
      free: false,
      basic: false,
      standard: true,
      premium: true,
    },
    {
      feature: 'Personalized Learning Paths',
      free: false,
      basic: false,
      standard: false,
      premium: true,
    },
    {
      feature: 'Premium Voices',
      free: false,
      basic: true,
      standard: true,
      premium: true,
    },
    {
      feature: 'Support',
      free: 'Email',
      basic: 'Priority Email',
      standard: 'Email + Discord',
      premium: 'Dedicated',
    },
  ];

  const stats = [
    {
      number: '10K+',
      label: 'Active Learners',
      icon: <Users2 className='w-6 h-6' />,
    },
    {
      number: '500K+',
      label: 'Conversations Held',
      icon: <Volume2 className='w-6 h-6' />,
    },
    {
      number: '120+',
      label: 'Conversation Topics',
      icon: <Languages className='w-6 h-6' />,
    },
    {
      number: '4.9/5',
      label: 'User Rating',
      icon: <Star className='w-6 h-6' />,
    },
  ];

  const testimonials = [
    {
      name: 'Maria S.',
      role: 'University Student',
      content:
        'Engla has been a game-changer for my confidence. I can practice speaking anytime without feeling judged. The AI is surprisingly natural!',
      rating: 5,
      avatar: 'MS',
    },
    {
      name: 'Kenji T.',
      role: 'Software Engineer',
      content:
        'I needed to improve my English for work. The real-world scenarios like job interviews were incredibly helpful. I got the promotion!',
      rating: 5,
      avatar: 'KT',
    },
    {
      name: 'Fatima A.',
      role: 'Aspiring Traveler',
      content:
        "I'm learning English to travel the world. Chatting with the AI about different cultures is my favorite part. It feels like I'm already on an adventure.",
      rating: 5,
      avatar: 'FA',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Choose a Topic',
      description:
        'Select from a wide range of real-world scenarios and topics. From ordering coffee to discussing business.',
      icon: <Smartphone className='w-8 h-8' />,
    },
    {
      step: '02',
      title: 'Start a Conversation',
      description:
        'Speak or chat naturally with our friendly AI. It understands context and responds just like a real person.',
      icon: <Mic className='w-8 h-8' />,
    },
    {
      step: '03',
      title: 'Get Instant Feedback',
      description:
        'Receive immediate feedback on your pronunciation, grammar, and vocabulary to help you improve fast.',
      icon: <MessageSquare className='w-8 h-8' />,
    },
  ];

  const faqs = [
    {
      question: 'How does the AI help me learn English?',
      answer:
        'Our AI acts as your personal language partner. It engages in natural conversation, provides instant feedback on your speaking and writing, and helps you build confidence in a pressure-free environment.',
    },
    {
      question: 'Is this suitable for absolute beginners?',
      answer:
        'Yes! Engla is designed for all levels. Beginners can start with basic topics and simple conversations, while advanced learners can tackle complex subjects to refine their fluency.',
    },
    {
      question: 'What kind of topics can I talk about?',
      answer:
        'You can talk about anything! We have structured topics like job interviews, presentations, and daily life scenarios, or you can have open-ended conversations about your hobbies, interests, or current events.',
    },
    {
      question: 'How is my pronunciation evaluated?',
      answer:
        'We use state-of-the-art speech recognition to analyze your pronunciation, intonation, and rhythm. You get a clear score and suggestions for improvement after each session.',
    },
    {
      question: 'Can I track my progress?',
      answer:
        'Absolutely. Your dashboard provides a detailed overview of your progress, including conversation history, vocabulary growth, and performance metrics over time.',
    },
  ];

  return (
    <div className='min-h-screen w-full bg-[#0a0a0a] relative'>
      {/* Cosmic Aurora */}
      <div
        className='absolute inset-0 z-0'
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 30%, rgba(59, 130, 246, 0.4) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 70%, rgba(147, 51, 234, 0.3) 0%, transparent 70%),
            radial-gradient(ellipse at 60% 20%, rgba(236, 72, 153, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse at 40% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 65%)
          `,
        }}
      />

      {/* Navigation */}
      <nav className='border-b border-border/20 bg-transparent backdrop-blur-sm sticky top-0 z-50 relative transition-all duration-300 hover:bg-black/20'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Image src='/logo.png' alt='Engla Logo' width={120} height={100} />
          </div>
          <div className='flex items-center space-x-4'>
            <Link
              href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/login`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button variant='default' className='btn-hover-effect'>
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='container mx-auto px-4 py-20 relative z-10'>
        <div
          className={`text-center max-w-4xl mx-auto transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <Badge variant='secondary' className='mb-4 animate-pulse-slow'>
            <Sparkles className='w-4 h-4 mr-2 text-primary-foreground' />
            Your Personal AI English Tutor
          </Badge>
          <h1 className='text-5xl md:text-5xl font-bold mb-6 gradient-text animate-fade-in'>
            Speak English Confidently
            <br />
            with Your AI Language Partner
          </h1>
          <p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in stagger-1'>
            Practice real-world conversations, get instant feedback on your
            pronunciation and grammar, and build fluency at your own pace. No
            pressure, just progress.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center animate-fade-in stagger-2'>
            <Link
              href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/register`}
              target='_blank'
              rel='noopener noreferrer'
            >
              <Button
                size='lg'
                className='text-lg px-8 py-6 hover:scale-105 transition-transform btn-hover-effect'
              >
                <Play className='w-5 h-5 mr-2' />
                Start Practicing for Free
              </Button>
            </Link>
            <WatchDemoModal />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='container mx-auto px-4 py-16 relative z-10'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
          {stats.map((stat, index) => (
            <div
              key={index}
              className='text-center scroll-fade-in'
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto animate-float'>
                {stat.icon}
              </div>
              <div className='text-3xl font-bold text-primary mb-2'>
                {stat.number}
              </div>
              <div className='text-sm text-muted-foreground'>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className='container mx-auto px-4 py-20 relative z-10'>
        <div className='text-center mb-16 scroll-fade-in'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Everything You Need to Become Fluent
          </h2>
          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            Our features are designed to improve your speaking, writing, and
            listening skills in a fun and effective way.
          </p>
        </div>

        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {[
            {
              icon: <Brain className='w-6 h-6 text-primary' />,
              title: 'Practice Speaking',
              description:
                'Have natural conversations with an AI that understands and responds in real-time.',
            },
            {
              icon: <Mic className='w-6 h-6 text-primary' />,
              title: 'Interactive Chat',
              description:
                'Improve your writing skills by chatting with the AI on any topic you can imagine.',
            },
            {
              icon: <Zap className='w-6 h-6 text-primary' />,
              title: 'Instant Feedback',
              description:
                'Get immediate corrections on your grammar, spelling, and pronunciation.',
            },
            {
              icon: <Shield className='w-6 h-6 text-primary' />,
              title: 'Real-world Scenarios',
              description:
                'Practice conversations for job interviews, presentations, or making friends.',
            },
            {
              icon: <Users className='w-6 h-6 text-primary' />,
              title: 'Vocabulary Builder',
              description:
                'Learn and retain new words and phrases with our smart repetition system.',
            },
            {
              icon: <Sparkles className='w-6 h-6 text-primary' />,
              title: 'Track Your Progress',
              description:
                'Watch your skills grow with detailed performance analytics and progress reports.',
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className='border-border/50 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-lg scroll-fade-in hover-lift bg-background/50 backdrop-blur-sm'
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 animate-float'>
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
      <section className='container mx-auto px-4 py-20 relative z-10'>
        <div className='text-center mb-16 scroll-fade-in'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 gradient-text'>
            How It Works
          </h2>
          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            Start your journey to fluency in just three simple steps.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {howItWorks.map((step, index) => (
            <Card
              key={index}
              className='text-center scroll-fade-in hover-lift bg-background/50 backdrop-blur-sm'
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardHeader>
                <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto animate-float'>
                  {step.icon}
                </div>
                <div className='text-sm text-primary font-semibold mb-2'>
                  {step.step}
                </div>
                <CardTitle className='text-xl'>{step.title}</CardTitle>
                <CardDescription className='text-base'>
                  {step.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Tutor vs Engla Section */}
      <section className='container mx-auto px-4 py-20 relative z-10'>
        <div className='text-center mb-16 scroll-fade-in'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 gradient-text'>
            Tutor vs Engla: Choose Your Path
          </h2>
          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            Compare traditional tutoring with AI-powered learning and discover
            what works best for you.
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          {/* Traditional Tutor Card */}
          <Card
            className='scroll-fade-in hover-lift bg-background/50 backdrop-blur-sm border-border/50 hover:border-border/70'
            style={{ animationDelay: `0ms` }}
          >
            <CardHeader>
              <div className='w-12 h-12 bg-muted/10 rounded-lg flex items-center justify-center mb-4 mx-auto animate-float'>
                <Users className='w-6 h-6 text-muted-foreground' />
              </div>
              <CardTitle className='text-center text-muted-foreground'>
                Traditional Tutor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold text-red-500 mb-2'>
                    ❌ Challenges
                  </h4>
                  <ul className='space-y-3 text-sm text-muted-foreground'>
                    <li className='flex items-start'>
                      <X className='w-4 h-4 text-red-500 mr-3 mt-0.5 flex-shrink-0' />
                      <span>High cost (৳2,000-5,000/session)</span>
                    </li>
                    <li className='flex items-start'>
                      <X className='w-4 h-4 text-red-500 mr-3 mt-0.5 flex-shrink-0' />
                      <span>Limited availability & scheduling conflicts</span>
                    </li>
                    <li className='flex items-start'>
                      <X className='w-4 h-4 text-red-500 mr-3 mt-0.5 flex-shrink-0' />
                      <span>Inconsistent quality between sessions</span>
                    </li>
                    <li className='flex items-start'>
                      <X className='w-4 h-4 text-red-500 mr-3 mt-0.5 flex-shrink-0' />
                      <span>Time zone & location restrictions</span>
                    </li>
                    <li className='flex items-start'>
                      <X className='w-4 h-4 text-red-500 mr-3 mt-0.5 flex-shrink-0' />
                      <span>Subject to tutor availability and mood</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Engla Card */}
          <Card
            className='scroll-fade-in hover-lift bg-background/50 backdrop-blur-sm border-primary/50 hover:border-primary/70'
            style={{ animationDelay: `200ms` }}
          >
            <CardHeader>
              <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto animate-float'>
                <Brain className='w-6 h-6 text-primary' />
              </div>
              <CardTitle className='text-center'>Engla AI Tutor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div>
                  <h4 className='font-semibold text-primary mb-2'>
                    ✅ Solutions
                  </h4>
                  <ul className='space-y-3 text-sm'>
                    <li className='flex items-start'>
                      <Check className='w-4 h-4 text-primary mr-3 mt-0.5 flex-shrink-0' />
                      <span>24/7 availability, anytime access</span>
                    </li>
                    <li className='flex items-start'>
                      <Check className='w-4 h-4 text-primary mr-3 mt-0.5 flex-shrink-0' />
                      <span>Instant feedback on all responses</span>
                    </li>
                    <li className='flex items-start'>
                      <Check className='w-4 h-4 text-primary mr-3 mt-0.5 flex-shrink-0' />
                      <span>Affordable pricing (starts free)</span>
                    </li>
                    <li className='flex items-start'>
                      <Check className='w-4 h-4 text-primary mr-3 mt-0.5 flex-shrink-0' />
                      <span>Consistent, judgment-free practice</span>
                    </li>
                    <li className='flex items-start'>
                      <Check className='w-4 h-4 text-primary mr-3 mt-0.5 flex-shrink-0' />
                      <span>Adaptive learning technology</span>
                    </li>
                    <li className='flex items-start'>
                      <Check className='w-4 h-4 text-primary mr-3 mt-0.5 flex-shrink-0' />
                      <span>Unlimited practice sessions</span>
                    </li>
                  </ul>
                </div>

                <div className='bg-primary/5 rounded-lg p-4 mt-6'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold text-primary mb-1'>
                      From ৳0
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Free to start, upgrade anytime
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA in the section */}
        <div className='text-center mt-16'>
          <Link
            href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/register`}
            target='_blank'
            rel='noopener noreferrer'
          >
            <Button
              size='lg'
              className='text-lg px-8 py-6 hover:scale-105 transition-transform btn-hover-effect'
            >
              <Sparkles className='w-5 h-5 mr-2' />
              Try Engla Free Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='container mx-auto px-4 py-20 relative z-10'>
        <div className='text-center mb-16 scroll-fade-in'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 gradient-text'>
            Loved by Learners Worldwide
          </h2>
          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            See how Engla is helping people from all walks of life achieve their
            language goals.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className='scroll-fade-in hover-lift bg-background/50 backdrop-blur-sm'
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <CardContent className='pt-6'>
                <div className='flex items-center mb-4'>
                  <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4'>
                    <span className='font-semibold text-primary'>
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <div className='font-semibold'>{testimonial.name}</div>
                    <div className='text-sm text-muted-foreground'>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <div className='flex mb-4'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className='w-4 h-4 text-yellow-400 fill-current'
                    />
                  ))}
                </div>
                <blockquote className='text-muted-foreground italic'>
                  “{testimonial.content}”
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className='container mx-auto px-4 py-20 relative z-10'>
        <div className='text-center mb-16 scroll-fade-in'>
          <Badge variant='outline' className='mb-4'>
            <Star className='w-4 h-4 mr-2' />
            Pricing Plans
          </Badge>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 gradient-text'>
            Choose Your Plan
          </h2>
          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            Start for free and upgrade as you grow. Simple, flexible pricing for
            every learner.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'>
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`relative transition-all duration-300 hover:scale-105 hover:shadow-xl scroll-fade-in pricing-card bg-background/50 backdrop-blur-sm flex flex-col h-full ${
                plan.popular
                  ? 'border-primary shadow-lg scale-105'
                  : 'border-border/50 hover:border-primary/50'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {plan.popular && (
                <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                  <Badge className='bg-primary text-primary-foreground'>
                    <Star className='w-3 h-3 mr-1' />
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className='text-center flex-shrink-0'>
                <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto animate-float'>
                  {plan.icon}
                </div>
                <CardTitle className='text-xl'>{plan.name}</CardTitle>
                <div className='flex items-baseline justify-center space-x-1'>
                  <span className='text-3xl font-bold'>{plan.currency}</span>
                  <span className='text-4xl font-bold'>{plan.price}</span>
                  <span className='text-muted-foreground'>/month</span>
                </div>
                <CardDescription className='text-sm'>
                  {plan.voiceMinutes} voice minutes • {plan.textMessages} text
                  messages
                </CardDescription>
                <p className='text-xs text-muted-foreground mt-2'>
                  Ideal for: {plan.idealFor}
                </p>
              </CardHeader>
              <CardContent className='flex flex-col flex-grow'>
                <ul className='space-y-2 flex-grow'>
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className='flex items-center text-sm'
                    >
                      <Check className='w-4 h-4 text-primary mr-2 flex-shrink-0' />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className='mt-6'>
                  <Button
                    className={`w-full btn-hover-effect ${
                      plan.popular ? 'bg-primary hover:bg-primary/90' : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.name === 'Free' ? 'Get Started' : 'Choose Plan'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className='bg-background/50 backdrop-blur-sm border rounded-lg p-6 scroll-fade-in'>
          <h3 className='text-xl font-bold mb-6 text-center'>
            Full Feature Comparison
          </h3>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b'>
                  <th className='text-left py-3 px-4 font-medium'>Features</th>
                  <th className='text-center py-3 px-4 font-medium'>Free</th>
                  <th className='text-center py-3 px-4 font-medium'>Basic</th>
                  <th className='text-center py-3 px-4 font-medium'>
                    Standard
                  </th>
                  <th className='text-center py-3 px-4 font-medium'>Premium</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((item, index) => (
                  <tr
                    key={index}
                    className='border-b border-border/50 feature-row'
                  >
                    <td className='py-3 px-4 font-medium'>{item.feature}</td>
                    <td className='py-3 px-4 text-center text-muted-foreground'>
                      {typeof item.free === 'boolean' ? (
                        item.free ? (
                          <Check className='w-5 h-5 text-green-500 mx-auto' />
                        ) : (
                          <X className='w-5 h-5 text-red-500 mx-auto' />
                        )
                      ) : (
                        item.free
                      )}
                    </td>
                    <td className='py-3 px-4 text-center text-muted-foreground'>
                      {typeof item.basic === 'boolean' ? (
                        item.basic ? (
                          <Check className='w-5 h-5 text-green-500 mx-auto' />
                        ) : (
                          <X className='w-5 h-5 text-red-500 mx-auto' />
                        )
                      ) : (
                        item.basic
                      )}
                    </td>
                    <td className='py-3 px-4 text-center text-muted-foreground'>
                      {typeof item.standard === 'boolean' ? (
                        item.standard ? (
                          <Check className='w-5 h-5 text-green-500 mx-auto' />
                        ) : (
                          <X className='w-5 h-5 text-red-500 mx-auto' />
                        )
                      ) : (
                        item.standard
                      )}
                    </td>
                    <td className='py-3 px-4 text-center text-muted-foreground'>
                      {typeof item.premium === 'boolean' ? (
                        item.premium ? (
                          <Check className='w-5 h-5 text-green-500 mx-auto' />
                        ) : (
                          <X className='w-5 h-5 text-red-500 mx-auto' />
                        )
                      ) : (
                        item.premium
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
      <section className='container mx-auto px-4 py-20 relative z-10'>
        <div className='text-center mb-16 scroll-fade-in'>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 gradient-text'>
            Frequently Asked Questions
          </h2>
          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            Have questions? We've got answers. Here are some of the most common
            things we get asked.
          </p>
        </div>

        <div className='max-w-3xl mx-auto space-y-4'>
          {faqs.map((faq, index) => (
            <Card
              key={index}
              className='scroll-fade-in bg-background/50 backdrop-blur-sm'
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader
                className='cursor-pointer hover:bg-muted/50 transition-colors'
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg'>{faq.question}</CardTitle>
                  {openFaq === index ? (
                    <ChevronUp className='w-5 h-5 text-muted-foreground' />
                  ) : (
                    <ChevronDown className='w-5 h-5 text-muted-foreground' />
                  )}
                </div>
              </CardHeader>
              {openFaq === index && (
                <CardContent className='pt-0'>
                  <p className='text-muted-foreground'>{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Merged CTA & Newsletter Section */}
      <section className='container mx-auto px-4 py-20 relative z-10'>
        <Card className='bg-background/50 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-shadow scroll-fade-in'>
          <CardContent className='text-center py-16'>
            <div className='max-w-4xl mx-auto'>
              <h2 className='text-3xl md:text-4xl font-bold mb-4 gradient-text'>
                Ready to Start Speaking English Fluently?
              </h2>
              <p className='text-muted-foreground text-lg mb-8 max-w-2xl mx-auto'>
                Join thousands of learners who are building confidence and
                fluency with their AI language partner. Get started for free
                today.
              </p>

              {/* Newsletter Signup */}
              <div className='mb-8'>
                <div className='flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-4'>
                  <input
                    type='email'
                    placeholder='Enter your email'
                    className='flex-1 px-4 py-3 rounded-lg border border-border bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-sm'
                  />
                  <Button className='btn-hover-effect'>Subscribe</Button>
                </div>
                <p className='text-xs text-muted-foreground'>
                  No spam, unsubscribe at any time.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link
                  href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/register`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Button
                    size='lg'
                    className='text-lg px-8 py-6 hover:scale-105 transition-transform btn-hover-effect'
                  >
                    Start Your Free Trial
                    <ArrowRight className='w-5 h-5 ml-2' />
                  </Button>
                </Link>
                <Button
                  variant='outline'
                  size='lg'
                  className='text-lg px-8 py-6 hover:scale-105 transition-transform btn-hover-effect'
                >
                  <Phone className='w-5 h-5 mr-2' />
                  Contact Sales
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className='border-t border-border/40 bg-background/80 glass relative z-10'>
        <div className='container mx-auto px-4 py-12'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8'>
            {/* Company Info */}
            <div className='space-y-4'>
              <div className='flex items-center space-x-2'>
                <Image
                  src='/logo.png'
                  alt='Engla Logo'
                  width={150}
                  height={150}
                />
              </div>
              <p className='text-muted-foreground text-sm'>
                Your personal AI partner for mastering English conversation.
                Practice anytime, anywhere.
              </p>
              <div className='flex space-x-4'>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  <Twitter className='w-5 h-5' />
                </a>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  <Linkedin className='w-5 h-5' />
                </a>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  <Github className='w-5 h-5' />
                </a>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  <Youtube className='w-5 h-5' />
                </a>
              </div>
            </div>

            {/* Product */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-lg'>Product</h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a
                    href='#'
                    className='text-muted-foreground hover:text-primary transition-colors'
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-muted-foreground hover:text-primary transition-colors'
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-muted-foreground hover:text-primary transition-colors'
                  >
                    Scenarios
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-muted-foreground hover:text-primary transition-colors'
                  >
                    Download
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-lg'>Company</h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a
                    href='#'
                    className='text-muted-foreground hover:text-primary transition-colors'
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-muted-foreground hover:text-primary transition-colors'
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-muted-foreground hover:text-primary transition-colors'
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-muted-foreground hover:text-primary transition-colors'
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-muted-foreground hover:text-primary transition-colors'
                  >
                    Partners
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div className='space-y-4'>
              <h3 className='font-semibold text-lg'>Support</h3>
              <ul className='space-y-2 text-sm'>
                <li>
                  <a
                    href='#'
                    className='text-muted-foreground hover:text-primary transition-colors'
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-muted-foreground hover:text-primary transition-colors'
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-muted-foreground hover:text-primary transition-colors'
                  >
                    Status
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-muted-foreground hover:text-primary transition-colors'
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-muted-foreground hover:text-primary transition-colors'
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className='border-t border-border/40 pt-8'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
              <div className='text-sm text-muted-foreground mb-4 md:mb-0'>
                © 2025 NexrBinary. All rights reserved.
              </div>
              <div className='flex space-x-6 text-sm'>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Terms of Service
                </a>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Privacy Policy
                </a>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Cookie Policy
                </a>
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary transition-colors'
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
