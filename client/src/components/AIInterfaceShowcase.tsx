import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, MessageCircle, Activity, Zap, CheckCircle2 } from "lucide-react";
import agentImage from "@assets/8a3b3e88-df7c-4284-9f2c-e8094f3de9cc_1762597948603.png";
import userAvatar from "@assets/20f938b4-0436-49b9-a4a6-815c0b0a2cb4_1762607585722.png";

interface ChatMessage {
  id: number;
  role: "agent" | "user";
  text: string;
  timestamp: string;
}

interface LogEntry {
  id: number;
  level: "info" | "success" | "processing";
  message: string;
  timestamp: string;
}

const chatMessages: ChatMessage[] = [
  { id: 1, role: "agent", text: "Hi! How can I help you today?", timestamp: "2:41 PM" },
  { id: 2, role: "user", text: "I need to book an appointment", timestamp: "2:41 PM" },
  { id: 3, role: "agent", text: "I'd be happy to help! What day works best?", timestamp: "2:42 PM" },
  { id: 4, role: "user", text: "How about Thursday at 3pm?", timestamp: "2:42 PM" },
  { id: 5, role: "agent", text: "Perfect! I've booked you for Thursday at 3pm. You'll receive a confirmation email shortly.", timestamp: "2:42 PM" },
];

const backendLogs: LogEntry[] = [
  { id: 1, level: "info", message: "Incoming call detected from +1-555-0123", timestamp: "14:41:03" },
  { id: 2, level: "processing", message: "Voice recognition initialized", timestamp: "14:41:04" },
  { id: 3, level: "success", message: "Intent classified: APPOINTMENT_BOOKING", timestamp: "14:41:08" },
  { id: 4, level: "processing", message: "Checking calendar availability...", timestamp: "14:41:12" },
  { id: 5, level: "success", message: "Slot confirmed: Thu 3:00PM", timestamp: "14:41:14" },
  { id: 6, level: "success", message: "Booking saved to database", timestamp: "14:41:15" },
  { id: 7, level: "info", message: "Sending confirmation email...", timestamp: "14:41:16" },
  { id: 8, level: "success", message: "Call completed successfully (15s)", timestamp: "14:41:18" },
];

export default function AIInterfaceShowcase() {
  const [activeChat, setActiveChat] = useState<ChatMessage[]>([]);
  const [activeLogs, setActiveLogs] = useState<LogEntry[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isPlaying) {
      setActiveChat([]);
      setActiveLogs([]);
      setCurrentIndex(0);
      return;
    }

    if (currentIndex >= Math.max(chatMessages.length, backendLogs.length)) {
      setTimeout(() => {
        setIsPlaying(false);
      }, 2000);
      return;
    }

    const timer = setTimeout(() => {
      if (currentIndex < chatMessages.length) {
        setActiveChat(prev => [...prev, chatMessages[currentIndex]]);
      }
      if (currentIndex < backendLogs.length) {
        setActiveLogs(prev => [...prev, backendLogs[currentIndex]]);
      }
      setCurrentIndex(prev => prev + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex]);

  const handleReplay = () => {
    setActiveChat([]);
    setActiveLogs([]);
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "success": return "text-green-400";
      case "processing": return "text-cyan-400";
      default: return "text-gray-400";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "success": return <CheckCircle2 className="w-3 h-3" />;
      case "processing": return <Activity className="w-3 h-3 animate-pulse" />;
      default: return <Zap className="w-3 h-3" />;
    }
  };

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-black via-[#0A0B1E] to-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-gray-200">Watch AI Agents</span>{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400">
                In Action
              </span>
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 via-violet-600/30 to-cyan-600/30 blur-3xl -z-10" />
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            See how our AI handles real conversations while processing everything in real-time
          </p>

          {!isPlaying && (
            <motion.button
              onClick={handleReplay}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 text-gray-100 font-bold text-lg hover:from-purple-500 hover:via-violet-500 hover:to-purple-500 transition-all shadow-lg hover:shadow-purple-500/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-testid="button-play-demo"
            >
              {activeChat.length > 0 ? "Watch Again" : "Watch Demo"}
            </motion.button>
          )}
        </motion.div>

        {/* Split View: Chat Interface + Terminal Backend */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-[#0F1020] to-[#0A0B1E] border-2 border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl">
              {/* Chat Header */}
              <div className="bg-purple-600/10 border-b border-purple-500/20 p-4 md:p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/50">
                  <img src={agentImage} alt="AI Agent" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-200 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-purple-400" />
                    AI Receptionist
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>Online - Avg response 0.3s</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-4 md:p-6 min-h-[400px] max-h-[400px] overflow-y-auto space-y-4 bg-black/20">
                <AnimatePresence>
                  {activeChat.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500/30">
                        <img 
                          src={message.role === 'agent' ? agentImage : userAvatar} 
                          alt={message.role} 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Message Bubble */}
                      <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} max-w-[70%]`}>
                        <div className={`px-4 py-3 rounded-2xl ${
                          message.role === 'agent'
                            ? 'bg-purple-600/20 border border-purple-500/30 text-gray-200'
                            : 'bg-gray-600/20 border border-gray-500/30 text-gray-200'
                        }`}>
                          {message.text}
                        </div>
                        <span className="text-xs text-gray-500 mt-1">{message.timestamp}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {!isPlaying && activeChat.length === 0 && (
                  <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                    Click "Watch Demo" to see AI agent conversation
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Terminal Backend */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-[#0F1020] to-[#0A0B1E] border-2 border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl">
              {/* Terminal Header */}
              <div className="bg-cyan-600/10 border-b border-cyan-500/20 p-4 md:p-6 flex items-center gap-3">
                <Terminal className="w-6 h-6 text-cyan-400" />
                <h3 className="text-lg font-bold text-gray-200 font-mono">Backend Processing</h3>
                <div className="ml-auto flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
              </div>

              {/* Terminal Logs */}
              <div className="p-4 md:p-6 min-h-[400px] max-h-[400px] overflow-y-auto bg-black/40 font-mono text-sm space-y-2">
                <AnimatePresence>
                  {activeLogs.map((log) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-3"
                    >
                      <span className="text-gray-600 text-xs">{log.timestamp}</span>
                      <div className={`flex items-center gap-2 ${getLevelColor(log.level)}`}>
                        {getLevelIcon(log.level)}
                        <span className="text-xs md:text-sm">{log.message}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {!isPlaying && activeLogs.length === 0 && (
                  <div className="h-full flex items-center justify-center text-gray-600 text-sm">
                    $ waiting for demo to start...
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
