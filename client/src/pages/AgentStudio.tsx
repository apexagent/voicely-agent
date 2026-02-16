import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Plus,
  Save,
  Trash2,
  Bot,
  Sparkles,
  DollarSign,
  ArrowLeft,
  Phone,
  Users,
  Calendar,
  MessageCircle,
  Play,
  Check,
  Upload,
  Lock,
  Code,
  ExternalLink,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import type { Agent, InsertAgent } from "@shared/schema";

// Utility: Escape HTML attributes to prevent XSS and attribute breakage
const escapeHtmlAttr = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

// Agent portraits
import alicePortrait from "@assets/generated_images/Alice_Support_Agent_New.png";
import sarahPortrait from "@assets/c57e465e-117a-48b6-ac72-f595b2147893_1762597948606.png";
import emmaPortrait from "@assets/dbd2eb13-b3a0-4352-ad50-b1e1e6c83823_1762597948606.png";
import mayaPortrait from "@assets/c6a83411-9447-410d-bda5-46daa0aa23f9_1762597948605.png";
import teamHero from "@assets/team-hero.png";

// Preset photo options
const presetPhotos = [
  { id: "sarah", name: "Sarah", image: sarahPortrait, role: "Sales" },
  { id: "emma", name: "Emma", image: emmaPortrait, role: "Receptionist" },
  { id: "alice", name: "Alice", image: alicePortrait, role: "Support" },
  { id: "maya", name: "Maya", image: mayaPortrait, role: "Follow-Up" },
];

// Agent type templates (simplified, no technical jargon)
const agentTypes = [
  {
    id: "sales",
    name: "Sales Agent",
    icon: Sparkles,
    description: "Answers questions and helps close deals",
    gradient: "from-purple-500 to-violet-600",
    avatar: sarahPortrait,
    prompt: "You are a friendly sales agent. Help customers understand our products, answer their questions, and guide them to make a purchase. Be enthusiastic but not pushy. Keep responses under 3 sentences.",
  },
  {
    id: "support",
    name: "Support Agent",
    icon: MessageCircle,
    description: "Helps customers with problems and questions",
    gradient: "from-cyan-500 to-blue-600",
    avatar: alicePortrait,
    prompt: "You are a helpful customer support agent. Listen to customer issues, provide solutions, and make them feel heard. Be patient and empathetic. Keep responses under 3 sentences.",
  },
  {
    id: "receptionist",
    name: "Receptionist",
    icon: Phone,
    description: "Greets callers and routes their calls",
    gradient: "from-green-500 to-emerald-600",
    avatar: emmaPortrait,
    prompt: "You are a professional receptionist. Greet callers warmly, find out how you can help them, and direct them to the right person or department. Keep responses under 3 sentences.",
  },
  {
    id: "appointments",
    name: "Appointment Scheduler",
    icon: Calendar,
    description: "Schedules and manages appointments",
    gradient: "from-orange-500 to-amber-600",
    avatar: mayaPortrait,
    prompt: "You are an appointment scheduling assistant. Help people find available times and book appointments. Ask for their preferred date and time. Keep responses under 3 sentences.",
  },
];

// Voice options - Our Voicely agent voices (each agent has their own unique voice)
const voiceOptions = [
  { id: "cgSgspJ2msm6clMCkdW9", name: "Alice", description: "Cute and conversational support specialist", gender: "female", teamMember: "Alice" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", description: "Strong and confident sales expert", gender: "female", teamMember: "Sarah" },
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Emma", description: "Soft and gentle receptionist", gender: "female", teamMember: "Emma" },
  { id: "ThT5KcBeYPX3keUQqHPh", name: "Ava", description: "Professional appointment scheduler", gender: "female", teamMember: "Ava" },
];

interface FormData {
  agentType: string;
  voiceId: string;
  agentName: string;
  businessName: string;
  businessDescription: string;
  businessUrl: string;
  customUrl: string;
  avatarUrl: string;
  photoFile: File | null;
  firstMessage: string;
  systemPrompt: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundImage: string;
  backgroundVideo: string;
}

export default function AgentStudio() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);
  const [showAccessCodeDialog, setShowAccessCodeDialog] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [formData, setFormData] = useState<FormData>({
    agentType: "",
    voiceId: "cgSgspJ2msm6clMCkdW9",
    agentName: "",
    businessName: "",
    businessDescription: "",
    businessUrl: "",
    customUrl: "",
    avatarUrl: "",
    photoFile: null,
    firstMessage: "",
    systemPrompt: "",
    primaryColor: "#8B5CF6", // Default purple
    secondaryColor: "#06B6D4", // Default cyan
    backgroundImage: "",
    backgroundVideo: "",
  });

  // Fetch agents
  const { data: agentsData, isLoading } = useQuery<{ agents: Agent[] }>({
    queryKey: ["/api/agents"],
  });

  const agents = agentsData?.agents || [];

  // Create agent mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertAgent) => {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({
        title: "Agent Created",
        description: "Your AI agent is ready to start helping customers.",
      });
      setIsCreating(false);
      setSelectedAgent(null);
      resetForm();
      // Close access code dialog and reset code on successful creation
      setShowAccessCodeDialog(false);
      setAccessCode("");
    },
    onError: (error: Error) => {
      toast({
        title: "Couldn't Create Agent",
        description: error.message,
        variant: "destructive",
      });
      // Keep access code dialog open on error so user can retry
    },
  });

  // Update agent mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertAgent> }) => {
      const response = await fetch(`/api/agents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({
        title: "Changes Saved",
        description: "Your agent has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Couldn't Save Changes",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete agent mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/agents/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({
        title: "Agent Deleted",
        description: "Agent has been removed.",
      });
      setSelectedAgent(null);
      setIsCreating(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "Couldn't Delete Agent",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate AI system prompt mutation
  const generatePromptMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/agents/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: formData.businessName,
          services: formData.businessDescription,
          website: formData.businessUrl,
          agentType: formData.agentType,
        }),
      });
      if (!response.ok) throw new Error(await response.text());
      return response.json();
    },
    onSuccess: (data: { prompt: string }) => {
      setFormData({ ...formData, systemPrompt: data.prompt });
      toast({
        title: "Prompt Generated",
        description: "Your custom AI prompt is ready. You can edit it below.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      agentType: "",
      voiceId: "21m00Tcm4TlvDq8ikWAM",
      agentName: "",
      businessName: "",
      businessDescription: "",
      businessUrl: "",
      customUrl: "",
      avatarUrl: "",
      photoFile: null,
      firstMessage: "",
      systemPrompt: "",
      primaryColor: "#8B5CF6",
      secondaryColor: "#06B6D4",
      backgroundImage: "",
      backgroundVideo: "",
    });
  };

  const handleCreateNew = () => {
    resetForm();
    setSelectedAgent(null);
    setIsCreating(true);
  };

  const handleEditAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    // Map existing agent to form - LOAD ALL FIELDS
    setFormData({
      agentType: agent.type,
      voiceId: agent.voiceId || "21m00Tcm4TlvDq8ikWAM",
      agentName: agent.name,
      businessName: agent.businessName || "",
      businessDescription: "", // Not stored in DB - only used for prompt generation
      businessUrl: agent.businessUrl || "",
      customUrl: agent.customUrl || "",
      avatarUrl: agent.avatarUrl || "",
      photoFile: null,
      firstMessage: agent.firstMessage || "",
      systemPrompt: agent.systemPrompt || "",
      primaryColor: agent.primaryColor || "#8B5CF6",
      secondaryColor: agent.secondaryColor || "#06B6D4",
      backgroundImage: agent.backgroundImage || "",
      backgroundVideo: agent.backgroundVideo || "",
    });
    setIsCreating(false);
  };

  // Preview voice with a short sample
  const playVoicePreview = async (voiceId: string, voiceName: string) => {
    try {
      setPlayingVoice(voiceId);
      
      const sampleText = `Hi, I'm ${voiceName}. I'm ready to help your customers!`;
      
      const response = await fetch("/api/voices/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sampleText,
          voiceId: voiceId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate voice preview");
      }

      // Get raw audio buffer from response
      const arrayBuffer = await response.arrayBuffer();
      
      // Create audio blob from buffer
      const audioBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.setAttribute('playsinline', ''); // Required for iOS Safari
      
      audio.onended = () => {
        setPlayingVoice(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = (err) => {
        console.error('Audio playback error:', err);
        setPlayingVoice(null);
        URL.revokeObjectURL(audioUrl);
        toast({
          title: "Preview Failed",
          description: "Could not play voice sample. Please try again.",
          variant: "destructive",
        });
      };
      
      // Play with error handling for autoplay restrictions
      try {
        await audio.play();
      } catch (playError: any) {
        console.error('Audio play error:', playError);
        // Autoplay was blocked, which is normal on mobile without user interaction
        if (playError.name === 'NotAllowedError' || playError.name === 'NotSupportedError') {
          // Try again (user just clicked button, so this should work)
          await audio.play();
        } else {
          throw playError;
        }
      }
    } catch (error) {
      console.error("Voice preview error:", error);
      setPlayingVoice(null);
      toast({
        title: "Preview Failed",
        description: "Could not play voice sample. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    if (!formData.agentType) {
      toast({
        title: "Pick an Agent Type",
        description: "Please select what your agent should do.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agentName.trim()) {
      toast({
        title: "Name Your Agent",
        description: "Please give your agent a name.",
        variant: "destructive",
      });
      return;
    }

    // If creating a new agent (not editing), require access code
    if (!selectedAgent) {
      setShowAccessCodeDialog(true);
      return;
    }

    // If editing existing agent, proceed directly
    submitAgent();
  };

  const submitAgent = () => {
    // Find the selected agent type
    const selectedType = agentTypes.find((t) => t.id === formData.agentType);
    
    // Use custom system prompt if provided, otherwise build from template
    let systemPrompt = formData.systemPrompt;
    if (!systemPrompt) {
      // Fallback to template + business context if no custom prompt
      systemPrompt = selectedType?.prompt || "";
      if (formData.businessName || formData.businessDescription) {
        systemPrompt += `\n\nBusiness Context:\n`;
        if (formData.businessName) {
          systemPrompt += `- Business Name: ${formData.businessName}\n`;
        }
        if (formData.businessDescription) {
          systemPrompt += `- What We Offer: ${formData.businessDescription}\n`;
        }
      }
    }

    const payload: Partial<InsertAgent> = {
      name: formData.agentName,
      type: formData.agentType,
      firstMessage: formData.firstMessage || undefined, // Opening greeting message
      systemPrompt: systemPrompt,
      voiceId: formData.voiceId,
      avatarUrl: formData.avatarUrl || selectedType?.avatar || "",
      status: "active",
      businessName: formData.businessName || undefined,
      businessUrl: formData.businessUrl || undefined,
      customUrl: formData.customUrl || undefined,
      primaryColor: formData.primaryColor,
      secondaryColor: formData.secondaryColor,
      backgroundImage: formData.backgroundImage || undefined,
      backgroundVideo: formData.backgroundVideo || undefined,
    };

    // submitAgent is now side-effect-free regarding dialog state
    // Dialog will be closed by mutation onSuccess callback
    if (selectedAgent) {
      updateMutation.mutate({ id: selectedAgent.id, data: payload });
    } else {
      createMutation.mutate(payload as InsertAgent);
    }
  };

  const verifyAccessCode = () => {
    // Enforce user entry - reject blank codes
    if (!accessCode.trim()) {
      toast({
        title: "Access Code Required",
        description: "Please enter an access code to create an agent.",
        variant: "destructive",
      });
      return;
    }

    if (accessCode === "VOICELY1") {
      submitAgent();
    } else {
      toast({
        title: "Incorrect Access Code",
        description: "Please enter the correct access code to create an agent.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    if (!selectedAgent) return;
    if (window.confirm(`Delete ${selectedAgent.name}?`)) {
      deleteMutation.mutate(selectedAgent.id);
    }
  };

  const handleBackToList = () => {
    setSelectedAgent(null);
    setIsCreating(false);
    resetForm();
  };

  const showEditor = isCreating || selectedAgent;

  return (
    <div className="min-h-screen bg-[#0A0B1E]">
      {/* Hero Banner with Team Image */}
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
                  Agent Studio
                </span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm md:text-base lg:text-lg text-gray-300 max-w-2xl break-words"
              >
                Create and customize your AI voice agents. Design personalities, configure voices, and deploy intelligent assistants in minutes.
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
                onClick={() => navigate("/my-agents")}
                data-testid="button-view-agents"
              >
                View My Agents
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Agent Creator Form */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* Step 1: What does your agent do? */}
            <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden backdrop-blur-xl bg-black/60 border border-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5" />
              
              <div className="relative space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">What does your agent do?</h2>
                  <p className="text-gray-400">Pick the type that matches your needs</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {agentTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.agentType === type.id;
                    
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, agentType: type.id, avatarUrl: type.avatar })}
                        className={`relative rounded-2xl p-6 text-left transition-all hover-elevate ${
                          isSelected
                            ? "bg-gradient-to-br from-purple-500/20 to-violet-600/20 border-2 border-purple-400 ring-2 ring-purple-500/50"
                            : "bg-black/40 border border-purple-500/20"
                        }`}
                        data-testid={`agent-type-${type.id}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white mb-1">{type.name}</h3>
                            <p className="text-sm text-gray-400">{type.description}</p>
                          </div>
                          {isSelected && (
                            <div className="flex-shrink-0">
                              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 2: How should they sound? */}
            <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden backdrop-blur-xl bg-black/60 border border-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
              
              <div className="relative space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">How should they sound?</h2>
                  <p className="text-gray-400">Choose a voice for your agent</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {voiceOptions.map((voice) => {
                    const isSelected = formData.voiceId === voice.id;
                    const isPlaying = playingVoice === voice.id;
                    
                    return (
                      <div
                        key={voice.id}
                        className={`relative rounded-xl p-4 transition-all ${
                          isSelected
                            ? "bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-2 border-cyan-400 ring-2 ring-cyan-500/50"
                            : "bg-black/40 border border-cyan-500/20"
                        }`}
                        data-testid={`voice-${voice.name.toLowerCase()}`}
                      >
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, voiceId: voice.id })}
                          className="w-full text-left"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 flex items-center justify-center flex-shrink-0">
                              <Users className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-white">{voice.name}</h4>
                              <p className="text-xs text-gray-400 capitalize">{voice.gender}</p>
                            </div>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mb-3">{voice.description}</p>
                        </button>
                        
                        {/* Play Preview Button */}
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            playVoicePreview(voice.id, voice.name);
                          }}
                          disabled={isPlaying}
                          className="w-full border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs"
                          data-testid={`play-voice-${voice.name.toLowerCase()}`}
                        >
                          <Play className={`w-3 h-3 mr-1 ${isPlaying ? 'animate-pulse' : ''}`} />
                          {isPlaying ? 'Playing...' : 'Preview Voice'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 3: Tell us about your business */}
            <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden backdrop-blur-xl bg-black/60 border border-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-cyan-500/5" />
              
              <div className="relative space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Tell us about your business</h2>
                  <p className="text-gray-400">This helps your agent answer customer questions</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white text-lg mb-2 block">What's your business name?</Label>
                    <Input
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="e.g., Joe's Pizza"
                      className="bg-black/40 border-green-500/30 text-white placeholder:text-gray-500 text-lg h-14"
                      data-testid="input-business-name"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-lg mb-2 block">What do you offer?</Label>
                    <Input
                      value={formData.businessDescription}
                      onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                      placeholder="e.g., Fresh pizza delivery and catering"
                      className="bg-black/40 border-green-500/30 text-white placeholder:text-gray-500 text-lg h-14"
                      data-testid="input-business-description"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-lg mb-2 block">Business Website URL</Label>
                    <Input
                      value={formData.businessUrl}
                      onChange={(e) => setFormData({ ...formData, businessUrl: e.target.value })}
                      placeholder="e.g., https://joespizza.com"
                      className="bg-black/40 border-green-500/30 text-white placeholder:text-gray-500 text-lg h-14"
                      data-testid="input-business-url"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-lg mb-2 block">Custom Agent URL (Optional)</Label>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-400 text-sm">voicelyagent.ai/</span>
                      <Input
                        value={formData.customUrl}
                        onChange={(e) => {
                          const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                          setFormData({ ...formData, customUrl: value });
                        }}
                        placeholder="my-sales-agent"
                        className="bg-black/40 border-purple-500/30 text-white placeholder:text-gray-500 text-lg h-14 flex-1"
                        data-testid="input-custom-url"
                      />
                    </div>
                    <p className="text-gray-400 text-xs mt-1">
                      Create a memorable link for your agent (lowercase letters, numbers, and hyphens only)
                    </p>
                  </div>

                  {/* First Message Input */}
                  <div className="space-y-2 pt-4 border-t border-green-500/20">
                    <Label className="text-white text-lg block">Opening Message</Label>
                    <p className="text-gray-400 text-sm mb-2">
                      What should your agent say when greeting customers? (Auto-generated based on agent type)
                    </p>
                    <Input
                      value={formData.firstMessage}
                      onChange={(e) => setFormData({ ...formData, firstMessage: e.target.value })}
                      placeholder="Hi! I'm here to help. How can I assist you today?"
                      className="bg-black/40 border-green-500/30 text-white placeholder:text-gray-500 text-base h-12"
                      data-testid="input-first-message"
                    />
                  </div>

                  {/* AI Prompt Generation Section */}
                  <div className="space-y-3 pt-4 border-t border-green-500/20">
                    <div className="flex items-center justify-between">
                      <Label className="text-white text-lg block">AI Agent Instructions</Label>
                      <Button
                        type="button"
                        onClick={() => generatePromptMutation.mutate()}
                        disabled={!formData.businessName || !formData.businessDescription || !formData.agentType || generatePromptMutation.isPending}
                        variant="outline"
                        className="bg-gradient-to-r from-purple-600 to-violet-600 border-purple-500/30 text-white hover:from-purple-500 hover:to-violet-500"
                        data-testid="button-generate-prompt"
                      >
                        {generatePromptMutation.isPending ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="mr-2"
                            >
                              <DollarSign className="w-4 h-4" />
                            </motion.div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <DollarSign className="w-4 h-4 mr-2" />
                            Generate with AI
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Click "Generate with AI" to create custom instructions based on your business info, or write your own below.
                    </p>
                    <Textarea
                      value={formData.systemPrompt}
                      onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                      placeholder="Agent instructions will appear here after generation, or you can write your own..."
                      className="bg-black/40 border-green-500/30 text-white placeholder:text-gray-500 min-h-[120px] resize-none"
                      data-testid="textarea-system-prompt"
                    />
                  </div>

                  <div>
                    <Label className="text-white text-lg mb-3 block">Choose Agent Photo</Label>
                    
                    {/* Preset Photos Grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                      {presetPhotos.map((preset) => (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, avatarUrl: preset.image, photoFile: null });
                          }}
                          className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover-elevate active-elevate-2 ${
                            formData.avatarUrl === preset.image && !formData.photoFile
                              ? 'border-green-500 ring-2 ring-green-500/50'
                              : 'border-green-500/20'
                          }`}
                          data-testid={`preset-photo-${preset.id}`}
                        >
                          <img
                            src={preset.image}
                            alt={preset.name}
                            className="w-full h-full object-cover"
                          />
                          {formData.avatarUrl === preset.image && !formData.photoFile && (
                            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                              <Check className="w-8 h-8 text-green-400" />
                            </div>
                          )}
                          <div className="absolute bottom-0 inset-x-0 bg-black/80 py-1 px-2">
                            <p className="text-[10px] font-semibold text-white text-center">{preset.name}</p>
                          </div>
                        </button>
                      ))}
                      
                      {/* Custom Upload Option */}
                      <label
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 border-dashed cursor-pointer transition-all hover-elevate active-elevate-2 flex flex-col items-center justify-center ${
                          formData.photoFile
                            ? 'border-green-500 ring-2 ring-green-500/50 bg-black/60'
                            : 'border-green-500/30 bg-black/40'
                        }`}
                        data-testid="custom-upload-button"
                      >
                        {formData.photoFile ? (
                          <>
                            <img
                              src={URL.createObjectURL(formData.photoFile)}
                              alt="Custom upload"
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                              <Check className="w-8 h-8 text-green-400" />
                            </div>
                            <div className="absolute bottom-0 inset-x-0 bg-black/80 py-1 px-2">
                              <p className="text-[10px] font-semibold text-white text-center">Custom</p>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-1">
                            <Upload className="w-6 h-6 text-green-400" />
                            <span className="text-[10px] text-green-300 font-semibold text-center px-1">Upload Custom</span>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFormData({ ...formData, photoFile: file, avatarUrl: '' });
                            }
                          }}
                          data-testid="input-agent-photo"
                        />
                      </label>
                    </div>
                    
                    <p className="text-xs text-gray-500">Select a preset photo or upload your own</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appearance Customization */}
            <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden backdrop-blur-xl bg-black/60 border border-cyan-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
              
              <div className="relative space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">Customize Appearance</h2>
                  <p className="text-gray-400">Match your brand colors and style</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Primary Color */}
                  <div>
                    <Label className="text-white text-lg mb-3 block">Primary Color</Label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-16 h-14 rounded-lg border-2 border-cyan-500/30 bg-black/40 cursor-pointer"
                        data-testid="input-primary-color"
                      />
                      <Input
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        placeholder="#8B5CF6"
                        className="flex-1 bg-black/40 border-cyan-500/30 text-white placeholder:text-gray-500 text-lg h-14 font-mono"
                        data-testid="input-primary-color-text"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Main particle/glow color</p>
                  </div>

                  {/* Secondary Color */}
                  <div>
                    <Label className="text-white text-lg mb-3 block">Secondary Color</Label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        value={formData.secondaryColor}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="w-16 h-14 rounded-lg border-2 border-purple-500/30 bg-black/40 cursor-pointer"
                        data-testid="input-secondary-color"
                      />
                      <Input
                        value={formData.secondaryColor}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        placeholder="#06B6D4"
                        className="flex-1 bg-black/40 border-purple-500/30 text-white placeholder:text-gray-500 text-lg h-14 font-mono"
                        data-testid="input-secondary-color-text"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Accent particle/glow color</p>
                  </div>
                </div>

                {/* Background Options */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <Label className="text-white text-lg mb-3 block">Background Image URL (Optional)</Label>
                    <Input
                      value={formData.backgroundImage}
                      onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
                      placeholder="https://example.com/background.jpg"
                      className="bg-black/40 border-cyan-500/30 text-white placeholder:text-gray-500 text-lg h-14"
                      data-testid="input-background-image"
                    />
                    <p className="text-xs text-gray-500 mt-2">Custom background image for your agent's page</p>
                  </div>

                  <div>
                    <Label className="text-white text-lg mb-3 block">Background Video URL (Optional)</Label>
                    <Input
                      value={formData.backgroundVideo}
                      onChange={(e) => setFormData({ ...formData, backgroundVideo: e.target.value })}
                      placeholder="https://example.com/background.mp4"
                      className="bg-black/40 border-purple-500/30 text-white placeholder:text-gray-500 text-lg h-14"
                      data-testid="input-background-video"
                    />
                    <p className="text-xs text-gray-500 mt-2">Custom background video (overrides image if both are set)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Name your agent */}
            <div className="relative rounded-3xl p-6 md:p-8 overflow-hidden backdrop-blur-xl bg-black/60 border border-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5" />
              
              <div className="relative space-y-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Give your agent a name</h2>
                  <p className="text-gray-400">This is how you'll identify them in your dashboard</p>
                </div>

                <Input
                  value={formData.agentName}
                  onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
                  placeholder="e.g., Sarah - Sales Agent"
                  className="bg-black/40 border-violet-500/30 text-white placeholder:text-gray-500 text-lg h-14"
                  data-testid="input-agent-name"
                />
              </div>
            </div>

            {/* Embed Code Generator - Only show for existing agents */}
            {selectedAgent && selectedAgent.vapiAssistantId && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-3xl p-6 md:p-8 overflow-hidden backdrop-blur-xl bg-black/60 border border-cyan-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />
                
                <div className="relative space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">Share Your Agent</h2>
                      <p className="text-gray-400">Embed on websites or share a direct link</p>
                    </div>
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-400/30 flex items-center justify-center">
                      <Code className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>

                  {/* Shareable Link */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-cyan-400" />
                      <Label className="text-white text-base font-semibold">Shareable Link</Label>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={selectedAgent.customUrl ? `voicelyagent.ai/agent/${selectedAgent.customUrl}` : 'Set a custom URL to enable sharing'}
                        readOnly
                        className="bg-black/40 border-cyan-500/30 text-white font-mono text-sm flex-1"
                        data-testid="input-shareable-url"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 flex-shrink-0"
                        disabled={!selectedAgent.customUrl}
                        onClick={() => {
                          if (selectedAgent.customUrl) {
                            navigator.clipboard.writeText(`https://voicelyagent.ai/agent/${selectedAgent.customUrl}`);
                            toast({ 
                              title: "Link Copied", 
                              description: "Share this link with anyone to try your agent.",
                            });
                          }
                        }}
                        data-testid="button-copy-shareable-url"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Link
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Anyone with this link can interact with your agent</p>
                  </div>

                  {/* Embed Code */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-cyan-400" />
                      <Label className="text-white text-base font-semibold">Website Embed Code</Label>
                    </div>
                    <Textarea
                      value={`<!-- Voicely AI Agent Widget -->
<script src="https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js"></script>
<vapi-widget 
  public-key="YOUR_VAPI_PUBLIC_KEY"
  assistant-id="${selectedAgent.vapiAssistantId}"
  mode="chat"
  theme="dark"
  color-accent="#06B6D4"
  title="${escapeHtmlAttr(selectedAgent.name ?? 'AI Agent')}"
  chat-placeholder="How can I help you today?"
  chat-first-message="${escapeHtmlAttr(selectedAgent.firstMessage ?? 'Hi! How can I assist you?')}"
  position="bottom-right">
</vapi-widget>
<!-- Powered by Voicely -->`}
                      readOnly
                      className="bg-black/40 border-cyan-500/30 text-white font-mono text-xs min-h-[200px] resize-none"
                      data-testid="textarea-embed-code"
                    />
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 w-full sm:w-auto"
                          onClick={() => {
                            const safeName = selectedAgent.name ?? 'AI Agent';
                            const safeFirstMessage = selectedAgent.firstMessage ?? 'Hi! How can I assist you?';
                            const embedCode = `<!-- Voicely AI Agent Widget -->
<script src="https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js"></script>
<vapi-widget 
  public-key="YOUR_VAPI_PUBLIC_KEY"
  assistant-id="${selectedAgent.vapiAssistantId}"
  mode="chat"
  theme="dark"
  color-accent="#06B6D4"
  title="${escapeHtmlAttr(safeName)}"
  chat-placeholder="How can I help you today?"
  chat-first-message="${escapeHtmlAttr(safeFirstMessage)}"
  position="bottom-right">
</vapi-widget>
<!-- Powered by Voicely -->`;
                            navigator.clipboard.writeText(embedCode);
                            toast({ 
                              title: "Embed Code Copied", 
                              description: "Paste this code before the closing body tag on your website.",
                            });
                          }}
                          data-testid="button-copy-embed-code"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Embed Code
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 flex-shrink-0">Replace YOUR_VAPI_PUBLIC_KEY with your Vapi public key</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover-elevate active-elevate-2 text-lg h-14"
                onClick={handleSave}
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-save"
              >
                <Save className="w-5 h-5 mr-2" />
                {createMutation.isPending || updateMutation.isPending
                  ? "Creating Your Agent..."
                  : selectedAgent
                  ? "Save Changes"
                  : "Create My Agent!"}
              </Button>
              {selectedAgent && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 h-14"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  data-testid="button-delete"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  {deleteMutation.isPending ? "Deleting..." : "Delete Agent"}
                </Button>
              )}
            </div>
        </motion.div>
      </div>

      {/* Access Code Dialog */}
      <Dialog open={showAccessCodeDialog} onOpenChange={setShowAccessCodeDialog}>
        <DialogContent className="bg-[#0A0B1E] border-purple-500/30 max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-400/30 flex items-center justify-center">
                <Lock className="w-6 h-6 text-purple-400" />
              </div>
              <DialogTitle className="text-2xl font-bold text-white">
                Access Code Required
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-400 text-base">
              Please enter the access code to create a new agent
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <div>
              <Label htmlFor="access-code" className="text-white text-base mb-2 block">
                Access Code
              </Label>
              <Input
                id="access-code"
                type="text"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    verifyAccessCode();
                  }
                }}
                placeholder="Enter code"
                className="bg-black/40 border-purple-500/30 text-white placeholder:text-gray-500 text-lg h-14 uppercase"
                autoFocus
                data-testid="input-access-code"
              />
              <p className="text-xs text-gray-500 mt-2">All letters will be automatically capitalized</p>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                variant="outline"
                className="flex-1 border-gray-600/30 text-gray-300 hover:bg-gray-800/50 h-12"
                onClick={() => {
                  setShowAccessCodeDialog(false);
                  setAccessCode("");
                }}
                data-testid="button-cancel-access"
              >
                Cancel
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 hover-elevate active-elevate-2 h-12"
                onClick={verifyAccessCode}
                data-testid="button-verify-access"
              >
                Verify & Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
