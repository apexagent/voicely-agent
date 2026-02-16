// Dynamic.xyz Auth hook for client-side authentication
import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDynamicContext, getAuthToken } from "@dynamic-labs/sdk-react-core";
import { type User } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

export function useAuth() {
  const { primaryWallet, user: dynamicUser } = useDynamicContext();
  const isDynamicAuthenticated = !!dynamicUser; // V3+ API: check if user exists
  const lastSyncedUserIdRef = useRef<string | null>(null); // Track synced user to prevent re-syncs
  
  // Debug logging for production troubleshooting
  useEffect(() => {
    (async () => {
      const authToken = await getAuthToken(); // MUST await - returns Promise
      console.log('[AUTH-DEBUG] Dynamic Context State:', {
        hasDynamicUser: !!dynamicUser,
        dynamicUserId: dynamicUser?.userId,
        dynamicEmail: dynamicUser?.email,
        hasWallet: !!primaryWallet,
        walletAddress: primaryWallet?.address,
        hasAuthToken: !!authToken,
        authTokenLength: authToken?.length || 0,
      });
    })();
  }, [dynamicUser, primaryWallet]);
  
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      console.log('[AUTH] 🔍 Fetching user from /api/auth/user...');
      const res = await fetch("/api/auth/user", {
        credentials: "include",
      });

      console.log('[AUTH] 🔍 Response status:', res.status, res.statusText);

      // If not authenticated, return null instead of throwing
      if (res.status === 401) {
        console.log('[AUTH] ❌ Not authenticated (401) - no session found');
        return null;
      }

      if (!res.ok) {
        console.error('[AUTH] ❌ Error response:', res.status, res.statusText);
        throw new Error(`${res.status}: ${res.statusText}`);
      }

      const userData = await res.json();
      console.log('[AUTH] ✅ User data fetched successfully:', { email: userData.email, id: userData.id });
      return userData;
    },
    retry: false,
    // ALWAYS try to fetch - if backend has session, we'll get user even if Dynamic SDK hasn't loaded
    enabled: true,
  });
  
  // Log any errors fetching user
  useEffect(() => {
    if (error) {
      console.error('[AUTH] Error fetching user:', error);
    }
  }, [error]);

  // Sync Dynamic user to backend when they log in (ONE-TIME per user session)
  useEffect(() => {
    async function syncUserToBackend() {
      // BACKEND-FIRST FALLBACK: If we already have a user from session, skip Dynamic sync
      if (user) {
        console.log('[AUTH] ✅ User already loaded from backend session, skipping Dynamic sync', {
          userId: user.id,
          email: user.email,
        });
        // Mark as synced to prevent re-syncs
        if (!lastSyncedUserIdRef.current) {
          lastSyncedUserIdRef.current = user.id;
        }
        return;
      }
      
      if (!isDynamicAuthenticated || !dynamicUser) {
        console.log('[AUTH] Skipping sync - Dynamic not ready', {
          isDynamicAuthenticated,
          hasDynamicUser: !!dynamicUser,
        });
        return;
      }

      // CRITICAL GUARD: Only sync if we haven't synced this user yet
      if (lastSyncedUserIdRef.current === dynamicUser.userId) {
        console.log('[AUTH] Skipping sync - already synced for this user', {
          userId: dynamicUser.userId,
        });
        return;
      }

      console.log('[AUTH] Starting sync to backend...', {
        userId: dynamicUser.userId,
        email: dynamicUser.email,
        wallet: primaryWallet?.address,
        isFirstSync: lastSyncedUserIdRef.current !== dynamicUser.userId,
      });

      try {
        // Get auth token from Dynamic using utility function (MUST await - returns Promise)
        const authToken = await getAuthToken();
        
        if (!authToken) {
          console.error('[AUTH] ❌ No auth token available from Dynamic');
          return;
        }

        console.log('[AUTH] ✅ Got valid auth token, length:', authToken.length);
        console.log('[AUTH] 📤 Sending sync request to backend...', {
          userId: dynamicUser.userId,
          email: dynamicUser.email,
          wallet: primaryWallet?.address,
        });
        
        // Sync user data to backend (credentials: include to receive session cookie)
        const response = await fetch('/api/auth/dynamic', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // CRITICAL: Must include to receive session cookie
          body: JSON.stringify({
            authToken,
            user: {
              userId: dynamicUser.userId,
              email: dynamicUser.email,
              firstName: dynamicUser.firstName,
              lastName: dynamicUser.lastName,
              verifiedCredentials: dynamicUser.verifiedCredentials,
              walletPublicKey: primaryWallet?.address,
              // Only send serializable wallet data (not the entire object with circular refs)
              primaryWallet: primaryWallet ? {
                address: primaryWallet.address,
                chain: primaryWallet.chain,
                connector: primaryWallet.connector?.key,
              } : null,
              authProvider: dynamicUser.verifiedCredentials?.[0]?.format,
            },
          }),
        });

        console.log('[AUTH] 📥 Backend response:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
        });

        if (response.ok) {
          const data = await response.json();
          console.log('[AUTH] ✅ Sync successful:', data);
          
          // Mark this user as synced to prevent re-syncs
          lastSyncedUserIdRef.current = dynamicUser.userId || null;
          
          // CRITICAL FIX: Immediately fetch and set user data in cache
          console.log('[AUTH] 🔄 Fetching user data to populate cache...');
          const userResponse = await fetch('/api/auth/user', {
            credentials: 'include',
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log('[AUTH] ✅ User data fetched and set in cache:', userData.email);
            queryClient.setQueryData(["/api/auth/user"], userData);
          } else {
            console.error('[AUTH] ❌ Failed to fetch user after sync, status:', userResponse.status);
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
          console.error('[AUTH] ❌ Sync failed:', {
            status: response.status,
            statusText: response.statusText,
            errorResponse: errorDetails,
          });
        }
      } catch (error: any) {
        console.error('[AUTH] ❌ CRITICAL: Failed to sync user to backend:', {
          error: error.message,
          stack: error.stack,
        });
      }
    }

    syncUserToBackend();
  }, [isDynamicAuthenticated, dynamicUser, primaryWallet, user]); // Add 'user' to deps for guard check

  return {
    user,
    isLoading, // Use actual query loading state only - prevents infinite loading
    isAuthenticated: !!user,
    dynamicUser,
    wallet: primaryWallet,
  };
}
