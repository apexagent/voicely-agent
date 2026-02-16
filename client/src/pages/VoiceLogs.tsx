import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Play,
  Clock,
  User,
  Bot,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { VoiceSession } from "@shared/schema";
import { formatDistance } from "date-fns";

// Simple waveform generator - creates a visual representation
function generateWaveformPath(width: number, height: number): string {
  const points = 30;
  const amplitude = height / 2;
  const centerY = height / 2;
  
  let path = `M 0 ${centerY}`;
  for (let i = 0; i <= points; i++) {
    const x = (i / points) * width;
    const variance = Math.sin(i * 0.5) * Math.cos(i * 0.3) * amplitude;
    const y = centerY + variance;
    path += ` L ${x} ${y}`;
  }
  return path;
}

export default function VoiceLogs() {
  // Fetch voice sessions
  const { data: sessionsData, isLoading } = useQuery<{ success: boolean; sessions: VoiceSession[] }>({
    queryKey: ["/api/voice-sessions"],
  });

  const sessions = sessionsData?.sessions || [];

  const getSentimentBadgeClass = (score: number | null): string => {
    if (score === null) return "bg-gray-500/20 text-gray-400 border-gray-400/30";
    if (score > 0.3) return "bg-green-500/20 text-green-400 border-green-400/30";
    if (score < -0.3) return "bg-red-500/20 text-red-400 border-red-400/30";
    return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30";
  };

  const getSentimentLabel = (score: number | null): string => {
    if (score === null) return "Neutral";
    if (score > 0.3) return "Positive";
    if (score < -0.3) return "Negative";
    return "Neutral";
  };

  const getSentimentIcon = (score: number | null) => {
    if (score === null) return Minus;
    if (score > 0.3) return TrendingUp;
    if (score < -0.3) return TrendingDown;
    return Minus;
  };

  return (
    <div className="min-h-screen bg-[#0A0B1E] relative overflow-hidden">
      {/* Cinematic Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
                         radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative rounded-3xl p-8 overflow-hidden backdrop-blur-xl bg-black/40 border border-purple-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />

            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-400/30 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-purple-400" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Voice Logs
                </h1>
              </div>
              <p className="text-gray-400 text-lg md:text-xl font-medium">
                Review and analyze your AI voice conversations
              </p>
            </div>
          </div>
        </motion.div>

        {/* Voice Session Timeline */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-3xl p-12 text-center backdrop-blur-xl bg-black/40 border border-purple-500/20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-400/30 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Voice Logs Yet</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Start testing your AI agents to see conversation logs and analytics here.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, index) => {
              const SentimentIcon = getSentimentIcon(session.sentimentScore);
              const sentimentBadgeClass = getSentimentBadgeClass(session.sentimentScore);
              
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  data-testid={`session-card-${session.id}`}
                >
                  <Card className="relative bg-black/60 backdrop-blur-xl border-purple-500/20 rounded-2xl p-6 hover-elevate overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5" />
                    
                    <div className="relative">
                      {/* Session Header */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12 border-2 border-purple-400/30">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white">
                              <Bot className="w-6 h-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-bold text-white">Voice Session #{session.id.substring(0, 8)}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{session.createdAt ? formatDistance(new Date(session.createdAt), new Date(), { addSuffix: true }) : 'Unknown'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge className={sentimentBadgeClass}>
                            <SentimentIcon className="w-3 h-3 mr-1" />
                            {getSentimentLabel(session.sentimentScore)}
                          </Badge>
                          <Badge className={
                            session.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-400/30' :
                            session.status === 'ended' ? 'bg-blue-500/20 text-blue-400 border-blue-400/30' :
                            'bg-gray-500/20 text-gray-400 border-gray-400/30'
                          }>
                            {session.status}
                          </Badge>
                        </div>
                      </div>

                      {/* Waveform Visualization */}
                      <div className="mb-6">
                        <svg width="100%" height="80" className="bg-black/40 rounded-xl border border-purple-500/10">
                          <path
                            d={generateWaveformPath(800, 80)}
                            fill="none"
                            stroke="url(#waveGradient)"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                          />
                          <defs>
                            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#A855F7" />
                              <stop offset="50%" stopColor="#8B5CF6" />
                              <stop offset="100%" stopColor="#06B6D4" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>

                      {/* Session Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                        <div className="bg-black/40 rounded-xl p-3 border border-purple-500/10">
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                            <Clock className="w-3 h-3" />
                            <span className="font-mono">DURATION</span>
                          </div>
                          <div className="text-lg font-bold text-white font-mono">
                            {Math.floor((session.duration || 0) / 60)}:{((session.duration || 0) % 60).toString().padStart(2, '0')}
                          </div>
                        </div>
                        
                        <div className="bg-black/40 rounded-xl p-3 border border-cyan-500/10">
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                            <User className="w-3 h-3" />
                            <span className="font-mono">TOKENS</span>
                          </div>
                          <div className="text-lg font-bold text-cyan-400 font-mono">
                            {session.tokensUsed || 0}
                          </div>
                        </div>

                        <div className="bg-black/40 rounded-xl p-3 border border-violet-500/10">
                          <div className="text-xs text-gray-500 mb-1 font-mono">STATUS</div>
                          <div className="text-lg font-bold text-violet-400 capitalize font-mono">
                            {session.status}
                          </div>
                        </div>

                        <div className="bg-black/40 rounded-xl p-3 border border-green-500/10">
                          <div className="text-xs text-gray-500 mb-1 font-mono">SENTIMENT</div>
                          <div className="text-lg font-bold text-green-400 font-mono">
                            {session.sentimentScore !== null ? `${(session.sentimentScore * 100).toFixed(0)}%` : 'N/A'}
                          </div>
                        </div>
                      </div>

                      {/* Transcript Snippet */}
                      {session.transcript && (
                        <div className="bg-black/40 rounded-xl p-4 border border-purple-500/10 mb-4">
                          <div className="text-xs text-gray-500 mb-2 font-mono">TRANSCRIPT</div>
                          <p className="text-sm text-gray-300 line-clamp-3">
                            {session.transcript}
                          </p>
                        </div>
                      )}

                      {/* Playback Controls */}
                      <div className="flex gap-2">
                        {session.audioUrl ? (
                          <Button
                            variant="outline"
                            className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                            data-testid={`button-play-${session.id}`}
                          >
                            <Play className="w-4 h-4 mr-2 fill-purple-400" />
                            Play Recording
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="border-gray-500/30 text-gray-400 cursor-not-allowed"
                            disabled
                          >
                            <Play className="w-4 h-4 mr-2" />
                            No Recording
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
