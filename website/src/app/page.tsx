'use client';

import { motion } from 'framer-motion';
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
  Smartphone,
  Users2,
  Volume2,
  Languages,
} from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const pricingPlans = [
  {
    name: 'Free',
    price: '0',
    currency: '৳',
    voiceMinutes: '15',
    textMessages: '100',
    idealFor: 'New users, trial & learning',
    features: [
      '1 free 15-min voice session',
      'Basic chat',
      'Limited voice commands',
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
    idealFor: 'Light users',
    features: [
      'Voice + chat',
      'Real-time transcription',
      'Basic voice commands',
      'Text chat',
      'Email support',
    ],
    popular: false,
    icon: <MessageCircle className='w-6 h-6' />,
  },
  {
    name: 'Standard',
    price: '300',
    currency: '৳',
    voiceMinutes: '84',
    textMessages: '1312',
    idealFor: 'Regular users',
    features: [
      'Enhanced voice recognition',
      'Custom wake words',
      'Multilingual support',
      'Sentiment analysis',
      'Email + Discord support',
    ],
    popular: true,
    icon: <Headphones className='w-6 h-6' />,
  },
  {
    name: 'Premium',
    price: '500',
    currency: '৳',
    voiceMinutes: '140',
    textMessages: '382',
    idealFor: 'Power users, GPT-4 access',
    features: [
      'Priority support (call/WhatsApp)',
      'Advanced voice modulation',
      'Custom voice personas',
      'GPT-4 powered chat',
    ],
    popular: false,
    icon: <Crown className='w-6 h-6' />,
  },
];

const stats = [
  {
    number: '10K+',
    label: 'Active Users',
    icon: <Users2 className='w-6 h-6' />,
  },
  {
    number: '1M+',
    label: 'Voice Minutes',
    icon: <Volume2 className='w-6 h-6' />,
  },
  {
    number: '50+',
    label: 'Languages',
    icon: <Languages className='w-6 h-6' />,
  },
  { number: '99.9%', label: 'Uptime', icon: <Zap className='w-6 h-6' /> },
];

const howItWorks = [
  {
    step: '01',
    title: 'Connect Your Device',
    description:
      'Simply connect your microphone and start speaking. Our AI works with any device - desktop, mobile, or tablet.',
    icon: <Smartphone className='w-8 h-8' />,
  },
  {
    step: '02',
    title: 'Speak Naturally',
    description:
      'Talk to our AI in your natural voice. It understands context, emotions, and responds intelligently.',
    icon: <Mic className='w-8 h-8' />,
  },
  {
    step: '03',
    title: 'Get Instant Responses',
    description:
      'Receive real-time responses with advanced language processing and custom voice personas.',
    icon: <MessageSquare className='w-8 h-8' />,
  },
];

export default function HomePage() {
  return (
    <div className='min-h-screen w-full bg-[#0a0a0a] relative overflow-hidden'>
      {/* Animated Background */}
      <div className='absolute inset-0 z-0'>
        <motion.div
          className='absolute inset-0'
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 20% 30%, rgba(59, 130, 246, 0.4) 0%, transparent 60%),
              radial-gradient(ellipse at 80% 70%, rgba(147, 51, 234, 0.3) 0%, transparent 70%),
              radial-gradient(ellipse at 60% 20%, rgba(236, 72, 153, 0.25) 0%, transparent 50%),
              radial-gradient(ellipse at 40% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 65%)
            `,
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        className='border-b border-border/20 bg-transparent backdrop-blur-sm sticky top-0 z-50 relative'
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <motion.div
            className='flex items-center space-x-2'
            whileHover={{ scale: 1.05 }}
          >
            <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
              <Mic className='w-5 h-5 text-primary-foreground' />
            </div>
            <span className='text-xl font-bold gradient-text'>Engla</span>
          </motion.div>
          <div className='flex items-center space-x-4'>
            <Link href='/login'>
              <Button variant='ghost' className='text-white hover:bg-white/10'>
                Login
              </Button>
            </Link>
            <Link href='/register'>
              <Button className='bg-primary hover:bg-primary/90'>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className='container mx-auto px-4 py-20 relative z-10'>
        <motion.div
          className='text-center max-w-4xl mx-auto'
          variants={staggerContainer}
          initial='initial'
          animate='animate'
        >
          <motion.div variants={fadeInUp}>
            <Badge variant='secondary' className='mb-4'>
              <Sparkles className='w-4 h-4 mr-2' />
              Next Generation Voice AI
            </Badge>
          </motion.div>

          <motion.h1
            className='text-5xl md:text-7xl font-bold mb-6 gradient-text'
            variants={fadeInUp}
          >
            Transform Your Voice
            <br />
            Into Intelligence
          </motion.h1>

          <motion.p
            className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto'
            variants={fadeInUp}
          >
            Experience the future of voice interaction. Our AI-powered platform
            understands, responds, and learns from your conversations with
            unprecedented accuracy.
          </motion.p>

          <motion.div
            className='flex flex-col sm:flex-row gap-4 justify-center'
            variants={fadeInUp}
          >
            <Link href='/register'>
              <Button size='lg' className='text-lg px-8 py-6'>
                <Play className='w-5 h-5 mr-2' />
                Start Free Trial
              </Button>
            </Link>
            <Button variant='outline' size='lg' className='text-lg px-8 py-6'>
              <ArrowRight className='w-5 h-5 mr-2' />
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className='container mx-auto px-4 py-16 relative z-10'>
        <motion.div
          className='grid grid-cols-2 md:grid-cols-4 gap-8'
          variants={staggerContainer}
          initial='initial'
          animate='animate'
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className='text-center'
              variants={fadeInUp}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto'>
                {stat.icon}
              </div>
              <div className='text-3xl font-bold text-primary mb-2'>
                {stat.number}
              </div>
              <div className='text-sm text-muted-foreground'>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className='container mx-auto px-4 py-20 relative z-10'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>
            Powerful Features for Modern Voice AI
          </h2>
          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            Everything you need to build, deploy, and scale voice AI
            applications
          </p>
        </motion.div>

        <motion.div
          className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'
          variants={staggerContainer}
          initial='initial'
          animate='animate'
        >
          {[
            {
              icon: <Brain className='w-6 h-6 text-primary' />,
              title: 'Advanced AI',
              description:
                'State-of-the-art language models that understand context and nuance',
            },
            {
              icon: <Mic className='w-6 h-6 text-primary' />,
              title: 'Voice Recognition',
              description:
                'Crystal clear voice processing with noise cancellation and accent support',
            },
            {
              icon: <Zap className='w-6 h-6 text-primary' />,
              title: 'Real-time Processing',
              description:
                'Lightning-fast response times with streaming audio processing',
            },
            {
              icon: <Shield className='w-6 h-6 text-primary' />,
              title: 'Enterprise Security',
              description:
                'Bank-level encryption and compliance with industry standards',
            },
            {
              icon: <Users className='w-6 h-6 text-primary' />,
              title: 'Team Collaboration',
              description:
                'Share conversations, collaborate on projects, and manage team access',
            },
            {
              icon: <Sparkles className='w-6 h-6 text-primary' />,
              title: 'Custom Integrations',
              description:
                'Connect with your favorite tools and platforms via our API',
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card className='border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-background/50 backdrop-blur-sm h-full'>
                <CardHeader>
                  <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4'>
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className='container mx-auto px-4 py-20 relative z-10'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='text-3xl md:text-4xl font-bold mb-4 gradient-text'>
            How It Works
          </h2>
          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            Get started in minutes with our simple three-step process
          </p>
        </motion.div>

        <motion.div
          className='grid md:grid-cols-3 gap-8'
          variants={staggerContainer}
          initial='initial'
          animate='animate'
        >
          {howItWorks.map((step, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ scale: 1.05 }}
            >
              <Card className='text-center hover-lift bg-background/50 backdrop-blur-sm h-full'>
                <CardHeader>
                  <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto'>
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
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section className='container mx-auto px-4 py-20 relative z-10'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant='outline' className='mb-4'>
            <Star className='w-4 h-4 mr-2' />
            Pricing Plans
          </Badge>
          <h2 className='text-3xl md:text-4xl font-bold mb-4 gradient-text'>
            Choose Your Perfect Plan
          </h2>
          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            Start with our free tier and scale as you grow. All plans include
            our core voice AI features.
          </p>
        </motion.div>

        <motion.div
          className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'
          variants={staggerContainer}
          initial='initial'
          animate='animate'
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Card
                className={`relative transition-all duration-300 hover:shadow-xl pricing-card bg-background/50 backdrop-blur-sm flex flex-col h-full ${
                  plan.popular
                    ? 'border-primary shadow-lg scale-105'
                    : 'border-border/50 hover:border-primary/50'
                }`}
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
                  <div className='w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto'>
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
                      className={`w-full ${
                        plan.popular ? 'bg-primary hover:bg-primary/90' : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.name === 'Free' ? 'Get Started' : 'Choose Plan'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className='container mx-auto px-4 py-20 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className='bg-background/50 backdrop-blur-sm border-primary/20 hover:shadow-lg transition-shadow'>
            <CardContent className='text-center py-16'>
              <div className='max-w-4xl mx-auto'>
                <h2 className='text-3xl md:text-4xl font-bold mb-4 gradient-text'>
                  Ready to Transform Your Voice Experience?
                </h2>
                <p className='text-muted-foreground text-lg mb-8 max-w-2xl mx-auto'>
                  Join thousands of users who are already experiencing the
                  future of voice AI. Get the latest updates, new features, and
                  voice AI insights delivered to your inbox.
                </p>

                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                  <Link href='/register'>
                    <Button size='lg' className='text-lg px-8 py-6'>
                      Get Started Today
                      <ArrowRight className='w-5 h-5 ml-2' />
                    </Button>
                  </Link>
                  <Button
                    variant='outline'
                    size='lg'
                    className='text-lg px-8 py-6'
                  >
                    <Phone className='w-5 h-5 mr-2' />
                    Contact Sales
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
