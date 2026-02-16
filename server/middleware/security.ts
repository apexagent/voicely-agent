import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://terminal.jup.ag'], // Jupiter Terminal styles
      fontSrc: ["'self'", 'https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://terminal.jup.ag', 'https://dynamic-static-assets.com', 'https://*.dynamic-static-assets.com'], // Unsafe-eval for Vite HMR, Jupiter + Dynamic
      connectSrc: [
        "'self'",
        'https://api.deepseek.com',
        'https://api.elevenlabs.io',
        'https://api.mainnet-beta.solana.com', // Solana RPC for Jupiter Terminal
        'https://*.helius-rpc.com', // Helius RPC (alternative)
        'https://*.solana.com', // Solana RPC endpoints
        'https://*.jup.ag', // Jupiter APIs (tokens, quotes, price)
        'https://app.dynamic.xyz', // Dynamic.xyz API
        'https://app.dynamicauth.com', // Dynamic.xyz authentication
        'https://dynamic-static-assets.com', // Dynamic.xyz static assets (base)
        'https://*.dynamic-static-assets.com', // Dynamic.xyz static assets (subdomains)
        'https://logs.dynamicauth.com', // Dynamic.xyz logging/analytics
        'wss://*.replit.dev',
        'ws://localhost:*',
      ],
      mediaSrc: ["'self'", 'blob:', 'data:'], // Allow blob and data URLs for audio playback
      frameSrc: ["'self'", 'https://terminal.jup.ag', 'https://app.dynamicauth.com'], // Jupiter Terminal + Dynamic.xyz embedded wallets
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false, // Needed for some external resources
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

// Input sanitization middleware - PRODUCTION-SAFE VERSION
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize request body (NoSQL injection only - no naive XSS stripping)
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
};

// Recursive sanitization function - SAFE VERSION
function sanitizeObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj; // Return as-is, no string manipulation
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const sanitized: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      // Remove keys that start with $ (NoSQL injection prevention only)
      if (key.startsWith('$')) {
        logger.warn('Blocked NoSQL injection attempt', { key });
        continue;
      }
      sanitized[key] = sanitizeObject(obj[key]);
    }
  }
  return sanitized;
}

// XSS prevention is handled by:
// 1. helmet CSP headers
// 2. React's built-in XSS protection
// 3. Proper output encoding in templates
// No need for naive string stripping that corrupts data

// CORS configuration
export const corsConfig = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://voicelyagent.ai', 'https://www.voicelyagent.ai']
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Per-Page'],
  maxAge: 86400, // 24 hours
};

// Request ID middleware for tracing
export const requestId = (req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] || generateRequestId();
  (req as any).requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
};

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Request logging middleware - USES WINSTON LOGGER
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      requestId: (req as any).requestId,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    };

    // Log based on status code using Winston (imported at top)
    if (res.statusCode >= 500) {
      logger.error('Request error', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Request warning', logData);
    } else {
      logger.http('Request', logData);
    }
  });

  next();
};
