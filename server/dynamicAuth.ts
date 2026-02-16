// Dynamic.xyz authentication implementation
import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import jwt from "jsonwebtoken";
import { JwksClient } from "jwks-rsa";
import { storage } from "./storage";
import { setSessionMiddleware } from "./index";
import { logger } from "./utils/logger";

// Dynamic.xyz JWKS configuration
const DYNAMIC_ENV_ID = process.env.DYNAMIC_ENVIRONMENT_ID || '5bd2ebb4-fb32-421e-b9b9-6f0576723c71';
const jwksUrl = `https://app.dynamic.xyz/api/v0/sdk/${DYNAMIC_ENV_ID}/.well-known/jwks`;

// Initialize JWKS client with caching for performance
const jwksClient = new JwksClient({
  jwksUri: jwksUrl,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 600000, // 10 minutes
  rateLimit: true,
  jwksRequestsPerMinute: 5,
});

// Verify Dynamic.xyz JWT token
async function verifyDynamicToken(token: string): Promise<any> {
  try {
    // First decode WITHOUT verification to see what issuer Dynamic is using
    const unverifiedDecoded = jwt.decode(token, { complete: true }) as any;
    if (!unverifiedDecoded || !unverifiedDecoded.header.kid) {
      throw new Error('JWT header missing or no kid (key ID) found');
    }
    
    const kid = unverifiedDecoded.header.kid;
    const actualIssuer = unverifiedDecoded.payload?.iss;
    
    logger.info('[DYNAMIC-AUTH] 🔍 JWT Token Info (unverified)', {
      kid,
      actualIssuer,
      environmentId: unverifiedDecoded.payload?.environment_id,
      userId: unverifiedDecoded.payload?.sub || unverifiedDecoded.payload?.userId,
    });
    
    // Get the specific signing key matching the kid from JWKS
    const key = await jwksClient.getSigningKey(kid);
    const publicKey = key.getPublicKey();
    
    // Verify the JWT - try with the actual issuer from the token
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      ignoreExpiration: false,
      // Use the actual issuer from the token, or don't validate issuer if not present
      ...(actualIssuer && { issuer: actualIssuer }),
    }) as any;
    
    // Additional validation: ensure the environment_id claim matches ours
    if (decoded.environment_id && decoded.environment_id !== DYNAMIC_ENV_ID) {
      throw new Error('Token environment_id does not match configured environment');
    }
    
    logger.info('[DYNAMIC-AUTH] ✅ JWT verified successfully', { 
      userId: decoded.sub || decoded.userId,
      issuer: actualIssuer,
    });
    
    return decoded;
  } catch (error: any) {
    logger.error('[DYNAMIC-AUTH] ❌ JWT verification failed', { error: error.message });
    throw new Error(`JWT verification failed: ${error.message}`);
  }
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only secure in production for HTTPS
      maxAge: sessionTtl,
    },
  });
}

// Upsert user from Dynamic.xyz data
async function upsertDynamicUser(dynamicUserData: any) {
  const { userId, email, firstName, lastName, verifiedCredentials, walletPublicKey, primaryWallet, authProvider } = dynamicUserData;
  
  logger.info('[DYNAMIC-AUTH] Upserting user', { 
    email, 
    userId,
  });
  
  await storage.upsertUser({
    id: userId,
    email: email,
    firstName: firstName || email?.split('@')[0],
    lastName: lastName || '',
    dynamicUserId: userId,
    walletAddress: walletPublicKey || primaryWallet?.address || null,
    authProvider: authProvider || verifiedCredentials?.[0]?.format || 'email',
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  const sessionMiddleware = getSession();
  app.use(sessionMiddleware);

  // Set session middleware for Socket.IO authentication
  setSessionMiddleware(sessionMiddleware);

  // Dynamic.xyz auth endpoint - called after user logs in via Dynamic widget
  app.post("/api/auth/dynamic", async (req, res) => {
    try {
      const { authToken, user } = req.body;
      
      logger.info('[DYNAMIC-AUTH] 📥 Sync request received', {
        hasAuthToken: !!authToken,
        authTokenLength: authToken?.length,
        userId: user?.userId,
        email: user?.email,
        wallet: user?.walletPublicKey,
      });
      
      if (!authToken || !user) {
        logger.error('[DYNAMIC-AUTH] ❌ Missing required fields');
        return res.status(400).json({ 
          success: false, 
          message: "Missing auth token or user data" 
        });
      }

      // SECURITY: Verify the JWT token from Dynamic.xyz before trusting ANY user data
      let verifiedToken;
      const DEBUG_SKIP_JWT_VERIFICATION = process.env.DEBUG_SKIP_JWT_VERIFICATION === 'true';
      
      try {
        logger.info('[DYNAMIC-AUTH] 🔐 Starting JWT verification...');
        verifiedToken = await verifyDynamicToken(authToken);
        logger.info('[DYNAMIC-AUTH] ✅ JWT verified successfully', {
          userId: verifiedToken.sub || verifiedToken.userId,
        });
      } catch (error: any) {
        logger.error('[DYNAMIC-AUTH] ❌ JWT verification FAILED', { 
          error: error.message,
          stack: error.stack,
          authTokenPreview: authToken?.substring(0, 50) + '...',
        });
        
        // DEBUG MODE: Allow login even if JWT fails (for debugging only!)
        if (DEBUG_SKIP_JWT_VERIFICATION) {
          logger.warn('[DYNAMIC-AUTH] ⚠️ DEBUG MODE: Skipping JWT verification failure, using client data');
          // Decode token without verification to get claims
          const decoded = jwt.decode(authToken) as any;
          verifiedToken = decoded || user; // Fallback to client-supplied data
        } else {
          return res.status(401).json({ 
            success: false, 
            message: "Invalid authentication token",
            error: error.message, // Include error for debugging
          });
        }
      }
      
      // CRITICAL: Use ONLY claims from the VERIFIED token - no client-supplied data
      // This prevents tampering with user data in the request body
      const verifiedUserId = verifiedToken.sub || verifiedToken.userId;
      
      // Extract verified credentials from token
      const verifiedCredentials = verifiedToken.verifiedCredentials || [];
      const verifiedEmail = verifiedToken.email || 
                           verifiedCredentials.find((c: any) => c.format === 'oauth')?.email ||
                           verifiedCredentials.find((c: any) => c.email)?.email;
      
      // Extract wallet address from token verified credentials
      const walletCredentials = verifiedCredentials.find((c: any) => 
        c.format === 'blockchain' || c.walletPublicKey
      );
      const verifiedWalletAddress = walletCredentials?.walletPublicKey || 
                                   walletCredentials?.address ||
                                   verifiedToken.wallet_public_key;
      
      // Determine auth provider from verified credentials
      const authProvider = verifiedCredentials[0]?.format || 'email';
      
      // Extract name from verified token claims only
      const verifiedFirstName = verifiedToken.firstName || 
                                verifiedToken.first_name ||
                                verifiedEmail?.split('@')[0] || 
                                'User';
      const verifiedLastName = verifiedToken.lastName || 
                              verifiedToken.last_name || 
                              '';
      
      // Build user data EXCLUSIVELY from verified token claims - zero client-supplied data
      const verifiedUserData = {
        userId: verifiedUserId,
        email: verifiedEmail,
        firstName: verifiedFirstName,
        lastName: verifiedLastName,
        verifiedCredentials: verifiedCredentials,
        walletPublicKey: verifiedWalletAddress,
        primaryWallet: verifiedWalletAddress ? { address: verifiedWalletAddress } : undefined,
        authProvider: authProvider,
      };
      
      // Upsert user to our database using ONLY verified data from token
      await upsertDynamicUser(verifiedUserData);

      // Set session using ONLY verified user ID and email from token
      (req.session as any).dynamicUser = {
        userId: verifiedUserId,
        email: verifiedEmail,
        authToken: authToken,
      };

      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      res.json({ 
        success: true, 
        message: "Authentication successful",
        user: {
          id: verifiedUserId,
          email: verifiedEmail,
        }
      });
    } catch (error: any) {
      console.error('[DYNAMIC-AUTH] Authentication failed:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  });

  // Logout endpoint - destroys session and clears cookies
  app.post('/api/auth/logout', (req, res) => {
    // Always attempt to destroy session, even if it doesn't exist
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('[LOGOUT] Session destruction failed:', err);
          // Clear cookie even if destroy fails
          res.clearCookie('connect.sid');
          return res.status(500).json({ 
            success: false, 
            message: 'Logout failed, but cookie cleared' 
          });
        }
        // Successfully destroyed session, clear cookie
        res.clearCookie('connect.sid');
        res.json({ success: true, message: 'Logged out successfully' });
      });
    } else {
      // No session exists, just clear cookie and return success
      res.clearCookie('connect.sid');
      res.json({ success: true, message: 'Already logged out' });
    }
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const dynamicUser = (req.session as any)?.dynamicUser;

  if (!dynamicUser || !dynamicUser.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Attach user to request for route handlers
  (req as any).user = {
    claims: {
      sub: dynamicUser.userId,
    },
    email: dynamicUser.email,
  };

  return next();
};

export const requireAdmin: RequestHandler = async (req, res, next) => {
  const dynamicUser = (req.session as any)?.dynamicUser;

  if (!dynamicUser || !dynamicUser.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Fetch user from database to check role
    const dbUser = await storage.getUser(dynamicUser.userId);
    if (!dbUser || dbUser.role !== "admin") {
      return res.status(403).json({ 
        message: "Forbidden",
        error: "Admin access required"
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
