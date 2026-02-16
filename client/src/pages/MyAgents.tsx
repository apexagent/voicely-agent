import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Plus, 
  Phone, 
  Headphones, 
  Briefcase, 
  Calendar, 
  UserPlus,
  Settings,
  Trash2,
  Power,
  PowerOff,
  Sparkles,
  Link2,
  Copy,
  Check,
  ExternalLink,
  Edit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { LoadingState } from "@/components/cyber";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Default agent portraits
import alicePortrait from "@assets/generated_images/Alice_Support_Agent_New.png";
import sarahPortrait from "@assets/c57e465e-117a-48b6-ac72-f595b2147893_1762597948606.png";
import emmaPortrait from "@assets/dbd2eb13-b3a0-4352-ad50-b1e1e6c83823_1762597948606.png";
import avaPortrait from "@assets/dbd2eb13-b3a0-4352-ad50-b1e1e6c83823_1762597948606.png";
import mayaPortrait from "@assets/c6a83411-9447-410d-bda5-46daa0aa23f9_1762597948605.png";
import teamHero from "@assets/team-hero.png";

interface Agent {
  id: string;
  userId: string;
  name: string;
  type: string;
  status: string;
  voiceId: string | null;
  personality: string | null;
  systemPrompt: string | null;
  customUrl: string | null;
  callsHandled: number;
  revenue: number;
  successRate: number;
  avgResponseTime: number;
  createdAt: string;
}

// Agent type configurations
const agentTypeConfig = {
  support: {
    icon: Headphones,
    gradient: "from-cyan-500 to-blue-600",
    defaultPortrait: alicePortrait,
    badges: ["Issue resolution", "Technical help"]
  },
  sales: {
    icon: Briefcase,
    gradient: "from-purple-500 to-violet-600",
    defaultPortrait: sarahPortrait,
    badges: ["Lead conversion", "Objection handling"]
  },
  receptionist: {
    icon: Phone,
    gradient: "from-green-500 to-emerald-600",
    defaultPortrait: emmaPortrait,
    badges: ["Call routing", "Information"]
  },
  appointment: {
    icon: Calendar,
    gradient: "from-orange-500 to-amber-600",
    defaultPortrait: avaPortrait,
    badges: ["Smart scheduling", "Calendar sync"]
  },
  followup: {
    icon: UserPlus,
    gradient: "from-pink-500 to-rose-600",
    defaultPortrait: mayaPortrait,
    badges: ["Lead nurturing", "Re-engagement"]
  }
};

export default function MyAgents() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null);
  const [copiedAgentId, setCopiedAgentId] = useState<string | null>(null);
  const [editUrlDialogOpen, setEditUrlDialogOpen] = useState(false);
  const [agentToEdit, setAgentToEdit] = useState<Agent | null>(null);
  const [customUrlInput, setCustomUrlInput] = useState("");

  // Fetch agents
  const { data: agentsResponse, isLoading } = useQuery<{ success: boolean; agents: Agent[] }>({
    queryKey: ["/api/agents"],
  });

  const agents = agentsResponse?.agents || [];

  // Delete agent mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/agents/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({
        title: "Agent Deleted",
        description: "Your agent has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete agent",
        variant: "destructive",
      });
    },
  });

  // Toggle agent status mutation
  const toggleMutation = useMutation({
    mutationFn: ({ id, currentStatus }: { id: string; currentStatus: string }) =>
      apiRequest("PATCH", `/api/agents/${id}`, {
        status: currentStatus === "active" ? "paused" : "active",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({
        title: "Status Updated",
        description: "Agent status changed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });

  // Update vanity URL mutation
  const updateUrlMutation = useMutation({
    mutationFn: ({ id, customUrl }: { id: string; customUrl: string | null }) =>
      apiRequest("PATCH", `/api/agents/${id}`, { customUrl }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      setEditUrlDialogOpen(false);
      setAgentToEdit(null);
      setCustomUrlInput("");
      toast({
        title: "Vanity URL Updated",
        description: "Your agent's custom URL has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      // Provide user-friendly error messages
      let errorMessage = error.message || "Failed to update vanity URL";
      
      // Check for duplicate URL constraint violation
      if (errorMessage.includes("unique constraint") || errorMessage.includes("duplicate")) {
        errorMessage = "This URL is already taken. Please choose a different one.";
      }
      
      toast({
        title: "URL Already Taken",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleDeleteClick = (agent: Agent) => {
    setAgentToDelete(agent);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (agentToDelete) {
      deleteMutation.mutate(agentToDelete.id);
      setDeleteDialogOpen(false);
      setAgentToDelete(null);
    }
  };

  const handleToggleStatus = (agent: Agent) => {
    toggleMutation.mutate({ id: agent.id, currentStatus: agent.status });
  };

  const handleCopyVanityUrl = async (agent: Agent) => {
    if (!agent.customUrl) {
      toast({
        title: "No Custom URL",
        description: "Set a custom URL first to enable sharing",
        variant: "destructive",
      });
      return;
    }
    
    const vanityUrl = `https://voicelyagent.ai/agent/${agent.customUrl}`;
    
    try {
      await navigator.clipboard.writeText(vanityUrl);
      setCopiedAgentId(agent.id);
      toast({
        title: "Link Copied!",
        description: "Agent URL copied to clipboard",
      });
      setTimeout(() => setCopiedAgentId(null), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy URL to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleEditUrlClick = (agent: Agent) => {
    setAgentToEdit(agent);
    setCustomUrlInput(agent.customUrl || "");
    setEditUrlDialogOpen(true);
  };

  const handleUpdateUrl = () => {
    if (!agentToEdit) return;
    
    // Validate input
    const trimmedUrl = customUrlInput.trim();
    if (trimmedUrl && !/^[a-z0-9-]+$/.test(trimmedUrl)) {
      toast({
        title: "Invalid URL",
        description: "Custom URL can only contain lowercase letters, numbers, and hyphens",
        variant: "destructive",
      });
      return;
    }

    updateUrlMutation.mutate({
      id: agentToEdit.id,
      customUrl: trimmedUrl || null,
    });
  };

  const formatDuration = (seconds: number | null | undefined) => {
    // Handle invalid values
    if (seconds == null || isNaN(seconds) || seconds === 0) {
      return "0s";
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (mins === 0) {
      return `${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  const getTypeConfig = (type: string) => {
    return agentTypeConfig[type as keyof typeof agentTypeConfig] || agentTypeConfig.support;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0B1E]">
        <LoadingState variant="branded" size="md" message="Loading your agents..." data-testid="loading-branded" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B1E]">
      {/* Hero Banner with Team Image - Responsive height */}
      <div className="relative h-[280px] md:h-[350px] lg:h-[400px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${teamHero})` }}
        >
          {/* Gradient Overlay - Dark from bottom, transparent at top for smooth blend */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B1E] via-[#0A0B1E]/90 to-[#0A0B1E]/30"></div>
          
          {/* Purple/Cyan accent gradient for brand colors */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-cyan-600/20"></div>
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-6 md:pb-10 lg:pb-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 md:gap-6">
            <div className="flex-1">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 md:mb-3 break-words"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  My AI Agent Workforce
                </span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm md:text-base lg:text-lg text-gray-300 max-w-2xl break-words"
              >
                Deploy, monitor, and scale your elite AI voice agents. Handle customer calls, appointments, and sales 24/7 with human-level intelligence.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-shrink-0"
            >
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover-elevate active-elevate-2 text-base md:text-lg px-6 md:px-8 py-4 md:py-6 h-auto"
                onClick={() => navigate("/agent-studio")}
                data-testid="button-create-agent"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5 mr-2 flex-shrink-0" />
                Create Agent
              </Button>
            </motion.div>
          </div>

          {/* Quick Stats - Overlaid on hero */}
          {agents.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
            >
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">
                  {agents.length}
                </div>
                <div className="text-sm text-gray-300">Total Agents</div>
              </div>
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">
                  {agents.filter(a => a.status === "active").length}
                </div>
                <div className="text-sm text-gray-300">Active Now</div>
              </div>
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-white">
                  {agents.reduce((sum, a) => sum + a.callsHandled, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-300">Total Calls</div>
              </div>
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold text-cyan-400">
                  {agents.length > 0 
                    ? Math.round(agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length)
                    : 0}%
                </div>
                <div className="text-sm text-gray-300">Success Rate</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Agent Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {agents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-200">No Agents Yet</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Create your first AI agent to start handling customer calls, appointments, and sales 24/7
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
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {agents.map((agent, index) => {
              const typeConfig = getTypeConfig(agent.type);
              const IconComponent = typeConfig.icon;

              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  {/* Agent Card */}
                  <div className="bg-black/60 backdrop-blur-xl border border-purple-500/20 rounded-xl overflow-hidden hover-elevate active-elevate-2 transition-all">
                    {/* Compact Header */}
                    <div className="p-6 pb-4 border-b border-purple-500/10">
                      <div className="flex items-start gap-4">
                        {/* Agent Portrait - Smaller, no gradient background */}
                        <Avatar className="w-16 h-16 border-2 border-purple-500/30 flex-shrink-0">
                          <AvatarImage 
                            src={typeConfig.defaultPortrait} 
                            alt={agent.name}
                            className="object-cover"
                          />
                          <AvatarFallback className="text-xl bg-purple-500/20">
                            {agent.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        {/* Name & Status */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-100" data-testid={`text-agent-name-${agent.id}`}>
                              {agent.name}
                            </h3>
                            {agent.status === "active" && (
                              <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20 flex-shrink-0" data-testid={`badge-online-${agent.id}`}>
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                                Online
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <IconComponent className="w-4 h-4" />
                            <span className="capitalize">{agent.type} Agent</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Agent Info */}
                    <div className="p-6 pt-4">

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-4 mb-4 bg-black/40 rounded-lg p-4 border border-purple-500/10">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400" data-testid={`text-success-rate-${agent.id}`}>
                            {agent.successRate}%
                          </div>
                          <div className="text-xs text-gray-400">Success</div>
                        </div>
                        <div className="text-center border-x border-purple-500/20">
                          <div className="text-lg font-bold text-gray-100" data-testid={`text-calls-handled-${agent.id}`}>
                            {agent.callsHandled.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-400">Calls</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-cyan-400" data-testid={`text-avg-time-${agent.id}`}>
                            {formatDuration(agent.avgResponseTime)}
                          </div>
                          <div className="text-xs text-gray-400">Avg Time</div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {agent.personality || `AI ${agent.type} specialist with advanced capabilities and real-time intelligence.`}
                      </p>

                      {/* Capability Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {typeConfig.badges.map((badge) => (
                          <Badge 
                            key={badge} 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>

                      {/* Vanity URL Section */}
                      <div className="mb-4 p-3 bg-black/30 rounded-lg border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Link2 className="w-4 h-4 text-purple-400" />
                          <span className="text-xs font-semibold text-gray-400">Shareable Link</span>
                        </div>
                        {agent.customUrl ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-mono text-gray-200 truncate">
                                voicelyagent.ai/agent/{agent.customUrl}
                              </div>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEditUrlClick(agent)}
                                data-testid={`button-edit-url-${agent.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleCopyVanityUrl(agent)}
                                data-testid={`button-copy-url-${agent.id}`}
                              >
                                {copiedAgentId === agent.id ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => window.open(`https://voicelyagent.ai/agent/${agent.customUrl}`, '_blank')}
                                data-testid={`button-open-url-${agent.id}`}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs text-gray-500">No custom URL set</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs border-purple-500/30 hover:bg-purple-500/10"
                              onClick={() => handleEditUrlClick(agent)}
                              data-testid={`button-add-url-${agent.id}`}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Add URL
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          className={`flex-1 ${
                            agent.status === "active" 
                              ? "bg-gradient-to-r from-cyan-600 to-blue-600" 
                              : "bg-gradient-to-r from-purple-600 to-violet-600"
                          } hover-elevate active-elevate-2`}
                          onClick={() => handleToggleStatus(agent)}
                          data-testid={`button-toggle-${agent.id}`}
                        >
                          {agent.status === "active" ? (
                            <>
                              <Phone className="w-4 h-4 mr-2" />
                              Active
                            </>
                          ) : (
                            <>
                              <PowerOff className="w-4 h-4 mr-2" />
                              Start Agent
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate("/agent-studio")}
                          data-testid={`button-edit-${agent.id}`}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteClick(agent)}
                          data-testid={`button-delete-${agent.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Agent?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{agentToDelete?.name}</strong>? 
              This action cannot be undone. All call history and analytics for this agent will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              data-testid="button-confirm-delete"
            >
              Delete Agent
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Vanity URL Dialog */}
      <Dialog open={editUrlDialogOpen} onOpenChange={setEditUrlDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {agentToEdit?.customUrl ? "Edit" : "Add"} Vanity URL
            </DialogTitle>
            <DialogDescription>
              Create a custom URL for your agent. Use only lowercase letters, numbers, and hyphens.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="custom-url">Custom URL</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {window.location.host}/agent/
                </span>
                <Input
                  id="custom-url"
                  placeholder="alice"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value.toLowerCase())}
                  data-testid="input-custom-url"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Examples: alice, sarah, emma, support-agent
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditUrlDialogOpen(false)}
              data-testid="button-cancel-edit-url"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateUrl}
              disabled={updateUrlMutation.isPending}
              data-testid="button-save-url"
            >
              {updateUrlMutation.isPending ? "Saving..." : "Save URL"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
