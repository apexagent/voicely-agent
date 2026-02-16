import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Zap,
  Settings,
  Brain,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import SystemMonitor from "./SystemMonitor";
import type { Agent, Call } from "@shared/schema";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("system");

  // Fetch agents
  const { data: agentsData, isLoading: agentsLoading } = useQuery<{ agents: Agent[] }>({
    queryKey: ["/api/agents"],
  });

  // Fetch calls
  const { data: callsData, isLoading: callsLoading } = useQuery<{ calls: Call[] }>({
    queryKey: ["/api/calls"],
  });

  const agents = agentsData?.agents || [];
  const calls = callsData?.calls || [];
  const activeAgents = agents.filter((a) => a.status === "active");
  const totalCalls = calls.length;
  const successfulCalls = calls.filter((c) => c.outcome === "successful").length;
  const successRate = totalCalls > 0 ? Math.round((successfulCalls / totalCalls) * 100) : 0;

  const isLoading = agentsLoading || callsLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">System monitoring and configuration</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Agents */}
        <div className="bg-black/40 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-gray-500">Total Agents</p>
          </div>
          <p className="text-3xl font-bold text-white" data-testid="text-total-agents">
            {agents.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {activeAgents.length} active
          </p>
        </div>

        {/* Total Calls */}
        <div className="bg-black/40 border border-cyan-500/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-4 h-4 text-cyan-400" />
            <p className="text-xs text-gray-500">Total Calls</p>
          </div>
          <p className="text-3xl font-bold text-white" data-testid="text-dashboard-total-calls">
            {totalCalls.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {successfulCalls} successful
          </p>
        </div>

        {/* Success Rate */}
        <div className="bg-black/40 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-green-400" />
            <p className="text-xs text-gray-500">Success Rate</p>
          </div>
          <p className="text-3xl font-bold text-white" data-testid="text-dashboard-success-rate">
            {successRate}%
          </p>
          <p className="text-xs text-gray-500 mt-1">
            From {totalCalls} calls
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-black/40 border border-purple-500/30 rounded-xl overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="p-6 pb-0">
            <TabsList className="grid w-full grid-cols-2 bg-black/60">
              <TabsTrigger
                value="system"
                data-testid="tab-system"
              >
                <Activity className="w-4 h-4 mr-2" />
                System Monitor
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                data-testid="tab-settings"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <TabsContent value="system" className="m-0">
              <h2 className="text-xl font-bold text-white mb-4">System Health</h2>
              <SystemMonitor />
            </TabsContent>

            <TabsContent value="settings" className="m-0">
              <h2 className="text-xl font-bold text-white mb-4">API Configuration</h2>
              <p className="text-sm text-gray-400 mb-6">
                Voice API status and settings
              </p>
              <Button
                variant="outline"
                className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                data-testid="button-test-apis"
              >
                <Zap className="w-4 h-4 mr-2" />
                Test API Connections
              </Button>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
