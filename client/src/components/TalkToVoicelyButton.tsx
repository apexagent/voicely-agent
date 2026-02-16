import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Sparkles, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceChat } from "@/hooks/useVoiceChat";
import { useToast } from "@/hooks/use-toast";
import voicelyIconPath from "@assets/New vvvv_1763478691091.png";

export default function TalkToVoicelyButton() {
  const { toast } = useToast();
  const [isStarting, setIsStarting] = useState(false);

  const voiceChat = useVoiceChat({
    agentId: "demo-support-agent",
    voiceId: "cgSgspJ2msm6clMCkdW9", // Jessica - Cute, conversational voice
    onError: (error) => {
      toast({
        title: "Voice Error",
        description: error,
        variant: "destructive",
      });
      setIsStarting(false);
    },
  });

  const handleToggle = async () => {
    if (voiceChat.isActive) {
      voiceChat.endSession();
      setIsStarting(false);
    } else if (voiceChat.isReady && !isStarting) {
      setIsStarting(true);
      try {
        await voiceChat.startSession();
      } catch (error) {
        console.error('[VOICE] Failed to start session:', error);
      } finally {
        setIsStarting(false);
      }
    }
  };

  return (
    <div className="relative flex items-center justify-center py-12">
      {/* Animated Voice Waves - Matching particle colors */}
      <div className="absolute inset-0 flex items-center justify-center">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 rounded-full"
            style={{
              left: `${50 + (i - 12) * 3}%`,
              background: `linear-gradient(to top, ${
                ["#06B6D4", "#A855F7", "#D946EF", "#7C3AED"][i % 4]
              }, transparent)`,
            }}
            animate={{
              height: [`${20 + Math.random() * 10}%`, `${30 + Math.random() * 60}%`, `${20 + Math.random() * 10}%`],
            }}
            transition={{
              duration: 0.6 + Math.random() * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.03,
            }}
          />
        ))}
      </div>

      {/* Talk to Voicely Button - Pulses when speaking */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="relative z-10"
        animate={voiceChat.isSpeaking ? {
          scale: [1, 1.08, 1],
        } : {}}
        transition={{
          duration: 1,
          repeat: voiceChat.isSpeaking ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        <Button
          onClick={handleToggle}
          disabled={!voiceChat.isReady || isStarting}
          className="relative px-8 py-5 text-lg font-semibold bg-white/5 border-2 border-cyan-500/30 hover:border-cyan-400/50 text-white backdrop-blur-xl rounded-full shadow-2xl disabled:opacity-50 transition-all group"
          data-testid="button-talk-to-voicely"
          style={{
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.4), 0 0 60px rgba(168, 85, 247, 0.3)',
          }}
        >
          <div className="flex items-center gap-4">
            {/* Transparent circular icon container with glassmorphism */}
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
              <img 
                src={voicelyIconPath} 
                alt="Voicely Icon" 
                className="w-8 h-8 object-contain"
              />
            </div>
            
            {/* Text */}
            <span className="text-white font-medium tracking-wide">
              {isStarting ? (
                "Starting..."
              ) : voiceChat.isActive ? (
                !voiceChat.hasAgentSpoken ? "Alice is greeting you..." :
                voiceChat.isSpeaking ? "Alice speaking..." : "Listening..."
              ) : (
                "Call Voicely"
              )}
            </span>
          </div>
          
          {/* Animated glow effect on hover */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
        </Button>

        {/* Ripple Effect when Speaking */}
        {voiceChat.isSpeaking && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-cyan-400"
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.6, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-purple-400"
              animate={{
                scale: [1, 1.8, 1.8],
                opacity: [0.4, 0, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.3,
              }}
            />
          </>
        )}
      </motion.div>

      {/* End Call Button - Only shows when active */}
      {voiceChat.isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-0"
        >
          <Button
            onClick={handleToggle}
            size="icon"
            variant="outline"
            className="border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-full w-10 h-10"
            data-testid="button-end-voice"
          >
            <PhoneOff className="w-4 h-4" />
          </Button>
        </motion.div>
      )}

      {/* Live Transcript - Shows Alice's greeting instantly */}
      {voiceChat.isActive && voiceChat.transcript.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-6 w-full max-w-2xl"
        >
          <div className="bg-black/40 backdrop-blur-lg border border-purple-500/30 rounded-lg p-6 shadow-2xl">
            <h3 className="text-sm font-semibold text-purple-300 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Live Transcript
            </h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {voiceChat.transcript.map((entry, index) => (
                <div
                  key={index}
                  className={`text-sm ${
                    entry.speaker === 'agent'
                      ? 'text-cyan-300'
                      : 'text-purple-300'
                  }`}
                  data-testid={`transcript-entry-${entry.speaker}-${index}`}
                >
                  <span className="font-semibold">
                    {entry.speaker === 'agent' ? 'Alice' : 'You'}:
                  </span>{' '}
                  {entry.text}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
