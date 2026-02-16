import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhoneCall, Headset, Calendar, RefreshCw, X, ArrowRight, Check, Mic, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import AgentDemoModal from "@/components/AgentDemoModal";
import salesAgentImage from "@assets/generated_images/AI_sales_agent_male_cyborg_69e78b01.png";
import receptionistImage from "@assets/generated_images/AI_receptionist_female_holographic_589d40b2.png";
import appointmentImage from "@assets/generated_images/AI_appointment_agent_calendar_interface_31366281.png";
import followUpImage from "@assets/generated_images/AI_follow-up_agent_data_viz_206ca8f2.png";

export default function AgentsGrid() {
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [demoAgent, setDemoAgent] = useState<any | null>(null);
  const [demoMode, setDemoMode] = useState<'voice' | 'chat'>('voice');

  const agents = [
    {
      icon: PhoneCall,
      title: "AI Sales Agent",
      description: "Qualify leads, pitch products, and close deals automatically",
      image: salesAgentImage,
      agentId: "demo-sales-agent",
      voiceId: "EXAVITQu4vr4xnSDxMaL",
      features: [
        "Qualifies leads with intelligent questioning",
        "Pitches products based on customer needs",
        "Closes deals with proven sales scripts",
        "Automatically logs all interactions to CRM",
        "Handles objections professionally",
        "Schedules follow-up calls",
      ],
      gradient: "from-purple-500 via-purple-600 to-violet-600",
    },
    {
      icon: Headset,
      title: "AI Receptionist",
      description: "Answers FAQs and routes calls to the right team member",
      image: receptionistImage,
      agentId: "demo-receptionist-agent",
      voiceId: "21m00Tcm4TlvDq8ikWAM",
      features: [
        "Answers common questions instantly",
        "Routes calls to the right person",
        "Handles multiple calls simultaneously",
        "24/7 availability, no breaks needed",
        "Professional tone every single time",
        "Integrates with your knowledge base",
      ],
      gradient: "from-cyan-500 via-blue-600 to-cyan-600",
    },
    {
      icon: Calendar,
      title: "AI Appointment Agent",
      description: "Books appointments and handles rescheduling automatically",
      image: appointmentImage,
      agentId: "demo-followup-agent",
      voiceId: "EXAVITQu4vr4xnSDxMaL",
      features: [
        "Books appointments in real-time",
        "Sends automated reminders",
        "Handles rescheduling requests",
        "Syncs with your calendar",
        "Reduces no-shows by 60%",
        "Optimizes scheduling efficiency",
      ],
      gradient: "from-emerald-500 via-teal-600 to-emerald-600",
    },
    {
      icon: RefreshCw,
      title: "AI Follow-Up Agent",
      description: "Renews subscriptions and recovers abandoned carts",
      image: followUpImage,
      agentId: "demo-followup-agent",
      voiceId: "EXAVITQu4vr4xnSDxMaL",
      features: [
        "Sends payment reminders automatically",
        "Recovers abandoned carts",
        "Renews subscriptions proactively",
        "Handles customer retention",
        "Processes refund requests",
        "Increases lifetime value by 40%",
      ],
      gradient: "from-pink-500 via-rose-600 to-pink-600",
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 relative overflow-hidden bg-gradient-to-b from-black via-[#0A0B1E] to-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      
      {/* Subtle Grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight" data-testid="text-agents-headline">
            <span className="text-gray-200">Meet Your New</span>{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400">
                AI-Powered
              </span>
              <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-purple-600/30 via-violet-600/30 to-purple-600/30 blur-2xl sm:blur-3xl -z-10" />
            </span>
            <br />
            <span className="text-gray-200">Workforce</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Four specialized agents working 24/7 to handle every customer conversation
          </p>
        </motion.div>

        {/* Agent Cards Grid - Mobile Optimized with Single Column Stack */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {agents.map((agent, index) => {
            const Icon = agent.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => setSelectedAgent(index)}
                className="relative group cursor-pointer"
                data-testid={`agent-card-${index}`}
              >
                {/* Card Container - Touch Optimized */}
                <div className="relative h-full rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0F1020] to-[#0A0B1E] border border-purple-500/20 overflow-hidden group-hover:border-purple-500/40 transition-all duration-300 min-h-[48px]">
                  {/* Agent Image */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={agent.image}
                      alt={agent.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${agent.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    
                    {/* Icon Badge */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${agent.gradient} p-0.5`}>
                        <div className="w-full h-full rounded-lg sm:rounded-xl bg-black/80 backdrop-blur-sm flex items-center justify-center">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content - Touch Optimized Padding */}
                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-200 mb-2 font-display">
                      {agent.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed mb-4 text-sm sm:text-base">
                      {agent.description}
                    </p>

                    {/* Learn More - Touch Friendly */}
                    <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity min-h-[24px]">
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div 
                    className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 pointer-events-none blur-xl sm:blur-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${agent.gradient.split(' ').slice(1).join(' ')})`,
                      filter: 'blur(40px)',
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Agent Detail Modal - Touch Optimized */}
      <AnimatePresence>
        {selectedAgent !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAgent(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-gradient-to-br from-[#0F1020] to-[#0A0B1E] rounded-2xl sm:rounded-3xl border border-purple-500/30 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button - Touch Optimized */}
              <button
                onClick={() => setSelectedAgent(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/60 backdrop-blur-xl border border-purple-500/30 flex items-center justify-center text-gray-300 hover:text-white hover:border-purple-500/60 transition-all min-h-[48px] min-w-[48px]"
                data-testid="button-close-agent-modal"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <div className="grid md:grid-cols-2 gap-0">
                {/* Left: Image */}
                <div className="relative aspect-[4/5] md:aspect-auto">
                  <img
                    src={agents[selectedAgent].image}
                    alt={agents[selectedAgent].title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${agents[selectedAgent].gradient} opacity-20`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Right: Content - Touch Optimized Padding */}
                <div className="p-6 sm:p-8 md:p-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${agents[selectedAgent].gradient} p-0.5 flex-shrink-0`}>
                      <div className="w-full h-full rounded-xl sm:rounded-2xl bg-black/80 backdrop-blur-sm flex items-center justify-center">
                        {(() => {
                          const Icon = agents[selectedAgent].icon;
                          return <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-purple-300" />;
                        })()}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-200 mb-2 font-display">
                        {agents[selectedAgent].title}
                      </h3>
                      <p className="text-gray-400 text-base sm:text-lg">
                        {agents[selectedAgent].description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <h4 className="text-lg sm:text-xl font-bold text-gray-200">Key Features</h4>
                    <ul className="space-y-3">
                      {agents[selectedAgent].features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="flex items-start gap-3"
                        >
                          <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${agents[selectedAgent].gradient} p-0.5 flex-shrink-0 mt-0.5`}>
                            <div className="w-full h-full rounded-full bg-black/80 flex items-center justify-center">
                              <Check className="w-3 h-3 text-purple-300" />
                            </div>
                          </div>
                          <span className="text-gray-300 text-sm sm:text-base leading-relaxed">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Try Demo Buttons - Touch Optimized */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Try a Demo:</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => {
                          setDemoMode('voice');
                          setDemoAgent({
                            id: agents[selectedAgent].agentId,
                            title: agents[selectedAgent].title,
                            description: agents[selectedAgent].description,
                            image: agents[selectedAgent].image,
                            color: agents[selectedAgent].gradient.includes('purple') ? 'purple' : 
                                   agents[selectedAgent].gradient.includes('cyan') ? 'cyan' : 
                                   agents[selectedAgent].gradient.includes('pink') ? 'pink' : 'emerald',
                            gradient: agents[selectedAgent].gradient,
                            glowColor: agents[selectedAgent].gradient.includes('purple') ? 'rgba(139,92,246,0.4)' : 
                                      agents[selectedAgent].gradient.includes('cyan') ? 'rgba(6,182,212,0.4)' : 
                                      agents[selectedAgent].gradient.includes('pink') ? 'rgba(236,72,153,0.4)' : 'rgba(16,185,129,0.4)',
                            agentId: agents[selectedAgent].agentId,
                            voiceId: agents[selectedAgent].voiceId
                          });
                          setSelectedAgent(null);
                        }}
                        className={`w-full bg-gradient-to-r ${agents[selectedAgent].gradient} hover:opacity-90 text-white font-bold text-sm sm:text-base py-5 sm:py-6 min-h-[48px]`}
                        data-testid="button-try-voice"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <Mic className="w-4 h-4" />
                          Try Voice
                        </span>
                      </Button>
                      <Button
                        onClick={() => {
                          setDemoMode('chat');
                          setDemoAgent({
                            id: agents[selectedAgent].agentId,
                            title: agents[selectedAgent].title,
                            description: agents[selectedAgent].description,
                            image: agents[selectedAgent].image,
                            color: agents[selectedAgent].gradient.includes('purple') ? 'purple' : 
                                   agents[selectedAgent].gradient.includes('cyan') ? 'cyan' : 
                                   agents[selectedAgent].gradient.includes('pink') ? 'pink' : 'emerald',
                            gradient: agents[selectedAgent].gradient,
                            glowColor: agents[selectedAgent].gradient.includes('purple') ? 'rgba(139,92,246,0.4)' : 
                                      agents[selectedAgent].gradient.includes('cyan') ? 'rgba(6,182,212,0.4)' : 
                                      agents[selectedAgent].gradient.includes('pink') ? 'rgba(236,72,153,0.4)' : 'rgba(16,185,129,0.4)',
                            agentId: agents[selectedAgent].agentId,
                            voiceId: agents[selectedAgent].voiceId
                          });
                          setSelectedAgent(null);
                        }}
                        variant="outline"
                        className={`w-full border-2 ${agents[selectedAgent].gradient.includes('purple') ? 'border-purple-500/50 hover:border-purple-400' : 
                                   agents[selectedAgent].gradient.includes('cyan') ? 'border-cyan-500/50 hover:border-cyan-400' : 
                                   agents[selectedAgent].gradient.includes('pink') ? 'border-pink-500/50 hover:border-pink-400' : 'border-emerald-500/50 hover:border-emerald-400'} text-white font-bold text-sm sm:text-base py-5 sm:py-6 min-h-[48px]`}
                        data-testid="button-try-chat"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Try Chat
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Agent Demo Modal */}
      {demoAgent && (
        <AgentDemoModal
          isOpen={true}
          onClose={() => setDemoAgent(null)}
          agent={demoAgent}
          initialMode={demoMode}
        />
      )}
    </section>
  );
}
