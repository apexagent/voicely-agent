import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Mobile demo auto-authentication hook
 * Automatically logs in unauthenticated users with demo account in development
 * Used across all mobile routes to ensure seamless access to protected features
 */
export function useMobileDemoAuth() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const queryClient = useQueryClient();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const hasAttemptedLoginRef = useRef(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const autoLogin = async () => {
      // Skip if already attempted, already logged in, or in production
      if (hasAttemptedLoginRef.current) return;
      if (user) return;
      if (import.meta.env.PROD) return; // Development only
      if (isAuthLoading) return; // Wait for auth check to complete

      hasAttemptedLoginRef.current = true;
      setIsAuthenticating(true);
      setAuthError(null);

      try {
        console.log('[MOBILE DEMO AUTH] Auto-logging in with demo account...');
        const response = await fetch("/api/dev-login", { method: "POST" });
        
        if (!response.ok) {
          throw new Error('Dev login failed');
        }
        
        console.log('[MOBILE DEMO AUTH] ✅ Auto-login successful, fetching user data...');
        
        // Fetch user data and set it in cache
        const userData = await queryClient.ensureQueryData({
          queryKey: ["/api/auth/user"],
          retry: 3,
          retryDelay: 200,
        });
        
        if (!userData) {
          throw new Error('Failed to load user data after login');
        }
        
        console.log('[MOBILE DEMO AUTH] ✅ User data loaded in cache, invalidating agents...');
        
        // Invalidate agents query so it fetches when component mounts
        await queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
        
        // The useAuth() hook will pick up the cached user data on next render
        // isAuthenticating will be set to false below, and isReady will become true
        // once React re-renders and useAuth() returns the cached user
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Auto-login failed';
        console.error('[MOBILE DEMO AUTH] ❌ Error:', errorMsg);
        setAuthError(errorMsg);
      } finally {
        setIsAuthenticating(false);
      }
    };

    autoLogin();
  }, [user, isAuthLoading, queryClient]);

  return {
    isAuthenticating: isAuthenticating || isAuthLoading,
    isReady: !!user && !isAuthenticating && !isAuthLoading,
    error: authError,
  };
}
