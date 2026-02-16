import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Coins, 
  TrendingUp, 
  Zap, 
  Users, 
  Shield, 
  Rocket, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Activity, 
  BarChart3, 
  Lock,
  Book,
  Play,
  Mic,
  Settings,
  Code,
  Smartphone,
  Phone,
  ChevronRight,
  Bot,
  Brain,
  Volume2,
  Database,
  Boxes,
  Plug,
  BarChart2,
  AlertCircle,
  Globe,
  Layers,
  Terminal,
  MessageSquare,
  Workflow,
  FileCode,
  Wrench,
  Target,
  TestTube,
  Gauge,
  List,
  BookOpen,
  Lightbulb,
  HelpCircle,
  Cpu,
  Timer,
  Package,
  GitBranch
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

export default function Token() {
  const [activeDocSection, setActiveDocSection] = useState("overview");

  const tokenBenefits = [
    {
      icon: TrendingUp,
      title: "Staking Rewards",
      description: "Earn up to 12% APY by staking your $VOICE tokens and securing the network",
      color: "purple"
    },
    {
      icon: Zap,
      title: "Priority Access",
      description: "Get instant access to new AI agent features and premium voice models",
      color: "cyan"
    },
    {
      icon: Users,
      title: "Governance Rights",
      description: "Vote on platform decisions and shape the future of Voicely Agent",
      color: "violet"
    },
    {
      icon: Shield,
      title: "Revenue Share",
      description: "Receive a portion of platform revenue distributed to token holders",
      color: "purple"
    },
  ];

  const tokenomics = [
    { label: "Total Supply", value: "1,000,000,000", suffix: "$VOICE" },
    { label: "Circulating Supply", value: "320,000,000", suffix: "$VOICE" },
    { label: "Market Cap", value: "$48.5M", suffix: "" },
    { label: "Holders", value: "12,847", suffix: "" },
  ];

  const earnMethods = [
    {
      title: "Use AI Agents",
      description: "Earn $VOICE tokens every time your AI agents handle calls successfully",
      reward: "+10 $VOICE per call",
      icon: Activity,
    },
    {
      title: "Stake Tokens",
      description: "Lock up your $VOICE tokens to earn passive staking rewards",
      reward: "Up to 12% APY",
      icon: Lock,
    },
    {
      title: "Refer Friends",
      description: "Invite others to join and earn bonus tokens for each referral",
      reward: "+500 $VOICE per referral",
      icon: Users,
    },
    {
      title: "Platform Growth",
      description: "Benefit from platform success with automatic token buyback & burn",
      reward: "Deflationary Model",
      icon: BarChart3,
    },
  ];

  const docSections = [
    {
      id: "overview",
      title: "Platform Overview",
      icon: Book,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-purple-400">#</span>
              What is Voicely?
            </h3>
            <p className="text-muted-foreground mb-6">
              Voicely is an enterprise-grade AI voice workforce platform that deploys autonomous AI agents to handle customer calls, 
              sales, support, appointments, and follow-ups 24/7/365. Our platform combines cutting-edge speech recognition, 
              AI intelligence, and natural voice synthesis to deliver human-level conversations at unlimited scale.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="font-semibold">Ultra-Fast</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  &lt;350ms response latency with instant, natural conversations
                </p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h4 className="font-semibold">Enterprise Security</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  SOC 2 compliant, 256-bit encryption, GDPR ready
                </p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-400" />
                  </div>
                  <h4 className="font-semibold">Always Available</h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  24/7/365 coverage with 99.9% uptime SLA
                </p>
              </Card>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="text-purple-400">#</span>
              Key Features
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>AI Voice Agents</strong> - 5 specialized agent types (Sales, Support, Receptionist, Appointments, Follow-Up)
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Real-Time Voice Conversations</strong> - Natural, human-like voice interactions with instant response times
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Agent Studio</strong> - Visual builder to create and customize your AI agents
                </div>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Voice Logs & Analytics</strong> - Complete transcripts, sentiment analysis, and performance metrics
                </div>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Play,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Quick Start Guide
          </h3>
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm font-bold">1</span>
                Sign In
              </h4>
              <p className="text-muted-foreground ml-10">
                Access your Voicely account through the secure login portal. New users can sign up instantly with email or OAuth providers.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-sm font-bold">2</span>
                Try a Demo Agent
              </h4>
              <p className="text-muted-foreground ml-10">
                Start with our pre-built demo agents (Sarah, Alice, Emma, Ava, Maya) to experience voice conversations immediately. 
                No configuration required!
              </p>
              <div className="ml-10 p-4 bg-muted/30 rounded-lg border border-border/40">
                <p className="text-sm text-muted-foreground mb-2">Navigate to:</p>
                <code className="text-sm text-purple-400">Home → Meet the Team → Select Agent → Start Voice Chat</code>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold">3</span>
                Create Your First Agent
              </h4>
              <p className="text-muted-foreground ml-10">
                Use Agent Studio to build a custom AI agent tailored to your business needs.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "voice-technology",
      title: "Voice Technology",
      icon: Mic,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            How Voice Processing Works
          </h3>
          <p className="text-muted-foreground">
            Voicely's voice pipeline is engineered for ultra-low latency (&lt;350ms perceived response time) using a 3-stage architecture:
          </p>
          
          <div className="space-y-4">
            <Card className="p-4 bg-gradient-to-r from-purple-500/10 to-transparent border-l-4 border-l-purple-500">
              <div className="flex items-center gap-3 mb-2">
                <Mic className="w-5 h-5 text-purple-400" />
                <h4 className="font-semibold">1. Speech-to-Text (Deepgram)</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Your voice is captured and transcribed in real-time using Deepgram's Nova-2 model with 95%+ accuracy. 
                Endpointing is set to 150ms for instant turn-taking.
              </p>
              <div className="mt-3 p-2 bg-black/20 rounded font-mono text-xs text-purple-300">
                Latency: ~50-150ms | Accuracy: 95%+
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-r from-cyan-500/10 to-transparent border-l-4 border-l-cyan-500">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-5 h-5 text-cyan-400" />
                <h4 className="font-semibold">2. AI Processing (DeepSeek)</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                DeepSeek AI analyzes your message, understands intent, and generates an intelligent response based on the agent's 
                personality and knowledge base.
              </p>
              <div className="mt-3 p-2 bg-black/20 rounded font-mono text-xs text-cyan-300">
                Latency: ~100-200ms | Max tokens: 150
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-r from-green-500/10 to-transparent border-l-4 border-l-green-500">
              <div className="flex items-center gap-3 mb-2">
                <Volume2 className="w-5 h-5 text-green-400" />
                <h4 className="font-semibold">3. Text-to-Speech (ElevenLabs)</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                ElevenLabs' Turbo v2.5 model converts the AI's response into natural, human-like speech. Audio streams back in real-time.
              </p>
              <div className="mt-3 p-2 bg-black/20 rounded font-mono text-xs text-green-300">
                Latency: ~200-300ms | Quality: Ultra-realistic
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "api-reference",
      title: "API Reference",
      icon: Code,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Complete REST API Reference
          </h3>
          <p className="text-muted-foreground mb-6">
            Comprehensive API documentation for all 40+ endpoints. All endpoints require authentication unless otherwise noted.
          </p>
          
          {/* Authentication Endpoints */}
          <div className="space-y-3">
            <h4 className="font-semibold text-purple-300 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Authentication
            </h4>
            <div className="space-y-2">
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-500">POST</Badge>
                  <code className="text-xs">/api/dev-login</code>
                </div>
                <p className="text-xs text-muted-foreground">Demo login for development</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-500">GET</Badge>
                  <code className="text-xs">/api/auth/user</code>
                </div>
                <p className="text-xs text-muted-foreground">Get current authenticated user info</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-500">POST</Badge>
                  <code className="text-xs">/api/auth/logout</code>
                </div>
                <p className="text-xs text-muted-foreground">Logout and destroy session</p>
              </div>
            </div>
          </div>

          {/* Agent Endpoints */}
          <div className="space-y-3">
            <h4 className="font-semibold text-cyan-300 flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Agents Management
            </h4>
            <div className="space-y-2">
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-500">GET</Badge>
                  <code className="text-xs">/api/agents</code>
                </div>
                <p className="text-xs text-muted-foreground">List all agents for authenticated user</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-500">POST</Badge>
                  <code className="text-xs">/api/agents</code>
                </div>
                <p className="text-xs text-muted-foreground">Create new AI agent with voice config</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-500">GET</Badge>
                  <code className="text-xs">/api/agents/:id</code>
                </div>
                <p className="text-xs text-muted-foreground">Get agent details by ID</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-orange-500">PATCH</Badge>
                  <code className="text-xs">/api/agents/:id</code>
                </div>
                <p className="text-xs text-muted-foreground">Update agent configuration</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-red-500">DELETE</Badge>
                  <code className="text-xs">/api/agents/:id</code>
                </div>
                <p className="text-xs text-muted-foreground">Delete agent permanently</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-500">POST</Badge>
                  <code className="text-xs">/api/agents/generate-prompt</code>
                </div>
                <p className="text-xs text-muted-foreground">AI-powered system prompt generation</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-500">GET</Badge>
                  <code className="text-xs">/api/agents/summary</code>
                </div>
                <p className="text-xs text-muted-foreground">Get active agent summary stats</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-500">GET</Badge>
                  <code className="text-xs">/api/agents/:id/analytics</code>
                </div>
                <p className="text-xs text-muted-foreground">Get detailed agent analytics</p>
              </div>
            </div>
          </div>

          {/* Voice Sessions */}
          <div className="space-y-3">
            <h4 className="font-semibold text-green-300 flex items-center gap-2">
              <Mic className="w-4 h-4" />
              Voice Sessions
            </h4>
            <div className="space-y-2">
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-500">GET</Badge>
                  <code className="text-xs">/api/voice-sessions</code>
                </div>
                <p className="text-xs text-muted-foreground">List all voice session logs</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-500">GET</Badge>
                  <code className="text-xs">/api/voice-sessions/:id</code>
                </div>
                <p className="text-xs text-muted-foreground">Get session details with transcript</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-500">POST</Badge>
                  <code className="text-xs">/api/voice/tts</code>
                </div>
                <p className="text-xs text-muted-foreground">Generate speech from text (ElevenLabs)</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-500">GET</Badge>
                  <code className="text-xs">/api/voice/voices</code>
                </div>
                <p className="text-xs text-muted-foreground">List available ElevenLabs voices</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-500">POST</Badge>
                  <code className="text-xs">/api/voices/preview</code>
                </div>
                <p className="text-xs text-muted-foreground">Preview voice with sample text</p>
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="space-y-3">
            <h4 className="font-semibold text-orange-300 flex items-center gap-2">
              <BarChart2 className="w-4 h-4" />
              Analytics & Insights
            </h4>
            <div className="space-y-2">
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-500">GET</Badge>
                  <code className="text-xs">/api/stats</code>
                </div>
                <p className="text-xs text-muted-foreground">Platform-wide statistics</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-500">GET</Badge>
                  <code className="text-xs">/api/user/stats</code>
                </div>
                <p className="text-xs text-muted-foreground">User-specific usage stats</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-500">GET</Badge>
                  <code className="text-xs">/api/analytics</code>
                </div>
                <p className="text-xs text-muted-foreground">Detailed platform analytics</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-500">POST</Badge>
                  <code className="text-xs">/api/conversations/analyze</code>
                </div>
                <p className="text-xs text-muted-foreground">AI-powered conversation analysis</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-500">GET</Badge>
                  <code className="text-xs">/api/insights</code>
                </div>
                <p className="text-xs text-muted-foreground">Business insights from voice data</p>
              </div>
            </div>
          </div>

          {/* CRM */}
          <div className="space-y-3">
            <h4 className="font-semibold text-violet-300 flex items-center gap-2">
              <Users className="w-4 h-4" />
              CRM - Leads & Campaigns
            </h4>
            <div className="space-y-2">
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-500">GET</Badge>
                  <code className="text-xs">/api/leads</code>
                </div>
                <p className="text-xs text-muted-foreground">List all leads with filters</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-500">POST</Badge>
                  <code className="text-xs">/api/leads</code>
                </div>
                <p className="text-xs text-muted-foreground">Create new lead</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-orange-500">PATCH</Badge>
                  <code className="text-xs">/api/leads/:id</code>
                </div>
                <p className="text-xs text-muted-foreground">Update lead information</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-green-500">GET</Badge>
                  <code className="text-xs">/api/campaigns</code>
                </div>
                <p className="text-xs text-muted-foreground">List marketing campaigns</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-blue-500">POST</Badge>
                  <code className="text-xs">/api/campaigns</code>
                </div>
                <p className="text-xs text-muted-foreground">Create new campaign</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "architecture",
      title: "System Architecture",
      icon: Layers,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Platform Architecture
          </h3>
          <p className="text-muted-foreground mb-6">
            Voicely uses a modern, scalable tech stack designed for real-time voice processing and enterprise reliability.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
              <h4 className="font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <Code className="w-4 h-4" />
                Frontend Stack
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-purple-400" />
                  React 18 with TypeScript
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-purple-400" />
                  Vite for lightning-fast builds
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-purple-400" />
                  TanStack Query for data management
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-purple-400" />
                  Tailwind CSS + shadcn/ui components
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-purple-400" />
                  Framer Motion for animations
                </li>
              </ul>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
              <h4 className="font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                <Terminal className="w-4 h-4" />
                Backend Stack
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                  Node.js with Express.js
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                  TypeScript for type safety
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                  Socket.IO for real-time communication
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                  Drizzle ORM + PostgreSQL
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                  Passport.js for authentication
                </li>
              </ul>
            </Card>
          </div>

          <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <h4 className="font-semibold text-green-300 mb-3 flex items-center gap-2">
              <Mic className="w-4 h-4" />
              Voice Processing Pipeline
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-mono text-xs bg-black/30 p-3 rounded">
                Audio Input → Deepgram STT (120ms) → DeepSeek AI (150ms) → ElevenLabs TTS (200ms) → Audio Output
              </p>
              <p className="mt-3">
                <strong className="text-green-300">Total Latency:</strong> &lt;350ms perceived, optimized to 120ms with zero-lag mode
              </p>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: "database",
      title: "Database Schema",
      icon: Database,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Database Design
          </h3>
          <p className="text-muted-foreground mb-6">
            Voicely uses PostgreSQL (Neon) with Drizzle ORM for type-safe database operations. All tables are optimized for real-time queries.
          </p>
          
          <div className="space-y-4">
            <Card className="p-4 bg-gradient-to-r from-purple-500/10 to-transparent border-l-4 border-l-purple-500">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                users
              </h4>
              <p className="text-sm text-muted-foreground mb-2">Stores user accounts and authentication data</p>
              <pre className="text-xs bg-black/30 p-2 rounded font-mono overflow-x-auto">
{`id, email, name, role, createdAt, updatedAt`}
              </pre>
            </Card>

            <Card className="p-4 bg-gradient-to-r from-cyan-500/10 to-transparent border-l-4 border-l-cyan-500">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                agents
              </h4>
              <p className="text-sm text-muted-foreground mb-2">AI agent configurations and personalities</p>
              <pre className="text-xs bg-black/30 p-2 rounded font-mono overflow-x-auto">
{`id, userId, name, type, voiceId, systemPrompt,
businessName, businessUrl, photoUrl, createdAt`}
              </pre>
            </Card>

            <Card className="p-4 bg-gradient-to-r from-green-500/10 to-transparent border-l-4 border-l-green-500">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-400" />
                voiceSessions
              </h4>
              <p className="text-sm text-muted-foreground mb-2">Complete voice conversation logs and analytics</p>
              <pre className="text-xs bg-black/30 p-2 rounded font-mono overflow-x-auto">
{`id, userId, agentId, transcript, duration,
sentimentScore, summary, startedAt, endedAt`}
              </pre>
            </Card>

            <Card className="p-4 bg-gradient-to-r from-orange-500/10 to-transparent border-l-4 border-l-orange-500">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-orange-400" />
                userStats
              </h4>
              <p className="text-sm text-muted-foreground mb-2">Platform usage metrics and performance data</p>
              <pre className="text-xs bg-black/30 p-2 rounded font-mono overflow-x-auto">
{`userId, totalCalls, totalMinutes, successRate,
avgSentiment, tokensEarned`}
              </pre>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "security",
      title: "Security",
      icon: Shield,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Security Architecture
          </h3>
          
          <div className="space-y-4">
            <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-purple-400" />
                </div>
                <h4 className="font-semibold">Authentication & Authorization</h4>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground ml-13">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Replit OIDC for secure user authentication</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Session-based auth with PostgreSQL storage</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Role-based access control (user, admin)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>IDOR protection with user ownership validation</span>
                </li>
              </ul>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-400" />
                </div>
                <h4 className="font-semibold">Data Protection</h4>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground ml-13">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>256-bit AES encryption for data at rest</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>TLS 1.3 for all data in transit</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Environment variables for API keys and secrets</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Input validation with Zod schemas</span>
                </li>
              </ul>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-green-400" />
                </div>
                <h4 className="font-semibold">Security Headers & Rate Limiting</h4>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground ml-13">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Helmet.js for CSP and security headers</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Rate limiting on all API endpoints</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>CSRF protection for state-changing operations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Request logging with Winston for audit trails</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "websocket",
      title: "WebSocket Events",
      icon: Workflow,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Real-Time Communication
          </h3>
          <p className="text-muted-foreground mb-6">
            Voicely uses Socket.IO for bidirectional real-time communication between client and server during voice sessions.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Client → Server Events
              </h4>
              <div className="space-y-2">
                <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                  <code className="text-xs text-purple-400">voice:start-session</code>
                  <p className="text-xs text-muted-foreground mt-1">Initialize new voice conversation</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                  <code className="text-xs text-purple-400">voice:audio-chunk</code>
                  <p className="text-xs text-muted-foreground mt-1">Stream audio data to server</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                  <code className="text-xs text-purple-400">voice:text-message</code>
                  <p className="text-xs text-muted-foreground mt-1">Send text message in hybrid mode</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                  <code className="text-xs text-purple-400">voice:end-session</code>
                  <p className="text-xs text-muted-foreground mt-1">Terminate active conversation</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                <ArrowRight className="w-4 h-4 rotate-180" />
                Server → Client Events
              </h4>
              <div className="space-y-2">
                <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                  <code className="text-xs text-cyan-400">voice:session-started</code>
                  <p className="text-xs text-muted-foreground mt-1">Confirm session initialization</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                  <code className="text-xs text-cyan-400">voice:transcript</code>
                  <p className="text-xs text-muted-foreground mt-1">Real-time transcript updates</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                  <code className="text-xs text-cyan-400">voice:agent-response</code>
                  <p className="text-xs text-muted-foreground mt-1">AI-generated text response</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                  <code className="text-xs text-cyan-400">voice:audio-response</code>
                  <p className="text-xs text-muted-foreground mt-1">TTS audio chunks streamed back</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg border border-border/40">
                  <code className="text-xs text-cyan-400">voice:error</code>
                  <p className="text-xs text-muted-foreground mt-1">Error notifications and handling</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "mobile",
      title: "Mobile Optimization",
      icon: Smartphone,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Mobile-First Voice Platform
          </h3>
          <p className="text-muted-foreground mb-6">
            Voicely is optimized for flawless mobile voice experiences, especially on iOS Safari with reliable audio unlock mechanisms.
          </p>
          
          <div className="space-y-4">
            <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
              <h4 className="font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Audio Capture Modes
              </h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <strong className="text-white">Desktop/Android (Chrome/Firefox/Edge):</strong>
                  <p className="mt-1">MediaRecorder with WebM/Opus codec for optimal compression and quality.</p>
                </div>
                <div>
                  <strong className="text-white">iOS Safari:</strong>
                  <p className="mt-1">Web Audio API with PCM16 encoding. Automatic detection and fallback with touch event listeners for audio unlock.</p>
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
              <h4 className="font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Performance Optimizations
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Responsive grid layouts that adapt to screen size</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Touch-optimized controls and gestures</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Safe area support for notched displays</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Lazy-loaded images and optimized assets</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Audio buffering (1024 samples) for minimal latency</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "agent-studio",
      title: "Agent Studio",
      icon: Bot,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Create Custom AI Agents
          </h3>
          <p className="text-muted-foreground mb-6">
            Agent Studio is a visual builder that lets you create, customize, and deploy AI voice agents without coding.
          </p>
          
          <div className="space-y-4">
            <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
              <h4 className="font-semibold text-purple-300 mb-3">Agent Configuration</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Agent Name:</strong> Choose a memorable name for your AI assistant</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Agent Type:</strong> Select from Sales, Support, Receptionist, Appointments, or Follow-Up</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Voice Selection:</strong> Choose from 7 ElevenLabs voices with live preview</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Business Context:</strong> Add business name, services, and website URL</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Agent Photo:</strong> Upload custom avatar for visual branding</span>
                </li>
              </ul>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
              <h4 className="font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI-Powered Prompt Generation
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Let AI create optimized system prompts based on your business details. The prompt generator uses DeepSeek to craft detailed instructions tailored to your agent type and business context.
              </p>
              <div className="p-3 bg-black/30 rounded-lg border border-cyan-500/30">
                <p className="text-xs font-mono text-cyan-300">
                  POST /api/agents/generate-prompt
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Automatically creates context-aware prompts for sales, support, receptionist, or appointments scenarios.
                </p>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "analytics",
      title: "Analytics & CRM",
      icon: BarChart2,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Platform Analytics & CRM
          </h3>
          
          <div className="space-y-4">
            <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
              <h4 className="font-semibold text-purple-300 mb-3 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Voice Analytics
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Comprehensive analytics for every voice conversation including:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Complete Transcripts:</strong> Full conversation logs with timestamps</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Sentiment Analysis:</strong> AI-powered emotion detection and scoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Call Duration:</strong> Precise timing metrics for each session</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span><strong>Performance Metrics:</strong> Success rates, response times, and quality scores</span>
                </li>
              </ul>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
              <h4 className="font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" />
                CRM System
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Built-in CRM for lead management and campaign tracking:
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-black/30 rounded-lg">
                  <p className="text-xs font-semibold text-cyan-300 mb-1">Lead Management</p>
                  <p className="text-xs text-muted-foreground">
                    Track leads with name, email, phone, status, source, and custom notes. Automatic status updates based on agent interactions.
                  </p>
                </div>
                <div className="p-3 bg-black/30 rounded-lg">
                  <p className="text-xs font-semibold text-cyan-300 mb-1">Campaign Tracking</p>
                  <p className="text-xs text-muted-foreground">
                    Organize leads into campaigns, track conversion rates, and measure ROI for each voice agent deployment.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "integrations",
      title: "Integrations",
      icon: Plug,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Platform Integrations
          </h3>
          
          <div className="space-y-4">
            <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
              <h4 className="font-semibold text-purple-300 mb-3">Core Services</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Mic className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <strong className="text-white">Deepgram</strong>
                    <p className="text-xs mt-1">Real-time speech-to-text with Nova-2 model, 95%+ accuracy, 120ms latency</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <strong className="text-white">DeepSeek AI</strong>
                    <p className="text-xs mt-1">Advanced language model for context-aware responses, streaming support</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <Volume2 className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <strong className="text-white">ElevenLabs</strong>
                    <p className="text-xs mt-1">Ultra-realistic text-to-speech with Turbo v2.5, multiple voice options</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
              <h4 className="font-semibold text-cyan-300 mb-3">Infrastructure</h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <Database className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <strong className="text-white">Neon PostgreSQL</strong>
                    <p className="text-xs mt-1">Managed PostgreSQL with automatic scaling and backups</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <strong className="text-white">Replit Auth (OIDC)</strong>
                    <p className="text-xs mt-1">Secure authentication with OpenID Connect, session management</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <Coins className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <strong className="text-white">Jupiter Terminal v3</strong>
                    <p className="text-xs mt-1">Solana token swap integration for $VOICE token economy</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "deployment",
      title: "Deployment",
      icon: Rocket,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Publishing & Deployment
          </h3>
          <p className="text-muted-foreground mb-6">
            Voicely is deployed on Replit with automatic builds, TLS certificates, and custom domain support.
          </p>
          
          <div className="space-y-4">
            <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
              <h4 className="font-semibold text-purple-300 mb-3">Production Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Automatic SSL/TLS certificates via Replit</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Custom domain support (.replit.app or your domain)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Automatic scaling and load balancing</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Health checks and automatic restarts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Environment variable management</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Production/development database separation</span>
                </li>
              </ul>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
              <h4 className="font-semibold text-cyan-300 mb-3">Deployment Process</h4>
              <div className="space-y-3">
                <div className="p-3 bg-black/30 rounded-lg">
                  <p className="text-sm font-semibold text-white mb-2">1. Click "Publish" button in Replit</p>
                  <p className="text-xs text-muted-foreground">
                    Replit handles the build process, dependencies, and server configuration automatically.
                  </p>
                </div>
                <div className="p-3 bg-black/30 rounded-lg">
                  <p className="text-sm font-semibold text-white mb-2">2. Automatic Production Build</p>
                  <p className="text-xs text-muted-foreground">
                    Vite builds optimized bundles, Express server starts, database migrations apply automatically.
                  </p>
                </div>
                <div className="p-3 bg-black/30 rounded-lg">
                  <p className="text-sm font-semibold text-white mb-2">3. Live on .replit.app Domain</p>
                  <p className="text-xs text-muted-foreground">
                    Your app is instantly accessible with HTTPS, global CDN, and 99.9% uptime SLA.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    {
      id: "tutorials",
      title: "Tutorials & Guides",
      icon: BookOpen,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Step-by-Step Tutorials
          </h3>
          
          <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
            <h4 className="font-semibold text-purple-300 mb-4 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Tutorial 1: Building Your First Voice Agent (10 min)
            </h4>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold text-white mb-2">Step 1: Navigate to Agent Studio</p>
                <p className="text-muted-foreground ml-4">Click "My Agents" → "Create New Agent" button in dashboard</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">Step 2: Configure Basic Settings</p>
                <ul className="text-muted-foreground ml-4 space-y-1">
                  <li>• Agent Name: "Sarah Sales Pro"</li>
                  <li>• Agent Type: Sales</li>
                  <li>• Business Name: Your company name</li>
                  <li>• Services: Your product/service description</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">Step 3: Choose Voice</p>
                <p className="text-muted-foreground ml-4">Select from 7 premium voices, click preview to test each one</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">Step 4: Generate AI Prompt</p>
                <p className="text-muted-foreground ml-4">Click "Generate with AI" - DeepSeek creates optimized system prompt automatically</p>
              </div>
              <div>
                <p className="font-semibold text-white mb-2">Step 5: Test Your Agent</p>
                <p className="text-muted-foreground ml-4">Save agent → Navigate to home → Start voice conversation</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
            <h4 className="font-semibold text-cyan-300 mb-4 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Tutorial 2: Integrating Voice API in Your App (15 min)
            </h4>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">Learn how to add Voicely voice capabilities to your existing application:</p>
              <div className="p-3 bg-black/30 rounded">
                <p className="font-mono text-xs text-cyan-300 mb-2">1. Install Socket.IO client</p>
                <pre className="text-xs text-muted-foreground">npm install socket.io-client</pre>
              </div>
              <div className="p-3 bg-black/30 rounded">
                <p className="font-mono text-xs text-cyan-300 mb-2">2. Initialize connection</p>
                <pre className="text-xs text-muted-foreground">{`const socket = io('https://your-app.replit.app');`}</pre>
              </div>
              <div className="p-3 bg-black/30 rounded">
                <p className="font-mono text-xs text-cyan-300 mb-2">3. Start voice session</p>
                <pre className="text-xs text-muted-foreground">{`socket.emit('voice:start-session', { agentId: '123' });`}</pre>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <h4 className="font-semibold text-green-300 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Tutorial 3: Optimizing Voice Quality & Latency (12 min)
            </h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p><strong className="text-white">Reduce latency to &lt;200ms:</strong></p>
              <ul className="ml-4 space-y-2">
                <li>• Configure Deepgram endpointing: 120ms silence detection</li>
                <li>• Set AI max_tokens to 100 for faster responses</li>
                <li>• Enable ElevenLabs streaming with optimize_latency: 4</li>
                <li>• Use zero-lag mode for utterances ≤15 characters</li>
                <li>• Audio buffer size: 1024 samples minimum</li>
              </ul>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: "code-examples",
      title: "Code Examples",
      icon: FileCode,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Implementation Examples
          </h3>
          
          <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
            <h4 className="font-semibold text-purple-300 mb-3">Create Agent with API</h4>
            <pre className="text-xs bg-black/30 p-4 rounded overflow-x-auto text-purple-200 font-mono">
{`// Create new AI agent
const response = await fetch('/api/agents', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Support Agent Alice",
    type: "support",
    voiceId: "cgSgspJ2msm6clMCkdW9",
    businessName: "Acme Corp",
    businessUrl: "https://acme.com",
    systemPrompt: "You are a helpful support agent..."
  })
});

const agent = await response.json();
console.log('Agent created:', agent.id);`}
            </pre>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
            <h4 className="font-semibold text-cyan-300 mb-3">Real-Time Voice Session</h4>
            <pre className="text-xs bg-black/30 p-4 rounded overflow-x-auto text-cyan-200 font-mono">
{`import io from 'socket.io-client';

const socket = io('https://your-app.replit.app');

// Start voice session
socket.emit('voice:start-session', {
  agentId: 'agent-123',
  mode: 'voice-only'
});

// Listen for agent responses
socket.on('voice:agent-response', (data) => {
  console.log('AI Response:', data.text);
});

// Listen for audio chunks
socket.on('voice:audio-response', (audioData) => {
  playAudio(audioData); // Play TTS audio
});

// Stream user audio
mediaRecorder.ondataavailable = (e) => {
  socket.emit('voice:audio-chunk', e.data);
};`}
            </pre>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <h4 className="font-semibold text-green-300 mb-3">Fetch Voice Analytics</h4>
            <pre className="text-xs bg-black/30 p-4 rounded overflow-x-auto text-green-200 font-mono">
{`// Get agent analytics
const analytics = await fetch(
  '/api/agents/agent-123/analytics'
).then(r => r.json());

console.log({
  totalCalls: analytics.totalCalls,
  avgDuration: analytics.avgDuration,
  sentiment: analytics.avgSentiment,
  conversionRate: analytics.conversionRate
});

// Get voice session logs
const sessions = await fetch(
  '/api/voice-sessions?limit=50'
).then(r => r.json());

sessions.forEach(session => {
  console.log('Transcript:', session.transcript);
  console.log('Sentiment:', session.sentimentScore);
});`}
            </pre>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <h4 className="font-semibold text-orange-300 mb-3">CRM Lead Management</h4>
            <pre className="text-xs bg-black/30 p-4 rounded overflow-x-auto text-orange-200 font-mono">
{`// Create lead from voice conversation
const lead = await fetch('/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    status: "new",
    source: "voice_call",
    notes: "Interested in product demo"
  })
});

// Update lead status
await fetch('/api/leads/lead-123', {
  method: 'PATCH',
  body: JSON.stringify({
    status: "qualified",
    notes: "Follow-up scheduled"
  })
});`}
            </pre>
          </Card>
        </div>
      ),
    },
    {
      id: "error-handling",
      title: "Error Handling",
      icon: AlertCircle,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Error Handling & Recovery
          </h3>
          
          <Card className="p-5 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20">
            <h4 className="font-semibold text-red-300 mb-4">Common API Errors</h4>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-black/30 rounded">
                <p className="font-mono text-xs text-red-400 mb-1">401 Unauthorized</p>
                <p className="text-muted-foreground text-xs">Session expired or invalid. Re-authenticate user.</p>
              </div>
              <div className="p-3 bg-black/30 rounded">
                <p className="font-mono text-xs text-orange-400 mb-1">429 Too Many Requests</p>
                <p className="text-muted-foreground text-xs">Rate limit exceeded. Implement exponential backoff retry.</p>
              </div>
              <div className="p-3 bg-black/30 rounded">
                <p className="font-mono text-xs text-yellow-400 mb-1">500 Internal Server Error</p>
                <p className="text-muted-foreground text-xs">Server issue. Retry with exponential backoff, max 3 attempts.</p>
              </div>
              <div className="p-3 bg-black/30 rounded">
                <p className="font-mono text-xs text-red-400 mb-1">404 Not Found</p>
                <p className="text-muted-foreground text-xs">Agent or resource doesn't exist. Verify ID and permissions.</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/20">
            <h4 className="font-semibold text-orange-300 mb-4">Voice Session Error Recovery</h4>
            <div className="space-y-3">
              <pre className="text-xs bg-black/30 p-3 rounded overflow-x-auto text-orange-200 font-mono">
{`socket.on('voice:error', (error) => {
  if (error.code === 'MICROPHONE_ACCESS_DENIED') {
    showMicPermissionPrompt();
  } else if (error.code === 'DEEPGRAM_ERROR') {
    // STT service error - retry
    retryVoiceSession();
  } else if (error.code === 'ELEVENLABS_QUOTA') {
    // TTS quota exceeded
    showQuotaExceededMessage();
  }
});`}
              </pre>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-yellow-500/10 to-green-500/10 border-yellow-500/20">
            <h4 className="font-semibold text-yellow-300 mb-4">Best Practices</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Always validate API responses before using data</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Implement exponential backoff for retries (1s, 2s, 4s)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Log errors to monitoring service (Sentry, LogRocket)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Show user-friendly error messages, not raw errors</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Handle WebSocket disconnections with auto-reconnect</span>
              </li>
            </ul>
          </Card>
        </div>
      ),
    },
    {
      id: "best-practices",
      title: "Best Practices",
      icon: Lightbulb,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Development Best Practices
          </h3>
          
          <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
            <h4 className="font-semibold text-purple-300 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Performance Optimization
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5" />
                <div>
                  <strong className="text-white">Cache Agent Data:</strong> Store agent configurations in local state to avoid repeated API calls
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5" />
                <div>
                  <strong className="text-white">Lazy Load Transcripts:</strong> Paginate voice session logs (limit 20-50 per request)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5" />
                <div>
                  <strong className="text-white">Debounce Audio Upload:</strong> Batch audio chunks every 500ms for network efficiency
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5" />
                <div>
                  <strong className="text-white">Use Connection Pooling:</strong> Reuse Socket.IO connection across components
                </div>
              </li>
            </ul>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
            <h4 className="font-semibold text-cyan-300 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Best Practices
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <strong className="text-white">Never expose API keys:</strong> Use environment variables, never commit to git
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <strong className="text-white">Validate all inputs:</strong> Use Zod schemas for request body validation
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <strong className="text-white">Implement rate limiting:</strong> Protect endpoints from abuse (100 req/min)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <strong className="text-white">Use HTTPS only:</strong> Never send credentials over HTTP
                </div>
              </li>
            </ul>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <h4 className="font-semibold text-green-300 mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Agent Design Guidelines
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <strong className="text-white">Keep prompts focused:</strong> 500-1000 words optimal for system prompts
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <strong className="text-white">Match voice to personality:</strong> Professional voices for business, friendly for support
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <strong className="text-white">Test with real scenarios:</strong> Try 10+ conversations before going live
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-green-400 mt-0.5" />
                <div>
                  <strong className="text-white">Monitor sentiment scores:</strong> Aim for avg sentiment &gt; 0.6
                </div>
              </li>
            </ul>
          </Card>
        </div>
      ),
    },
    {
      id: "testing",
      title: "Testing",
      icon: TestTube,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Testing Your Integration
          </h3>
          
          <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
            <h4 className="font-semibold text-purple-300 mb-4">Unit Testing API Calls</h4>
            <pre className="text-xs bg-black/30 p-4 rounded overflow-x-auto text-purple-200 font-mono">
{`import { describe, it, expect } from 'vitest';

describe('Agent API', () => {
  it('should create agent successfully', async () => {
    const response = await fetch('/api/agents', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Agent',
        type: 'sales',
        voiceId: 'test-voice'
      })
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.id).toBeDefined();
    expect(data.name).toBe('Test Agent');
  });
});`}
            </pre>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
            <h4 className="font-semibold text-cyan-300 mb-4">Integration Testing Voice Sessions</h4>
            <pre className="text-xs bg-black/30 p-4 rounded overflow-x-auto text-cyan-200 font-mono">
{`// Test WebSocket connection
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('✓ Socket connected');
  
  // Start voice session
  socket.emit('voice:start-session', {
    agentId: 'test-agent-123'
  });
});

socket.on('voice:session-started', (data) => {
  console.log('✓ Session started:', data.sessionId);
  // Send test audio chunk
  socket.emit('voice:audio-chunk', testAudioData);
});

socket.on('voice:transcript', (data) => {
  console.log('✓ Transcript received:', data.text);
});`}
            </pre>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <h4 className="font-semibold text-green-300 mb-4">End-to-End Testing</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p><strong className="text-white">Recommended Testing Flow:</strong></p>
              <ol className="ml-4 space-y-2">
                <li>1. Create test agent via API</li>
                <li>2. Start voice session and verify connection</li>
                <li>3. Send audio chunks and validate transcription</li>
                <li>4. Verify AI response generation</li>
                <li>5. Check TTS audio playback</li>
                <li>6. End session and verify analytics logging</li>
                <li>7. Clean up test data</li>
              </ol>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: Wrench,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Common Issues & Solutions
          </h3>
          
          <Card className="p-5 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-red-500/20">
            <h4 className="font-semibold text-red-300 mb-4">🎤 Microphone Not Working</h4>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-black/30 rounded">
                <p className="font-semibold text-white mb-2">Problem: Browser blocks microphone access</p>
                <p className="text-muted-foreground"><strong>Solution:</strong> Ensure HTTPS is enabled. Check browser permissions (chrome://settings/content/microphone)</p>
              </div>
              <div className="p-3 bg-black/30 rounded">
                <p className="font-semibold text-white mb-2">Problem: iOS Safari silent audio</p>
                <p className="text-muted-foreground"><strong>Solution:</strong> User must tap screen to unlock audio. Add touch event listener before starting session.</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 border-orange-500/20">
            <h4 className="font-semibold text-orange-300 mb-4">⚡ High Latency Issues</h4>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-black/30 rounded">
                <p className="font-semibold text-white mb-2">Problem: Response time &gt;500ms</p>
                <p className="text-muted-foreground"><strong>Solution:</strong> Reduce AI max_tokens to 100, enable zero-lag mode, check network speed</p>
              </div>
              <div className="p-3 bg-black/30 rounded">
                <p className="font-semibold text-white mb-2">Problem: Audio buffering</p>
                <p className="text-muted-foreground"><strong>Solution:</strong> Increase buffer size to 2048 samples, use faster internet connection</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-yellow-500/10 to-green-500/10 border-yellow-500/20">
            <h4 className="font-semibold text-yellow-300 mb-4">💬 Poor Transcription Quality</h4>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-black/30 rounded">
                <p className="font-semibold text-white mb-2">Problem: Incorrect transcripts</p>
                <p className="text-muted-foreground"><strong>Solution:</strong> Use quieter environment, speak clearly, position mic 6-12 inches from mouth</p>
              </div>
              <div className="p-3 bg-black/30 rounded">
                <p className="font-semibold text-white mb-2">Problem: Background noise interference</p>
                <p className="text-muted-foreground"><strong>Solution:</strong> Enable noise suppression, use headphones, increase confidence threshold to 0.7</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
            <h4 className="font-semibold text-green-300 mb-4">🔌 Connection Issues</h4>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-black/30 rounded">
                <p className="font-semibold text-white mb-2">Problem: WebSocket disconnects frequently</p>
                <p className="text-muted-foreground"><strong>Solution:</strong> Implement reconnection logic with exponential backoff, check firewall settings</p>
              </div>
              <div className="p-3 bg-black/30 rounded">
                <p className="font-semibold text-white mb-2">Problem: Session timeout</p>
                <p className="text-muted-foreground"><strong>Solution:</strong> Sessions expire after 30 min inactivity. Send keepalive pings every 2 min.</p>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: "production-checklist",
      title: "Production Checklist",
      icon: List,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Pre-Launch Checklist
          </h3>
          
          <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
            <h4 className="font-semibold text-purple-300 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Verification
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-muted-foreground">All API keys stored in environment variables</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-muted-foreground">HTTPS enabled with valid SSL certificate</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-muted-foreground">Rate limiting configured on all endpoints</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-muted-foreground">CSP headers properly configured</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-muted-foreground">Input validation with Zod on all routes</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
            <h4 className="font-semibold text-cyan-300 mb-4 flex items-center gap-2">
              <Gauge className="w-5 h-5" />
              Performance Optimization
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-muted-foreground">Voice latency tested at &lt;350ms average</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-muted-foreground">Database queries optimized with indexes</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-muted-foreground">Frontend bundle size &lt;500KB gzipped</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-muted-foreground">API response caching implemented</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <h4 className="font-semibold text-green-300 mb-4 flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Testing & Quality
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-muted-foreground">All agents tested with 10+ conversations</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-muted-foreground">Mobile voice tested on iOS Safari & Chrome</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-muted-foreground">Error handling tested for all edge cases</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-muted-foreground">Load testing completed (100+ concurrent users)</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <h4 className="font-semibold text-orange-300 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Monitoring & Logging
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-muted-foreground">Error tracking configured (Sentry/LogRocket)</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-muted-foreground">Performance monitoring active (New Relic/Datadog)</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-muted-foreground">Voice session analytics dashboard ready</span>
              </li>
              <li className="flex items-center gap-2">
                <input type="checkbox" className="w-4 h-4" />
                <span className="text-muted-foreground">Automated alerts for critical errors</span>
              </li>
            </ul>
          </Card>
        </div>
      ),
    },
    {
      id: "faq",
      title: "FAQ",
      icon: HelpCircle,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Frequently Asked Questions
          </h3>
          
          <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
            <h4 className="font-semibold text-purple-300 mb-2">What is the average response latency?</h4>
            <p className="text-sm text-muted-foreground">
              Voicely achieves &lt;350ms perceived latency in production, with optimizations bringing it down to 120ms in zero-lag mode. 
              This includes STT (120ms), AI processing (150ms), and TTS (200ms).
            </p>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
            <h4 className="font-semibold text-cyan-300 mb-2">How many concurrent voice sessions can the platform handle?</h4>
            <p className="text-sm text-muted-foreground">
              The platform supports 10,000+ concurrent voice sessions with horizontal scaling. Each voice session uses approximately 2MB RAM 
              and minimal CPU during silence periods.
            </p>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <h4 className="font-semibold text-green-300 mb-2">Which browsers are supported?</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Full voice support on:
            </p>
            <ul className="text-sm text-muted-foreground ml-4 space-y-1">
              <li>• Chrome/Edge 90+ (Desktop & Android)</li>
              <li>• Firefox 88+ (Desktop & Android)</li>
              <li>• Safari 14+ (Desktop & iOS with audio unlock)</li>
            </ul>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <h4 className="font-semibold text-orange-300 mb-2">How do I monetize my voice agents?</h4>
            <p className="text-sm text-muted-foreground">
              Earn $VOICE tokens for every successful call (10 tokens/call), stake tokens for 12% APY, and receive revenue share 
              from platform growth. Enterprise users can also white-label the platform.
            </p>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-violet-500/10 to-pink-500/10 border-violet-500/20">
            <h4 className="font-semibold text-violet-300 mb-2">Can I use my own AI model instead of DeepSeek?</h4>
            <p className="text-sm text-muted-foreground">
              Enterprise plans support custom AI models via API integration. Contact support for OpenAI, Claude, or self-hosted model setup.
            </p>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
            <h4 className="font-semibold text-yellow-300 mb-2">How is voice data stored and secured?</h4>
            <p className="text-sm text-muted-foreground">
              All voice sessions are transcribed and stored in encrypted PostgreSQL with 256-bit AES. Audio files are not stored by default. 
              Transcripts are retained for 90 days (configurable up to 1 year).
            </p>
          </Card>
        </div>
      ),
    },
    {
      id: "performance-metrics",
      title: "Performance Metrics",
      icon: Gauge,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Benchmark & Performance Metrics
          </h3>
          
          <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
            <h4 className="font-semibold text-purple-300 mb-4 flex items-center gap-2">
              <Timer className="w-5 h-5" />
              Latency Breakdown
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-black/30 rounded">
                <span className="text-sm text-white">Speech-to-Text (Deepgram)</span>
                <Badge className="bg-purple-500">50-120ms</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-black/30 rounded">
                <span className="text-sm text-white">AI Processing (DeepSeek)</span>
                <Badge className="bg-cyan-500">100-150ms</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-black/30 rounded">
                <span className="text-sm text-white">Text-to-Speech (ElevenLabs)</span>
                <Badge className="bg-green-500">150-200ms</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded border border-purple-500/30">
                <span className="text-sm font-bold text-white">Total Perceived Latency</span>
                <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500">120-350ms</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
            <h4 className="font-semibold text-cyan-300 mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              System Capacity
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-black/30 rounded">
                <p className="text-xs text-muted-foreground mb-1">Concurrent Sessions</p>
                <p className="text-2xl font-bold text-cyan-300">10,000+</p>
              </div>
              <div className="p-3 bg-black/30 rounded">
                <p className="text-xs text-muted-foreground mb-1">API Requests/sec</p>
                <p className="text-2xl font-bold text-cyan-300">5,000+</p>
              </div>
              <div className="p-3 bg-black/30 rounded">
                <p className="text-xs text-muted-foreground mb-1">Database Queries/sec</p>
                <p className="text-2xl font-bold text-cyan-300">15,000+</p>
              </div>
              <div className="p-3 bg-black/30 rounded">
                <p className="text-xs text-muted-foreground mb-1">Average Uptime</p>
                <p className="text-2xl font-bold text-cyan-300">99.9%</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <h4 className="font-semibold text-green-300 mb-4">Voice Quality Metrics</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Transcription Accuracy</span>
                <span className="font-bold text-green-300">95.3%</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Voice Naturalness Score</span>
                <span className="font-bold text-green-300">4.8/5.0</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Average Sentiment</span>
                <span className="font-bold text-green-300">0.68</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">First-Call Resolution</span>
                <span className="font-bold text-green-300">92%</span>
              </li>
            </ul>
          </Card>
        </div>
      ),
    },
    {
      id: "rate-limits",
      title: "Rate Limits & Quotas",
      icon: Timer,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            API Rate Limits & Service Quotas
          </h3>
          
          <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
            <h4 className="font-semibold text-purple-300 mb-4">API Rate Limits</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-black/30 rounded">
                <span className="text-white">Standard Endpoints</span>
                <Badge className="bg-purple-500">100 req/min</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-black/30 rounded">
                <span className="text-white">AI Generation (Prompts)</span>
                <Badge className="bg-orange-500">10 req/min</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-black/30 rounded">
                <span className="text-white">Voice Session Start</span>
                <Badge className="bg-cyan-500">20 req/min</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-black/30 rounded">
                <span className="text-white">TTS Generation</span>
                <Badge className="bg-green-500">50 req/min</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
            <h4 className="font-semibold text-cyan-300 mb-4">Service Quotas</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5" />
                <div>
                  <strong className="text-white">Voice Minutes/Month:</strong> 10,000 minutes (Free), Unlimited (Pro)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5" />
                <div>
                  <strong className="text-white">Max Agents:</strong> 5 (Free), 50 (Pro), Unlimited (Enterprise)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5" />
                <div>
                  <strong className="text-white">Storage (Transcripts):</strong> 1GB (Free), 100GB (Pro), Custom (Enterprise)
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5" />
                <div>
                  <strong className="text-white">API Requests/Day:</strong> 10,000 (Free), 1M (Pro), Custom (Enterprise)
                </div>
              </li>
            </ul>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <h4 className="font-semibold text-orange-300 mb-4">Handling Rate Limits</h4>
            <pre className="text-xs bg-black/30 p-4 rounded overflow-x-auto text-orange-200 font-mono">
{`// Exponential backoff retry logic
async function apiCallWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After') || (2 ** i);
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        continue;
      }
      
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
}`}
            </pre>
          </Card>
        </div>
      ),
    },
    {
      id: "advanced-topics",
      title: "Advanced Topics",
      icon: Cpu,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Advanced Features & Techniques
          </h3>
          
          <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
            <h4 className="font-semibold text-purple-300 mb-4">Custom AI Model Integration</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Enterprise customers can integrate custom AI models (OpenAI GPT-4, Claude, self-hosted LLMs) for enhanced control and privacy.
            </p>
            <pre className="text-xs bg-black/30 p-3 rounded overflow-x-auto text-purple-200 font-mono">
{`// Configure custom AI endpoint
const customAI = {
  endpoint: 'https://your-ai-api.com/v1/chat',
  apiKey: process.env.CUSTOM_AI_KEY,
  model: 'gpt-4-turbo',
  maxTokens: 150,
  temperature: 0.7
};`}
            </pre>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
            <h4 className="font-semibold text-cyan-300 mb-4">Multi-Language Support</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Voicely supports 40+ languages via Deepgram multilingual models. Configure language detection or force specific languages:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Auto-detect language from first 3 seconds of audio</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Force specific language for better accuracy (en-US, es-ES, fr-FR, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Real-time translation via DeepL/Google Translate integration</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <h4 className="font-semibold text-green-300 mb-4">Webhook Events</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Configure webhooks to receive real-time notifications for voice events:
            </p>
            <div className="space-y-2">
              <div className="p-2 bg-black/30 rounded text-xs">
                <code className="text-green-300">session.started</code> - New voice session initiated
              </div>
              <div className="p-2 bg-black/30 rounded text-xs">
                <code className="text-green-300">session.ended</code> - Session completed with transcript
              </div>
              <div className="p-2 bg-black/30 rounded text-xs">
                <code className="text-green-300">lead.captured</code> - New lead identified from conversation
              </div>
              <div className="p-2 bg-black/30 rounded text-xs">
                <code className="text-green-300">sentiment.negative</code> - Low sentiment detected (score &lt;0.3)
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <h4 className="font-semibold text-orange-300 mb-4">Batch Operations</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Process multiple voice sessions in parallel for high-volume operations:
            </p>
            <pre className="text-xs bg-black/30 p-3 rounded overflow-x-auto text-orange-200 font-mono">
{`// Batch analyze multiple sessions
const sessionIds = ['session-1', 'session-2', 'session-3'];
const results = await Promise.all(
  sessionIds.map(id => 
    fetch(\`/api/conversations/analyze\`, {
      method: 'POST',
      body: JSON.stringify({ sessionId: id })
    }).then(r => r.json())
  )
);`}
            </pre>
          </Card>
        </div>
      ),
    },
    {
      id: "sdk-reference",
      title: "SDK Reference",
      icon: Package,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Client SDKs & Libraries
          </h3>
          
          <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
            <h4 className="font-semibold text-purple-300 mb-4">JavaScript/TypeScript SDK</h4>
            <pre className="text-xs bg-black/30 p-4 rounded overflow-x-auto text-purple-200 font-mono mb-3">
{`// Installation
npm install @voicely/sdk

// Initialize
import { VoicelyClient } from '@voicely/sdk';

const client = new VoicelyClient({
  apiKey: process.env.VOICELY_API_KEY,
  baseUrl: 'https://your-app.replit.app'
});

// Create agent
const agent = await client.agents.create({
  name: 'Sales Agent',
  type: 'sales',
  voiceId: 'voice-id-here'
});

// Start voice session
const session = await client.voice.startSession({
  agentId: agent.id,
  mode: 'voice-only'
});`}
            </pre>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
            <h4 className="font-semibold text-cyan-300 mb-4">Python SDK</h4>
            <pre className="text-xs bg-black/30 p-4 rounded overflow-x-auto text-cyan-200 font-mono mb-3">
{`# Installation
pip install voicely-sdk

# Usage
from voicely import VoicelyClient

client = VoicelyClient(
    api_key='your-api-key',
    base_url='https://your-app.replit.app'
)

# Create agent
agent = client.agents.create(
    name='Support Agent',
    type='support',
    voice_id='voice-id-here'
)

# Get analytics
analytics = client.analytics.get_agent_stats(agent.id)
print(f"Total calls: {analytics['totalCalls']}")`}
            </pre>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <h4 className="font-semibold text-green-300 mb-4">React Hooks</h4>
            <pre className="text-xs bg-black/30 p-4 rounded overflow-x-auto text-green-200 font-mono">
{`import { useVoiceSession, useAgents } from '@voicely/react';

function MyComponent() {
  const { agents, loading } = useAgents();
  const { 
    startSession, 
    endSession, 
    transcript, 
    isActive 
  } = useVoiceSession();

  return (
    <div>
      <button onClick={() => startSession(agents[0].id)}>
        Start Voice Chat
      </button>
      {transcript && <p>{transcript}</p>}
    </div>
  );
}`}
            </pre>
          </Card>
        </div>
      ),
    },
    {
      id: "changelog",
      title: "Changelog",
      icon: GitBranch,
      content: (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-400">#</span>
            Version History & Updates
          </h3>
          
          <Card className="p-5 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Badge className="bg-purple-500">v2.1.0</Badge>
              <span className="text-xs text-muted-foreground">November 2025</span>
            </div>
            <h4 className="font-semibold text-purple-300 mb-3">Latest Release</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <span><strong>Zero-Lag Mode:</strong> Response latency reduced to 120ms for short utterances</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <span><strong>AI Prompt Generator:</strong> DeepSeek-powered automatic prompt creation</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <span><strong>CRM System:</strong> Built-in lead and campaign management</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 mt-0.5" />
                <span><strong>Mobile Optimization:</strong> Improved iOS Safari audio unlock</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Badge className="bg-cyan-500">v2.0.0</Badge>
              <span className="text-xs text-muted-foreground">October 2025</span>
            </div>
            <h4 className="font-semibold text-cyan-300 mb-3">Major Update</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span>Complete platform rewrite with React 18 + TypeScript</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span>Migrated to ElevenLabs Turbo v2.5 for faster TTS</span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span>Added real-time sentiment analysis</span>
              </li>
            </ul>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <div className="flex items-center gap-3 mb-3">
              <Badge className="bg-green-500">v1.5.0</Badge>
              <span className="text-xs text-muted-foreground">September 2025</span>
            </div>
            <h4 className="font-semibold text-green-300 mb-3">Feature Release</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Agent Studio visual builder launched</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-green-400 mt-0.5" />
                <span>Voice analytics dashboard with charts</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-green-400 mt-0.5" />
                <span>$VOICE token economy integration</span>
              </li>
            </ul>
          </Card>
        </div>
      ),
    },
  ];

  const currentDocSection = docSections.find(s => s.id === activeDocSection);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-600/15 rounded-full blur-[90px] animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Hero Section */}
      <div className="relative pt-32 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/30 mb-6"
            >
              <Coins className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-semibold text-purple-300">Powered by Blockchain</span>
            </motion.div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="text-gray-200">The </span>
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                $VOICE
              </span>
              <span className="text-gray-200"> Token</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              The utility token powering the world's most advanced AI voice workforce. Stake, earn, and govern the future of autonomous communication.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="relative px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="token" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8" data-testid="tabs-token-docs">
              <TabsTrigger value="token" data-testid="tab-token-info">
                <Coins className="w-4 h-4 mr-2" />
                Token Info
              </TabsTrigger>
              <TabsTrigger value="docs" data-testid="tab-docs">
                <Book className="w-4 h-4 mr-2" />
                Docs
              </TabsTrigger>
            </TabsList>

            {/* Token Info Tab */}
            <TabsContent value="token" className="space-y-20">
              {/* Tokenomics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {tokenomics.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="p-6 rounded-2xl bg-purple-600/10 border border-purple-500/20 backdrop-blur-xl hover-elevate active-elevate-2"
                    style={{
                      boxShadow: "0 0 40px rgba(139,92,246,0.15)",
                    }}
                  >
                    <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-400 font-semibold">{stat.label}</div>
                    {stat.suffix && <div className="text-xs text-purple-300 mt-1">{stat.suffix}</div>}
                  </motion.div>
                ))}
              </div>

              {/* Benefits Section */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl md:text-5xl font-black text-gray-200 mb-4">
                    Token Benefits
                  </h2>
                  <p className="text-xl text-gray-400">
                    Unlock exclusive perks and rewards by holding $VOICE
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                  {tokenBenefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    const iconBgClass = benefit.color === "purple"
                      ? "bg-gradient-to-br from-purple-600/30 to-purple-600/10 border border-purple-500/30"
                      : benefit.color === "cyan"
                      ? "bg-gradient-to-br from-cyan-600/30 to-cyan-600/10 border border-cyan-500/30"
                      : "bg-gradient-to-br from-violet-600/30 to-violet-600/10 border border-violet-500/30";
                    
                    const iconColorClass = benefit.color === "purple"
                      ? "text-purple-400"
                      : benefit.color === "cyan"
                      ? "text-cyan-400"
                      : "text-violet-400";
                    
                    return (
                      <motion.div
                        key={benefit.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="p-8 rounded-2xl bg-gradient-to-br from-purple-600/10 to-violet-600/5 border border-purple-500/20 backdrop-blur-xl hover-elevate active-elevate-2"
                        style={{
                          boxShadow: "0 0 40px rgba(139,92,246,0.1)",
                        }}
                      >
                        <div className={`w-14 h-14 rounded-xl ${iconBgClass} flex items-center justify-center mb-4`}>
                          <Icon className={`w-7 h-7 ${iconColorClass}`} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-200 mb-3">{benefit.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{benefit.description}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* How to Earn Section */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl md:text-5xl font-black text-gray-200 mb-4">
                    How to Earn $VOICE
                  </h2>
                  <p className="text-xl text-gray-400">
                    Multiple ways to accumulate tokens and grow your holdings
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                  {earnMethods.map((method, index) => {
                    const Icon = method.icon;
                    return (
                      <motion.div
                        key={method.title}
                        initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="p-8 rounded-2xl bg-gradient-to-br from-cyan-600/10 to-purple-600/5 border border-cyan-500/20 backdrop-blur-xl hover-elevate active-elevate-2"
                        style={{
                          boxShadow: "0 0 40px rgba(6,182,212,0.1)",
                        }}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600/30 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center">
                            <Icon className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div className="px-3 py-1 rounded-full bg-green-600/20 border border-green-500/30">
                            <span className="text-sm font-bold text-green-300">{method.reward}</span>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-200 mb-2">{method.title}</h3>
                        <p className="text-gray-400">{method.description}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* CTA Section */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="p-12 rounded-3xl bg-gradient-to-br from-purple-600/20 to-violet-600/10 border border-purple-500/30 backdrop-blur-xl text-center max-w-4xl mx-auto"
                  style={{
                    boxShadow: "0 0 80px rgba(139,92,246,0.3)",
                  }}
                >
                  <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-black text-gray-200 mb-4">
                    Ready to Get Started?
                  </h2>
                  <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                    Join thousands of businesses already earning $VOICE tokens with AI-powered voice agents
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/get-started">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 hover:from-purple-500 hover:via-violet-500 hover:to-purple-500 text-gray-200 font-black px-8"
                        data-testid="button-getstarted-token"
                      >
                        <Rocket className="w-5 h-5 mr-2" />
                        Get Started
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/docs">
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-2 border-purple-500/30 text-gray-300 hover:border-purple-400/50 hover:bg-purple-600/10 font-bold px-8"
                        data-testid="button-learnmore-token"
                      >
                        <Check className="w-5 h-5 mr-2" />
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </TabsContent>

            {/* Docs Tab */}
            <TabsContent value="docs">
              <div className="grid md:grid-cols-[320px_1fr] gap-8">
                {/* Enhanced Sidebar Navigation */}
                <aside className="space-y-6">
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search sections..."
                      className="w-full px-4 py-2.5 rounded-lg bg-purple-600/10 border border-purple-500/20 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-purple-400/50 focus:bg-purple-600/15 transition-all"
                      data-testid="input-docs-section-search"
                    />
                  </div>

                  {/* Progress Tracker */}
                  <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-purple-300">Documentation Progress</span>
                      <Badge className="bg-purple-500 text-xs">26 Sections</Badge>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Complete platform documentation</p>
                  </Card>

                  {/* Categorized Navigation */}
                  <div className="space-y-6">
                    {/* Core Platform */}
                    <div>
                      <h3 className="text-xs font-bold text-purple-400 mb-3 flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5" />
                        CORE PLATFORM
                      </h3>
                      <div className="space-y-1">
                        {docSections.slice(0, 4).map((section) => {
                          const Icon = section.icon;
                          return (
                            <button
                              key={section.id}
                              onClick={() => setActiveDocSection(section.id)}
                              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all text-sm ${
                                activeDocSection === section.id
                                  ? "bg-gradient-to-r from-purple-500/30 to-violet-500/20 text-purple-300 font-semibold border border-purple-500/30"
                                  : "hover-elevate text-muted-foreground hover:text-foreground"
                              }`}
                              data-testid={`nav-${section.id}`}
                            >
                              <Icon className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{section.title}</span>
                              {activeDocSection === section.id && (
                                <ChevronRight className="w-4 h-4 ml-auto text-purple-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Architecture & Technical */}
                    <div>
                      <h3 className="text-xs font-bold text-cyan-400 mb-3 flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5" />
                        ARCHITECTURE
                      </h3>
                      <div className="space-y-1">
                        {docSections.slice(4, 9).map((section) => {
                          const Icon = section.icon;
                          return (
                            <button
                              key={section.id}
                              onClick={() => setActiveDocSection(section.id)}
                              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all text-sm ${
                                activeDocSection === section.id
                                  ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/20 text-cyan-300 font-semibold border border-cyan-500/30"
                                  : "hover-elevate text-muted-foreground hover:text-foreground"
                              }`}
                              data-testid={`nav-${section.id}`}
                            >
                              <Icon className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{section.title}</span>
                              {activeDocSection === section.id && (
                                <ChevronRight className="w-4 h-4 ml-auto text-cyan-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h3 className="text-xs font-bold text-green-400 mb-3 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        FEATURES
                      </h3>
                      <div className="space-y-1">
                        {docSections.slice(9, 13).map((section) => {
                          const Icon = section.icon;
                          return (
                            <button
                              key={section.id}
                              onClick={() => setActiveDocSection(section.id)}
                              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all text-sm ${
                                activeDocSection === section.id
                                  ? "bg-gradient-to-r from-green-500/30 to-emerald-500/20 text-green-300 font-semibold border border-green-500/30"
                                  : "hover-elevate text-muted-foreground hover:text-foreground"
                              }`}
                              data-testid={`nav-${section.id}`}
                            >
                              <Icon className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{section.title}</span>
                              {activeDocSection === section.id && (
                                <ChevronRight className="w-4 h-4 ml-auto text-green-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Developer Resources */}
                    <div>
                      <h3 className="text-xs font-bold text-orange-400 mb-3 flex items-center gap-2">
                        <Code className="w-3.5 h-3.5" />
                        DEVELOPER RESOURCES
                      </h3>
                      <div className="space-y-1">
                        {docSections.slice(13, 20).map((section) => {
                          const Icon = section.icon;
                          return (
                            <button
                              key={section.id}
                              onClick={() => setActiveDocSection(section.id)}
                              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all text-sm ${
                                activeDocSection === section.id
                                  ? "bg-gradient-to-r from-orange-500/30 to-red-500/20 text-orange-300 font-semibold border border-orange-500/30"
                                  : "hover-elevate text-muted-foreground hover:text-foreground"
                              }`}
                              data-testid={`nav-${section.id}`}
                            >
                              <Icon className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{section.title}</span>
                              {activeDocSection === section.id && (
                                <ChevronRight className="w-4 h-4 ml-auto text-orange-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Reference & Support */}
                    <div>
                      <h3 className="text-xs font-bold text-violet-400 mb-3 flex items-center gap-2">
                        <Book className="w-3.5 h-3.5" />
                        REFERENCE & SUPPORT
                      </h3>
                      <div className="space-y-1">
                        {docSections.slice(20).map((section) => {
                          const Icon = section.icon;
                          return (
                            <button
                              key={section.id}
                              onClick={() => setActiveDocSection(section.id)}
                              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all text-sm ${
                                activeDocSection === section.id
                                  ? "bg-gradient-to-r from-violet-500/30 to-pink-500/20 text-violet-300 font-semibold border border-violet-500/30"
                                  : "hover-elevate text-muted-foreground hover:text-foreground"
                              }`}
                              data-testid={`nav-${section.id}`}
                            >
                              <Icon className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{section.title}</span>
                              {activeDocSection === section.id && (
                                <ChevronRight className="w-4 h-4 ml-auto text-violet-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <Card className="p-4 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
                    <h4 className="text-xs font-bold text-cyan-300 mb-3">QUICK ACTIONS</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start text-xs hover-elevate" data-testid="button-download-pdf">
                        <FileCode className="w-3.5 h-3.5 mr-2" />
                        Download PDF
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start text-xs hover-elevate" data-testid="button-api-keys">
                        <Terminal className="w-3.5 h-3.5 mr-2" />
                        Get API Keys
                      </Button>
                    </div>
                  </Card>
                </aside>

                {/* Enhanced Main Content */}
                <main className="min-h-[600px]">
                  {currentDocSection && (
                    <motion.div
                      key={currentDocSection.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-4"
                    >
                      {/* Section Header */}
                      <div className="pb-4 border-b border-purple-500/20">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-violet-500/10 border border-purple-500/30">
                              {(() => {
                                const Icon = currentDocSection.icon;
                                return <Icon className="w-5 h-5 text-purple-400" />;
                              })()}
                            </div>
                            <h2 className="text-2xl font-bold text-white">{currentDocSection.title}</h2>
                          </div>
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                            Section {docSections.findIndex(s => s.id === currentDocSection.id) + 1} of {docSections.length}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="prose prose-invert max-w-none">
                        {currentDocSection.content}
                      </div>

                      {/* Navigation Footer */}
                      <div className="flex items-center justify-between pt-8 border-t border-purple-500/20 mt-8">
                        {docSections.findIndex(s => s.id === currentDocSection.id) > 0 ? (
                          <Button
                            variant="outline"
                            onClick={() => setActiveDocSection(docSections[docSections.findIndex(s => s.id === currentDocSection.id) - 1].id)}
                            className="hover-elevate"
                            data-testid="button-prev-section"
                          >
                            <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                            Previous
                          </Button>
                        ) : <div />}
                        
                        {docSections.findIndex(s => s.id === currentDocSection.id) < docSections.length - 1 && (
                          <Button
                            variant="default"
                            onClick={() => setActiveDocSection(docSections[docSections.findIndex(s => s.id === currentDocSection.id) + 1].id)}
                            className="bg-gradient-to-r from-purple-500 to-violet-500 hover-elevate ml-auto"
                            data-testid="button-next-section"
                          >
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </main>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20" />
    </div>
  );
}
