import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import Card3D from "./Card3D";

interface AgentCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export default function AgentCard({ icon: Icon, title, description, index }: AgentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <Card3D intensity={10}>
        <Card className="relative overflow-hidden border-2 border-purple-500/20 backdrop-blur-xl bg-black/60 hover-elevate group h-full" data-testid={`card-agent-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-violet-600/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="absolute -inset-[1px] bg-gradient-to-br from-purple-600/0 via-purple-600/0 to-purple-600/0 group-hover:from-purple-600/50 group-hover:via-violet-600/30 group-hover:to-purple-600/50 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10" />
          
          <CardHeader className="space-y-6 p-8">
            <motion.div 
              className="relative inline-block"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-500 blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center glow-purple group-hover:glow-purple-intense transition-all">
                <Icon className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-display text-white">{title}</CardTitle>
              <CardDescription className="text-base text-gray-400 leading-relaxed">
                {description}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </Card3D>
    </motion.div>
  );
}
