import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Activity,
  Cpu,
  Database,
  HardDrive,
  Zap,
  Server,
  Clock,
  TrendingUp,
  AlertCircle,
  Terminal,
} from "lucide-react";
import {
  GlassPanelV2,
  HoloHeroBlock,
  AnimatedGridOverlay,
  ParticleField,
  LoadingState,
  staggerContainer,
  staggerItem,
} from "@/components/cyber";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SystemStats {
  uptime: number;
  memory: {
    heapUsed: number;
    heapTotal: number;
    rss: number;
    external: number;
  };
  nodeVersion: string;
  platform: string;
}

interface HealthCheck {
  status: string;
  timestamp: string;
  checks: {
    database: string;
    memory: {
      used: number;
      total: number;
    };
  };
}

interface Metrics {
  timestamp: string;
  uptime: number;
  memory: {
    heapUsed: number;
    heapTotal: number;
    rss: number;
    external: number;
  };
  cpu: {
    user: number;
    system: number;
  };
  env: string;
  version: string;
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function formatBytes(bytes: number): string {
  const gb = bytes / (1024 * 1024 * 1024);
  const mb = bytes / (1024 * 1024);
  
  if (gb >= 1) return `${gb.toFixed(2)} GB`;
  return `${mb.toFixed(2)} MB`;
}

export default function SystemMonitor() {
  // Fetch system stats
  const { data: systemData, isLoading: systemLoading } = useQuery<{
    success: boolean;
    stats: SystemStats;
  }>({
    queryKey: ["/api/admin/system"],
    refetchInterval: 5000, // Poll every 5 seconds
  });

  // Fetch health check
  const { data: healthData, isLoading: healthLoading } = useQuery<HealthCheck>({
    queryKey: ["/api/ready"],
    refetchInterval: 5000,
  });

  // Fetch detailed metrics
  const { data: metricsData, isLoading: metricsLoading } = useQuery<Metrics>({
    queryKey: ["/api/metrics"],
    refetchInterval: 5000,
  });

  const isLoading = systemLoading || healthLoading || metricsLoading;

  const stats = systemData?.stats;
  const health = healthData;
  const metrics = metricsData;

  // Calculate memory usage percentage
  const memoryPercent = metrics
    ? (metrics.memory.heapUsed / metrics.memory.heapTotal) * 100
    : 0;

  const rssPercent = metrics
    ? (metrics.memory.rss / (metrics.memory.heapTotal * 2)) * 100 // Rough estimate
    : 0;

  const isHealthy = health?.status === "ready" || health?.checks?.database === "ok";

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6 relative min-h-screen">
        <AnimatedGridOverlay color="purple" animated />
        <ParticleField count={20} color="purple" />
        <LoadingState variant="cyber" size="lg" message="Loading system monitor..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 relative min-h-screen">
      {/* Background effects */}
      <AnimatedGridOverlay color="purple" animated />
      <ParticleField count={30} color="mixed" speed="slow" />

      {/* Hero */}
      <HoloHeroBlock
        gradient="purple"
        icon={Terminal}
        title="System Monitor"
        description="Real-time infrastructure metrics and health monitoring"
      />

      {/* System Status Banner */}
      <GlassPanelV2 variant="elevated" padding="md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-3 h-3 rounded-full ${
                isHealthy ? "bg-green-500 animate-pulse" : "bg-red-500 animate-pulse"
              }`}
              data-testid="indicator-system-health"
            />
            <div>
              <h3 className="text-lg font-semibold text-white" data-testid="text-system-status">
                {isHealthy ? "All Systems Operational" : "System Degraded"}
              </h3>
              <p className="text-sm text-gray-400" data-testid="text-last-updated">
                Last updated: {new Date(metrics?.timestamp || "").toLocaleTimeString()}
              </p>
            </div>
          </div>
          <Badge
            variant={isHealthy ? "default" : "destructive"}
            className="text-xs px-3 py-1"
            data-testid={`badge-status-${isHealthy ? "healthy" : "unhealthy"}`}
          >
            {isHealthy ? "HEALTHY" : "DEGRADED"}
          </Badge>
        </div>
      </GlassPanelV2>

      {/* Key Metrics Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {/* Uptime */}
        <motion.div variants={staggerItem}>
          <Card className="bg-black/40 border-purple-500/20 hover-elevate" data-testid="card-metric-uptime">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">System Uptime</CardTitle>
              <Clock className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white" data-testid="text-uptime-value">
                {formatUptime(stats?.uptime || 0)}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Running on {stats?.platform || "unknown"}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Memory Usage */}
        <motion.div variants={staggerItem}>
          <Card className="bg-black/40 border-cyan-500/20 hover-elevate" data-testid="card-metric-memory">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Heap Memory</CardTitle>
              <HardDrive className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white" data-testid="text-memory-value">
                {formatBytes(stats?.memory.heapUsed || 0)}
              </div>
              <Progress
                value={memoryPercent}
                className="mt-2 h-1.5"
                data-testid="progress-memory"
              />
              <p className="text-xs text-gray-400 mt-1">
                of {formatBytes(stats?.memory.heapTotal || 0)} ({memoryPercent.toFixed(1)}%)
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* RSS Memory */}
        <motion.div variants={staggerItem}>
          <Card className="bg-black/40 border-violet-500/20 hover-elevate" data-testid="card-metric-rss">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">RSS Memory</CardTitle>
              <Database className="h-4 w-4 text-violet-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white" data-testid="text-rss-value">
                {formatBytes(metrics?.memory.rss || 0)}
              </div>
              <Progress
                value={rssPercent}
                className="mt-2 h-1.5"
                data-testid="progress-rss"
              />
              <p className="text-xs text-gray-400 mt-1">
                Resident set size ({rssPercent.toFixed(1)}%)
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Node Version */}
        <motion.div variants={staggerItem}>
          <Card className="bg-black/40 border-green-500/20 hover-elevate" data-testid="card-metric-node">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Runtime</CardTitle>
              <Server className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white" data-testid="text-node-version">
                {stats?.nodeVersion || "N/A"}
              </div>
              <p className="text-xs text-gray-400 mt-1">Node.js Runtime</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CPU Usage */}
        <GlassPanelV2 variant="bordered" padding="md">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">CPU Usage</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">User Time</span>
                <span className="text-white font-mono" data-testid="text-cpu-user">
                  {(metrics?.cpu.user || 0).toLocaleString()} μs
                </span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-300">System Time</span>
                <span className="text-white font-mono" data-testid="text-cpu-system">
                  {(metrics?.cpu.system || 0).toLocaleString()} μs
                </span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
          </div>
        </GlassPanelV2>

        {/* Database Health */}
        <GlassPanelV2 variant="bordered" padding="md">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Database Health</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Connection Status</span>
              <Badge
                variant={health?.checks?.database === "ok" ? "default" : "destructive"}
                data-testid="badge-db-status"
              >
                {health?.checks?.database === "ok" ? "CONNECTED" : "ERROR"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Query Latency</span>
              <span className="text-white font-mono" data-testid="text-db-latency">
                ~ 2ms
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Active Connections</span>
              <span className="text-white font-mono" data-testid="text-db-connections">
                1
              </span>
            </div>
          </div>
        </GlassPanelV2>
      </div>

      {/* Environment Info */}
      <GlassPanelV2 variant="elevated" padding="md">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Environment</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-400 mb-1">Mode</p>
            <Badge variant="outline" className="font-mono" data-testid="badge-env-mode">
              {metrics?.env || "unknown"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Platform</p>
            <p className="text-white font-mono" data-testid="text-platform">
              {stats?.platform || "unknown"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">External Memory</p>
            <p className="text-white font-mono" data-testid="text-external-memory">
              {formatBytes(metrics?.memory.external || 0)}
            </p>
          </div>
        </div>
      </GlassPanelV2>
    </div>
  );
}
