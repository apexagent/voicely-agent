import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useAuth } from "@/hooks/useAuth";
import { 
  Wallet as WalletIcon, 
  Copy, 
  Send, 
  Download, 
  ExternalLink,
  ArrowDownToLine,
  Key,
  Shield,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Wallet() {
  const { user } = useAuth();
  const { primaryWallet, setShowDynamicUserProfile } = useDynamicContext();
  const { toast } = useToast();
  const [balance, setBalance] = useState<string>("0");
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [balanceError, setBalanceError] = useState<string | null>(null);

  // Fetch SOL balance
  useEffect(() => {
    async function fetchBalance() {
      if (!primaryWallet?.address) {
        setIsLoadingBalance(false);
        return;
      }

      try {
        setIsLoadingBalance(true);
        setBalanceError(null);
        
        // Use reliable Helius RPC endpoint (same as Jupiter widget)
        const response = await fetch('https://mainnet.helius-rpc.com/?api-key=f66fbdf1-3faa-4a24-83bb-edafda342dfb', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getBalance',
            params: [primaryWallet.address]
          })
        });

        // Check if HTTP request was successful
        if (!response.ok) {
          throw new Error(`RPC request failed: ${response.status}`);
        }

        const data = await response.json();
        
        // Check for RPC-level errors
        if (data.error) {
          throw new Error(data.error.message || 'RPC returned an error');
        }

        // Verify we got a valid result
        if (data.result?.value !== undefined) {
          // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
          const solBalance = (data.result.value / 1_000_000_000).toFixed(4);
          setBalance(solBalance);
        } else {
          throw new Error('Invalid response format from RPC');
        }
      } catch (error: any) {
        console.error('[WALLET] Failed to fetch balance:', error);
        setBalanceError(error.message || 'Unknown error');
        toast({
          title: "Failed to fetch balance",
          description: error.message || "Could not connect to Solana network",
          variant: "destructive",
        });
      } finally {
        setIsLoadingBalance(false);
      }
    }

    fetchBalance();
    // Refresh balance every 30 seconds
    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [primaryWallet?.address, toast]);

  const copyAddress = () => {
    if (primaryWallet?.address) {
      navigator.clipboard.writeText(primaryWallet.address);
      toast({
        title: "Address copied!",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const shortenAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const openDynamicProfile = () => {
    setShowDynamicUserProfile(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0B1E] flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <Shield className="w-16 h-16 mx-auto mb-4 text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-200 mb-2">Sign In Required</h2>
          <p className="text-gray-400">Please sign in to access your wallet</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B1E] relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl font-bold text-gray-200 mb-2 flex items-center gap-3">
            <WalletIcon className="w-10 h-10 text-purple-400" />
            My Wallet
          </h1>
          <p className="text-gray-400">Manage your Solana wallet and assets</p>
        </motion.div>

        {/* Main Wallet Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden mb-6">
            {/* Card Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur-xl opacity-20" />
            
            <div className="relative bg-black/90 backdrop-blur-2xl border border-purple-500/30 rounded-2xl p-8">
              {/* Balance Section */}
              <div className="text-center mb-8">
                <p className="text-sm text-gray-400 mb-2">Total Balance</p>
                <div className="font-display text-6xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {isLoadingBalance ? (
                    <span className="animate-pulse">...</span>
                  ) : balanceError ? (
                    <span className="text-red-400 text-2xl">Error</span>
                  ) : (
                    <>{balance} SOL</>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {isLoadingBalance ? "Fetching..." : balanceError ? balanceError : "≈ $" + (parseFloat(balance) * 100).toFixed(2) + " USD"}
                </p>
              </div>

              {/* Wallet Address */}
              <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-4 mb-6">
                <p className="text-xs text-gray-400 mb-2">Wallet Address</p>
                <div className="flex items-center gap-3">
                  <code className="flex-1 font-mono text-gray-200 text-sm break-all">
                    {primaryWallet?.address || "No wallet connected"}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyAddress}
                    className="shrink-0"
                    data-testid="button-copy-address"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="default"
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={openDynamicProfile}
                  disabled={!primaryWallet}
                  data-testid="button-send"
                >
                  <Send className="w-6 h-6" />
                  <span className="text-sm font-semibold">Send</span>
                </Button>

                <Button
                  variant="default"
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={openDynamicProfile}
                  disabled={!primaryWallet}
                  data-testid="button-receive"
                >
                  <ArrowDownToLine className="w-6 h-6" />
                  <span className="text-sm font-semibold">Receive</span>
                </Button>

                <Button
                  variant="default"
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={openDynamicProfile}
                  disabled={!primaryWallet}
                  data-testid="button-export"
                >
                  <Download className="w-6 h-6" />
                  <span className="text-sm font-semibold">Backup</span>
                </Button>

                <Button
                  variant="default"
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={openDynamicProfile}
                  disabled={!primaryWallet}
                  data-testid="button-settings"
                >
                  <Key className="w-6 h-6" />
                  <span className="text-sm font-semibold">Security</span>
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Quick Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-black/50 backdrop-blur-xl border border-purple-500/20 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-600/20 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-200 mb-2">Secure Wallet</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Your wallet uses MPC technology for maximum security. Your private keys are never exposed.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-purple-500/30"
                    onClick={openDynamicProfile}
                    data-testid="button-manage-wallet"
                  >
                    Manage Wallet
                    <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Network Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="bg-black/50 backdrop-blur-xl border border-cyan-500/20 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-cyan-600/20 rounded-lg">
                  <Zap className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-200 mb-2">Solana Network</h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Connected to Solana mainnet with ultra-fast transactions and low fees.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-green-400 font-semibold">Connected</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-purple-600/10 to-cyan-600/10 border border-purple-500/20 p-6">
            <h3 className="font-semibold text-gray-200 mb-3">Need Help?</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <button 
                onClick={openDynamicProfile}
                className="text-left p-3 rounded-lg bg-black/30 hover:bg-black/50 transition-colors"
                data-testid="button-how-to-send"
              >
                <p className="font-semibold text-purple-400 mb-1">How to send SOL?</p>
                <p className="text-gray-400 text-xs">Click Send, enter address and amount</p>
              </button>
              <button 
                onClick={copyAddress}
                className="text-left p-3 rounded-lg bg-black/30 hover:bg-black/50 transition-colors"
                data-testid="button-how-to-receive"
              >
                <p className="font-semibold text-cyan-400 mb-1">How to receive SOL?</p>
                <p className="text-gray-400 text-xs">Share your wallet address with sender</p>
              </button>
              <button 
                onClick={openDynamicProfile}
                className="text-left p-3 rounded-lg bg-black/30 hover:bg-black/50 transition-colors"
                data-testid="button-backup-wallet"
              >
                <p className="font-semibold text-green-400 mb-1">Backup wallet</p>
                <p className="text-gray-400 text-xs">Export your recovery key safely</p>
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
