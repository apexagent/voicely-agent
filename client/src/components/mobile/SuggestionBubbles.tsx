import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, DollarSign, Calendar, Zap } from "lucide-react";

interface Suggestion {
  id: string;
  text: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SuggestionBubblesProps {
  suggestions: Suggestion[];
  onSelect: (text: string) => void;
  isVisible: boolean;
}

export function SuggestionBubbles({ suggestions, onSelect, isVisible }: SuggestionBubblesProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full mb-4"
          data-testid="suggestion-bubbles-container"
        >
          <div className="flex flex-col gap-2">
            <p className="text-xs text-purple-300/70 font-medium px-1 mb-1">
              Try asking:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => onSelect(suggestion.text)}
                  className="group relative overflow-hidden rounded-xl p-3 text-left
                    bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10
                    backdrop-blur-xl border border-purple-500/20
                    hover-elevate active-elevate-2
                    transition-all duration-300"
                  data-testid={`suggestion-bubble-${suggestion.id}`}
                >
                  {/* Animated gradient border */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-cyan-500/30 blur-sm" />
                  </div>

                  {/* Content */}
                  <div className="relative flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 
                      flex items-center justify-center border border-purple-400/20">
                      <suggestion.icon className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                      {suggestion.text}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Voicely-specific suggestions
export const voicelySuggestions: Suggestion[] = [
  {
    id: "overview",
    text: "Give me the Voicely overview",
    icon: Sparkles,
  },
  {
    id: "pricing",
    text: "How does Voicely pricing work?",
    icon: DollarSign,
  },
  {
    id: "scheduling",
    text: "Show me scheduling automation",
    icon: Calendar,
  },
  {
    id: "integration",
    text: "Can Voicely integrate with my CRM?",
    icon: Zap,
  },
];
