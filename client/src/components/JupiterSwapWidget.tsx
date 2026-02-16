import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft, Zap, Shield, TrendingUp, ExternalLink, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Jupiter Terminal TypeScript interface
declare global {
  interface Window {
    Jupiter: {
      init(config: JupiterInitConfig): Promise<void>;
      syncProps(props: { passthroughWalletContextState: any }): void;
      close(): void;
      resume(): void;
    };
  }
}

interface JupiterInitConfig {
  displayMode?: 'modal' | 'integrated' | 'widget';
  integratedTargetId?: string;
  endpoint?: string;
  strictTokenList?: boolean;
  defaultExplorer?: 'Solana Explorer' | 'Solscan' | 'Solana Beach' | 'SolanaFM';
  formProps?: {
    swapMode?: 'ExactInOrOut' | 'ExactIn' | 'ExactOut';
    initialInputMint?: string;
    initialOutputMint?: string;
    initialAmount?: string;
    fixedInputMint?: boolean;
    fixedOutputMint?: boolean;
    fixedAmount?: boolean;
  };
  onSuccess?: (result: { txid: string; swapResult: any }) => void;
  onSwapError?: (error: { error: any }) => void;
  containerStyles?: React.CSSProperties;
  containerClassName?: string;
}

interface JupiterSwapWidgetProps {
  theme?: 'light' | 'dark';
}

export default function JupiterSwapWidget({ theme = 'dark' }: JupiterSwapWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerId = 'jupiter-terminal-voicely';
  const initialized = useRef(false);
  const [isLoading, setIsLoading] = useState(true); // Start loading immediately
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [terminalReady, setTerminalReady] = useState(false);

  const initJupiterTerminal = async () => {
    // Prevent double initialization
    if (initialized.current) return;
    
    setIsLoading(true);
    setLoadingProgress(0);
    
    // Simulated loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);
    
    try {
      // Wait for window.Jupiter to be available (up to 15 seconds)
      let attempts = 0;
      const maxAttempts = 150; // 15 seconds at 100ms intervals
      
      while (!window.Jupiter && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (!window.Jupiter) {
        console.error('Jupiter Terminal script failed to load after 15 seconds');
        console.error('Please check if the script is blocked or the CDN is accessible');
        setIsLoading(false);
        clearInterval(progressInterval);
        return;
      }
      
      console.log('Jupiter Terminal script loaded successfully');

      await window.Jupiter.init({
        displayMode: 'integrated',
        integratedTargetId: containerId,
        // Using reliable Helius public RPC endpoint for better performance
        endpoint: 'https://mainnet.helius-rpc.com/?api-key=f66fbdf1-3faa-4a24-83bb-edafda342dfb',
        strictTokenList: true, // Only show validated tokens
        defaultExplorer: 'Solscan',
        formProps: {
          swapMode: 'ExactInOrOut',
          // Default: SOL -> USDC swap
          initialInputMint: 'So11111111111111111111111111111111111111112', // SOL (wrapped)
          initialOutputMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
          fixedInputMint: false,
          fixedOutputMint: false,
        },
        onSuccess: ({ txid }) => {
          console.log('Swap successful! Transaction:', txid);
        },
        onSwapError: ({ error }) => {
          console.error('Swap failed:', error);
        },
        containerStyles: {
          maxHeight: '90vh',
          borderRadius: '24px',
        },
        containerClassName: theme === 'dark' ? 'jupiter-terminal-dark' : 'jupiter-terminal-light',
      });

      initialized.current = true;
      setTerminalReady(true); // Terminal is ready - users can now connect wallet through Jupiter UI
      setLoadingProgress(100);
      setTimeout(() => setIsLoading(false), 500);
    } catch (error) {
      console.error('Error initializing Jupiter Terminal:', error);
      setIsLoading(false);
      clearInterval(progressInterval);
    }
  };

  // Auto-initialize on mount (no button click required)
  useEffect(() => {
    initJupiterTerminal();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.Jupiter?.close) {
        try {
          window.Jupiter.close();
        } catch (error) {
          console.error('Error closing Jupiter Terminal:', error);
        }
      }
    };
  }, []);

  return (
    <div className="w-full space-y-4">
      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-br from-purple-900/30 via-black/40 to-cyan-900/30 border border-purple-500/30 backdrop-blur-xl"
      >
        <div className="flex items-center gap-4">
          <motion.div
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 via-violet-600 to-cyan-600 flex items-center justify-center shadow-xl"
            style={{
              boxShadow: "0 0 40px rgba(139,92,246,0.6)",
            }}
            animate={{
              boxShadow: [
                "0 0 40px rgba(139,92,246,0.6)",
                "0 0 60px rgba(6,182,212,0.6)",
                "0 0 40px rgba(139,92,246,0.6)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ArrowRightLeft className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Token Swap Terminal
            </h3>
            <p className="text-sm text-gray-400">Powered by Jupiter Aggregator</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30 hover-elevate">
            <Zap className="w-3 h-3 mr-1" />
            Best Rates
          </Badge>
          <Badge className="bg-cyan-600/20 text-cyan-300 border-cyan-500/30 hover-elevate">
            <Shield className="w-3 h-3 mr-1" />
            Secure
          </Badge>
          <Badge className="bg-green-600/20 text-green-300 border-green-500/30 hover-elevate">
            <TrendingUp className="w-3 h-3 mr-1" />
            Smart Routing
          </Badge>
        </div>
      </motion.div>

      {/* Premium Swap Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(6,182,212,0.1) 100%)",
        }}
      >
        {/* Glassmorphism Border Effect */}
        <div className="absolute inset-0 rounded-3xl border-2 border-purple-500/30 pointer-events-none" />
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-600/10 via-transparent to-cyan-600/10 pointer-events-none" />

        {/* Animated Glow Effect */}
        <motion.div
          className="absolute inset-0 opacity-30 pointer-events-none"
          animate={{
            background: [
              "radial-gradient(circle at 0% 0%, rgba(139,92,246,0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, rgba(6,182,212,0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 0% 0%, rgba(139,92,246,0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Main Content */}
        <div className="relative bg-black/60 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl">
          {/* Jupiter Terminal Container - Always visible (loads immediately) */}
          <div
            id={containerId}
            ref={containerRef}
            className="w-full min-h-[600px] rounded-2xl overflow-hidden"
            data-testid="jupiter-swap-widget"
            style={{
              opacity: terminalReady ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          />

          {/* Loading Overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/90 backdrop-blur-sm rounded-3xl"
              >
                <div className="text-center space-y-6 p-8">
                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-600 via-violet-600 to-cyan-600 flex items-center justify-center shadow-2xl"
                    style={{
                      boxShadow: "0 0 60px rgba(139,92,246,0.8)",
                    }}
                  >
                    <ArrowRightLeft className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <div className="space-y-3">
                    <h4 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                      Loading Swap Terminal
                    </h4>
                    <p className="text-sm text-gray-400">Preparing Jupiter Aggregator...</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-600"
                      initial={{ width: "0%" }}
                      animate={{ width: `${loadingProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Shield className="w-3 h-3" />
                    <span>Secure Solana Connection</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Info Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-black/40 border border-purple-500/20 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Shield className="w-4 h-4 text-purple-400" />
          <span>Smart routing across all Solana DEXs for best prices</span>
        </div>
        <a
          href="https://jup.ag"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors hover-elevate px-3 py-1.5 rounded-lg"
        >
          <span>Learn about Jupiter</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </motion.div>
    </div>
  );
}
