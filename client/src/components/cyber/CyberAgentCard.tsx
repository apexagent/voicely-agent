import { motion } from "framer-motion";
import { HolographicBorder } from "./HolographicBorder";
import { Bot, Phone, MessageSquare, TrendingUp, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Agent } from "@shared/schema";

interface CyberAgentCardProps {
  agent: Agent;
  onTalk?: () => void;
  onChat?: () => void;
  className?: string;
}

const statusColors = {
  active: "green",
  idle: "cyan",
  training: "orange",
  offline: "pink",
} as const;

const typeIcons = {
  sales: TrendingUp,
  support: MessageSquare,
  scheduling: Clock,
  outbound: Phone,
};

export function CyberAgentCard({ agent, onTalk, onChat, className = "" }: CyberAgentCardProps) {
  const borderColor = (agent.status === "active" ? "cyan" : "purple") as "cyan" | "purple";
  const StatusIcon = typeIcons[agent.type as keyof typeof typeIcons] || Bot;

  return (
    <HolographicBorder 
      color={borderColor} 
      intensity="high" 
      className={className}
    >
      <div className="p-6 space-y-4">
        {/* Header with Avatar */}
        <div className="flex items-start gap-4">
          <motion.div
            className="relative w-20 h-20 rounded-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {agent.avatarUrl && agent.avatarUrl.startsWith('@assets/') ? (
              <img 
                src={agent.avatarUrl.replace('@assets/', '/attached_assets/')} 
                alt={agent.name}
                className="w-full h-full object-cover"
                style={{
                  filter: "brightness(1.1) contrast(1.1)",
                }}
              />
            ) : agent.avatarUrl ? (
              <img 
                src={agent.avatarUrl} 
                alt={agent.name}
                className="w-full h-full object-cover"
                style={{
                  filter: "brightness(1.1) contrast(1.1)",
                }}
              />
            ) : (
              <div 
                className="w-full h-full flex items-center justify-center bg-gradient-to-br"
                style={{
                  background: `linear-gradient(135deg, ${agent.primaryColor}40, ${agent.secondaryColor}40)`,
                }}
              >
                <StatusIcon className="w-10 h-10 text-white" />
              </div>
            )}
            
            {/* Holographic overlay */}
            <div 
              className="absolute inset-0 opacity-30 mix-blend-overlay"
              style={{
                background: `linear-gradient(45deg, ${agent.primaryColor}, ${agent.secondaryColor})`,
              }}
            />
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xl font-bold text-white truncate">
                {agent.name}
              </h3>
              <Badge 
                variant="outline"
                className="text-xs"
                style={{
                  borderColor: agent.primaryColor || "#8B5CF6",
                  color: agent.primaryColor || "#8B5CF6",
                }}
              >
                {agent.type}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: statusColors[agent.status as keyof typeof statusColors] === "green" 
                    ? "#10B981" 
                    : statusColors[agent.status as keyof typeof statusColors] === "cyan"
                    ? "#06B6D4"
                    : statusColors[agent.status as keyof typeof statusColors] === "orange"
                    ? "#F59E0B"
                    : "#EC4899",
                  boxShadow: `0 0 8px currentColor`,
                }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <span className="text-sm text-gray-400 capitalize">
                {agent.status}
              </span>
            </div>
          </div>
        </div>

        {/* System Log */}
        <div className="bg-black/40 rounded-md p-3 font-mono text-xs space-y-1">
          <div className="text-green-400">&gt;&gt; SYS: Agent initialized</div>
          <div className="text-green-400">&gt;&gt; VOICE_ID: {agent.voiceId}</div>
          <div className="text-green-400">&gt;&gt; STATUS: {agent.status.toUpperCase()}</div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/20 rounded-md p-3 space-y-1">
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Phone className="w-3 h-3" />
              <span>Calls</span>
            </div>
            <div className="text-lg font-bold text-white">
              {agent.callsHandled?.toLocaleString() ?? 0}
            </div>
          </div>

          <div className="bg-black/20 rounded-md p-3 space-y-1">
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>Success</span>
            </div>
            <div className="text-lg font-bold text-cyan-400">
              {agent.successRate?.toFixed(1) ?? 0}%
            </div>
          </div>

          <div className="bg-black/20 rounded-md p-3 space-y-1">
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Clock className="w-3 h-3" />
              <span>Response</span>
            </div>
            <div className="text-lg font-bold text-purple-400">
              {agent.avgResponseTime?.toFixed(1) ?? 0}s
            </div>
          </div>

          <div className="bg-black/20 rounded-md p-3 space-y-1">
            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <DollarSign className="w-3 h-3" />
              <span>Revenue</span>
            </div>
            <div className="text-lg font-bold text-green-400">
              ${((agent.revenue ?? 0) / 100).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="bg-black/40 rounded-md p-2 font-mono text-xs text-green-400 flex items-center justify-between">
          <span>&gt; Ready for deployment</span>
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-green-400 animate-pulse" />
            <div className="w-1 h-3 bg-green-400 animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-1 h-3 bg-green-400 animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          {onChat && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onChat}
              data-testid={`button-chat-${agent.name.toLowerCase()}`}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </Button>
          )}
          {onTalk && (
            <Button
              size="sm"
              className="flex-1"
              onClick={onTalk}
              style={{
                background: `linear-gradient(135deg, ${agent.primaryColor}, ${agent.secondaryColor})`,
              }}
              data-testid={`button-talk-${agent.name.toLowerCase()}`}
            >
              <Phone className="w-4 h-4 mr-2" />
              Talk Now
            </Button>
          )}
        </div>
      </div>
    </HolographicBorder>
  );
}
