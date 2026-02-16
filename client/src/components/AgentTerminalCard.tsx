import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, TrendingUp, Clock, DollarSign } from "lucide-react";
import type { Agent } from "@shared/schema";

interface AgentTerminalCardProps {
  agent: Agent;
  onClick?: () => void;
}

export default function AgentTerminalCard({ agent, onClick }: AgentTerminalCardProps) {
  const statusColors: Record<string, { border: string; bg: string; text: string; shadow: string }> = {
    active: { border: "border-green-500/30", bg: "bg-green-500/10", text: "text-green-400", shadow: "rgba(34,197,94,0.2)" },
    idle: { border: "border-yellow-500/30", bg: "bg-yellow-500/10", text: "text-yellow-400", shadow: "rgba(234,179,8,0.2)" },
    training: { border: "border-cyan-500/30", bg: "bg-cyan-500/10", text: "text-cyan-400", shadow: "rgba(6,182,212,0.2)" },
    offline: { border: "border-gray-500/30", bg: "bg-gray-500/10", text: "text-gray-400", shadow: "rgba(107,114,128,0.2)" },
  };

  const colors = statusColors[agent.status] || statusColors.offline;
  const revenue = agent.revenue ? (agent.revenue / 100).toFixed(2) : "0.00";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`border-2 ${colors.border} rounded-lg overflow-hidden cursor-pointer hover-elevate active-elevate-2`}
      style={{
        boxShadow: `0 0 20px ${colors.shadow}, inset 0 0 15px ${colors.shadow}`
      }}
      onClick={onClick}
      data-testid={`agent-card-${agent.id}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b-2 border-cyan-500/20 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-violet-600 p-0.5">
                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                  <span className="text-sm font-bold text-cyan-400">
                    {agent.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              {agent.status === "active" && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-gray-900 animate-pulse" />
              )}
            </div>

            {/* Title */}
            <div>
              <h3 className="text-cyan-400 font-bold text-sm tracking-wider uppercase" data-testid={`agent-name-${agent.id}`}>
                {agent.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge className={`${colors.bg} ${colors.text} border-${agent.status === 'active' ? 'green' : agent.status === 'idle' ? 'yellow' : 'gray'}-500/50 text-xs`}>
                  ● {agent.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </div>

          {/* Status Dots */}
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-violet-500"></div>
          </div>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="bg-black/90 backdrop-blur-sm p-4">
        {/* System Log */}
        <div className="font-mono text-xs space-y-1 mb-4">
          <div className="text-green-400">
            <span className="text-gray-600">&gt;&gt;</span> SYS{" "}
            <span className="text-gray-600">
              {new Date().toLocaleTimeString('en-US', { hour12: false })}
            </span>
          </div>
          <div className="text-cyan-300 text-[10px]">
            {agent.name.toUpperCase()} CORE v2.0 | {agent.personality?.slice(0, 40) || "AI ENGINE"} | VOICE READY
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-gray-900/50 border border-purple-500/20 rounded p-2">
            <div className="flex items-center gap-1 mb-1">
              <Phone className="w-3 h-3 text-purple-300" />
              <span className="text-gray-400 text-xs">Calls</span>
            </div>
            <p className="text-gray-200 font-bold text-sm" data-testid={`agent-calls-${agent.id}`}>
              {agent.callsHandled}
            </p>
          </div>

          <div className="bg-gray-900/50 border border-cyan-500/20 rounded p-2">
            <div className="flex items-center gap-1 mb-1">
              <TrendingUp className="w-3 h-3 text-cyan-300" />
              <span className="text-gray-400 text-xs">Success</span>
            </div>
            <p className="text-gray-200 font-bold text-sm" data-testid={`agent-success-${agent.id}`}>
              {agent.successRate !== null && agent.successRate !== undefined ? `${agent.successRate}%` : "N/A"}
            </p>
          </div>

          <div className="bg-gray-900/50 border border-green-500/20 rounded p-2">
            <div className="flex items-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-green-300" />
              <span className="text-gray-400 text-xs">Response</span>
            </div>
            <p className="text-gray-200 font-bold text-sm" data-testid={`agent-response-${agent.id}`}>
              {agent.avgResponseTime !== null && agent.avgResponseTime !== undefined ? `${agent.avgResponseTime.toFixed(1)}s` : "N/A"}
            </p>
          </div>

          <div className="bg-gray-900/50 border border-violet-500/20 rounded p-2">
            <div className="flex items-center gap-1 mb-1">
              <DollarSign className="w-3 h-3 text-violet-300" />
              <span className="text-gray-400 text-xs">Revenue</span>
            </div>
            <p className="text-gray-200 font-bold text-sm" data-testid={`agent-revenue-${agent.id}`}>
              ${revenue}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border-purple-500/30 text-purple-300 hover:from-purple-500/20 hover:to-violet-500/20 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Open chat interface
            }}
            data-testid={`button-chat-${agent.id}`}
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            Chat
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30 text-cyan-300 hover:from-cyan-500/20 hover:to-blue-500/20 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Initiate call
            }}
            data-testid={`button-call-${agent.id}`}
          >
            <Phone className="w-3 h-3 mr-1" />
            Call
          </Button>
        </div>

        {/* Terminal Footer Log */}
        <div className="font-mono text-xs mt-3 pt-3 border-t border-gray-800">
          <div className="text-gray-600">
            <span className="text-gray-700">&gt;&gt;</span> STATUS{" "}
            <span className={colors.text}>
              {agent.status === "active" ? "READY FOR CALLS" : agent.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
