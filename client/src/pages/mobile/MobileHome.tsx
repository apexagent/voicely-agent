import { motion } from "framer-motion";
import { Play, Zap, TrendingUp, Users, Clock, Phone, Activity, Bot, ArrowRight, Sparkles, Brain, Mic, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useAnimatedCounter } from "@/hooks/useAnimatedCounter";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import type { Agent } from "@shared/schema";
import heroAgentImage from "@assets/generated_images/AI_agent_with_energy_flows_ed679220.png";

const liveActivities = [
  { id: 1, agent: "Alice", action: "Closed deal", value: "$2,400", time: "2s ago", sentiment: "positive" },
  { id: 2, agent: "Sarah", action: "Booked demo", value: "Enterprise", time: "5s ago", sentiment: "interested" },
  { id: 3, agent: "Alex", action: "Resolved ticket", value: "#4521", time: "8s ago", sentiment: "positive" },
  { id: 4, agent: "Morgan", action: "Scheduled call", value: "Thu 2PM", time: "12s ago", sentiment: "neutral" },
];

export default function MobileHome() {
  const { isLoading } = useAuth();
  
  // Fetch user's agents
  const { data: agentsResponse, isLoading: agentsLoading } = useQuery<{ agents: Agent[] }>({
    queryKey: ["/api/agents"],
  });
  
  const agents = agentsResponse?.agents || [];
  
  // Animated counters for live metrics
  const successRate = useAnimatedCounter(98.7, 2000, 1);
  const callsToday = useAnimatedCounter(12000, 2500, 0);
  
  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0B1E] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0A0B1E] pb-28 overflow-hidden">
      {/* Safe Area Support - iOS Notch */}
      <div className="h-safe-top" />
      
      {/* Premium Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <motion.div 
          className="absolute inset-0" 
          animate={{
            backgroundPosition: ["0px 0px", "40px 40px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating Particles - Mobile Optimized */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { left: 15, top: 20, duration: 3.5, delay: 0 },
          { left: 70, top: 30, duration: 4.2, delay: 1.2 },
          { left: 40, top: 60, duration: 3.8, delay: 2.5 },
          { left: 85, top: 50, duration: 4.5, delay: 0.8 },
          { left: 25, top: 80, duration: 3.2, delay: 3.5 },
          { left: 60, top: 10, duration: 4.0, delay: 1.8 },
        ].map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/50 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Hero AI Agent Section */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative h-80 overflow-hidden"
        >
          {/* Hero Image Container */}
          <div className="absolute inset-0">
            <img
              src={heroAgentImage}
              alt="AI Voice Workforce"
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B1E] via-[#0A0B1E]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
            
            {/* Energy Pulse Effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-32 h-32 rounded-full border-2 border-purple-500/30"
                  animate={{
                    scale: [1, 2.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 1,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Top Badge - Mobile Optimized */}
          <div className="absolute top-6 left-4 right-4 z-10">
            <Badge 
              variant="outline" 
              className="bg-black/95 backdrop-blur-xl border-purple-500/50 text-purple-300 font-bold px-5 py-2.5 text-sm shadow-lg shadow-purple-500/20"
              data-testid="badge-platform-status"
            >
              <Activity className="w-4 h-4 mr-2 animate-pulse" />
              4 AI Agents Online • 24/7
            </Badge>
          </div>

          {/* Hero Content - Optimized Touch Targets */}
          <div className="absolute bottom-8 left-4 right-4 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black/95 backdrop-blur-xl border border-purple-500/40 rounded-3xl p-6"
              style={{
                boxShadow: "0 0 50px rgba(139,92,246,0.3)",
              }}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400">
                  Voicely Agent
                </h1>
              </div>
              <p className="text-gray-300 text-base leading-relaxed mb-5">
                AI voice workforce platform handling customer calls 24/7 with human-like intelligence
              </p>
              
              <Link href="/mobile/agent" data-testid="link-try-live-demo">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-600 hover:from-purple-700 hover:via-violet-700 hover:to-cyan-700 text-white font-bold text-lg rounded-3xl shadow-2xl shadow-purple-500/40 border-2 border-purple-400/30"
                  data-testid="button-try-live-demo"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Try Live AI Demo
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Live Metrics Dashboard */}
      <div className="mx-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-5"
        >
          {/* Terminal Header */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-purple-500/20">
            <Brain className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-300 font-mono">LIVE_PLATFORM_METRICS</span>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              className="text-center p-4 rounded-2xl bg-black/40 border border-purple-500/20 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              data-testid="metric-success-rate"
            >
              {/* Pulse Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative z-10">
                <motion.div 
                  className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-400 mb-1"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {successRate}%
                </motion.div>
                <div className="text-xs text-gray-400 font-mono mb-1">SUCCESS RATE</div>
                <Badge variant="outline" className="text-[9px] border-green-500/30 text-green-400 bg-green-500/10">
                  <TrendingUp className="w-2 h-2 mr-0.5" />
                  +2.3%
                </Badge>
              </div>
            </motion.div>

            <motion.div
              className="text-center p-4 rounded-2xl bg-black/40 border border-purple-500/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-400 mb-1">
                0.3s
              </div>
              <div className="text-xs text-gray-400 font-mono mb-1">AVG RESPONSE</div>
              <Badge variant="outline" className="text-[9px] border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
                <Zap className="w-2 h-2 mr-0.5" />
                Fast
              </Badge>
            </motion.div>

            <motion.div
              className="text-center p-4 rounded-2xl bg-black/40 border border-purple-500/20"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-violet-400 mb-1">
                24/7
              </div>
              <div className="text-xs text-gray-400 font-mono mb-1">UPTIME</div>
              <Badge variant="outline" className="text-[9px] border-purple-500/30 text-purple-400 bg-purple-500/10">
                <Activity className="w-2 h-2 mr-0.5 animate-pulse" />
                Live
              </Badge>
            </motion.div>

            <motion.div
              className="text-center p-4 rounded-2xl bg-black/40 border border-purple-500/20 relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              data-testid="metric-calls-today"
            >
              {/* Pulse Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <div className="relative z-10">
                <motion.div 
                  className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-red-400 mb-1"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {(Number(callsToday) / 1000).toFixed(0)}K+
                </motion.div>
                <div className="text-xs text-gray-400 font-mono mb-1">CALLS TODAY</div>
                <Badge variant="outline" className="text-[9px] border-orange-500/30 text-orange-400 bg-orange-500/10">
                  <TrendingUp className="w-2 h-2 mr-0.5" />
                  +18%
                </Badge>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Live Activity Feed */}
      <div className="mx-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400 animate-pulse" />
              <h3 className="text-sm font-bold text-gray-300">Live Activity</h3>
            </div>
            <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-400 bg-purple-500/10">
              Real-time
            </Badge>
          </div>

          <div className="space-y-2">
            {liveActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="p-4 rounded-2xl bg-black/60 border border-purple-500/30 backdrop-blur-xl hover-elevate"
              >
                <div className="flex items-center gap-3">
                  {/* Agent Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 border-2 border-purple-400/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>

                  {/* Activity Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold text-gray-200">{activity.agent}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500 font-mono">{activity.time}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {activity.action} • <span className="text-cyan-400 font-semibold">{activity.value}</span>
                    </p>
                  </div>

                  {/* Sentiment Indicator */}
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    activity.sentiment === "positive" 
                      ? "bg-green-400 shadow-lg shadow-green-400/50" 
                      : activity.sentiment === "interested"
                      ? "bg-cyan-400 shadow-lg shadow-cyan-400/50"
                      : "bg-gray-400"
                  }`} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Feature Highlights */}
      <div className="mx-4 mt-6 grid grid-cols-2 gap-3">
        {[
          { icon: Phone, label: "Unlimited Calls", color: "from-purple-600 to-violet-600", stat: "∞" },
          { icon: Users, label: "4 AI Agents", color: "from-cyan-600 to-blue-600", stat: "4" },
          { icon: Clock, label: "Always On", color: "from-green-600 to-emerald-600", stat: "24/7" },
          { icon: Zap, label: "Fast Response", color: "from-orange-600 to-red-600", stat: "<1s" },
        ].map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.label}
              className="p-4 rounded-2xl bg-black/60 border border-purple-500/30 backdrop-blur-xl hover-elevate"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.1 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              data-testid={`feature-${feature.label.toLowerCase().replace(/\s/g, '-')}`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-black text-gray-200 mb-1">{feature.stat}</div>
              <p className="text-xs text-gray-400 font-medium">{feature.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Stats - Real Agent Data */}
      <div className="mx-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 gap-3"
        >
          <div className="p-4 rounded-2xl bg-black/60 border border-purple-500/30 backdrop-blur-xl">
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-violet-400 mb-1">
              {agents.length}
            </div>
            <div className="text-xs text-gray-400 font-mono">Total Agents</div>
          </div>
          <div className="p-4 rounded-2xl bg-black/60 border border-purple-500/30 backdrop-blur-xl">
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-400 mb-1">
              {agents.filter(a => a.status === 'active').length}
            </div>
            <div className="text-xs text-gray-400 font-mono">Active Now</div>
          </div>
          <div className="p-4 rounded-2xl bg-black/60 border border-purple-500/30 backdrop-blur-xl">
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-red-400 mb-1">
              {agents.reduce((sum, a) => sum + (a.callsHandled || 0), 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-400 font-mono">Total Calls</div>
          </div>
          <div className="p-4 rounded-2xl bg-black/60 border border-purple-500/30 backdrop-blur-xl">
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-emerald-400 mb-1">
              83%
            </div>
            <div className="text-xs text-gray-400 font-mono">Success Rate</div>
          </div>
        </motion.div>
      </div>

      {/* Your AI Team - Grid Layout */}
      {!agentsLoading && agents.length > 0 && (
        <div className="mx-4 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-gray-200">Your AI Team</h3>
              </div>
              <Link href="/my-agents">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs border-purple-500/30 text-purple-400 bg-purple-500/10 hover-elevate h-7"
                  data-testid="button-view-all-agents"
                >
                  Manage
                </Button>
              </Link>
            </div>

            {/* Agent Grid - 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              {agents.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.0 + index * 0.08 }}
                  data-testid={`agent-card-${agent.id}`}
                >
                  <Link href={`/mobile/agent?id=${agent.id}`}>
                    <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-xl hover-elevate active-elevate-2 cursor-pointer p-4"
                      style={{ aspectRatio: '1/1' }}
                    >
                      {/* Gradient Accent */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                        index % 4 === 0 ? 'from-purple-500 to-violet-500' :
                        index % 4 === 1 ? 'from-cyan-500 to-blue-500' :
                        index % 4 === 2 ? 'from-pink-500 to-rose-500' :
                        'from-green-500 to-emerald-500'
                      }`} />
                      
                      <div className="relative h-full flex flex-col">
                        {/* Agent Avatar */}
                        <div className="mb-3">
                          {agent.avatarUrl ? (
                            <img
                              src={agent.avatarUrl}
                              alt={agent.name}
                              className="w-full aspect-square rounded-xl object-cover border border-white/10 shadow-lg"
                            />
                          ) : (
                            <div className={`w-full aspect-square rounded-xl bg-gradient-to-br ${
                              index % 4 === 0 ? 'from-purple-600 to-violet-600' :
                              index % 4 === 1 ? 'from-cyan-600 to-blue-600' :
                              index % 4 === 2 ? 'from-pink-600 to-rose-600' :
                              'from-green-600 to-emerald-600'
                            } border border-white/10 flex items-center justify-center shadow-lg`}>
                              <Bot className="w-12 h-12 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Agent Info */}
                        <div className="flex-1 flex flex-col">
                          <h4 className="text-sm font-bold text-white mb-0.5 truncate">
                            {agent.name}
                          </h4>
                          <p className="text-xs text-gray-400 capitalize mb-2">
                            {agent.type}
                          </p>

                          {/* Status & Stats */}
                          <div className="mt-auto flex items-center justify-between">
                            <Badge 
                              variant="outline" 
                              className={`text-[9px] flex-shrink-0 ${
                                agent.status === 'active' 
                                  ? 'border-green-500/40 text-green-300 bg-green-500/20' 
                                  : 'border-gray-500/40 text-gray-400 bg-gray-500/20'
                              }`}
                            >
                              <div className={`w-1 h-1 rounded-full mr-1 ${
                                agent.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                              }`} />
                              {agent.status === 'active' ? 'Online' : 'Offline'}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Phone className="w-2.5 h-2.5 text-cyan-400" />
                              <span className="text-[10px] text-gray-400 font-medium">
                                {agent.callsHandled || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hover Shine */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
                        animate={{
                          x: ['-100%', '200%'],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatDelay: 7,
                        }}
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}

              {/* Create New Agent Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 + agents.length * 0.08 }}
              >
                <Link href="/agent-studio">
                  <div 
                    className="rounded-2xl border-2 border-dashed border-purple-500/40 bg-black/40 backdrop-blur-xl hover-elevate active-elevate-2 cursor-pointer flex flex-col items-center justify-center gap-2 p-4"
                    style={{ aspectRatio: '1/1' }}
                    data-testid="button-create-agent"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-200 mb-0.5">Create Agent</p>
                      <p className="text-[10px] text-gray-400">Add to team</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}

      {/* CTA Cards */}
      <div className="mx-4 mt-6 space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <Link href="/mobile/industries">
            <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-600/20 to-violet-600/20 border border-purple-500/40 backdrop-blur-xl hover-elevate active-elevate-2 cursor-pointer"
              data-testid="card-explore-industries"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-gray-200 mb-1">Industries We Serve</h4>
                  <p className="text-sm text-gray-400">12+ industries with custom solutions</p>
                </div>
                <ArrowRight className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
        >
          <Link href="/mobile/agent">
            <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/40 backdrop-blur-xl hover-elevate active-elevate-2 cursor-pointer"
              data-testid="card-try-demo"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <Play className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-gray-200 mb-1">Interactive Demo</h4>
                  <p className="text-sm text-gray-400">Experience Alice in action</p>
                </div>
                <ArrowRight className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Platform Badge */}
      <div className="mx-4 mt-8 mb-4 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-purple-500/30 backdrop-blur-xl"
        >
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-400 font-mono">Powered by AI • Enterprise Ready</span>
        </motion.div>
      </div>
    </div>
  );
}
