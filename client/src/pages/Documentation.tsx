import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Book, 
  Zap, 
  Phone, 
  Code, 
  Shield, 
  Smartphone,
  Bot,
  ChevronRight,
  Play,
  Settings,
  Database,
  Mic,
  Brain,
  Volume2,
  Menu,
  X,
  Copy,
  Check,
  ChevronDown,
  Rocket,
  MessageSquare,
  Activity,
  BarChart3,
  Link as LinkIcon,
  Terminal,
  Sparkles,
  ArrowRight,
  Clock,
  TrendingUp,
  Users,
  Globe,
  Coins,
  DollarSign,
  Flame,
  Target,
  PieChart,
  Repeat,
  Lock,
  Building2,
  LineChart,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["quick-start"]));
  const [liveCode, setLiveCode] = useState(`// Try editing this code!
const agent = {
  name: "Sales Agent",
  voice: "Emily",
  greeting: "Hi! How can I help you today?"
};

console.log(agent);`);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const sections = [
    { id: "overview", title: "Overview", icon: Book, badge: "Start Here" },
    { id: "tokenomics", title: "Tokenomics", icon: Coins, badge: "$VOICE" },
    { id: "quickstart", title: "Quick Start", icon: Rocket, badge: "5 min" },
    { id: "voice-pipeline", title: "Voice Pipeline", icon: Mic, badge: "Core" },
    { id: "agents", title: "Agent Studio", icon: Bot, badge: "Popular" },
    { id: "api", title: "API Reference", icon: Code, badge: "Reference" },
    { id: "analytics", title: "Analytics", icon: BarChart3, badge: "Insights" },
  ];

  // Enhanced Code Block with syntax highlighting effect
  const CodeBlock = ({ code, language = "typescript", id, editable = false }: { code: string; language?: string; id: string; editable?: boolean }) => (
    <div className="relative group">
      <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500/50 to-cyan-500/50 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity" />
      <div className="relative bg-black/80 border border-purple-500/30 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-purple-500/20 bg-purple-900/20">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <Badge variant="outline" className="text-xs border-purple-500/30 bg-purple-500/10">
              {language}
            </Badge>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => copyToClipboard(code, id)}
            className="opacity-70 hover:opacity-100 transition-opacity"
            data-testid={`button-copy-${id}`}
          >
            {copiedCode === id ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-green-400" />
                <span className="text-xs text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                <span className="text-xs">Copy</span>
              </>
            )}
          </Button>
        </div>
        {editable ? (
          <textarea
            value={liveCode}
            onChange={(e) => setLiveCode(e.target.value)}
            className="w-full p-4 bg-transparent text-sm text-gray-300 font-mono resize-none focus:outline-none min-h-[200px]"
            spellCheck={false}
            data-testid="textarea-live-code"
          />
        ) : (
          <pre className="p-4 overflow-x-auto">
            <code className="text-sm text-gray-300 font-mono leading-relaxed">{code}</code>
          </pre>
        )}
      </div>
    </div>
  );

  // Interactive Stats Card
  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`p-6 rounded-2xl bg-gradient-to-br ${color} border border-white/10 backdrop-blur-xl`}
    >
      <Icon className="w-8 h-8 mb-3 text-white/90" />
      <div className="text-3xl font-black text-white mb-1">{value}</div>
      <div className="text-sm text-white/70">{label}</div>
    </motion.div>
  );

  // Interactive Feature Card
  const FeatureCard = ({ icon: Icon, title, description, color, delay = 0 }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className="relative group"
    >
      <div className={`absolute -inset-[1px] bg-gradient-to-r ${color} rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity`} />
      <Card className="relative p-6 bg-black/60 backdrop-blur-xl border-purple-500/20 hover-elevate">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Icon className="w-7 h-7 text-purple-400" />
        </div>
        <h3 className="font-bold text-lg mb-2 text-white">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </Card>
    </motion.div>
  );

  // Animated Pipeline Step
  const PipelineStep = ({ number, icon: Icon, title, time, isLast = false }: any) => (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: number * 0.1 }}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-purple-500/50"
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        {!isLast && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ delay: number * 0.1 + 0.2, duration: 0.3 }}
            className="w-[2px] flex-1 bg-gradient-to-b from-purple-500 to-cyan-500 mt-2"
          />
        )}
      </div>
      <div className="flex-1 pb-8">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-bold text-white">{title}</h4>
          <Badge variant="outline" className="border-cyan-500/50 bg-cyan-500/10 text-cyan-300 text-xs">
            {time}
          </Badge>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0B1E] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[150px]"
        />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-[#0A0B1E]/95 backdrop-blur-xl border-b border-purple-500/20">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Book className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-bold text-white">Developer Docs</h1>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            data-testid="button-mobile-menu"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-purple-900/30 via-purple-900/10 to-transparent border-b border-purple-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6 backdrop-blur-xl"
            >
              <span className="text-sm font-semibold text-purple-200">Interactive Documentation</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6">
              <span className="text-white">Build with </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-purple-300 to-cyan-400">
                Voicely
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Everything you need to create, deploy, and scale production-ready AI voice agents with ultra-low latency and human-like conversations
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold px-8 shadow-lg shadow-purple-500/30"
                data-testid="button-get-started"
                onClick={() => setActiveSection("quickstart")}
              >
                <Rocket className="w-5 h-5 mr-2" />
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-500/50 bg-purple-500/10 backdrop-blur-xl hover:bg-purple-500/20"
                data-testid="button-api-reference"
                onClick={() => setActiveSection("api")}
              >
                <Code className="w-5 h-5 mr-2" />
                API Reference
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Sidebar - Mobile Drawer / Desktop Fixed */}
          <AnimatePresence>
            {(sidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                className="fixed lg:sticky top-16 lg:top-8 left-0 h-[calc(100vh-4rem)] lg:h-auto w-[280px] bg-[#0A0B1E] lg:bg-transparent z-40 border-r lg:border-r-0 border-purple-500/20 overflow-y-auto p-4 lg:p-0"
              >
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">Navigation</h3>
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          setActiveSection(section.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                          activeSection === section.id
                            ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white font-semibold border border-purple-500/30 shadow-lg shadow-purple-500/20"
                            : "hover-elevate text-gray-400 hover:text-white"
                        }`}
                        data-testid={`nav-${section.id}`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="flex-1 break-words">{section.title}</span>
                        {section.badge && activeSection !== section.id && (
                          <Badge variant="outline" className="text-xs border-purple-500/30 bg-purple-500/10">
                            {section.badge}
                          </Badge>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Sidebar Footer */}
                <div className="mt-8 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h4 className="font-bold text-sm text-white">Need Help?</h4>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">
                    Join our community for support and updates
                  </p>
                  <Button size="sm" variant="outline" className="w-full border-purple-500/50 bg-purple-500/10">
                    <MessageSquare className="w-3.5 h-3.5 mr-2" />
                    Get Support
                  </Button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Backdrop for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <main className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Overview Section */}
                {activeSection === "overview" && (
                  <div className="space-y-12">
                    {/* Hero Section */}
                    <div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 mb-6"
                      >
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-semibold text-purple-300">Next-Generation AI Voice Infrastructure</span>
                      </motion.div>
                      <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        Voicely Platform Overview
                      </h2>
                      <p className="text-gray-300 text-xl leading-relaxed max-w-4xl mb-8">
                        Enterprise-grade AI voice workforce platform revolutionizing customer engagement with autonomous agents delivering human-like conversations at scale. Built for global enterprises requiring 24/7/365 coverage with sub-350ms response times.
                      </p>
                      
                      {/* Key Metrics Bar */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30 text-center">
                          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">$500B</div>
                          <div className="text-xs text-gray-400 mt-1">Market TAM</div>
                        </Card>
                        <Card className="p-4 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/30 text-center">
                          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">&lt;250ms</div>
                          <div className="text-xs text-gray-400 mt-1">Response Time</div>
                        </Card>
                        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30 text-center">
                          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">99.9%</div>
                          <div className="text-xs text-gray-400 mt-1">Uptime SLA</div>
                        </Card>
                        <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/30 text-center">
                          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">85%</div>
                          <div className="text-xs text-gray-400 mt-1">Cost Reduction</div>
                        </Card>
                      </div>
                    </div>

                    {/* Market Opportunity */}
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                        <Building2 className="w-7 h-7 text-purple-400" />
                        Market Opportunity
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-violet-500/5 border-purple-500/20">
                          <Target className="w-10 h-10 text-purple-400 mb-4" />
                          <h4 className="text-xl font-bold text-white mb-3">Total Addressable Market</h4>
                          <div className="space-y-3 text-sm text-gray-300">
                            <div className="flex items-center justify-between">
                              <span>Customer Service AI</span>
                              <span className="font-bold text-purple-400">$140B by 2028</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Sales Automation</span>
                              <span className="font-bold text-cyan-400">$180B by 2028</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Voice AI Infrastructure</span>
                              <span className="font-bold text-green-400">$180B by 2028</span>
                            </div>
                            <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent my-2" />
                            <div className="flex items-center justify-between text-base">
                              <span className="font-bold text-white">Total TAM</span>
                              <span className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">$500B+</span>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/20">
                          <LineChart className="w-10 h-10 text-cyan-400 mb-4" />
                          <h4 className="text-xl font-bold text-white mb-3">Growth Projections</h4>
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">2024 Revenue</span>
                                <span className="text-sm font-bold text-white">$2.5M</span>
                              </div>
                              <div className="h-2 bg-black/60 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: "8%" }}
                                  transition={{ delay: 0.3, duration: 1 }}
                                  className="h-full bg-gradient-to-r from-purple-600 to-purple-500"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">2025 Projected</span>
                                <span className="text-sm font-bold text-white">$12M</span>
                              </div>
                              <div className="h-2 bg-black/60 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: "40%" }}
                                  transition={{ delay: 0.5, duration: 1 }}
                                  className="h-full bg-gradient-to-r from-cyan-600 to-cyan-500"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">2026 Target</span>
                                <span className="text-sm font-bold text-white">$30M</span>
                              </div>
                              <div className="h-2 bg-black/60 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: "100%" }}
                                  transition={{ delay: 0.7, duration: 1 }}
                                  className="h-full bg-gradient-to-r from-green-600 to-green-500"
                                />
                              </div>
                            </div>
                            <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              380% YoY Growth
                            </Badge>
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* Competitive Advantages */}
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                        <Zap className="w-7 h-7 text-purple-400" />
                        Competitive Advantages
                      </h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <FeatureCard
                          icon={Clock}
                          title="Industry-Leading Latency"
                          description="200-250ms end-to-end response time, 40% faster than competitors. Zero-lag mode for instant reactions."
                          color="from-purple-500/50 to-violet-500/50"
                          delay={0}
                        />
                        <FeatureCard
                          icon={Coins}
                          title="Token-Powered Economy"
                          description="$VOICE token with auto-burn mechanism, aligning platform growth with holder value through deflationary tokenomics."
                          color="from-cyan-500/50 to-blue-500/50"
                          delay={0.1}
                        />
                        <FeatureCard
                          icon={Shield}
                          title="Enterprise-Grade Security"
                          description="SOC 2 Type II, GDPR & HIPAA compliant. End-to-end encryption with zero-trust architecture."
                          color="from-green-500/50 to-emerald-500/50"
                          delay={0.2}
                        />
                        <FeatureCard
                          icon={Brain}
                          title="Advanced AI Pipeline"
                          description="Multi-model architecture with DeepSeek AI, optimized for context awareness and natural conversations."
                          color="from-orange-500/50 to-amber-500/50"
                          delay={0.3}
                        />
                        <FeatureCard
                          icon={Globe}
                          title="Global Infrastructure"
                          description="Edge deployment across 200+ regions, 99.9% uptime SLA with automatic failover and load balancing."
                          color="from-pink-500/50 to-rose-500/50"
                          delay={0.4}
                        />
                        <FeatureCard
                          icon={BarChart3}
                          title="Real-Time Analytics"
                          description="AI-powered conversation analysis, sentiment tracking, and actionable insights with live dashboards."
                          color="from-violet-500/50 to-purple-500/50"
                          delay={0.5}
                        />
                      </div>
                    </div>

                    {/* Use Cases & ROI */}
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                        <Briefcase className="w-7 h-7 text-purple-400" />
                        Enterprise Use Cases & ROI
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-violet-500/5 border-purple-500/20">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center">
                              <Phone className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white">Customer Support</h4>
                              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                                85% cost reduction
                              </Badge>
                            </div>
                          </div>
                          <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>Handle 10,000+ concurrent calls with instant resolution</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>92% first-call resolution rate vs 67% industry average</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>4.8/5 customer satisfaction with 24/7 availability</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <DollarSign className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span className="font-semibold text-green-300">ROI: $450K annual savings per 100 agents</span>
                            </li>
                          </ul>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/20">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                              <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white">Sales & Lead Gen</h4>
                              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                                3x conversion rate
                              </Badge>
                            </div>
                          </div>
                          <ul className="space-y-2 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>Qualify 500+ leads per day with 68% conversion to SQL</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>Dynamic objection handling with 78% close rate</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>Intelligent follow-ups increasing pipeline by 240%</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <DollarSign className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span className="font-semibold text-green-300">ROI: $2.2M incremental revenue per quarter</span>
                            </li>
                          </ul>
                        </Card>
                      </div>
                    </div>

                    {/* Live Code Playground */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Terminal className="w-6 h-6 text-purple-400" />
                        <h3 className="text-2xl font-bold text-white">Interactive Playground</h3>
                        <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white">
                          <Play className="w-3 h-3 mr-1" />
                          Live
                        </Badge>
                      </div>
                      <p className="text-gray-400 mb-4">
                        Try editing the code below. Changes are reflected in real-time!
                      </p>
                      <CodeBlock
                        code={liveCode}
                        id="playground"
                        editable={true}
                      />
                      <div className="mt-4 p-4 rounded-xl bg-black/60 border border-green-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-sm font-semibold text-green-400">Output</span>
                        </div>
                        <pre className="text-sm text-gray-300 font-mono">
                          {liveCode.includes('console.log') ? '> ' + liveCode.split('console.log(')[1]?.split(');')[0] : '> Ready to run'}
                        </pre>
                      </div>
                    </div>

                    {/* Architecture Diagram */}
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                        <Activity className="w-6 h-6 text-purple-400" />
                        System Architecture
                      </h3>
                      <div className="grid md:grid-cols-5 gap-4">
                        {[
                          { icon: Mic, label: "Audio Input", color: "from-purple-600 to-purple-500" },
                          { icon: Brain, label: "Deepgram STT", color: "from-cyan-600 to-cyan-500" },
                          { icon: Sparkles, label: "DeepSeek AI", color: "from-violet-600 to-violet-500" },
                          { icon: Volume2, label: "ElevenLabs TTS", color: "from-pink-600 to-pink-500" },
                          { icon: Phone, label: "Audio Output", color: "from-green-600 to-green-500" },
                        ].map((step, i) => (
                          <motion.div
                            key={step.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="relative"
                          >
                            <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-purple-500/20 text-center hover-elevate">
                              <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                                <step.icon className="w-6 h-6 text-white" />
                              </div>
                              <div className="text-sm font-semibold text-white">{step.label}</div>
                              <div className="text-xs text-gray-400 mt-1">{30 + i * 20}ms</div>
                            </Card>
                            {i < 4 && (
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ delay: i * 0.1 + 0.3 }}
                                className="hidden md:block absolute top-1/2 -right-2 w-4 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-500"
                              >
                                <ArrowRight className="absolute -right-1 -top-2 w-4 h-4 text-purple-400" />
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tokenomics Section */}
                {activeSection === "tokenomics" && (
                  <div className="space-y-12">
                    {/* Hero Section */}
                    <div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 mb-6"
                      >
                        <Coins className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-semibold text-purple-300">Deflationary Token Economy</span>
                      </motion.div>
                      <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                        $VOICE Token Economics
                      </h2>
                      <p className="text-gray-300 text-xl leading-relaxed max-w-4xl mb-8">
                        Revolutionary token model aligning platform growth with holder value through automated burn mechanisms and revenue-backed deflationary economics. Built for sustainable long-term value accrual.
                      </p>
                      
                      {/* Key Token Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/30 text-center">
                          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">1B</div>
                          <div className="text-xs text-gray-400 mt-1">Total Supply</div>
                        </Card>
                        <Card className="p-4 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/30 text-center">
                          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">10%</div>
                          <div className="text-xs text-gray-400 mt-1">Auto-Burn Rate</div>
                        </Card>
                        <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/30 text-center">
                          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">12%</div>
                          <div className="text-xs text-gray-400 mt-1">Staking APY</div>
                        </Card>
                        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30 text-center">
                          <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">$0.15</div>
                          <div className="text-xs text-gray-400 mt-1">Launch Price</div>
                        </Card>
                      </div>
                    </div>

                    {/* Token Distribution */}
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                        <PieChart className="w-7 h-7 text-purple-400" />
                        Token Distribution
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-violet-500/5 border-purple-500/20">
                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-300">Public Sale (40%)</span>
                                <span className="text-sm font-bold text-white">400M tokens</span>
                              </div>
                              <div className="h-3 bg-black/60 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: "40%" }}
                                  transition={{ delay: 0.2, duration: 0.8 }}
                                  className="h-full bg-gradient-to-r from-purple-600 to-purple-500"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-300">Treasury (25%)</span>
                                <span className="text-sm font-bold text-white">250M tokens</span>
                              </div>
                              <div className="h-3 bg-black/60 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: "25%" }}
                                  transition={{ delay: 0.3, duration: 0.8 }}
                                  className="h-full bg-gradient-to-r from-cyan-600 to-cyan-500"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-300">Team & Advisors (20%)</span>
                                <span className="text-sm font-bold text-white">200M tokens</span>
                              </div>
                              <div className="h-3 bg-black/60 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: "20%" }}
                                  transition={{ delay: 0.4, duration: 0.8 }}
                                  className="h-full bg-gradient-to-r from-green-600 to-green-500"
                                />
                              </div>
                              <p className="text-xs text-gray-400 mt-1">12-month linear vesting</p>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-300">Ecosystem Fund (15%)</span>
                                <span className="text-sm font-bold text-white">150M tokens</span>
                              </div>
                              <div className="h-3 bg-black/60 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: "15%" }}
                                  transition={{ delay: 0.5, duration: 0.8 }}
                                  className="h-full bg-gradient-to-r from-orange-600 to-orange-500"
                                />
                              </div>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/20">
                          <h4 className="text-xl font-bold text-white mb-4">Key Highlights</h4>
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center flex-shrink-0">
                                <Users className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h5 className="font-bold text-white mb-1">Community First</h5>
                                <p className="text-sm text-gray-400">60% allocated to public distribution and ecosystem growth</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
                                <Lock className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h5 className="font-bold text-white mb-1">Team Alignment</h5>
                                <p className="text-sm text-gray-400">12-month vesting ensures long-term commitment and alignment</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-600 to-green-500 flex items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h5 className="font-bold text-white mb-1">Treasury Security</h5>
                                <p className="text-sm text-gray-400">Multi-sig wallet with time-locked releases for protocol stability</p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* Burn Mechanism & Deflationary Model */}
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                        <Flame className="w-7 h-7 text-orange-400" />
                        Auto-Burn Mechanism
                      </h3>
                      <Card className="p-6 md:p-8 bg-gradient-to-br from-orange-500/10 via-red-500/5 to-purple-500/10 border-orange-500/30">
                        <div className="grid md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="text-xl font-bold text-white mb-4">How It Works</h4>
                            <div className="space-y-4">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                                  1
                                </div>
                                <div>
                                  <h5 className="font-bold text-white mb-1">Revenue Generation</h5>
                                  <p className="text-sm text-gray-400">Platform generates revenue from AI voice agent usage ($0.10-0.30 per minute)</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                                  2
                                </div>
                                <div>
                                  <h5 className="font-bold text-white mb-1">Auto-Convert</h5>
                                  <p className="text-sm text-gray-400">10% of all revenue automatically converts to $VOICE tokens via Jupiter DEX</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                                  3
                                </div>
                                <div>
                                  <h5 className="font-bold text-white mb-1">Permanent Burn</h5>
                                  <p className="text-sm text-gray-400">Tokens sent to burn address (0x000...000), permanently removed from circulation</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                                  4
                                </div>
                                <div>
                                  <h5 className="font-bold text-white mb-1">Value Accrual</h5>
                                  <p className="text-sm text-gray-400">Reduced supply + constant demand = increasing token value for holders</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-white mb-4">Projected Burns</h4>
                            <div className="space-y-4">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-gray-400">Year 1 Burn</span>
                                  <div className="text-right">
                                    <div className="text-sm font-bold text-white">15M tokens</div>
                                    <div className="text-xs text-gray-500">1.5% of supply</div>
                                  </div>
                                </div>
                                <div className="h-2 bg-black/60 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "15%" }}
                                    transition={{ delay: 0.6, duration: 1 }}
                                    className="h-full bg-gradient-to-r from-orange-600 to-red-600"
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-gray-400">Year 2 Burn</span>
                                  <div className="text-right">
                                    <div className="text-sm font-bold text-white">45M tokens</div>
                                    <div className="text-xs text-gray-500">4.5% of supply</div>
                                  </div>
                                </div>
                                <div className="h-2 bg-black/60 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "45%" }}
                                    transition={{ delay: 0.8, duration: 1 }}
                                    className="h-full bg-gradient-to-r from-orange-600 to-red-600"
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-gray-400">Year 3 Burn</span>
                                  <div className="text-right">
                                    <div className="text-sm font-bold text-white">90M tokens</div>
                                    <div className="text-xs text-gray-500">9% of supply</div>
                                  </div>
                                </div>
                                <div className="h-2 bg-black/60 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "90%" }}
                                    transition={{ delay: 1, duration: 1 }}
                                    className="h-full bg-gradient-to-r from-orange-600 to-red-600"
                                  />
                                </div>
                              </div>
                              <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 mt-4">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold text-white">5-Year Projected Burn</span>
                                  <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">300M+</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">30% of total supply permanently removed</p>
                              </Card>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Token Utility */}
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                        <Zap className="w-7 h-7 text-purple-400" />
                        Token Utility & Use Cases
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-violet-500/5 border-purple-500/20">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center mb-4">
                            <Phone className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-white mb-2">Platform Usage</h4>
                          <p className="text-sm text-gray-400 mb-4">Pay for AI voice agent calls and services using $VOICE tokens at discounted rates</p>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                              0.1 VOICE per minute
                            </Badge>
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                              30% discount vs fiat
                            </Badge>
                          </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/20">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center mb-4">
                            <TrendingUp className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-white mb-2">Staking Rewards</h4>
                          <p className="text-sm text-gray-400 mb-4">Stake $VOICE tokens to earn 12% APY from platform revenue share</p>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-xs">
                              12% APY
                            </Badge>
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                              Monthly payouts
                            </Badge>
                          </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mb-4">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-white mb-2">Governance Rights</h4>
                          <p className="text-sm text-gray-400 mb-4">Vote on platform features, integrations, and protocol upgrades</p>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                              1 token = 1 vote
                            </Badge>
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                              DAO structure
                            </Badge>
                          </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-orange-500/5 to-amber-500/5 border-orange-500/20">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 flex items-center justify-center mb-4">
                            <Sparkles className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-white mb-2">Premium Features</h4>
                          <p className="text-sm text-gray-400 mb-4">Unlock exclusive agent voices, analytics, and priority support</p>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30 text-xs">
                              5,000+ tokens
                            </Badge>
                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
                              VIP tier
                            </Badge>
                          </div>
                        </Card>
                      </div>
                    </div>

                    {/* Value Accrual Model */}
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                        <Repeat className="w-7 h-7 text-purple-400" />
                        Value Accrual Flywheel
                      </h3>
                      <Card className="p-6 md:p-8 bg-gradient-to-br from-purple-500/5 via-violet-500/5 to-cyan-500/5 border-purple-500/20">
                        <div className="grid md:grid-cols-5 gap-4">
                          {[
                            { icon: DollarSign, title: "Revenue Growth", desc: "Platform usage generates increasing revenue", color: "from-green-600 to-emerald-600" },
                            { icon: Repeat, title: "Auto-Convert", desc: "10% of revenue converts to $VOICE", color: "from-cyan-600 to-blue-600" },
                            { icon: Flame, title: "Burn Tokens", desc: "Tokens permanently removed from supply", color: "from-orange-600 to-red-600" },
                            { icon: Target, title: "Supply Shrinks", desc: "Scarcity increases with platform growth", color: "from-purple-600 to-violet-600" },
                            { icon: TrendingUp, title: "Value Rises", desc: "Holders benefit from deflationary pressure", color: "from-pink-600 to-rose-600" },
                          ].map((step, i) => (
                            <motion.div
                              key={step.title}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className="relative"
                            >
                              <Card className="p-4 bg-gradient-to-br from-black/40 to-black/20 border-purple-500/20 text-center">
                                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                                  <step.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-sm font-bold text-white mb-1">{step.title}</div>
                                <div className="text-xs text-gray-400">{step.desc}</div>
                              </Card>
                              {i < 4 && (
                                <div className="hidden md:block absolute top-1/2 -right-2 z-10">
                                  <ArrowRight className="w-5 h-5 text-purple-400" />
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 mt-8">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center flex-shrink-0">
                              <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-white mb-2">Sustainable Value Creation</h4>
                              <p className="text-sm text-gray-300">Unlike inflationary tokens, $VOICE benefits from a self-reinforcing cycle: More platform usage → More revenue → More burns → Higher scarcity → Increased value for existing holders. This creates natural alignment between platform success and token holder returns.</p>
                            </div>
                          </div>
                        </Card>
                      </Card>
                    </div>

                    {/* Financial Projections */}
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                        <LineChart className="w-7 h-7 text-purple-400" />
                        Financial Projections
                      </h3>
                      <div className="grid md:grid-cols-3 gap-6">
                        <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-violet-500/5 border-purple-500/20">
                          <div className="text-sm text-gray-400 mb-2">Year 1 (2025)</div>
                          <div className="text-3xl font-black text-white mb-4">$12M</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Platform Revenue</span>
                              <span className="font-bold text-white">$12M</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Tokens Burned</span>
                              <span className="font-bold text-orange-400">15M</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Projected Price</span>
                              <span className="font-bold text-green-400">$0.45</span>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 border-cyan-500/20">
                          <div className="text-sm text-gray-400 mb-2">Year 2 (2026)</div>
                          <div className="text-3xl font-black text-white mb-4">$30M</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Platform Revenue</span>
                              <span className="font-bold text-white">$30M</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Tokens Burned</span>
                              <span className="font-bold text-orange-400">45M</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Projected Price</span>
                              <span className="font-bold text-green-400">$1.20</span>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-6 bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
                          <div className="text-sm text-gray-400 mb-2">Year 3 (2027)</div>
                          <div className="text-3xl font-black text-white mb-4">$75M</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Platform Revenue</span>
                              <span className="font-bold text-white">$75M</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Tokens Burned</span>
                              <span className="font-bold text-orange-400">90M</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-400">Projected Price</span>
                              <span className="font-bold text-green-400">$3.50</span>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Start Section */}
                {activeSection === "quickstart" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        Quick Start Guide
                      </h2>
                      <p className="text-gray-300 text-lg leading-relaxed">
                        Get your first AI voice agent up and running in under 5 minutes
                      </p>
                    </div>

                    {/* Pipeline Steps */}
                    <div className="relative">
                      <div className="space-y-1">
                        <PipelineStep
                          number={1}
                          icon={Settings}
                          title="Install SDK"
                          time="1 min"
                        />
                        <PipelineStep
                          number={2}
                          icon={Bot}
                          title="Create Agent"
                          time="2 min"
                        />
                        <PipelineStep
                          number={3}
                          icon={Zap}
                          title="Configure Voice"
                          time="1 min"
                        />
                        <PipelineStep
                          number={4}
                          icon={Rocket}
                          title="Deploy Live"
                          time="1 min"
                          isLast
                        />
                      </div>
                    </div>

                    {/* Code Examples */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 text-white text-sm font-bold">1</span>
                          Install the SDK
                        </h3>
                        <CodeBlock
                          id="install"
                          language="bash"
                          code={`npm install @voicely/sdk
# or
yarn add @voicely/sdk`}
                        />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 text-white text-sm font-bold">2</span>
                          Initialize Your Agent
                        </h3>
                        <CodeBlock
                          id="init"
                          language="typescript"
                          code={`import { VoicelyAgent } from '@voicely/sdk';

const agent = new VoicelyAgent({
  apiKey: process.env.VOICELY_API_KEY,
  name: "Sales Agent",
  voice: "Emily", // Natural, professional voice
  greeting: "Hi! I'm here to help you today.",
  systemPrompt: "You are a helpful sales agent..."
});

// Start listening
await agent.start();`}
                        />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 text-white text-sm font-bold">3</span>
                          Handle Events
                        </h3>
                        <CodeBlock
                          id="events"
                          language="typescript"
                          code={`agent.on('transcript', (data) => {
  console.log('User said:', data.text);
});

agent.on('response', (data) => {
  console.log('Agent replied:', data.text);
});

agent.on('call_ended', () => {
  console.log('Call completed');
});`}
                        />
                      </div>
                    </div>

                    {/* Next Steps */}
                    <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-purple-500/20">
                      <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" />
                        Next Steps
                      </h3>
                      <div className="space-y-3">
                        {[
                          { title: "Customize Your Agent", desc: "Learn about voice selection, prompts, and personality", icon: Bot },
                          { title: "Explore API Reference", desc: "Dive deep into all available methods and events", icon: Code },
                          { title: "View Analytics", desc: "Track performance and optimize conversations", icon: BarChart3 },
                        ].map((item, i) => (
                          <button
                            key={i}
                            className="w-full flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-purple-500/20 hover-elevate text-left transition-all"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                              <item.icon className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-white">{item.title}</div>
                              <div className="text-sm text-gray-400">{item.desc}</div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    </Card>
                  </div>
                )}

                {/* Voice Pipeline Section */}
                {activeSection === "voice-pipeline" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        Voice Pipeline Architecture
                      </h2>
                      <p className="text-gray-300 text-lg leading-relaxed">
                        Understanding the ultra-low latency voice processing pipeline that powers natural conversations
                      </p>
                    </div>

                    {/* Latency Breakdown */}
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid grid-cols-3 w-full bg-black/40 border border-purple-500/20">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
                        <TabsTrigger value="mobile">Mobile</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="mt-6 space-y-6">
                        <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border-purple-500/20">
                          <h3 className="text-xl font-bold mb-4 text-white">Total Latency: ~200-250ms</h3>
                          <div className="space-y-4">
                            {[
                              { label: "Silence Detection", time: "120ms", color: "from-purple-600 to-purple-500", width: "48%" },
                              { label: "AI Processing", time: "50-80ms", color: "from-cyan-600 to-cyan-500", width: "32%" },
                              { label: "TTS Generation", time: "30-50ms", color: "from-green-600 to-green-500", width: "20%" },
                            ].map((item) => (
                              <div key={item.label}>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-semibold text-gray-300">{item.label}</span>
                                  <span className="text-sm text-gray-400">{item.time}</span>
                                </div>
                                <div className="h-8 bg-black/60 rounded-lg overflow-hidden border border-purple-500/20">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: item.width }}
                                    transition={{ duration: 1, delay: 0.3 }}
                                    className={`h-full bg-gradient-to-r ${item.color} flex items-center justify-center text-xs font-bold text-white`}
                                  >
                                    {item.time}
                                  </motion.div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>

                        <CodeBlock
                          id="pipeline"
                          language="typescript"
                          code={`// Voice Pipeline Configuration
const pipelineConfig = {
  // Deepgram STT
  silenceDetection: {
    endpointing: 200,      // ms
    utteranceTimeout: 150  // ms
  },
  
  // DeepSeek AI
  ai: {
    model: "deepseek-chat",
    temperature: 0.4,
    max_tokens: 100,
    stream: true
  },
  
  // ElevenLabs TTS
  tts: {
    model: "eleven_turbo_v2_5",
    optimize_streaming_latency: 4
  }
};`}
                        />
                      </TabsContent>

                      <TabsContent value="optimizations" className="mt-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-violet-500/10 border-purple-500/20">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-white" />
                              </div>
                              <h3 className="text-lg font-bold text-white">Zero-Lag Mode</h3>
                            </div>
                            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                              Responds instantly to short utterances (≤15 characters) for ultra-fast interactions
                            </p>
                            <CodeBlock
                              id="zerolag"
                              language="typescript"
                              code={`if (text.length <= 15) {
  // Immediate response
  respondInstantly(text);
}`}
                            />
                          </Card>

                          <Card className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/20">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center">
                                <Activity className="w-6 h-6 text-white" />
                              </div>
                              <h3 className="text-lg font-bold text-white">Streaming TTS</h3>
                            </div>
                            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                              First audio chunk streams in 300-400ms while full response generates
                            </p>
                            <CodeBlock
                              id="streaming"
                              language="typescript"
                              code={`// Two-phase streaming
const firstChunk = await tts.stream(
  response.slice(0, 30) // chars
);
playAudio(firstChunk);`}
                            />
                          </Card>
                        </div>
                      </TabsContent>

                      <TabsContent value="mobile" className="mt-6 space-y-6">
                        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                          <h3 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                            <Smartphone className="w-6 h-6 text-green-400" />
                            Mobile Audio Capture
                          </h3>
                          <p className="text-gray-300 mb-4 leading-relaxed">
                            Automatic detection and fallback for iOS Safari and other mobile browsers
                          </p>
                          <CodeBlock
                            id="mobile-audio"
                            language="typescript"
                            code={`// Desktop/Android: MediaRecorder (WebM/Opus)
if (MediaRecorder.isTypeSupported('audio/webm')) {
  recorder = new MediaRecorder(stream, {
    mimeType: 'audio/webm;codecs=opus'
  });
}

// iOS Safari: Web Audio API (PCM16)
else {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  // ... PCM16 encoding
}`}
                          />
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}

                {/* Agent Studio Section */}
                {activeSection === "agents" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        Agent Studio
                      </h2>
                      <p className="text-gray-300 text-lg leading-relaxed">
                        Create and customize AI voice agents with unique personalities, voices, and capabilities
                      </p>
                    </div>

                    {/* Agent Configuration */}
                    <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border-purple-500/20">
                      <h3 className="text-xl font-bold mb-4 text-white">Agent Configuration</h3>
                      <CodeBlock
                        id="agent-config"
                        language="typescript"
                        code={`const agent = {
  name: "Sarah - Sales Expert",
  role: "sales",
  voice: "Emily",
  
  // System Prompt
  systemPrompt: \`You are Sarah, a professional sales agent.
  - Be friendly and enthusiastic
  - Focus on understanding customer needs
  - Provide clear product information
  - Close with confidence\`,
  
  // Greeting
  greeting: "Hi! I'm Sarah. How can I help you find the perfect solution today?",
  
  // Business Details
  business: {
    name: "TechCorp",
    website: "https://techcorp.com",
    services: ["Software Development", "Cloud Solutions"]
  },
  
  // Voice Settings
  voiceSettings: {
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0.5,
    useSpeakerBoost: true
  }
};`}
                      />
                    </Card>

                  </div>
                )}

                {/* API Reference Section */}
                {activeSection === "api" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        API Reference
                      </h2>
                      <p className="text-gray-300 text-lg leading-relaxed">
                        Complete REST API and WebSocket documentation
                      </p>
                    </div>

                    {/* API Endpoints */}
                    <Tabs defaultValue="rest" className="w-full">
                      <TabsList className="grid grid-cols-2 w-full bg-black/40 border border-purple-500/20">
                        <TabsTrigger value="rest">REST API</TabsTrigger>
                        <TabsTrigger value="websocket">WebSocket</TabsTrigger>
                      </TabsList>

                      <TabsContent value="rest" className="mt-6 space-y-6">
                        {[
                          {
                            title: "Authentication",
                            endpoints: [
                              { method: "POST", path: "/api/auth/login", desc: "Login with credentials" },
                              { method: "GET", path: "/api/auth/user", desc: "Get current user" },
                              { method: "POST", path: "/api/auth/logout", desc: "Logout user" },
                            ]
                          },
                          {
                            title: "Agent Management",
                            endpoints: [
                              { method: "GET", path: "/api/agents", desc: "List all agents" },
                              { method: "POST", path: "/api/agents", desc: "Create new agent" },
                              { method: "PUT", path: "/api/agents/:id", desc: "Update agent" },
                              { method: "DELETE", path: "/api/agents/:id", desc: "Delete agent" },
                            ]
                          },
                          {
                            title: "Voice Sessions",
                            endpoints: [
                              { method: "POST", path: "/api/voice/sessions", desc: "Start voice session" },
                              { method: "POST", path: "/api/voice/tts", desc: "Generate TTS audio" },
                              { method: "GET", path: "/api/voice/voices", desc: "List available voices" },
                            ]
                          },
                        ].map((group) => (
                          <Collapsible
                            key={group.title}
                            defaultOpen
                          >
                            <Card className="overflow-hidden border-purple-500/20">
                              <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover-elevate">
                                <h3 className="font-bold text-xl flex items-center gap-2 text-white">
                                  <Code className="w-6 h-6 text-purple-400" />
                                  {group.title}
                                </h3>
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="p-6 pt-0 space-y-3">
                                  {group.endpoints.map((endpoint, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 bg-black/40 rounded-xl border border-purple-500/10 hover-elevate">
                                      <Badge variant="outline" className={`${
                                        endpoint.method === 'GET' ? 'border-green-500/50 bg-green-500/10 text-green-300' :
                                        endpoint.method === 'POST' ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300' :
                                        endpoint.method === 'PUT' ? 'border-orange-500/50 bg-orange-500/10 text-orange-300' :
                                        'border-red-500/50 bg-red-500/10 text-red-300'
                                      } font-mono text-xs flex-shrink-0 font-bold`}>
                                        {endpoint.method}
                                      </Badge>
                                      <div className="flex-1 min-w-0">
                                        <code className="text-sm text-purple-300 font-mono break-all font-semibold">{endpoint.path}</code>
                                        <p className="text-xs text-gray-400 mt-1">{endpoint.desc}</p>
                                      </div>
                                      <Button size="sm" variant="ghost" className="flex-shrink-0">
                                        <ChevronRight className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </CollapsibleContent>
                            </Card>
                          </Collapsible>
                        ))}
                      </TabsContent>

                      <TabsContent value="websocket" className="mt-6 space-y-6">
                        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-purple-500/20">
                          <h3 className="text-xl font-bold mb-4 text-white">WebSocket Connection</h3>
                          <CodeBlock
                            id="ws-connect"
                            language="typescript"
                            code={`import { io } from 'socket.io-client';

const socket = io('https://api.voicely.com', {
  auth: {
    token: 'your-auth-token'
  }
});

socket.on('connect', () => {
  console.log('Connected to Voicely');
});`}
                          />
                        </Card>

                        <div className="grid md:grid-cols-2 gap-6">
                          <Card className="p-6 border-purple-500/20">
                            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                              <ArrowRight className="w-5 h-5 text-cyan-400" />
                              Client → Server Events
                            </h3>
                            <div className="space-y-2">
                              {[
                                { event: "voice:start-session", desc: "Start voice session" },
                                { event: "voice:audio-chunk", desc: "Send audio data" },
                                { event: "voice:text-message", desc: "Send text input" },
                                { event: "voice:end-session", desc: "End session" },
                              ].map((item) => (
                                <div key={item.event} className="p-3 bg-black/40 rounded-lg border border-purple-500/10">
                                  <code className="text-sm text-cyan-300 font-mono font-semibold">{item.event}</code>
                                  <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                                </div>
                              ))}
                            </div>
                          </Card>

                          <Card className="p-6 border-purple-500/20">
                            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
                              <ArrowRight className="w-5 h-5 text-purple-400 rotate-180" />
                              Server → Client Events
                            </h3>
                            <div className="space-y-2">
                              {[
                                { event: "voice:session-started", desc: "Session initialized" },
                                { event: "voice:transcript", desc: "User speech text" },
                                { event: "voice:agent-response", desc: "AI response text" },
                                { event: "voice:audio-response", desc: "TTS audio data" },
                              ].map((item) => (
                                <div key={item.event} className="p-3 bg-black/40 rounded-lg border border-purple-500/10">
                                  <code className="text-sm text-purple-300 font-mono font-semibold">{item.event}</code>
                                  <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                                </div>
                              ))}
                            </div>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}

                {/* Analytics Section */}
                {activeSection === "analytics" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                        Analytics & Insights
                      </h2>
                      <p className="text-gray-300 text-lg leading-relaxed">
                        Track performance, sentiment, and optimize your voice agents
                      </p>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { icon: Activity, label: "Total Calls", value: "10,234", trend: "+12%", color: "from-purple-600/30 to-purple-600/10" },
                        { icon: Clock, label: "Avg Duration", value: "3:24", trend: "+5%", color: "from-cyan-600/30 to-cyan-600/10" },
                        { icon: TrendingUp, label: "Conversion", value: "68%", trend: "+8%", color: "from-green-600/30 to-green-600/10" },
                        { icon: Users, label: "Satisfaction", value: "4.8/5", trend: "+0.3", color: "from-orange-600/30 to-orange-600/10" },
                      ].map((metric) => (
                        <Card key={metric.label} className={`p-6 bg-gradient-to-br ${metric.color} border-purple-500/20`}>
                          <div className="flex items-start justify-between mb-4">
                            <metric.icon className="w-8 h-8 text-purple-400" />
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                              {metric.trend}
                            </Badge>
                          </div>
                          <div className="text-3xl font-black text-white mb-1">{metric.value}</div>
                          <div className="text-sm text-gray-400">{metric.label}</div>
                        </Card>
                      ))}
                    </div>

                    {/* Analytics API */}
                    <Card className="p-6 bg-gradient-to-br from-purple-500/5 to-cyan-500/5 border-purple-500/20">
                      <h3 className="text-xl font-bold mb-4 text-white">Fetching Analytics Data</h3>
                      <CodeBlock
                        id="analytics-api"
                        language="typescript"
                        code={`// Get agent analytics
const analytics = await fetch('/api/analytics/agent/' + agentId);
const data = await analytics.json();

console.log(data);
// {
//   totalCalls: 10234,
//   averageDuration: 204, // seconds
//   sentimentScore: 0.85,
//   conversionRate: 0.68,
//   topIntents: ["pricing", "features", "support"]
// }`}
                      />
                    </Card>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
