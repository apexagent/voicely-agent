import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import VoiceWaveform from "./VoiceWaveform";
import { useVoiceChat } from "@/hooks/useVoiceChat";

interface Message {
  id: number;
  speaker: "user" | "agent";
  text: string;
  sentiment?: "positive" | "neutral" | "question";
}

const demoConversation: Message[] = [
  { id: 1, speaker: "agent", text: "Good afternoon! This is Sarah from Voicely. How can I help you today?", sentiment: "positive" },
  { id: 2, speaker: "user", text: "Hi, I'm interested in learning more about your AI voice agents.", sentiment: "question" },
  { id: 3, speaker: "agent", text: "Absolutely! Our AI agents can handle calls 24/7 with natural conversations. Would you like to see a demo?", sentiment: "positive" },
  { id: 4, speaker: "user", text: "Yes, that sounds great. How quickly can we get started?", sentiment: "positive" },
  { id: 5, speaker: "agent", text: "We can have you up and running within 48 hours. Let me connect you with our onboarding team.", sentiment: "positive" },
];

export default function LiveCallSimulator() {
  const [callDuration, setCallDuration] = useState(0);
  
  // Real voice streaming
  const {
    isActive,
    isRecording,
    isSpeaking,
    transcript,
    error,
    startSession,
    endSession,
    isReady,
  } = useVoiceChat({
    agentId: "demo_call_simulator",
    voiceId: "21m00Tcm4TlvDq8ikWAM",
  });

  // Track call duration
  useEffect(() => {
    if (!isActive) {
      setCallDuration(0);
      return;
    }

    const durationInterval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(durationInterval);
  }, [isActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    startSession();
  };

  const handleEndCall = () => {
    endSession();
  };

  const getSentimentBadge = (sentiment?: string) => {
    if (!sentiment) return null;
    const colors = {
      positive: "bg-green-500/20 text-green-400 border-green-500/30",
      neutral: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      question: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    };
    return (
      <Badge variant="outline" className={`text-xs ${colors[sentiment as keyof typeof colors]}`}>
        {sentiment}
      </Badge>
    );
  };

  return (
    <Card className="p-6 bg-black/40 backdrop-blur-xl border-purple-500/20 max-w-2xl mx-auto" data-testid="call-simulator">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
            <h3 className="text-lg font-semibold text-white">Live Call Demo</h3>
          </div>
          {isActive && (
            <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              {formatDuration(callDuration)}
            </Badge>
          )}
        </div>

        {/* Waveform */}
        <VoiceWaveform 
          isPlaying={isActive && (isRecording || isSpeaking)} 
          barCount={50}
          className="bg-black/20 rounded-lg p-4"
        />
        
        {/* Voice Status */}
        {isActive && (
          <div className="text-sm text-center text-gray-400" data-testid="voice-status">
            {isRecording && "🎤 Listening to you..."}
            {isSpeaking && "🔊 Agent is speaking..."}
            {!isRecording && !isSpeaking && "⚡ Ready"}
          </div>
        )}
        
        {/* Error Display */}
        {error && (
          <div className="text-sm text-red-400 text-center" data-testid="voice-error">
            Error: {error}
          </div>
        )}

        {/* Transcript */}
        <div className="min-h-[280px] max-h-[280px] overflow-y-auto space-y-3 bg-black/20 rounded-lg p-4 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
          <AnimatePresence>
            {transcript.filter(t => t.isFinal).map((entry, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex flex-col gap-1 ${entry.speaker === 'agent' ? 'items-start' : 'items-end'}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${entry.speaker === 'agent' ? 'text-purple-400' : 'text-gray-400'}`}>
                    {entry.speaker === 'agent' ? 'AI Agent' : 'You'}
                  </span>
                  <span className="text-xs text-gray-600">
                    {entry.timestamp.toLocaleTimeString('en-US', { hour12: false })}
                  </span>
                </div>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  entry.speaker === 'agent' 
                    ? 'bg-purple-500/10 border border-purple-500/20 text-white' 
                    : 'bg-gray-500/10 border border-gray-500/20 text-gray-300'
                }`}>
                  {entry.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {!isActive && transcript.length === 0 && (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
              Click "Start Demo Call" to begin live voice conversation
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {!isActive ? (
            <Button
              onClick={handleStartCall}
              disabled={!isReady}
              className="flex-1 bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white glow-purple disabled:opacity-50"
              size="lg"
              data-testid="button-start-call"
            >
              <Phone className="w-4 h-4 mr-2" />
              {isReady ? "Start Demo Call" : "Connecting..."}
            </Button>
          ) : (
            <Button
              onClick={handleEndCall}
              variant="destructive"
              className="flex-1"
              size="lg"
              data-testid="button-end-call"
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              End Call
            </Button>
          )}
          
          <Button
            variant="outline"
            size="lg"
            className="border-purple-500/30 hover:bg-purple-500/10"
            data-testid="button-volume"
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-3 pt-3 border-t border-purple-500/20"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{messages.length}</div>
              <div className="text-xs text-gray-400">Messages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">98%</div>
              <div className="text-xs text-gray-400">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">120ms</div>
              <div className="text-xs text-gray-400">Response</div>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
}
