import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  Stethoscope, Scale, Home, Building2, Heart, Shield, 
  Utensils, GraduationCap, Layers, Phone
} from "lucide-react";
import voicelyLogo from "@assets/IMAGE_2025-11-10_22_12_52-removebg-preview_(1)_1765378653714.png";

interface VoiceWaveLoaderProps {
  onComplete?: () => void;
  duration?: number;
}

const industries = [
  { name: 'Healthcare', icon: Stethoscope },
  { name: 'Legal', icon: Scale },
  { name: 'Real Estate', icon: Home },
  { name: 'Finance', icon: Building2 },
  { name: 'Dental', icon: Heart },
  { name: 'Insurance', icon: Shield },
  { name: 'Hospitality', icon: Utensils },
  { name: 'Education', icon: GraduationCap },
];

const integrationApps = [
  'Salesforce', 'HubSpot', 'Slack', 'Google Calendar', 
  'Stripe', 'Twilio', 'Zendesk', 'Zoom'
];

export function VoiceWaveLoader({ onComplete, duration = 2500 }: VoiceWaveLoaderProps) {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true);
      setTimeout(() => {
        onComplete?.();
      }, 600);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-950"
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      transition={{ duration: 0.6 }}
      style={{ pointerEvents: isComplete ? "none" : "auto" }}
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-cyan-900/10" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(139, 92, 246, 0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139, 92, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content */}
      <div className="relative flex flex-col items-center max-w-4xl mx-auto px-6">
        {/* Logo and Title */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/30 to-cyan-600/30 border border-purple-500/30 flex items-center justify-center"
            animate={{
              boxShadow: [
                '0 0 20px rgba(139,92,246,0.2)',
                '0 0 40px rgba(139,92,246,0.4)',
                '0 0 20px rgba(139,92,246,0.2)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <img src={voicelyLogo} alt="Voicely" className="w-10 h-10 object-contain" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-white">Voicely Agent</h1>
            <p className="text-gray-400 text-sm">AI Voice Workforce Platform</p>
          </div>
        </motion.div>

        {/* Industries Section */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-5 font-medium">
            Serving 19+ Industries
          </p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {industries.map((industry, i) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30"
              >
                <motion.div
                  animate={{ 
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/20 to-cyan-600/20 flex items-center justify-center"
                >
                  <industry.icon className="w-5 h-5 text-gray-300" />
                </motion.div>
                <span className="text-[10px] text-gray-500 hidden md:block">{industry.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Integrations Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-10 p-5 rounded-2xl bg-gradient-to-r from-purple-600/10 via-gray-800/30 to-cyan-600/10 border border-gray-700/50 w-full max-w-2xl"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Layers className="w-5 h-5 text-purple-400" />
            <span className="text-lg font-semibold text-white">Integrates with 40+ Apps</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {integrationApps.map((app, i) => (
              <motion.div
                key={app}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 + i * 0.05 }}
                className="px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700/50 text-xs text-gray-400"
              >
                {app}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Phone className="w-5 h-5 text-purple-400" />
            </motion.div>
            <span className="text-gray-300 font-medium">Loading AI Voice Platform</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mx-auto">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: duration / 1000 - 0.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>

      {/* Minimal corner accents */}
      <div className="absolute top-6 left-6 w-12 h-12 border-t border-l border-purple-500/20 rounded-tl-lg" />
      <div className="absolute top-6 right-6 w-12 h-12 border-t border-r border-cyan-500/20 rounded-tr-lg" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-b border-l border-cyan-500/20 rounded-bl-lg" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-b border-r border-purple-500/20 rounded-br-lg" />
    </motion.div>
  );
}
