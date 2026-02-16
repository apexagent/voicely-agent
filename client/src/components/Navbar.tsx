import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, Sparkles, Home, Users, Play, DollarSign, BookOpen, ArrowRight, FlaskConical, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import voicelyLogo from "@assets/Untitled design (11)_1762790672251.png";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/mobile/contact", label: "Contact", icon: Users },
    { href: "/demo", label: "Demo", icon: Play },
    { href: "/pricing", label: "Pricing", icon: DollarSign },
    { href: "/docs", label: "Docs", icon: BookOpen },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/90 border-b border-purple-500/30">
        {/* Subtle Purple Glow at Top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1 group relative z-10" data-testid="link-logo">
              <img 
                src={voicelyLogo} 
                alt="Voicely" 
                className="h-20 w-auto transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8 relative z-10">
              <Link 
                href="/" 
                className="text-sm font-semibold text-gray-300 hover:text-purple-300 transition-colors relative group" 
                data-testid="link-home"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link 
                href="/mobile/contact" 
                className="text-sm font-semibold text-gray-300 hover:text-purple-300 transition-colors relative group" 
                data-testid="link-contact"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link 
                href="/demo" 
                className="text-sm font-semibold text-gray-300 hover:text-purple-300 transition-colors relative group" 
                data-testid="link-demo"
              >
                Demo
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link 
                href="/pricing" 
                className="text-sm font-semibold text-gray-300 hover:text-purple-300 transition-colors relative group" 
                data-testid="link-pricing"
              >
                Pricing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 group-hover:w-full transition-all duration-300" />
              </Link>
              <Link 
                href="/docs" 
                className="text-sm font-semibold text-gray-300 hover:text-purple-300 transition-colors relative group" 
                data-testid="link-docs"
              >
                Docs
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-violet-500 group-hover:w-full transition-all duration-300" />
              </Link>
            </div>

            {/* CTA Buttons - Contact Only Platform */}
            <div className="hidden lg:flex items-center gap-4 relative z-10">
              {/* Talk to Alice Button */}
              <Link href="/mobile/contact">
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="ghost" 
                    className="relative overflow-hidden text-gray-200 border-2 border-purple-500/40 hover:border-cyan-400/60 font-bold px-6 py-5 bg-black/40 backdrop-blur-xl h-11"
                    data-testid="button-contact-alice"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Talk to Alice
                    </span>
                    
                    {/* Animated Border Gradient */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.3), transparent)",
                      }}
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                    
                    {/* Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10"
                      style={{
                        background: "radial-gradient(circle, rgba(139,92,246,0.8), rgba(6,182,212,0.4))",
                      }}
                    />
                  </Button>
                </motion.div>
              </Link>
              
              {/* INSANELY INTERACTIVE GET STARTED BUTTON */}
              <Link href="/get-started">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    className="relative overflow-hidden text-gray-100 font-black px-8 py-6 border-2 border-purple-400/60 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 h-11"
                    style={{
                      boxShadow: "0 0 60px rgba(139,92,246,1), 0 0 100px rgba(168,85,247,0.6)",
                      backgroundSize: "200% 100%",
                    }}
                    data-testid="button-getstarted"
                  >
                  <motion.span 
                    className="relative z-10 flex items-center gap-2 text-base"
                    animate={{
                      x: [0, 2, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    Get Started
                    <motion.div
                      animate={{
                        x: [0, 5, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </motion.span>
                  
                  {/* Animated Gradient Background */}
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                    style={{
                      background: "linear-gradient(90deg, #7c3aed, #a855f7, #06b6d4, #a855f7, #7c3aed)",
                      backgroundSize: "200% 100%",
                    }}
                  />
                  
                  {/* Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  />
                  
                  {/* Particles */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${10 + i * 12}%`,
                        top: "50%",
                      }}
                      animate={{
                        y: [-20, -40, -20],
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                  
                  {/* Mega Glow */}
                  <motion.div 
                    className="absolute inset-0 blur-2xl -z-10"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    style={{
                      background: "radial-gradient(circle, rgba(139,92,246,1), rgba(168,85,247,0.8), rgba(6,182,212,0.5))",
                    }}
                  />
                  </Button>
                </motion.div>
              </Link>
            </div>

            {/* Mobile Menu Button - Enhanced */}
            <motion.button
              className="lg:hidden relative z-10 w-12 h-12 rounded-xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-gray-200 hover:text-purple-300 hover:bg-purple-600/20 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
              whileTap={{ scale: 0.95 }}
              style={{
                boxShadow: mobileMenuOpen ? "0 0 30px rgba(139,92,246,0.5)" : "none",
              }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* PREMIUM MOBILE SIDE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-black/95 backdrop-blur-2xl border-l border-purple-500/30 z-50 lg:hidden overflow-y-auto"
              style={{
                boxShadow: "-20px 0 60px rgba(139,92,246,0.3)",
              }}
            >
              {/* Gradient Glow Background */}
              <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
                <div className="absolute top-1/4 -right-1/4 w-96 h-96 bg-purple-600/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-1/4 w-80 h-80 bg-violet-600/30 rounded-full blur-[100px]" />
              </div>

              <div className="relative z-10 p-8 h-full flex flex-col">
                {/* Header Section */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mb-8"
                >
                  {/* Welcome Card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-600/20 to-violet-600/10 border border-purple-500/30 backdrop-blur-xl mb-6"
                    style={{
                      boxShadow: "0 0 40px rgba(139,92,246,0.2)",
                    }}
                  >
                    <div className="text-lg font-bold text-gray-200 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      Welcome to Voicely
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                      Talk to Alice to learn about our custom AI voice agents for your business
                    </div>
                  </div>
                </motion.div>

                {/* Navigation Links */}
                <div className="flex-1 space-y-2 mb-8">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Navigation</div>
                  
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="group"
                        >
                          <motion.div
                            className="flex items-center justify-between p-4 rounded-xl bg-purple-600/5 hover:bg-purple-600/15 border border-transparent hover:border-purple-500/30 transition-all"
                            whileHover={{ x: 5 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/30 to-violet-600/20 border border-purple-500/30 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-purple-300" />
                              </div>
                              <span className="text-base font-semibold text-gray-200 group-hover:text-purple-300 transition-colors">
                                {item.label}
                              </span>
                            </div>
                            <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
                          </motion.div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* CTA Buttons - Contact Only Platform */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3 pt-6 border-t border-purple-500/20"
                >
                  <Link href="/mobile/contact" onClick={() => setMobileMenuOpen(false)}>
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <Button 
                        size="lg"
                        className="w-full bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 hover:from-purple-500 hover:via-violet-500 hover:to-purple-500 text-white font-black relative overflow-hidden"
                        style={{
                          boxShadow: "0 0 50px rgba(139,92,246,0.7), inset 0 0 20px rgba(255,255,255,0.1)",
                        }}
                        data-testid="button-mobile-contact"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Talk to Alice
                          <ArrowRight className="w-5 h-5" />
                        </span>
                        {/* Animated Shine */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                          animate={{
                            x: ["-200%", "200%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatDelay: 1,
                          }}
                        />
                      </Button>
                    </motion.div>
                  </Link>
                  
                  <Link href="/get-started" onClick={() => setMobileMenuOpen(false)}>
                    <Button 
                      variant="ghost" 
                      size="lg"
                      className="w-full text-gray-300 hover:text-gray-200 border-2 border-purple-500/30 hover:border-purple-400/50 hover:bg-purple-600/10 transition-all font-bold"
                      data-testid="button-mobile-getstarted"
                    >
                      <Rocket className="w-5 h-5 mr-2" />
                      Get Started
                    </Button>
                  </Link>

                  {/* Trust Badge */}
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div 
                          key={i}
                          className="w-8 h-8 rounded-full border-2 border-black bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold"
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-gray-400">
                      <span className="font-bold text-purple-400">1,000+</span> teams trust us
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Glow Accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-violet-500 to-purple-600" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
