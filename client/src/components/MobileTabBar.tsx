import { Home, Users, Play, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import voicelyWaveformIcon from "@assets/IMAGE_2025-11-10_22_12_52-removebg-preview_(1)_1765378718896.png";

interface TabConfig {
  path: string;
  icon: typeof Home;
  label: string;
}

export function MobileTabBar() {
  const [location] = useLocation();

  // Regular tabs (excluding Agent - it's the special center button)
  const leftTabs: TabConfig[] = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/mobile/industries", icon: Users, label: "Industries" },
  ];

  const rightTabs: TabConfig[] = [
    { path: "/demo", icon: Play, label: "Demo" },
    { path: "/mobile/contact", icon: User, label: "Contact" },
  ];

  const agentPath = "/mobile/agent";

  const isActive = (path: string) => {
    // Exact match for home - only active on root
    if (path === "/") {
      return location === "/";
    }
    // Exact match for other tabs (no sub-routes)
    return location === path;
  };

  const renderTab = (tab: TabConfig) => {
    const Icon = tab.icon;
    const active = isActive(tab.path);

    const buttonContent = (
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        className="relative flex flex-col items-center justify-center min-w-[68px] h-16 px-2 py-2 rounded-2xl transition-all duration-300"
        data-testid={`tab-${tab.label.toLowerCase()}`}
      >
        {/* Active indicator with elite glow */}
        {active && (
          <>
            <motion.div
              layoutId="activeMobileTab"
              className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-cyan-600/30 rounded-2xl border border-purple-500/40"
              initial={false}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
              style={{
                boxShadow: "0 0 30px rgba(139,92,246,0.4), inset 0 0 20px rgba(139,92,246,0.1)",
              }}
            />
            {/* Pulsing outer glow */}
            <motion.div
              className="absolute inset-0 bg-purple-500/20 rounded-2xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </>
        )}

        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div className={`relative ${active ? "scale-110" : ""} transition-transform`}>
            <Icon
              className={`w-6 h-6 transition-all duration-300 ${
                active 
                  ? "text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" 
                  : "text-gray-400"
              }`}
            />
            {/* Active icon glow */}
            {active && (
              <motion.div
                className="absolute inset-0 blur-md"
                animate={{
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Icon className="w-6 h-6 text-purple-400" />
              </motion.div>
            )}
          </div>
          <span
            className={`text-[11px] font-bold transition-all duration-300 ${
              active 
                ? "text-gray-200 drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]" 
                : "text-gray-400"
            }`}
          >
            {tab.label}
          </span>
        </div>
      </motion.button>
    );

    // All tabs are regular links now
    return (
      <Link key={tab.path} href={tab.path}>
        {buttonContent}
      </Link>
    );
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-5"
      style={{
        paddingBottom: "max(20px, env(safe-area-inset-bottom))",
      }}
    >
      {/* Multi-Layer Elite Glassmorphism Background */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl border-t border-purple-500/30">
        {/* Premium triple-glow top border */}
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/70 to-transparent" />
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent opacity-60" />
        
        {/* Radial gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 via-purple-900/5 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_top,rgba(139,92,246,0.08),transparent_70%)]" />
        
        {/* Subtle noise texture for premium feel */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Tab Container with Center Agent Button */}
      <div className="relative h-24 px-2 sm:px-4 flex items-center justify-between max-w-screen-sm mx-auto w-full">
        {/* Left Tabs */}
        <div className="flex items-center gap-0.5 sm:gap-1 flex-1 justify-start">
          {leftTabs.map(renderTab)}
        </div>

        {/* Center Special Agent Button - Fixed width container */}
        <div className="flex items-center justify-center" style={{ width: "80px", flexShrink: 0 }}>
          <Link href={agentPath}>
            <motion.button
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
              className="relative flex items-center justify-center"
              data-testid="tab-agent-center"
              style={{
                marginTop: "-20px",
              }}
            >
              {/* Gradient circle with waveform logo - matches Header menu button style */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 flex items-center justify-center ring-2 ring-purple-500/50 ring-offset-2 ring-offset-black/50 shadow-lg shadow-purple-500/30">
                <img src={voicelyWaveformIcon} alt="Agent" className="w-8 h-8 object-contain" />
              </div>
            </motion.button>
          </Link>
        </div>

        {/* Right Tabs */}
        <div className="flex items-center gap-0.5 sm:gap-1 flex-1 justify-end">
          {rightTabs.map(renderTab)}
        </div>
      </div>
    </nav>
  );
}
