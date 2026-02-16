import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface AgentHeroPanelProps {
  portrait: string;
  video?: string;
  name: string;
  role: string;
  description: string;
  gradient: string;
  isOnline: boolean;
  isReady: boolean;
}

export function AgentHeroPanel({
  portrait,
  video,
  name,
  role,
  description,
  gradient,
  isOnline,
  isReady,
}: AgentHeroPanelProps) {
  return (
    <div className="space-y-4">
      {/* Agent Portrait */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/40 to-black/80">
        <div className="relative h-72">
          {video ? (
            <video
              src={video}
              poster={portrait}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={portrait}
              alt={name}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Online Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-green-600/80 border-green-500/50 text-white font-semibold backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse" />
              ONLINE
            </Badge>
          </div>
        </div>
      </div>

      {/* Agent Info Card */}
      <div className={`bg-gradient-to-r ${gradient} rounded-xl p-4`}>
        <h3 className="text-xl font-bold text-white mb-1">
          Voicely {role}
        </h3>
        <p className="text-white/90 text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
