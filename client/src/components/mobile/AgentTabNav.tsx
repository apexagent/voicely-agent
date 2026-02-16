import { motion } from "framer-motion";
import { TrendingUp, Phone, Clock, UserPlus } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface AgentTab {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface AgentTabNavProps {
  tabs: AgentTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function AgentTabNav({ tabs, activeTab, onTabChange }: AgentTabNavProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" data-testid="agent-tab-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative px-4 py-3 rounded-xl font-semibold text-sm whitespace-nowrap
              flex items-center gap-2 transition-all duration-300
              ${isActive
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/80 hover:text-gray-200'
              }
            `}
            data-testid={`tab-${tab.id}`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.name}</span>
            
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
