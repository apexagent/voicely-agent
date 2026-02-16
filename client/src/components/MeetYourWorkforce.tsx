import { motion, AnimatePresence } from "framer-motion";
import { PhoneCall, Headphones, Calendar, RefreshCw, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import heroAgentVideo from "@assets/_video_prompt_202511111401_4skg4_1762845013872.mp4";
import salesAgentImg from "@assets/c57e465e-117a-48b6-ac72-f595b2147893_1762607585724.png";
import receptionistImg from "@assets/6d2e3129-7027-46ab-a628-de3766dedf07_1763287429962.png";
import appointmentImg from "@assets/dbd2eb13-b3a0-4352-ad50-b1e1e6c83823_1762607585724.png";
import supportImg from "@assets/b47fb970-cdb6-40cc-937b-3c9239ba0648_1763288423679.png";

// Deterministic data for holographic visualizations
const waveformHeights = [35, 65, 45, 80, 50, 90, 60, 40];
const chartBarHeights = [40, 60, 80, 50, 70, 90];
const lineChartHeights = [20, 28, 36, 44, 52, 60, 68, 76, 84, 92];

export default function MeetYourWorkforce() {

  const agents = [
    {
      id: "sales",
      icon: PhoneCall,
      title: "AI Sales Agent",
      description: "Qualify leads, pitch products, and close deals automatically",
      features: [
        "Lead qualification & scoring",
        "Product demos & presentations",
        "Objection handling",
      ],
      capabilities: [
        "Lead qualification & scoring",
        "Product demos & presentations",
        "Objection handling",
        "Contract negotiation",
        "Deal closing automation"
      ],
      image: salesAgentImg,
      color: "purple",
      gradient: "from-purple-500 to-violet-500",
      agentId: "demo-sales-agent",
      voiceId: "EXAVITQu4vr4xnSDxMaL",
      testId: "sales",
    },
    {
      id: "receptionist",
      icon: Headphones,
      title: "AI Receptionist",
      description: "Answers FAQs and routes calls to the right team member",
      features: [
        "24/7 call answering",
        "FAQ automation",
        "Intelligent call routing",
      ],
      capabilities: [
        "24/7 call answering",
        "FAQ automation",
        "Intelligent call routing",
        "Visitor management",
        "Multi-language support"
      ],
      image: receptionistImg,
      color: "purple",
      gradient: "from-purple-500 to-violet-500",
      agentId: "demo-receptionist-agent",
      voiceId: "21m00Tcm4TlvDq8ikWAM",
      testId: "receptionist",
    },
    {
      id: "appointment",
      icon: Calendar,
      title: "AI Appointment Agent",
      description: "Books appointments and handles rescheduling automatically",
      features: [
        "Calendar sync & booking",
        "Smart scheduling",
        "Automated reminders",
      ],
      capabilities: [
        "Calendar sync & booking",
        "Smart scheduling",
        "Automated reminders",
        "Reschedule handling",
        "No-show follow-ups"
      ],
      image: appointmentImg,
      color: "cyan",
      gradient: "from-cyan-500 to-blue-500",
      agentId: "demo-followup-agent",
      voiceId: "EXAVITQu4vr4xnSDxMaL",
      testId: "appointment",
    },
    {
      id: "support",
      icon: Headphones,
      title: "AI Support Agent",
      description: "Provides 24/7 customer support and resolves issues instantly",
      features: [
        "Issue resolution & troubleshooting",
        "Product knowledge base",
        "Ticket creation & tracking",
      ],
      capabilities: [
        "Issue resolution & troubleshooting",
        "Product knowledge base",
        "Ticket creation & tracking",
        "Escalation management",
        "Customer satisfaction tracking"
      ],
      image: supportImg,
      color: "purple",
      gradient: "from-purple-500 to-violet-500",
      agentId: "demo-support-agent",
      voiceId: "cgSgspJ2msm6clMCkdW9",
      testId: "support",
    },
  ];

  return (
    <section id="meet-your-workforce" className="relative py-20 sm:py-24 md:py-32 overflow-hidden bg-gradient-to-b from-black via-[#0A0B1E] to-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 leading-tight">
            <span className="text-white">Meet Your </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">AI Workforce</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Specialized AI Agents, each expertly trained to handle specific business needs. Available 24/7 to transform your operations.
          </p>
        </motion.div>

        {/* Main Hero Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative mb-12 md:mb-16 rounded-3xl overflow-hidden border-2 border-purple-500/30 bg-gradient-to-br from-purple-900/20 via-violet-900/10 to-black/40 backdrop-blur-xl"
          data-testid="hero-workforce-card"
        >
          {/* Large Agent Video */}
          <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden">
            <video
              src={heroAgentVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center"
              data-testid="hero-workforce-video"
            />
            
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Voicely Logo Badge */}
            <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 px-4 py-2 rounded-lg bg-black/80 backdrop-blur-sm border border-purple-500/40">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400 font-display font-black text-base md:text-lg">
                Voicely
              </span>
            </div>
          </div>
        </motion.div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent, index) => {
            const Icon = agent.icon;
            
            const colorMap: Record<string, {
              border: string;
              bg: string;
              iconBg: string;
            }> = {
              purple: {
                border: "border-purple-500/40",
                bg: "from-purple-900/40 via-purple-900/20 to-black/40",
                iconBg: "bg-purple-600/90",
              },
              cyan: {
                border: "border-cyan-500/40",
                bg: "from-cyan-900/40 via-cyan-900/20 to-black/40",
                iconBg: "bg-cyan-600/90",
              },
            };
            
            const colorClasses = colorMap[agent.color] || colorMap["purple"];

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl border-2 ${colorClasses.border} bg-gradient-to-b ${colorClasses.bg} backdrop-blur-xl overflow-hidden hover:scale-105 transition-transform duration-300`}
                data-testid={`agent-card-${index}`}
              >
                {/* Agent Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={agent.image}
                    alt={agent.title}
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Icon Badge */}
                  <div className={`absolute top-3 right-3 w-10 h-10 rounded-lg ${colorClasses.iconBg} backdrop-blur-sm flex items-center justify-center border border-white/20`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-2 font-display">
                    {agent.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {agent.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {agent.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-purple-400 mt-0.5">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Learn More Button */}
                  <Link href="/mobile/industries">
                    <Button
                      variant="ghost"
                      className="w-full border border-white/20 hover:bg-white/10 text-white"
                      data-testid={`button-learn-more-${agent.testId}`}
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
