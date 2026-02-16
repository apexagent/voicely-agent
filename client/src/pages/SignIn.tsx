import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Sparkles } from "lucide-react";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import voicelyLogo from "@assets/Untitled design (11)_1762790672251.png";

export default function SignIn() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Debug logging
  useEffect(() => {
    console.log('[SIGN-IN] Auth state:', {
      hasUser: !!user,
      isLoading,
      isAuthenticated,
      userEmail: user?.email,
    });
  }, [user, isLoading, isAuthenticated]);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (user && !isLoading) {
      console.log('[SIGN-IN] User authenticated, redirecting to My Agents...');
      setLocation("/my-agents");
    }
  }, [user, isLoading, setLocation]);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0">
        {/* Starfield */}
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-200/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Gradient Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <Link href="/">
            <div className="mb-8 text-gray-300 hover:text-purple-300 flex items-center gap-2 cursor-pointer" data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </div>
          </Link>

          {/* Sign In Card */}
          <div className="relative">
            {/* Card Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur-xl opacity-30" />
            
            <div className="relative bg-black/90 backdrop-blur-2xl border border-purple-500/30 rounded-2xl p-8">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <img src={voicelyLogo} alt="Voicely" className="h-10 w-auto" />
              </div>

              {/* Headline */}
              <div className="text-center mb-8">
                <h1 className="font-display text-3xl font-bold text-gray-200 mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-400 text-sm">Sign in to access your AI workforce</p>
              </div>

              {/* Dynamic.xyz Login Widget */}
              <div className="flex justify-center">
                <DynamicWidget data-testid="dynamic-login-widget" />
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600/10 border border-purple-500/20">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-gray-400">Auto-creates Solana wallet • Secure authentication</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
