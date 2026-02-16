import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface NeonFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export default function NeonFeatureCard({ icon: Icon, title, description, index }: NeonFeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative group"
      data-testid={`card-feature-${index + 1}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-chart-2/20 blur-2xl rounded-full group-hover:blur-3xl transition-all" />
      
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 to-chart-2/30 blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
        
        <div className="relative w-48 h-48 rounded-full border-4 border-primary/30 bg-background/50 backdrop-blur-xl flex flex-col items-center justify-center p-6 group-hover:border-primary/50 transition-all shadow-glow-violet group-hover:shadow-glow-violet-intense">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center mb-4 shadow-glow-violet">
            <Icon className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="font-display font-bold text-lg text-center mb-2">{title}</h3>
          <p className="text-sm text-foreground/60 text-center leading-snug">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
