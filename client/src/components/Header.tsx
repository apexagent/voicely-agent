import { Home, Building2, Play, Mic, BookOpen, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import voicelyLogo from "@assets/Untitled design (11)_1762796118421.png";
import voicelyWaveformIcon from "@assets/IMAGE_2025-11-10_22_12_52-removebg-preview_(1)_1765378718896.png";

interface NavLink {
  path: string;
  icon: typeof Home;
  label: string;
}

export function Header() {
  const [location] = useLocation();

  const navLinks: NavLink[] = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/mobile/industries", icon: Building2, label: "Industries" },
    { path: "/mobile/agent", icon: Mic, label: "Agent" },
    { path: "/demo", icon: Play, label: "Demo" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location === "/";
    }
    return location === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Premium Glassmorphism Background */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-3xl border-b border-purple-500/30">
        {/* Multi-layer glow effects */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-60" />
        
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/8 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_bottom,rgba(139,92,246,0.08),transparent_70%)]" />
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Navigation Container */}
      <nav className="relative h-20 px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between h-full">
          {/* Left: Voicely Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center cursor-pointer"
              data-testid="link-home-logo"
            >
              <img 
                src={voicelyLogo} 
                alt="Voicely" 
                className="h-10 w-auto"
              />
            </motion.div>
          </Link>

          {/* Center/Right: Navigation Links - Hidden on mobile */}
          <div className="flex items-center gap-2 lg:gap-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);

              return (
                <Link key={link.path} href={link.path}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    className="hidden md:flex relative items-center gap-2.5 px-4 lg:px-5 py-2.5 rounded-xl transition-all duration-300"
                    data-testid={`nav-${link.label.toLowerCase()}`}
                  >
                    {/* Active indicator with elite glow */}
                    {active && (
                      <>
                        <motion.div
                          layoutId="activeDesktopNav"
                          className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-cyan-600/30 rounded-xl border border-purple-500/40"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          }}
                          style={{
                            boxShadow: "0 0 24px rgba(139,92,246,0.35), inset 0 0 16px rgba(139,92,246,0.1)",
                          }}
                        />
                        {/* Subtle pulsing glow */}
                        <motion.div
                          className="absolute inset-0 bg-purple-500/15 rounded-xl"
                          animate={{
                            opacity: [0.2, 0.4, 0.2],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </>
                    )}

                    <div className="relative z-10 flex items-center gap-2.5">
                      <Icon
                        className={`w-5 h-5 transition-all duration-300 ${
                          active 
                            ? "text-purple-300 drop-shadow-[0_0_6px_rgba(168,85,247,0.7)]" 
                            : "text-gray-500"
                        }`}
                      />
                      <span
                        className={`text-sm font-semibold transition-all duration-300 ${
                          active 
                            ? "text-gray-200 drop-shadow-[0_0_4px_rgba(255,255,255,0.4)]" 
                            : "text-gray-600"
                        }`}
                      >
                        {link.label}
                      </span>
                    </div>
                  </motion.button>
                </Link>
              );
            })}

            {/* Contact Only Platform - Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-br from-purple-600/20 via-violet-600/15 to-cyan-600/20 border border-purple-500/40 hover-elevate active-elevate-2 overflow-hidden group"
                  data-testid="button-menu"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-500/20 to-cyan-600/0 opacity-0 group-hover:opacity-100"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  
                  <div className="relative flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 flex items-center justify-center ring-2 ring-purple-500/50 ring-offset-2 ring-offset-black/50">
                      <img src={voicelyWaveformIcon} alt="Menu" className="w-5 h-5 object-contain" />
                    </div>
                    <span className="text-sm font-semibold text-gray-200">Menu</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-purple-300 relative" />
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-72 bg-gradient-to-br from-black via-[#0A0B1E] to-black backdrop-blur-2xl border border-purple-500/40 shadow-2xl overflow-hidden"
                style={{
                  boxShadow: "0 0 40px rgba(139,92,246,0.3), 0 20px 60px rgba(0,0,0,0.8)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-cyan-600/10 pointer-events-none" />
                
                {/* Contact Only Platform Menu */}
                <div className="py-2 px-2 space-y-1">
                  <DropdownMenuItem asChild>
                    <Link href="/mobile/contact" className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg hover:bg-purple-600/20 transition-all group" data-testid="menu-contact">
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600/30 to-pink-600/20 group-hover:from-purple-600/50 group-hover:to-pink-600/40 transition-all">
                        <Mic className="w-4 h-4 text-purple-300" />
                      </div>
                      <span className="font-medium text-gray-200 group-hover:text-white transition-colors">Talk to Alice</span>
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/docs" className="flex items-center gap-3 cursor-pointer px-3 py-2.5 rounded-lg hover:bg-violet-600/20 transition-all group" data-testid="menu-docs">
                      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-violet-600/30 to-purple-600/20 group-hover:from-violet-600/50 group-hover:to-purple-600/40 transition-all">
                        <BookOpen className="w-4 h-4 text-violet-300" />
                      </div>
                      <span className="font-medium text-gray-200 group-hover:text-white transition-colors">Documentation</span>
                    </Link>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </header>
  );
}
