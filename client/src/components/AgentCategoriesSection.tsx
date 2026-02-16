import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Headphones, Calendar, RefreshCcw, Sparkles, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AgentDemoModal from "@/components/AgentDemoModal";
import heroAgent from "@assets/9bd3c5fc-f5c8-410c-b35a-c3aa27718c92_1762597439964.png";
import aliceImg from "@assets/generated_images/Alice_Support_Agent_New.png";
import salesAgentImg from "@assets/c0001dae-d4fe-4559-964d-817e77c4df0f_1762597948605.png";
import emmaImg from "@assets/generated_images/AI_Receptionist_portrait_9f254370.png";
import appointmentImg from "@assets/77912688-291a-4713-b923-54cec485ff01_1762597948605.png";
import followupImg from "@assets/c6a83411-9447-410d-bda5-46daa0aa23f9_1762597948605.png";

export default function AgentCategoriesSection() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const agentCategories = [
    {
      id: "support",
      title: "AI Support Agent - Alice",
      icon: HelpCircle,
      image: aliceImg,
      description: "Provides 24/7 technical support and troubleshooting assistance",
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
      glowColor: "rgba(59,130,246,0.4)",
      agentId: "demo-support-agent",
      voiceId: "cgSgspJ2msm6clMCkdW9",
      capabilities: [
        "Technical troubleshooting",
        "CRM integration support",
        "Platform optimization",
        "Billing assistance",
        "Custom solutions"
      ]
    },
    {
      id: "sales",
      title: "AI Sales Agent",
      icon: Phone,
      image: salesAgentImg,
      description: "Qualify leads, pitch products, and close deals automatically",
      color: "cyan",
      gradient: "from-cyan-500 to-blue-500",
      glowColor: "rgba(6,182,212,0.4)",
      agentId: "demo-sales-agent",
      voiceId: "EXAVITQu4vr4xnSDxMaL",
      capabilities: [
        "Lead qualification & scoring",
        "Product demos & presentations",
        "Objection handling",
        "Contract negotiation",
        "Deal closing automation"
      ]
    },
    {
      id: "receptionist",
      title: "AI Receptionist - Emma",
      icon: Headphones,
      image: emmaImg,
      description: "Answers FAQs and routes calls to the right team member",
      color: "purple",
      gradient: "from-purple-500 to-violet-500",
      glowColor: "rgba(139,92,246,0.4)",
      agentId: "demo-receptionist-agent",
      voiceId: "21m00Tcm4TlvDq8ikWAM",
      capabilities: [
        "24/7 call answering",
        "FAQ automation",
        "Intelligent call routing",
        "Visitor management",
        "Multi-language support"
      ]
    },
    {
      id: "appointment",
      title: "AI Appointment Agent",
      icon: Calendar,
      image: appointmentImg,
      description: "Books appointments and handles rescheduling automatically",
      color: "violet",
      gradient: "from-violet-500 to-purple-500",
      glowColor: "rgba(167,139,250,0.4)",
      agentId: "demo-followup-agent",
      voiceId: "EXAVITQu4vr4xnSDxMaL",
      capabilities: [
        "Calendar sync & booking",
        "Smart scheduling",
        "Automated reminders",
        "Reschedule handling",
        "No-show follow-ups"
      ]
    },
    {
      id: "followup",
      title: "AI Follow-Up Agent",
      icon: RefreshCcw,
      image: followupImg,
      description: "Renews subscriptions and recovers abandoned carts",
      color: "pink",
      gradient: "from-pink-500 to-rose-500",
      glowColor: "rgba(236,72,153,0.4)",
      agentId: "demo-followup-agent",
      voiceId: "EXAVITQu4vr4xnSDxMaL",
      capabilities: [
        "Cart recovery campaigns",
        "Subscription renewals",
        "Feedback collection",
        "Re-engagement outreach",
        "Customer retention"
      ]
    }
  ];

  return (
    <section className="relative py-40 overflow-hidden">
      {/* Pure Black Background */}
      <div className="absolute inset-0 bg-black" />

      {/* Animated Grid Overlay */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px"
          }}
        />
      </div>

      {/* Gradient Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[140px]" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-600/20 border border-purple-500/40 backdrop-blur-xl mb-8"
            style={{
              boxShadow: "0 0 40px rgba(139,92,246,0.4)",
            }}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold text-purple-300">
              Elite Voice Agents
            </span>
          </motion.div>

          <h2 className="font-display text-5xl lg:text-7xl font-black mb-6 leading-tight">
            <span className="text-gray-200">Meet Your </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 relative inline-block">
              AI Workforce
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/40 via-violet-600/40 to-cyan-600/40 blur-[80px] -z-10" />
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Specialized AI Agents, each expertly trained to handle specific business needs. Available 24/7 to transform your operations.
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mb-32"
        >
          <div 
            className="relative rounded-3xl overflow-hidden border-2 border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-black/40 backdrop-blur-xl p-2"
            style={{
              boxShadow: "0 0 120px rgba(139,92,246,0.5), inset 0 0 100px rgba(139,92,246,0.05)",
            }}
          >
            <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20">
              <img 
                src={heroAgent} 
                alt="Voicely AI Agent" 
                className="w-full h-auto"
              />
              {/* Image Glow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Floating Glow Effect */}
          <motion.div
            className="absolute -inset-8 bg-gradient-to-r from-purple-600/30 via-violet-600/30 to-cyan-600/30 rounded-full blur-[100px] -z-10"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          />
        </motion.div>

        {/* Agent Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agentCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                {/* Card Container with Glassmorphism */}
                <div 
                  className="relative h-full rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-black/40 backdrop-blur-xl overflow-hidden transition-all duration-300 hover:border-purple-400/40 hover:shadow-2xl"
                  style={{
                    boxShadow: "0 0 40px rgba(139,92,246,0.1)",
                  }}
                >
                  {/* Agent Image Hero */}
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={`${category.title} - Elite AI Voice Agent`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    
                    {/* Icon Badge Overlay */}
                    <motion.div
                      className={`absolute top-4 right-4 w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} p-0.5`}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="w-full h-full rounded-xl bg-black/80 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3">
                      {category.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed mb-5">
                      {category.description}
                    </p>

                    {/* Capabilities List */}
                    <ul className="space-y-2 mb-6">
                      {category.capabilities.slice(0, 3).map((capability, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-500">
                          <div className="w-1 h-1 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                          <span>{capability}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedAgent(category.id)}
                      className="w-full bg-purple-600/10 hover:bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:text-purple-200 transition-all group/btn"
                      data-testid={`button-learn-${category.id}`}
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>

                  {/* Hover Glow Effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${category.glowColor}, transparent 70%)`,
                    }}
                  />
                </div>

                {/* Outer Glow on Hover */}
                <motion.div
                  className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                  style={{
                    background: `radial-gradient(circle, ${category.glowColor}, transparent 70%)`,
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Interactive Agent Demo Modal */}
      {selectedAgent !== null && agentCategories.find(a => a.id === selectedAgent) && (
        <AgentDemoModal
          isOpen={true}
          onClose={() => setSelectedAgent(null)}
          agent={agentCategories.find(a => a.id === selectedAgent)!}
        />
      )}
    </section>
  );
}
