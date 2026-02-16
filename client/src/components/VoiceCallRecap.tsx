import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { 
  Sparkles, 
  Clock, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle2, 
  X,
  Download,
  Share2,
  Heart,
  Zap,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface VoiceCallRecapProps {
  isOpen: boolean;
  onClose: () => void;
  duration: number; // in seconds
  transcript: string;
  agentName: string;
  agentImage?: string;
}

// Count-up animation hook
function useCountUp(target: number, delay: number = 0) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, target, {
      duration: 1.5,
      delay,
      ease: "easeOut",
    });
    
    const unsubscribe = rounded.on("change", latest => setDisplayValue(latest));
    
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [target, delay]);

  return displayValue;
}

export default function VoiceCallRecap({
  isOpen,
  onClose,
  duration,
  transcript,
  agentName,
  agentImage,
}: VoiceCallRecapProps) {
  const { toast } = useToast();
  
  // Parse conversation stats from transcript
  const lines = transcript.split('\n').filter(line => line.trim());
  const userMessages = lines.filter(line => line.toLowerCase().startsWith('user:') || line.toLowerCase().startsWith('you:'));
  const agentMessages = lines.filter(line => line.toLowerCase().startsWith('assistant:') || line.toLowerCase().startsWith('agent:'));
  
  const totalMessages = lines.length;
  const totalWords = transcript.split(/\s+/).filter(Boolean).length;
  
  // Animated count-ups for stats
  const animatedDuration = useCountUp(duration, 0.6);
  const animatedMessages = useCountUp(totalMessages, 0.7);
  const animatedWords = useCountUp(totalWords, 0.8);
  
  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  // Generate AI summary (simplified - in production this would call an AI endpoint)
  const generateSummary = () => {
    if (transcript.toLowerCase().includes('demo') || transcript.toLowerCase().includes('pricing')) {
      return "Product demo discussion covering platform features and pricing options.";
    } else if (transcript.toLowerCase().includes('support') || transcript.toLowerCase().includes('help')) {
      return "Support inquiry resolved with technical guidance and next steps.";
    } else if (transcript.toLowerCase().includes('schedule') || transcript.toLowerCase().includes('appointment')) {
      return "Appointment scheduling completed successfully.";
    }
    return "Productive conversation about Voicely's AI voice agent platform.";
  };

  // Download transcript handler
  const handleDownload = () => {
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voicely-transcript-${agentName}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share handler with robust error handling
  const handleShare = async () => {
    const shareText = `Just had a ${formatDuration(duration)} conversation with ${agentName} on Voicely!\n\n${totalMessages} messages • ${totalWords} words\n\nPowered by AI voice agents`;
    
    // Try native Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Voicely Call Summary',
          text: shareText,
        });
        toast({
          title: "Shared successfully",
          description: "Call summary shared via your device",
        });
        return;
      } catch (err: any) {
        // User cancelled share - silently ignore
        if (err.name === 'AbortError') {
          return;
        }
        // Share failed, fall through to clipboard
        console.log('Share failed, attempting clipboard fallback');
      }
    }
    
    // Fallback: copy to clipboard
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to clipboard",
          description: "Call summary ready to paste",
        });
      } catch (err) {
        toast({
          title: "Share unavailable",
          description: "Please copy the summary manually",
          variant: "destructive",
        });
      }
    } else {
      // No share or clipboard API available
      toast({
        title: "Share not supported",
        description: "Your browser doesn't support sharing or clipboard access",
        variant: "destructive",
      });
    }
  };

  const stats = [
    { 
      icon: Clock, 
      label: "Duration", 
      value: animatedDuration,
      displayValue: formatDuration(duration),
      color: "from-purple-600 to-violet-600" 
    },
    { 
      icon: MessageSquare, 
      label: "Messages", 
      value: animatedMessages,
      displayValue: animatedMessages.toString(),
      color: "from-cyan-600 to-blue-600" 
    },
    { 
      icon: TrendingUp, 
      label: "Words", 
      value: animatedWords,
      displayValue: animatedWords.toString(),
      color: "from-green-600 to-emerald-600" 
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            data-testid="recap-backdrop"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg z-50"
            data-testid="recap-modal"
          >
            <div className="relative h-full sm:h-auto bg-gradient-to-br from-[#0A0B1E] via-purple-950/20 to-[#0A0B1E] rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden">
              {/* Animated background effects */}
              <div className="absolute inset-0 opacity-20">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-transparent to-cyan-600/30"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </div>

              {/* Multi-layer sparkle particles for depth */}
              {/* Layer 1: Background nebula particles (large, slow) */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={`nebula-${i}`}
                  className="absolute w-32 h-32 rounded-full blur-3xl"
                  style={{
                    background: i % 2 === 0 
                      ? 'radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)',
                    left: `${(i * 25) + 10}%`,
                    top: `${(i * 20) + 15}%`,
                  }}
                  animate={{
                    x: [0, 30, 0],
                    y: [0, -20, 0],
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 8 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
              
              {/* Layer 2: Mid-depth sparkles (medium speed) */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={`mid-${i}`}
                  className={`absolute w-1.5 h-1.5 rounded-full ${
                    i % 3 === 0 ? 'bg-purple-400' : 
                    i % 3 === 1 ? 'bg-cyan-400' : 'bg-violet-400'
                  }`}
                  initial={{ 
                    opacity: 0,
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    y: [`${Math.random() * 100}%`, `${Math.random() * 100 - 20}%`],
                    scale: [0, 1.8, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    delay: i * 0.15,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut",
                  }}
                />
              ))}
              
              {/* Layer 3: Foreground sparkles (fast, small) */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={`fore-${i}`}
                  className="absolute w-0.5 h-0.5 bg-white rounded-full"
                  style={{
                    boxShadow: '0 0 4px rgba(255,255,255,0.8)',
                  }}
                  initial={{ 
                    opacity: 0,
                    x: `${20 + Math.random() * 60}%`,
                    y: `${20 + Math.random() * 60}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 2, 0],
                    rotate: [0, 180],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.25 + 0.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: "easeOut",
                  }}
                />
              ))}

              {/* Content */}
              <div className="relative p-6 sm:p-8 max-h-full overflow-y-auto">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 border border-purple-500/30 flex items-center justify-center hover-elevate active-elevate-2 transition-all z-10"
                  data-testid="button-close-recap"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>

                {/* Header with animation */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-6"
                >
                  {/* Animated checkmark */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring", 
                      damping: 15, 
                      stiffness: 200,
                      delay: 0.3 
                    }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl"
                    style={{
                      boxShadow: "0 0 40px rgba(34,197,94,0.4)",
                    }}
                  >
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
                      Call Completed
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                      {agentImage && (
                        <Avatar className="w-6 h-6 border border-purple-500/30">
                          <AvatarImage src={agentImage} alt={agentName} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-violet-600 text-white text-xs">
                            {agentName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <span>with {agentName}</span>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-3 gap-3 mb-6"
                >
                  {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="p-4 rounded-2xl bg-black/60 border border-purple-500/30 backdrop-blur-xl text-center"
                      >
                        <div className={`w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                          style={{
                            boxShadow: i === 0 ? "0 0 20px rgba(168,85,247,0.3)" : 
                                      i === 1 ? "0 0 20px rgba(6,182,212,0.3)" : 
                                      "0 0 20px rgba(34,197,94,0.3)"
                          }}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-xl font-bold text-gray-100 mb-1 tabular-nums">{stat.displayValue}</p>
                        <p className="text-xs text-gray-500 font-mono uppercase tracking-wide">{stat.label}</p>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* AI Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border border-purple-500/40 backdrop-blur-xl mb-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-bold text-purple-300 font-mono">AI_SUMMARY</h3>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {generateSummary()}
                  </p>
                </motion.div>

                {/* Key Highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                  className="mb-6"
                >
                  <h4 className="text-xs text-gray-500 font-mono mb-3">HIGHLIGHTS</h4>
                  <div className="space-y-2">
                    {[
                      { text: "Natural conversation flow", dotColor: "bg-green-400" },
                      { text: "Quick response times", dotColor: "bg-cyan-400" },
                      { text: "Professional interaction", dotColor: "bg-purple-400" },
                    ].map((highlight, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.2 + i * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <motion.div 
                          className={`w-1.5 h-1.5 rounded-full ${highlight.dotColor}`}
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            delay: 1.3 + i * 0.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                        <span className="text-sm text-gray-400">{highlight.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="grid grid-cols-2 gap-3"
                >
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300"
                    data-testid="button-download-transcript"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Transcript
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300"
                    data-testid="button-share-recap"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </motion.div>

                {/* Close CTA */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.7 }}
                  className="mt-4"
                >
                  <Button
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold"
                    data-testid="button-done-recap"
                  >
                    Done
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
