import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WebSocketProvider } from "@/providers/WebSocketProvider";
import { useAuth } from "@/hooks/useAuth";
import { useMobileDemoAuth } from "@/hooks/useMobileDemoAuth";
import { MobileTabBar } from "@/components/MobileTabBar";
import { Header } from "@/components/Header";
import { VoiceWaveLoader, LoadingState } from "@/components/cyber";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DynamicContextProvider, getAuthToken } from "@dynamic-labs/sdk-react-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import MyAgents from "@/pages/MyAgents";
import Agent from "@/pages/Agent";
import AgentStudio from "@/pages/AgentStudio";
import VoiceLogs from "@/pages/VoiceLogs";
import Settings from "@/pages/Settings";
import Wallet from "@/pages/Wallet";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import GetStarted from "@/pages/GetStarted";
import Token from "@/pages/Token";
import Demo from "@/pages/Demo";
import SavedDemo from "@/pages/SavedDemo";
import Documentation from "@/pages/Documentation";
import MobileHome from "@/pages/mobile/MobileHome";
import MobileAgent from "@/pages/mobile/MobileAgent";
import MobileIndustries from "@/pages/mobile/MobileIndustries";
import IndustryAgent from "@/pages/mobile/IndustryAgent";
import MobileToken from "@/pages/mobile/MobileToken";
import MobileAccount from "@/pages/mobile/MobileAccount";
import MobileContact from "@/pages/mobile/MobileContact";
import Activity from "@/pages/Activity";
import SharedAgent from "@/pages/SharedAgent";
import NotFound from "@/pages/not-found";

function RedirectToMyAgents() {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate("/my-agents", { replace: true });
  }, [navigate]);
  return null;
}

function RedirectToContact() {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate("/mobile/contact", { replace: true });
  }, [navigate]);
  return null;
}

function ProtectedRoute({ 
  children, 
  pageName 
}: { 
  children: React.ReactNode; 
  pageName: string;
}) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/mobile/contact", { replace: true });
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0B1E] flex items-center justify-center">
        <LoadingState variant="branded" size="md" message="Loading..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}

function MobileProtectedRoute({ 
  children, 
  pageName 
}: { 
  children: React.ReactNode; 
  pageName: string;
}) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/mobile/contact", { replace: true });
    }
  }, [isLoading, user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0B1E] flex items-center justify-center">
        <LoadingState variant="branded" size="md" message="Loading..." />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#0A0B1E]">
      {children}
    </div>
  );
}

function Router() {
  return (
    <Switch>
      {/* Mobile Routes - Elite mobile experience */}
      <Route path="/mobile">
        {() => (
          <MobileProtectedRoute pageName="Command Center">
            <MobileHome />
          </MobileProtectedRoute>
        )}
      </Route>
      <Route path="/mobile/agent" component={MobileAgent} />
      <Route path="/mobile/industries" component={MobileIndustries} />
      <Route path="/mobile/industry/:industry" component={IndustryAgent} />
      <Route path="/mobile/token" component={MobileToken} />
      <Route path="/mobile/contact" component={MobileContact} />
      <Route path="/mobile/account">
        {() => (
          <MobileProtectedRoute pageName="Account">
            <MobileAccount />
          </MobileProtectedRoute>
        )}
      </Route>
      
      {/* Marketing pages - available to everyone */}
      <Route path="/token" component={Token} />
      <Route path="/demo" component={Demo} />
      <Route path="/demo/:slug" component={SavedDemo} />
      <Route path="/docs" component={Documentation} />
      {/* Redirect /sign-in to contact page - contact-only platform */}
      <Route path="/sign-in" component={RedirectToContact} />
      <Route path="/get-started" component={GetStarted} />
      <Route path="/activity" component={Activity} />
      
      {/* Home page - always accessible to everyone */}
      <Route path="/" component={Home} />
      
      {/* Agent Showcase - Public access for voice feature testing */}
      <Route path="/agent" component={Agent} />
      
      {/* Shareable Agent Page - Public access for embedding/sharing specific agents */}
      {/* Format: /agent/alice, /agent/sarah, etc. */}
      <Route path="/agent/:agentId" component={SharedAgent} />
      
      {/* Protected routes - Show login prompt if not authenticated */}
      <Route path="/dashboard">
        {() => (
          <ProtectedRoute pageName="Dashboard">
            <Dashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/my-agents">
        {() => (
          <ProtectedRoute pageName="My Agents">
            <MyAgents />
          </ProtectedRoute>
        )}
      </Route>
      {/* Redirect /agents to /my-agents for backward compatibility */}
      <Route path="/agents" component={RedirectToMyAgents} />
      <Route path="/agent-studio">
        {() => (
          <ProtectedRoute pageName="Agent Studio">
            <AgentStudio />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/voice-logs">
        {() => (
          <ProtectedRoute pageName="Voice Logs">
            <VoiceLogs />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/settings">
        {() => (
          <ProtectedRoute pageName="Settings">
            <Settings />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/wallet">
        {() => (
          <ProtectedRoute pageName="Wallet">
            <Wallet />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/admin">
        {() => (
          <ProtectedRoute pageName="Admin Dashboard">
            <AdminDashboard />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

// Component to handle auto-login inside DynamicContextProvider
function AutoLoginHandler() {
  // DEVELOPMENT AUTO-LOGIN: Automatically log in with demo account for testing
  // This runs in development only - production requires manual authentication
  useMobileDemoAuth();
  return null;
}

// Router with conditional header (hidden on mobile routes)  
function RouterWithConditionalHeader() {
  return (
    <div className="pb-16 md:pb-0 bg-[#0A0B1E] min-h-screen">
      <ConditionalHeaderContent />
    </div>
  );
}

// Inner component that uses useLocation (must be inside Router context)
function ConditionalHeaderContent() {
  const [location] = useLocation();
  const isMobileRoute = location.startsWith('/mobile');

  return (
    <>
      {/* Desktop Header - Shows on desktop for all routes, hidden on mobile screens for /mobile routes */}
      <div className={isMobileRoute ? 'hidden md:block' : ''}>
        <Header />
      </div>
      {/* Main content with responsive padding for navigation */}
      <div className={isMobileRoute ? 'pt-0 md:pt-20' : 'pt-0 md:pt-20'}>
        <Router />
      </div>
    </>
  );
}

function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [hasShownLoader, setHasShownLoader] = useState(false);

  useEffect(() => {
    // Only show loader on first page load
    const hasLoaded = sessionStorage.getItem("voicely_loaded");
    if (hasLoaded) {
      setShowLoader(false);
      setHasShownLoader(true);
    } else {
      sessionStorage.setItem("voicely_loaded", "true");
    }
  }, []);

  const handleLoaderComplete = () => {
    setShowLoader(false);
    setHasShownLoader(true);
  };

  return (
    <ErrorBoundary>
      <DynamicContextProvider
        settings={{
          environmentId: '5bd2ebb4-fb32-421e-b9b9-6f0576723c71',
          walletConnectors: [SolanaWalletConnectors],
          events: {
          onAuthSuccess: async (args: any) => {
            console.log('[DYNAMIC] Auth success event fired!', {
              hasUser: !!args?.user,
              userId: args?.user?.userId,
              email: args?.user?.email,
            });
            
            // CRITICAL FIX: Sync user to backend IMMEDIATELY when auth succeeds
            // Don't wait for Dynamic SDK context to update - use event args directly
            try {
              const authToken = await getAuthToken(); // MUST await - returns Promise
              const user = args?.user;
              const primaryWallet = args?.primaryWallet;
              
              if (!authToken || !user) {
                console.error('[DYNAMIC] Missing token or user in onAuthSuccess', {
                  hasToken: !!authToken,
                  hasUser: !!user,
                });
                return;
              }
              
              console.log('[DYNAMIC] Got auth token, syncing user to backend...', {
                userId: user.userId,
                email: user.email,
                wallet: primaryWallet?.address,
              });
              
              // Sync user data to backend to create session
              const response = await fetch('/api/auth/dynamic', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  authToken,
                  user: {
                    userId: user.userId,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    verifiedCredentials: user.verifiedCredentials,
                    walletPublicKey: primaryWallet?.address || user.verifiedCredentials?.[0]?.address,
                    // Only send serializable wallet data (not the entire object with circular refs)
                    primaryWallet: primaryWallet ? {
                      address: primaryWallet.address,
                      chain: primaryWallet.chain,
                      connector: primaryWallet.connector?.key,
                    } : null,
                    authProvider: user.verifiedCredentials?.[0]?.format,
                  },
                }),
                credentials: 'include',
              });
              
              console.log('[DYNAMIC] 📥 Backend response:', {
                status: response.status,
                ok: response.ok,
              });

              if (response.ok) {
                const data = await response.json();
                console.log('[DYNAMIC] ✅ Backend sync successful!', {
                  success: data.success,
                  userId: data.user?.id,
                  email: data.user?.email,
                });
                
                // CRITICAL FIX: Immediately fetch and set user data in cache
                // This eliminates race condition with cookie propagation
                console.log('[DYNAMIC] Fetching user from backend session...');
                const userResponse = await fetch('/api/auth/user', {
                  credentials: 'include',
                });
                
                if (userResponse.ok) {
                  const userData = await userResponse.json();
                  console.log('[DYNAMIC] ✅ Got user data from backend:', {
                    userId: userData.id,
                    email: userData.email,
                  });
                  
                  // Set user data directly in cache (no race condition)
                  queryClient.setQueryData(["/api/auth/user"], userData);
                  
                  console.log('[DYNAMIC] ✅ User data set in cache - frontend now authenticated!');
                } else {
                  console.error('[DYNAMIC] ❌ Failed to fetch user after sync:', userResponse.status);
                  // Fallback: invalidate to trigger refetch
                  await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
                }
              } else {
                const errorText = await response.text();
                let errorDetails;
                try {
                  errorDetails = JSON.parse(errorText);
                } catch {
                  errorDetails = errorText;
                }
                console.error('[DYNAMIC] ❌ Backend sync failed:', response.status, errorDetails);
              }
            } catch (error) {
              console.error('[DYNAMIC] ❌ Error in onAuthSuccess:', error);
            }
          },
          onLogout: () => {
            console.log('[DYNAMIC] Logout - clearing cache');
            queryClient.clear();
          },
        },
      }}
    >
        <QueryClientProvider client={queryClient}>
          <WebSocketProvider>
            <TooltipProvider>
              {/* Auto-login handler for development testing */}
              <AutoLoginHandler />
              {showLoader && !hasShownLoader && (
                <VoiceWaveLoader onComplete={handleLoaderComplete} duration={2000} />
              )}
              <ErrorBoundary>
                <RouterWithConditionalHeader />
              </ErrorBoundary>
              {/* Mobile Tab Bar - Shows on small screens only */}
              <MobileTabBar />
              <Toaster />
            </TooltipProvider>
          </WebSocketProvider>
        </QueryClientProvider>
      </DynamicContextProvider>
    </ErrorBoundary>
  );
}

export default App;
