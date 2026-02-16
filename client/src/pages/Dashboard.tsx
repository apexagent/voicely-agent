import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Coins,
  Phone,
  TrendingUp,
  Bot,
  Plus,
  Sparkles,
  Zap,
  Users,
  DollarSign,
  Clock,
  ChevronRight,
  Headphones,
  Briefcase,
  Radio,
  Calendar,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

// Agent portraits
import alicePortrait from "@assets/generated_images/Alice_Support_Agent_New.png";
import sarahPortrait from "@assets/c57e465e-117a-48b6-ac72-f595b2147893_1762597948606.png";
import emmaPortrait from "@assets/dbd2eb13-b3a0-4352-ad50-b1e1e6c83823_1762597948606.png";
import avaPortrait from "@assets/dbd2eb13-b3a0-4352-ad50-b1e1e6c83823_1762597948606.png";
import mayaPortrait from "@assets/c6a83411-9447-410d-bda5-46daa0aa23f9_1762597948605.png";

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  callsHandled: number;
  revenue?: number;
  successRate?: number;
}

interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  totalCallsHandled: number;
  voiceTokenBalance: number;
  subscriptionTier: string;
}

// Agent type configurations with icons and portraits
const agentConfig: Record<string, { icon: any; gradient: string; portrait: string }> = {
  support: {
    icon: Headphones,
    gradient: "from-cyan-500 to-blue-600",
    portrait: alicePortrait,
  },
  sales: {
    icon: Briefcase,
    gradient: "from-purple-500 to-violet-600",
    portrait: sarahPortrait,
  },
  receptionist: {
    icon: Radio,
    gradient: "from-green-500 to-emerald-600",
    portrait: emmaPortrait,
  },
  appointment: {
    icon: Calendar,
    gradient: "from-orange-500 to-amber-600",
    portrait: avaPortrait,
  },
  followup: {
    icon: UserPlus,
    gradient: "from-pink-500 to-rose-600",
    portrait: mayaPortrait,
  },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Fetch user data
  const { data: userData } = useQuery<UserType>({
    queryKey: ["/api/auth/user"],
    enabled: !!user,
  });

  // Fetch agents
  const { data: agentsResponse } = useQuery<{ agents: Agent[] }>({
    queryKey: ["/api/agents"],
    enabled: !!user,
  });

  const agents = agentsResponse?.agents || [];
  const activeAgents = agents.filter(a => a.status === "active");
  const totalCalls = agents.reduce((sum, a) => sum + a.callsHandled, 0);
  const totalRevenue = agents.reduce((sum, a) => sum + (a.revenue || 0), 0);

  return (
    <div className="min-h-screen bg-[#0A0B1E] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Command Center
              </h1>
              <p className="text-gray-400">
                {userData?.firstName || 'User'} • {agents.length} agents deployed
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover-elevate active-elevate-2"
                onClick={() => navigate("/agent-studio")}
                data-testid="button-create-agent"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Agent
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-purple-500/30"
                onClick={() => navigate("/my-agents")}
                data-testid="button-view-agents"
              >
                <Bot className="w-5 h-5 mr-2" />
                My Agents
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Active Agents */}
          <Card className="bg-black/40 border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Bot className="w-7 h-7 text-purple-400" />
              {activeAgents.length > 0 && (
                <Badge className="bg-green-500/20 text-green-400 border-green-400/30 text-xs">
                  ACTIVE
                </Badge>
              )}
            </div>
            <div className="text-3xl font-bold text-white mb-1" data-testid="text-active-agents">
              {activeAgents.length}
            </div>
            <div className="text-sm text-gray-400">Active Agents</div>
            <div className="mt-2 text-xs text-purple-400">
              {agents.length} total
            </div>
          </Card>

          {/* Total Calls */}
          <Card className="bg-black/40 border-cyan-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Phone className="w-7 h-7 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1" data-testid="text-total-calls">
              {totalCalls.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Calls Handled</div>
          </Card>

          {/* Revenue */}
          <Card className="bg-black/40 border-green-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="w-7 h-7 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1" data-testid="text-revenue">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Revenue</div>
          </Card>

          {/* $VOICE Tokens */}
          <Card className="bg-black/40 border-violet-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <Coins className="w-7 h-7 text-violet-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1" data-testid="text-voice-tokens">
              {(userData?.voiceTokenBalance || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">$VOICE Tokens</div>
          </Card>
        </div>


        {/* Empty State */}
        {agents.length === 0 && (
          <Card className="bg-black/40 border-purple-500/20 rounded-xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
              <Bot className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Create Your First Agent</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Deploy AI voice agents to handle customer calls 24/7.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-violet-600 hover-elevate active-elevate-2"
              onClick={() => navigate("/mobile/contact")}
              data-testid="button-create-first-agent"
            >
              <Plus className="w-5 h-5 mr-2" />
              Talk to Alice
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
