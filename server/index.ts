import express, { type Request, Response, NextFunction } from "express";
import { createServer, type ServerResponse } from "http";
import { Server } from "socket.io";
import { EventEmitter } from "events";
import compression from "compression";
import path from "path";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupVoiceWebSocket } from "./voice";
import { logger } from "./utils/logger";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { securityHeaders, sanitizeInput, requestId, requestLogger } from "./middleware/security";
import { standardLimiter } from "./middleware/rateLimiter";

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO for real-time updates
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === "development" ? "http://localhost:5000" : true,
    credentials: true,
  },
});

// Store session middleware reference for Socket.IO authentication
let sessionMiddleware: any = null;

export function setSessionMiddleware(middleware: any) {
  sessionMiddleware = middleware;

  // Apply session middleware to Socket.IO using io.use()
  io.use((socket, next) => {
    const req = socket.request as any;
    
    // Use actual response from socket.request if available, otherwise create a proper mock
    let res = (req as any).res;
    
    if (!res) {
      // Create a proper EventEmitter-based response mock
      class MockResponse extends EventEmitter {
        statusCode = 200;
        finished = false;
        
        getHeader() { return undefined; }
        setHeader() { return this; }
        removeHeader() { return this; }
        writeHead() { return this; }
        write() { return true; }
        end() {
          this.finished = true;
          this.emit('finish');
          return this;
        }
      }
      
      res = new MockResponse();
      (req as any).res = res;
    }

    // Run session middleware with proper response object
    sessionMiddleware(req, res, (err: any) => {
      if (err) {
        log(`WebSocket session warning: ${socket.id} - ${err.message}`);
      }

      const session = req.session;
      const user = session?.passport?.user;

      if (user && user.claims?.sub) {
        // Store authenticated user ID in socket data
        socket.data.userId = user.claims.sub;
        socket.data.isAuthenticated = true;
        log(`WebSocket authenticated: ${socket.id} (user: ${user.claims.sub})`);
      } else {
        // Allow public access for voice demos
        socket.data.userId = null;
        socket.data.isAuthenticated = false;
        log(`WebSocket public connection: ${socket.id} (unauthenticated)`);
      }
      
      next();
    });
  });
}

// Setup voice WebSocket handlers
setupVoiceWebSocket(io);

// Socket.IO connection handler (for both authenticated and public clients)
io.on("connection", (socket) => {
  const userId = socket.data.userId;
  const isAuthenticated = socket.data.isAuthenticated;
  
  log(`WebSocket client connected: ${socket.id} (${isAuthenticated ? `user: ${userId}` : 'public'})`);

  // Automatically join authenticated users to their own room
  if (isAuthenticated && userId) {
    socket.join(`user:${userId}`);
    log(`Client ${socket.id} auto-joined room user:${userId}`);
    // Acknowledge room join for authenticated users
    socket.emit("room-joined", { userId });
  }

  socket.on("disconnect", () => {
    log(`WebSocket client disconnected: ${socket.id}`);
  });
});

// ============================================
// PHASE 1: SECURITY & PERFORMANCE MIDDLEWARE
// ============================================

// Trust proxy (required for rate limiting and IP detection)
app.set('trust proxy', 1);

// Response compression (gzip/brotli)
app.use(compression());

// Security headers (helmet)
app.use(securityHeaders);

// Request ID for tracing
app.use(requestId);

// Request logging
app.use(requestLogger);

// Body parsing with raw body capture
declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  },
  limit: '10mb', // Increase for large payloads
}));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Input sanitization (XSS and NoSQL injection prevention)
app.use(sanitizeInput);

// Global rate limiting (can be overridden per-route)
app.use('/api', standardLimiter);

// Legacy request logging (kept for compatibility)
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Register all API routes
  await registerRoutes(app);

  // Serve attached assets (images, files)
  const attachedAssetsPath = path.resolve(import.meta.dirname, "..", "attached_assets");
  app.use('/attached_assets', express.static(attachedAssetsPath));

  // Vite setup (development) or static serving (production)
  if (app.get("env") === "development") {
    await setupVite(app, httpServer);
  } else {
    serveStatic(app);
  }

  // 404 handler for unmatched routes
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);

  // Graceful shutdown handler
  const shutdown = async () => {
    logger.info('Shutdown signal received, closing server gracefully...');
    
    httpServer.close(() => {
      logger.info('HTTP server closed');
    });

    // Close Socket.IO connections
    io.close(() => {
      logger.info('Socket.IO connections closed');
    });

    // Give ongoing requests 10 seconds to complete
    setTimeout(() => {
      logger.error('Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  // Listen for shutdown signals
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', error);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', { promise, reason });
  });

  // Start server - use PORT env variable (required for Replit Autoscale deployments)
  const port = parseInt(process.env.PORT || '5000', 10);
  
  logger.info(`Attempting to start server on port ${port}...`);
  logger.info(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  logger.info(`DATABASE_URL: ${process.env.DATABASE_URL ? 'configured' : 'NOT SET'}`);
  
  httpServer.listen(port, "0.0.0.0", () => {
    logger.info(`🚀 Voicely Agent Server started on port ${port}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`Security: Helmet enabled, Rate limiting active`);
  });
  
  httpServer.on('error', (error: NodeJS.ErrnoException) => {
    logger.error(`Failed to start server: ${error.message}`);
    if (error.code === 'EADDRINUSE') {
      logger.error(`Port ${port} is already in use`);
    }
    process.exit(1);
  });
})().catch((error) => {
  logger.error('Server initialization failed:', error);
  console.error('FATAL: Server initialization failed:', error);
  process.exit(1);
});
