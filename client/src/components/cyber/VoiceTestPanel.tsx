import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, Volume2, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { HolographicBorder } from "./HolographicBorder";

interface VoiceTestPanelProps {
  voiceId: string;
  agentName: string;
}

export function VoiceTestPanel({ voiceId, agentName }: VoiceTestPanelProps) {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "success" | "error">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const testText = `Hello! I'm ${agentName}, your AI voice agent. I'm here to assist you 24/7 with professional, intelligent conversations. Let's achieve great results together.`;

  const handleTestVoice = async () => {
    try {
      setIsLoading(true);
      setTestStatus("idle");

      // Stop any current audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const response = await fetch("/api/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: testText,
          voiceId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate voice");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
        setTestStatus("success");
        setTimeout(() => setTestStatus("idle"), 3000);
      });

      audio.addEventListener("error", () => {
        setIsPlaying(false);
        setTestStatus("error");
        toast({
          title: "Audio Error",
          description: "Failed to play voice sample",
          variant: "destructive",
        });
      });

      await audio.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Voice test error:", error);
      setIsLoading(false);
      setTestStatus("error");
      toast({
        title: "Voice Test Failed",
        description: "Unable to generate voice sample. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStopVoice = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }
  };

  return (
    <HolographicBorder color="purple" intensity="medium">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">Voice Preview</h3>
          </div>
          <AnimatePresence mode="wait">
            {testStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 text-green-400 text-xs"
              >
                <CheckCircle className="w-3 h-3" />
                <span>Voice OK</span>
              </motion.div>
            )}
            {testStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 text-red-400 text-xs"
              >
                <XCircle className="w-3 h-3" />
                <span>Failed</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Test Message */}
        <div className="bg-black/40 rounded-md p-3 font-mono text-xs text-gray-400">
          <span className="text-green-400">&gt;&gt; TEST_SAMPLE:</span>
          <p className="mt-1 text-gray-300">{testText}</p>
        </div>

        {/* Waveform Visualization */}
        <div className="relative h-12 bg-black/40 rounded-md overflow-hidden flex items-center justify-center gap-1 px-4">
          {isPlaying ? (
            Array.from({ length: 24 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1 bg-gradient-to-t from-purple-600 to-cyan-400 rounded-full"
                animate={{
                  height: ["20%", "80%", "20%"],
                }}
                transition={{
                  duration: 0.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: "easeInOut",
                }}
              />
            ))
          ) : (
            <span className="text-xs text-gray-600 font-mono">Audio waveform inactive</span>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          {!isPlaying ? (
            <Button
              onClick={handleTestVoice}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
              data-testid="button-test-voice"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Test Voice
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleStopVoice}
              variant="outline"
              className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
              data-testid="button-stop-voice"
            >
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
          )}
        </div>

        {/* Voice ID Info */}
        <div className="bg-black/20 rounded-md p-2 font-mono text-xs">
          <span className="text-gray-600">&gt;&gt; VOICE_ID:</span>{" "}
          <span className="text-cyan-400">{voiceId}</span>
        </div>
      </div>
    </HolographicBorder>
  );
}
