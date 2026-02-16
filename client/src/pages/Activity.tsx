import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Phone,
  Clock,
  Bot,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  MessageSquare,
  Activity as ActivityIcon,
  Sparkles,
  Zap,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { VoiceSession } from "@shared/schema";
import { formatDistance } from "date-fns";

interface Activity {
  id: string;
  userId: string;
  agentId: string | null;
  type: string;
  action: string;
  amount: string | null;
  metadata: any;
  createdAt: Date;
}

export default function Activity() {
  // Fetch voice sessions
  const { data: sessionsData, isLoading: sessionsLoading } = useQuery<{
    success: boolean;
    sessions: VoiceSession[];
  }>({
    queryKey: ["/api/voice-sessions"],
  });

  // Fetch activities
  const { data: activitiesData, isLoading: activitiesLoading } = useQuery<{
    success: boolean;
    activities: Activity[];
  }>({
    queryKey: ["/api/activities"],
  });

  const sessions = sessionsData?.sessions || [];
  const activities = activitiesData?.activities || [];
  const isLoading = sessionsLoading || activitiesLoading;

  // Combine and sort recent sessions by date
  const recentSessions = [...sessions]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 10);

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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "call_completed":
        return Phone;
      case "tokens_earned":
        return Award;
      case "agent_deployed":
        return Sparkles;
      default:
        return ActivityIcon;
    }
  };

  // Calculate stats
  const totalSessions = sessions.length;
  const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const averageDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;

  return (
    <div className="min-h-screen bg-[#0A0B1E] relative overflow-hidden">
      {/* Background Effects */}
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
                  <ActivityIcon className="w-6 h-6 text-purple-400" />
                </div>
                <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  Activity Feed
                </h1>
              </div>
              <p className="text-gray-400 text-lg md:text-xl font-medium">
                Recent voice sessions and platform activity
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="p-6 bg-black/60 backdrop-blur-xl border-purple-500/20 hover-elevate">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-400/30 flex items-center justify-center">
                <Phone className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-sm text-gray-400 font-semibold">Total Sessions</span>
            </div>
            <div className="text-3xl font-black text-white" data-testid="stat-total-sessions">
              {totalSessions}
            </div>
          </Card>

          <Card className="p-6 bg-black/60 backdrop-blur-xl border-cyan-500/20 hover-elevate">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-sm text-gray-400 font-semibold">Avg Duration</span>
            </div>
            <div className="text-3xl font-black text-white" data-testid="stat-avg-duration">
              {averageDuration}s
            </div>
          </Card>

          <Card className="p-6 bg-black/60 backdrop-blur-xl border-green-500/20 hover-elevate">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 flex items-center justify-center">
                <Zap className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-sm text-gray-400 font-semibold">Recent Activity</span>
            </div>
            <div className="text-3xl font-black text-white" data-testid="stat-recent-count">
              {recentSessions.length}
            </div>
          </Card>
        </motion.div>

        {/* Recent Sessions Feed */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recentSessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-3xl p-12 text-center backdrop-blur-xl bg-black/40 border border-purple-500/20"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-400/30 flex items-center justify-center">
              <ActivityIcon className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Activity Yet</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Start using voice agents to see your activity feed populate with sessions and events.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              Recent Voice Sessions
            </h2>
            
            {recentSessions.map((session, index) => {
              const SentimentIcon = getSentimentIcon(session.sentimentScore);
              const sentimentBadgeClass = getSentimentBadgeClass(session.sentimentScore);

              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  data-testid={`activity-session-${session.id}`}
                >
                  <Card className="relative bg-black/60 backdrop-blur-xl border-purple-500/20 rounded-2xl p-5 hover-elevate overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5" />

                    <div className="relative">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <Avatar className="w-12 h-12 border-2 border-purple-400/30">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-violet-600 text-white">
                              <Bot className="w-6 h-6" />
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-base font-bold text-white truncate">
                                Voice Session
                              </h3>
                              <Badge className="text-xs bg-purple-500/20 text-purple-300 border-purple-400/30">
                                {session.agentId}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-gray-400 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {session.createdAt
                                  ? formatDistance(new Date(session.createdAt), new Date(), {
                                      addSuffix: true,
                                    })
                                  : "Unknown"}
                              </span>
                              {session.duration && session.duration > 0 && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {session.duration}s
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className={sentimentBadgeClass}>
                            <SentimentIcon className="w-3 h-3 mr-1" />
                            {getSentimentLabel(session.sentimentScore)}
                          </Badge>
                          <Badge
                            className={
                              session.status === "active"
                                ? "bg-green-500/20 text-green-400 border-green-400/30"
                                : session.status === "ended"
                                ? "bg-blue-500/20 text-blue-400 border-blue-400/30"
                                : "bg-gray-500/20 text-gray-400 border-gray-400/30"
                            }
                          >
                            {session.status}
                          </Badge>
                        </div>
                      </div>

                      {session.transcript && (
                        <div className="mt-4 p-3 bg-black/40 rounded-lg border border-purple-500/10">
                          <p className="text-sm text-gray-300 line-clamp-2">{session.transcript}</p>
                        </div>
                      )}
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
