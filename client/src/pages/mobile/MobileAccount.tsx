import { motion } from "framer-motion";
import { User, Mail, Phone, Bell, Shield, CreditCard, LogOut, LogIn, ChevronRight, Zap, LayoutDashboard, Bot, FileText, Plus, Settings as SettingsIcon, Activity, TrendingUp, DollarSign, Headphones, Briefcase, Radio, Calendar, UserPlus, Wallet as WalletIcon, Copy, Send, Download, ArrowDownToLine, Key, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type User as UserType } from "@shared/schema";
import { useState, useEffect } from "react";
import { LucideIcon } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Agent portraits
import alicePortrait from "@assets/generated_images/Alice_Support_Agent_New.png";
import sarahPortrait from "@assets/c57e465e-117a-48b6-ac72-f595b2147893_1762597948606.png";
import emmaPortrait from "@assets/dbd2eb13-b3a0-4352-ad50-b1e1e6c83823_1762597948606.png";
import avaPortrait from "@assets/dbd2eb13-b3a0-4352-ad50-b1e1e6c83823_1762597948606.png";
import mayaPortrait from "@assets/c6a83411-9447-410d-bda5-46daa0aa23f9_1762597948605.png";
import defaultProfilePic from "@assets/0af78963-cafd-4bbd-9991-0ba6481573b0-removebg-preview_1763558888595.png";
import voicelyIconPath from "@assets/New vvvv_1763478691091.png";

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  callsHandled: number;
  avatarUrl?: string;
}

// Agent type configurations with icons and portraits
const agentConfig: Record<string, { icon: any; gradient: string; portrait: string }> = {
  support: {
    icon: Headphones,
    gradient: "from-cyan-500 to-blue-600",
    portrait: alicePortrait,
  },
  sales: {
    icon: Briefcase,
    gradient: "from-purple-500 to-violet-600",
    portrait: sarahPortrait,
  },
  receptionist: {
    icon: Radio,
    gradient: "from-green-500 to-emerald-600",
    portrait: emmaPortrait,
  },
  appointment: {
    icon: Calendar,
    gradient: "from-orange-500 to-amber-600",
    portrait: avaPortrait,
  },
  followup: {
    icon: UserPlus,
    gradient: "from-pink-500 to-rose-600",
    portrait: mayaPortrait,
  },
};

export default function MobileAccount() {
  const { user, isLoading } = useAuth();
  const { primaryWallet, setShowDynamicUserProfile, setShowAuthFlow } = useDynamicContext();
  const { toast } = useToast();
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const [settingsSheetOpen, setSettingsSheetOpen] = useState(false);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");
  
  // Dedicated local state for notification preferences (optimistic UI)
  const [localPreferences, setLocalPreferences] = useState({
    pushNotifications: true,
    emailAlerts: true,
    smsAlerts: false,
  });
  const [isRefreshingPrefs, setIsRefreshingPrefs] = useState(false);

  // Debug logging - Enhanced for production debugging
  useEffect(() => {
    console.log('[MOBILE-ACCOUNT] 🔍 DETAILED Auth state:', {
      hasUser: !!user,
      userObject: user,
      userEmail: user?.email,
      userId: user?.id,
      isLoading,
      willShowLogin: !isLoading && !user,
      willShowAuthContent: !isLoading && !!user,
    });
  }, [user, isLoading]);

  // Error boundary logging
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('[MOBILE-ACCOUNT] Runtime error:', event.error);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Use `user` from useAuth directly - no need for duplicate query
  const userData = user;
  
  // Debug wallet state
  useEffect(() => {
    console.log('[MOBILE ACCOUNT] Wallet State:', {
      hasPrimaryWallet: !!primaryWallet,
      primaryWalletAddress: primaryWallet?.address,
      hasUserData: !!userData,
      userWalletAddress: userData?.walletAddress,
      shouldShowWallet: !(!primaryWallet && !userData?.walletAddress)
    });
  }, [primaryWallet, userData]);

  // Hydrate local preferences from userData
  useEffect(() => {
    if (userData) {
      setLocalPreferences({
        pushNotifications: userData.pushNotifications ?? true,
        emailAlerts: userData.emailAlerts ?? true,
        smsAlerts: userData.smsAlerts ?? false,
      });
      setEditedFirstName(userData.firstName || "");
      setEditedLastName(userData.lastName || "");
    }
  }, [userData]);

  // Fetch agents for Command Center stats
  const { data: agentsResponse, isLoading: agentsLoading } = useQuery<{ agents: Agent[] }>({
    queryKey: ["/api/agents"],
    enabled: !!user,
  });

  const agents = agentsResponse?.agents || [];
  const activeAgents = agents.filter(a => a.status === "active");
  const totalCalls = agents.reduce((sum, a) => sum + (a.callsHandled || 0), 0);

  // Fetch SOL balance using React Query for proper caching and polling
  const walletAddress = primaryWallet?.address || userData?.walletAddress;
  const { data: solBalanceData, isLoading: isLoadingBalance, error: balanceQueryError } = useQuery({
    queryKey: ['sol-balance', walletAddress],
    queryFn: async () => {
      if (!walletAddress) {
        throw new Error('No wallet address');
      }

      // Use backend proxy to avoid CORS and rate limiting issues
      const response = await fetch('/api/solana/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          address: walletAddress
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Request failed: ${response.status}`);
      }
      
      if (data.error) {
        throw new Error(data.error.message || data.error);
      }

      if (data.result?.value === undefined) {
        throw new Error('Invalid response from server');
      }

      return (data.result.value / 1_000_000_000).toFixed(4);
    },
    enabled: !!walletAddress && !!user,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    retry: 2,
    staleTime: 10000,
  });

  const solBalance = solBalanceData || "0";
  const balanceError = balanceQueryError ? (balanceQueryError as Error).message : null;

  // Mutation for updating notification preferences
  const preferencesMutation = useMutation({
    mutationFn: async (preferences: { pushNotifications?: boolean; emailAlerts?: boolean; smsAlerts?: boolean }) => {
      return await apiRequest('PATCH', '/api/auth/user/preferences', preferences);
    },
    onSuccess: async () => {
      // Set flag to disable switches during refetch
      setIsRefreshingPrefs(true);
      
      // Invalidate and wait for refetch to complete
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      // Reset flag after refetch completes
      setIsRefreshingPrefs(false);
      
      toast({
        title: "Preferences updated",
        description: "Your notification preferences have been saved",
      });
    },
    onError: (error: any) => {
      // Revert local state on error by resyncing from userData
      if (userData) {
        setLocalPreferences({
          pushNotifications: userData.pushNotifications ?? true,
          emailAlerts: userData.emailAlerts ?? true,
          smsAlerts: userData.smsAlerts ?? false,
        });
      }
      
      toast({
        title: "Update failed",
        description: error.message || "Failed to update preferences",
        variant: "destructive",
      });
    },
  });

  // Mutation for updating profile
  const profileMutation = useMutation({
    mutationFn: async (profile: { firstName?: string; lastName?: string; profileImageUrl?: string }) => {
      return await apiRequest('PATCH', '/api/auth/user/profile', profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setProfileSheetOpen(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handlePreferenceToggle = (field: 'pushNotifications' | 'emailAlerts' | 'smsAlerts', value: boolean) => {
    // Update local state immediately for optimistic UI
    setLocalPreferences(prev => ({ ...prev, [field]: value }));
    
    // Trigger backend mutation
    preferencesMutation.mutate({ [field]: value });
  };

  const handleSaveProfile = () => {
    // Only send fields that changed from original userData (detecting case/whitespace differences)
    const updates: { firstName?: string; lastName?: string } = {};
    
    const trimmedFirstName = editedFirstName.trim();
    const trimmedLastName = editedLastName.trim();
    
    // Detect meaningful changes (including case and whitespace differences)
    if (trimmedFirstName && trimmedFirstName !== (userData?.firstName || '').trim()) {
      updates.firstName = trimmedFirstName;
    }
    
    if (trimmedLastName && trimmedLastName !== (userData?.lastName || '').trim()) {
      updates.lastName = trimmedLastName;
    }
    
    // Only mutate if there are actual changes
    if (Object.keys(updates).length > 0) {
      profileMutation.mutate(updates);
    } else {
      setProfileSheetOpen(false);
      toast({
        title: "No changes",
        description: "Profile is already up to date",
      });
    }
  };

  const copyAddress = () => {
    const address = primaryWallet?.address || userData?.walletAddress;
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address copied!",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const openDynamicProfile = () => {
    try {
      setShowDynamicUserProfile(true);
    } catch (error) {
      console.error('[WALLET] Failed to open Dynamic profile:', error);
      toast({
        title: "Connection Error",
        description: "Unable to open wallet profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Logout failed');
      }
      
      // Successful logout - redirect to home
      window.location.href = "/";
    } catch (error) {
      console.error('[LOGOUT] Failed:', error);
      // Still redirect even if logout fails to clear client state
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B1E] pb-28 md:pb-8 relative">
      <div className="max-w-2xl mx-auto px-4 relative z-10">
        {/* Profile Header with Gradient Voice Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-8 pb-6"
        >
          {isLoading ? (
            /* Loading State */
            <Card className="bg-gradient-to-br from-purple-600/10 via-cyan-600/5 to-transparent border-purple-500/20 rounded-2xl p-8 mb-6 text-center" data-testid="loading-state">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">Loading your account...</p>
              </div>
            </Card>
          ) : !user ? (
            /* Login Prompt for Unauthenticated Users - With Voicely Logo */
            <Card className="bg-gradient-to-br from-purple-600/10 via-cyan-600/5 to-transparent border-purple-500/20 rounded-2xl p-6 sm:p-8 mb-6 text-center relative overflow-hidden" data-testid="login-prompt">
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl -z-10" />
              
              <div className="flex flex-col items-center gap-4">
                {/* Voicely Logo with Gradient Container */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-500/20 via-cyan-500/20 to-purple-500/20 p-4 flex items-center justify-center border-2 border-purple-500/30 shadow-lg shadow-purple-500/20">
                  <img 
                    src={voicelyIconPath} 
                    alt="Voicely" 
                    className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                  />
                </div>
                
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    Welcome to Voicely
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base mb-1">
                    AI Voice Workforce Platform
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm mb-4">
                    Sign in to access your AI voice agents and manage your account
                  </p>
                </div>
                
                <Button 
                  onClick={() => setShowAuthFlow(true)} 
                  className="w-full max-w-xs bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white shadow-lg shadow-purple-500/25" 
                  size="lg" 
                  data-testid="button-login"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In with Dynamic
                </Button>
                
                <p className="text-xs text-gray-600 mt-2">
                  Securely login with email or social accounts
                </p>
              </div>
            </Card>
          ) : (
            /* Authenticated User Profile */
            <Card className="bg-gradient-to-br from-purple-600/10 via-cyan-600/5 to-transparent border-purple-500/20 rounded-2xl p-6 mb-6" data-testid="profile-header">
              <div className="flex items-center gap-4">
                {/* Profile Picture - Gradient Voice Logo by Default */}
                <div className="relative">
                  <Avatar className="w-20 h-20 border-4 border-purple-500/30 shadow-lg shadow-purple-500/20" data-testid="profile-avatar">
                    <AvatarImage 
                      src={userData?.profileImageUrl || defaultProfilePic} 
                      alt="Profile" 
                      className="object-cover"
                    />
                    <AvatarFallback>
                      <img src={defaultProfilePic} alt="Default Avatar" className="w-full h-full object-cover" />
                    </AvatarFallback>
                  </Avatar>
                  {/* Online Status Indicator */}
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-[#0A0B1E]" />
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-bold text-white mb-1 truncate" data-testid="profile-name">
                    {userData?.firstName && userData?.lastName 
                      ? `${userData.firstName} ${userData.lastName}` 
                      : userData?.email?.split('@')[0] || "User"}
                  </h1>
                  <p className="text-gray-400 text-sm mb-2 truncate" data-testid="profile-email">
                    {userData?.email || "Guest"}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30">
                      <Bot className="w-3 h-3 mr-1" />
                      {agents.length} Agents
                    </Badge>
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-400/30">
                      <Zap className="w-3 h-3 mr-1" />
                      {(userData?.voiceTokenBalance ?? 0).toLocaleString()} $VOICE
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          )}

        </motion.div>

        {/* Navigation Menu for Authenticated Users */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6 space-y-2"
          >
            <div className="px-2 mb-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Access</h3>
            </div>

            <Link href="/dashboard">
              <motion.div 
                whileHover={{ x: 4 }}
                className="group relative flex items-center justify-between px-4 py-3.5 rounded-xl bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20 hover:border-purple-500/40 transition-all cursor-pointer overflow-hidden" 
                data-testid="link-dashboard"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 flex-1 relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/30 to-purple-600/20 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
                    <LayoutDashboard className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Dashboard</p>
                    <p className="text-xs text-gray-500">View analytics</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-purple-400 transition-colors relative z-10" />
              </motion.div>
            </Link>

            <Link href="/my-agents">
              <motion.div 
                whileHover={{ x: 4 }}
                className="group relative flex items-center justify-between px-4 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500/10 via-cyan-500/5 to-transparent border border-cyan-500/20 hover:border-cyan-500/40 transition-all cursor-pointer overflow-hidden" 
                data-testid="link-my-agents"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 flex-1 relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/30 to-cyan-600/20 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                    <Bot className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">My Agents</p>
                    <p className="text-xs text-gray-500">{agents.length} active</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 transition-colors relative z-10" />
              </motion.div>
            </Link>

            <Link href="/agent-studio">
              <motion.div 
                whileHover={{ x: 4 }}
                className="group relative flex items-center justify-between px-4 py-3.5 rounded-xl bg-gradient-to-r from-green-500/10 via-green-500/5 to-transparent border border-green-500/20 hover:border-green-500/40 transition-all cursor-pointer overflow-hidden" 
                data-testid="link-create-agent"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 flex-1 relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/30 to-emerald-600/20 flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 transition-shadow">
                    <Plus className="w-5 h-5 text-green-300" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Create an Agent</p>
                    <p className="text-xs text-gray-500">Build new AI agent</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-green-400 transition-colors relative z-10" />
              </motion.div>
            </Link>

            <Link href="/voice-logs">
              <motion.div 
                whileHover={{ x: 4 }}
                className="group relative flex items-center justify-between px-4 py-3.5 rounded-xl bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent border border-orange-500/20 hover:border-orange-500/40 transition-all cursor-pointer overflow-hidden" 
                data-testid="link-voice-logs"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 flex-1 relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/30 to-amber-600/20 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-shadow">
                    <FileText className="w-5 h-5 text-orange-300" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Voice Logs</p>
                    <p className="text-xs text-gray-500">View conversations</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-orange-400 transition-colors relative z-10" />
              </motion.div>
            </Link>

            <Link href="/wallet">
              <motion.div 
                whileHover={{ x: 4 }}
                className="group relative flex items-center justify-between px-4 py-3.5 rounded-xl bg-gradient-to-r from-violet-500/10 via-violet-500/5 to-transparent border border-violet-500/20 hover:border-violet-500/40 transition-all cursor-pointer overflow-hidden" 
                data-testid="link-wallet-page"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 flex-1 relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/30 to-purple-600/20 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
                    <WalletIcon className="w-5 h-5 text-violet-300" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Wallet</p>
                    <p className="text-xs text-gray-500">Manage crypto</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-violet-400 transition-colors relative z-10" />
              </motion.div>
            </Link>

            <Link href="/settings">
              <motion.div 
                whileHover={{ x: 4 }}
                className="group relative flex items-center justify-between px-4 py-3.5 rounded-xl bg-gradient-to-r from-gray-500/10 via-gray-500/5 to-transparent border border-gray-500/20 hover:border-gray-500/40 transition-all cursor-pointer overflow-hidden" 
                data-testid="link-settings-page"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500/0 via-gray-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 flex-1 relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-500/30 to-gray-600/20 flex items-center justify-center shadow-lg shadow-gray-500/20 group-hover:shadow-gray-500/40 transition-shadow">
                    <SettingsIcon className="w-5 h-5 text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-medium">Settings</p>
                    <p className="text-xs text-gray-500">Preferences</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors relative z-10" />
              </motion.div>
            </Link>
          </motion.div>
        )}

        {user && (
          <div className="px-2 mb-3 mt-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Command Center</h3>
          </div>
        )}

        {/* Wallet Section for Unauthenticated Users */}
        {!user && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <WalletIcon className="w-5 h-5 text-cyan-400" />
                Solana Wallet
              </h2>
            </div>

            <Card className="bg-black/40 border-cyan-500/20 rounded-xl p-5" data-testid="wallet-preview">
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border-2 border-cyan-500/30 mx-auto mb-4">
                  <WalletIcon className="w-8 h-8 text-cyan-400" />
                </div>
                <p className="text-white text-base mb-2 font-semibold">Connect Your Wallet</p>
                <p className="text-gray-400 text-sm mb-4">Login to view your Solana balance and manage your crypto assets</p>
                
                {/* Preview Features */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-left">
                  <div className="bg-purple-600/10 border border-purple-500/20 rounded-lg p-3">
                    <Activity className="w-4 h-4 text-purple-400 mb-1" />
                    <p className="text-xs text-gray-400">View Balance</p>
                  </div>
                  <div className="bg-cyan-600/10 border border-cyan-500/20 rounded-lg p-3">
                    <Send className="w-4 h-4 text-cyan-400 mb-1" />
                    <p className="text-xs text-gray-400">Send & Receive</p>
                  </div>
                </div>

                <Button 
                  onClick={() => setShowAuthFlow(true)} 
                  variant="default" 
                  size="sm" 
                  className="w-full" 
                  data-testid="button-wallet-login"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login to Access Wallet
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Authenticated Content */}
        {user && (
          <>
            {/* Command Center Stats - 4 Grid */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-3 mb-6"
            >
          {/* Active Agents */}
          <Card className="bg-black/40 border-purple-500/30 rounded-xl p-4" data-testid="stat-active-agents">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-mono uppercase">Active Agents</span>
              <Bot className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-white" data-testid="value-active-agents">
              {agentsLoading ? "..." : activeAgents.length}
            </div>
            {!agentsLoading && activeAgents.length > 0 && (
              <Badge className="bg-green-500/20 text-green-400 border-green-400/30 text-xs mt-2">
                LIVE
              </Badge>
            )}
          </Card>

          {/* Total Calls */}
          <Card className="bg-black/40 border-cyan-500/30 rounded-xl p-4" data-testid="stat-total-calls">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-mono uppercase">Total Calls</span>
              <Phone className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white" data-testid="value-total-calls">
              {agentsLoading ? "..." : totalCalls.toLocaleString()}
            </div>
          </Card>

          {/* Total Agents */}
          <Card className="bg-black/40 border-green-500/30 rounded-xl p-4" data-testid="stat-total-agents">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-mono uppercase">Total Agents</span>
              <Bot className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white" data-testid="value-total-agents">
              {agentsLoading ? "..." : agents.length}
            </div>
          </Card>

          {/* Voice Tokens */}
          <Card className="bg-black/40 border-violet-500/30 rounded-xl p-4" data-testid="stat-voice-tokens">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-mono uppercase">$VOICE Tokens</span>
              <Zap className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-bold text-white" data-testid="value-voice-tokens">
              {isLoading ? "..." : (userData?.voiceTokenBalance ?? 0).toLocaleString()}
            </div>
          </Card>
        </motion.div>

        {/* Wallet Section - Compact Design */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent border-cyan-500/30 rounded-xl p-5 overflow-hidden relative" data-testid="wallet-card">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl -z-10" />
            
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center border border-cyan-500/40">
                <WalletIcon className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Solana Wallet</h3>
                <p className="text-xs text-gray-400">Manage your crypto assets</p>
              </div>
            </div>

            {!primaryWallet && !userData?.walletAddress ? (
              /* No Wallet Connected State */
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm mb-3">No wallet connected</p>
                <Button
                  variant="default"
                  size="sm"
                  onClick={openDynamicProfile}
                  className="w-full bg-gradient-to-r from-cyan-600 to-purple-600"
                  data-testid="button-connect-wallet"
                >
                  <WalletIcon className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <>
                {/* Balance Display - Compact */}
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent" data-testid="sol-balance">
                    {isLoadingBalance ? (
                      <span className="animate-pulse">...</span>
                    ) : balanceError ? (
                      <span className="text-red-400 text-lg">Error</span>
                    ) : (
                      <>{solBalance} SOL</>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {isLoadingBalance ? "Loading..." : balanceError ? balanceError : "≈ $" + (parseFloat(solBalance) * 100).toFixed(2) + " USD"}
                  </p>
                </div>

                {/* Wallet Address - Compact */}
                <div className="bg-black/40 border border-purple-500/20 rounded-lg p-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <code className="flex-1 font-mono text-gray-300 text-xs truncate">
                      {(primaryWallet?.address || userData?.walletAddress || '').slice(0, 12)}...{(primaryWallet?.address || userData?.walletAddress || '').slice(-8)}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyAddress}
                      className="shrink-0 h-6 w-6 p-0"
                      data-testid="button-copy-address"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Quick Actions - Compact 2x2 Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-10 border-cyan-500/30 hover:bg-cyan-500/10"
                    onClick={openDynamicProfile}
                    data-testid="button-wallet-send"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">Send</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="flex items-center justify-center gap-2 h-10 border-purple-500/30 hover:bg-purple-500/10"
                    onClick={openDynamicProfile}
                    data-testid="button-wallet-receive"
                  >
                    <ArrowDownToLine className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">Receive</span>
                  </Button>

                  <Link href="/wallet" className="col-span-2">
                    <Button
                      variant="default"
                      className="w-full h-10 bg-gradient-to-r from-cyan-600 to-purple-600"
                      data-testid="button-view-wallet"
                    >
                      View Full Wallet
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </Card>
        </motion.div>

        {/* Active Agents Preview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-400" />
              My Agents
            </h2>
            <Link href="/my-agents">
              <Button variant="ghost" size="sm" className="text-purple-400 hover:bg-purple-500/10" data-testid="button-view-all-agents">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          
          {/* Loading State */}
          {agentsLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-black/40 border-purple-500/20 rounded-xl p-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-700/50" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-700/50 rounded w-32" />
                      <div className="h-3 bg-gray-700/50 rounded w-24" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!agentsLoading && agents.length === 0 && (
            <Card className="bg-black/40 border-purple-500/20 rounded-xl p-8 text-center" data-testid="empty-agents">
              <Bot className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-4">No agents created yet</p>
              <Link href="/mobile/contact">
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-violet-600 hover-elevate" data-testid="button-create-first-agent">
                  <Plus className="w-4 h-4 mr-2" />
                  Talk to Alice
                </Button>
              </Link>
            </Card>
          )}

          {/* Agents List */}
          {!agentsLoading && agents.length > 0 && (
            <div className="space-y-3">
              {agents.slice(0, 3).map((agent) => {
                const config = agentConfig[agent.type] || agentConfig.support;
                const Icon = config.icon;

                return (
                  <Link key={agent.id} href="/my-agents">
                    <Card className="bg-black/40 border-purple-500/20 rounded-xl p-4 hover-elevate cursor-pointer" data-testid={`card-agent-${agent.id}`}>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 border-2 border-purple-400/30">
                          <AvatarImage src={agent.avatarUrl || config.portrait} alt={agent.name} className="object-cover object-top scale-110" />
                          <AvatarFallback className={`bg-gradient-to-br ${config.gradient} text-white font-bold text-xs`}>
                            {agent.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-bold text-white truncate">{agent.name}</h3>
                            <Badge className={agent.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-400/30 text-xs' : 'bg-gray-500/20 text-gray-400 border-gray-400/30 text-xs'}>
                              {agent.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                              <Icon className="w-3 h-3" />
                              <span className="capitalize">{agent.type}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{(agent.callsHandled || 0).toLocaleString()} calls</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-600 flex-shrink-0" />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Navigation Menu Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/40 border border-gray-800/50 rounded-xl overflow-hidden mb-4"
        >
          <div className="px-4 py-3 border-b border-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-300">Navigation</h3>
          </div>
          
          <Link href="/dashboard">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/30 hover:bg-white/5 transition-colors cursor-pointer" data-testid="link-dashboard">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600/30 to-violet-600/20 flex items-center justify-center">
                  <LayoutDashboard className="w-4 h-4 text-purple-300" />
                </div>
                <p className="text-sm text-gray-200 font-medium">Dashboard</p>
              </div>
              <ChevronRight className="w-5 h-5 text-purple-400" />
            </div>
          </Link>

          <Link href="/my-agents">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/30 hover:bg-white/5 transition-colors cursor-pointer" data-testid="link-my-agents">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600/30 to-violet-600/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-purple-300" />
                </div>
                <p className="text-sm text-gray-200 font-medium">My Agents</p>
              </div>
              <ChevronRight className="w-5 h-5 text-purple-400" />
            </div>
          </Link>

          <Link href="/agent-studio">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/30 hover:bg-white/5 transition-colors cursor-pointer" data-testid="link-agent-studio">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600/30 to-violet-600/20 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-purple-300" />
                </div>
                <p className="text-sm text-gray-200 font-medium">Agent Studio</p>
              </div>
              <ChevronRight className="w-5 h-5 text-purple-400" />
            </div>
          </Link>

          <Link href="/voice-logs">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/30 hover:bg-white/5 transition-colors cursor-pointer" data-testid="link-voice-logs">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600/30 to-violet-600/20 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-purple-300" />
                </div>
                <p className="text-sm text-gray-200 font-medium">Voice Logs</p>
              </div>
              <ChevronRight className="w-5 h-5 text-purple-400" />
            </div>
          </Link>

          <Link href="/wallet">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/30 hover:bg-white/5 transition-colors cursor-pointer" data-testid="link-wallet-nav">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-600/30 to-blue-600/20 flex items-center justify-center">
                  <WalletIcon className="w-4 h-4 text-cyan-300" />
                </div>
                <p className="text-sm text-gray-200 font-medium">Wallet</p>
              </div>
              <ChevronRight className="w-5 h-5 text-cyan-400" />
            </div>
          </Link>

          <Link href="/settings">
            <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer" data-testid="link-settings-nav">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-600/30 to-gray-600/20 flex items-center justify-center">
                  <SettingsIcon className="w-4 h-4 text-gray-300" />
                </div>
                <p className="text-sm text-gray-200 font-medium">Settings</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Link>
        </motion.div>

        {/* Notification Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-black/40 border border-gray-800/50 rounded-xl overflow-hidden mb-4"
        >
          <div className="px-4 py-3 border-b border-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-300">Notification Preferences</h3>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/30" data-testid="setting-push-notifications">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 rounded-lg bg-gray-800/50 flex items-center justify-center">
                <Bell className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-200">Push Notifications</p>
                <p className="text-xs text-gray-500">Get notified about agent activity</p>
              </div>
            </div>
            <Switch
              checked={localPreferences.pushNotifications}
              onCheckedChange={(value) => handlePreferenceToggle('pushNotifications', value)}
              disabled={preferencesMutation.isPending || isRefreshingPrefs}
              data-testid="toggle-push-notifications"
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/30" data-testid="setting-email-alerts">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 rounded-lg bg-gray-800/50 flex items-center justify-center">
                <Mail className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-200">Email Alerts</p>
                <p className="text-xs text-gray-500">Receive email summaries</p>
              </div>
            </div>
            <Switch
              checked={localPreferences.emailAlerts}
              onCheckedChange={(value) => handlePreferenceToggle('emailAlerts', value)}
              disabled={preferencesMutation.isPending || isRefreshingPrefs}
              data-testid="toggle-email-alerts"
            />
          </div>

          <div className="flex items-center justify-between px-4 py-3" data-testid="setting-sms-alerts">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 rounded-lg bg-gray-800/50 flex items-center justify-center">
                <Phone className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-200">SMS Alerts</p>
                <p className="text-xs text-gray-500">Text message notifications</p>
              </div>
            </div>
            <Switch
              checked={localPreferences.smsAlerts}
              onCheckedChange={(value) => handlePreferenceToggle('smsAlerts', value)}
              disabled={preferencesMutation.isPending || isRefreshingPrefs}
              data-testid="toggle-sms-alerts"
            />
          </div>
        </motion.div>

        {/* Account Settings Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-black/40 border border-gray-800/50 rounded-xl overflow-hidden mb-4"
        >
          <div className="px-4 py-3 border-b border-gray-800/50">
            <h3 className="text-sm font-semibold text-gray-300">Account Settings</h3>
          </div>

          {/* Edit Profile - Opens Sheet */}
          <Sheet open={profileSheetOpen} onOpenChange={setProfileSheetOpen}>
            <SheetTrigger asChild>
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/30 hover:bg-white/5 transition-colors cursor-pointer" data-testid="button-edit-profile">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-9 h-9 rounded-lg bg-gray-800/50 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-200">Personal Information</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </div>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-[#0A0B1E] border-gray-800">
              <SheetHeader>
                <SheetTitle className="text-white">Edit Profile</SheetTitle>
                <SheetDescription className="text-gray-400">
                  Update your personal information
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                  <Input
                    id="firstName"
                    value={editedFirstName}
                    onChange={(e) => setEditedFirstName(e.target.value)}
                    className="bg-black/40 border-gray-700 text-white mt-2"
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                  <Input
                    id="lastName"
                    value={editedLastName}
                    onChange={(e) => setEditedLastName(e.target.value)}
                    className="bg-black/40 border-gray-700 text-white mt-2"
                    data-testid="input-last-name"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Email</Label>
                  <Input
                    value={userData?.email || ""}
                    disabled
                    className="bg-black/20 border-gray-700 text-gray-500 mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <Button
                  onClick={handleSaveProfile}
                  disabled={profileMutation.isPending}
                  className="w-full bg-gradient-to-r from-purple-600 to-violet-600"
                  data-testid="button-save-profile"
                >
                  {profileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/settings">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/30 hover:bg-white/5 transition-colors cursor-pointer" data-testid="link-settings">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-9 h-9 rounded-lg bg-gray-800/50 flex items-center justify-center">
                  <SettingsIcon className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-sm text-gray-200">Settings</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </div>
          </Link>

          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/30 hover:bg-white/5 transition-colors cursor-pointer" data-testid="button-security">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 rounded-lg bg-gray-800/50 flex items-center justify-center">
                <Shield className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-200">Privacy & Security</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </div>

          <div className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer" data-testid="button-billing">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-9 h-9 rounded-lg bg-gray-800/50 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm text-gray-200">Billing & Payments</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-gray-700 text-gray-300 hover:bg-white/5"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
