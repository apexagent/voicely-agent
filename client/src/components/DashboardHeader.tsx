import { useWebSocket } from "@/hooks/useWebSocket";
import voicelyLogo from "@assets/Untitled design (11)_1762790672251.png";

export default function DashboardHeader() {
  const { isConnected } = useWebSocket();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-cyan-500/20 backdrop-blur-xl bg-[#0A0B1E]/90"
      data-testid="header-dashboard"
    >
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Status Indicators */}
        <div className="flex items-center gap-4">
          {/* WebSocket Status */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5"
            data-testid="indicator-websocket"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected
                  ? 'bg-green-400 animate-pulse'
                  : 'bg-gray-500'
              }`}
            />
            <span className="text-xs text-cyan-300">
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>

          {/* Voicely Logo */}
          <div
            className="flex items-center px-3 py-1.5"
            data-testid="logo-voicely-header"
          >
            <img 
              src={voicelyLogo} 
              alt="Voicely" 
              className="h-8 w-auto" 
            />
          </div>
        </div>
      </div>
    </header>
  );
}
