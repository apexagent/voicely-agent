import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/hooks/useAuth';

interface MetricsUpdate {
  tokensEarned?: number;
  callsHandled?: number;
  successRate?: number;
  revenue?: number;
}

interface ActivityUpdate {
  id: string;
  type: string;
  action: string;
  amount?: number;
  createdAt: string;
}

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  metricsUpdate: MetricsUpdate | null;
  activityUpdate: ActivityUpdate | null;
  emit: <T = any>(event: string, data?: T) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [metricsUpdate, setMetricsUpdate] = useState<MetricsUpdate | null>(null);
  const [activityUpdate, setActivityUpdate] = useState<ActivityUpdate | null>(null);

  useEffect(() => {
    // Only create socket once (for both authenticated and public users)
    if (socketRef.current) {
      return;
    }

    console.log('[WebSocket] Initializing singleton connection...');

    // Connect to WebSocket server (SINGLETON)
    const socket = io({
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('[WebSocket] Connected:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('[WebSocket] Disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('[WebSocket] Connection error:', error);
      setIsConnected(false);
    });

    // Metrics updates
    socket.on('metrics:update', (data: MetricsUpdate) => {
      console.log('[WebSocket] Metrics update:', data);
      setMetricsUpdate(data);
    });

    // Activity feed updates
    socket.on('activity:new', (data: ActivityUpdate) => {
      console.log('[WebSocket] New activity:', data);
      setActivityUpdate(data);
    });

    // Agent status updates
    socket.on('agent:status', (data: { agentId: string; status: string }) => {
      console.log('[WebSocket] Agent status:', data);
    });

    // Cleanup on unmount
    return () => {
      console.log('[WebSocket] Cleaning up singleton connection');
      socket.disconnect();
      socketRef.current = null;
    };
  }, []); // Empty dependency array - only initialize once

  const emit = <T = any>(event: string, data?: T) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  };

  const value: WebSocketContextType = {
    socket: socketRef.current,
    isConnected,
    metricsUpdate,
    activityUpdate,
    emit,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket(): WebSocketContextType {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
}
