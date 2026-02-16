import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Phone, 
  Bot, 
  User,
  CheckCircle2, 
  MessageSquare,
  Calendar,
  FileSpreadsheet,
  ArrowDown,
  ArrowRight,
  GitBranch,
  PhoneOff,
  Mail,
  Database,
  Webhook,
  Sparkles,
  Stethoscope,
  Building2,
  Car,
  Scale,
  Home,
  UtensilsCrossed,
  Shield,
  Dumbbell,
  Scissors,
  GraduationCap,
  HardHat,
  Plane,
  DollarSign,
  Heart,
  Hotel,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import { 
  generateDetailedConversationFlow, 
  getIndustryFromUrl,
  industryIntegrations,
  type ConversationNode,
  type WorkflowType
} from "@/config/industryIntegrations";

export interface FlowNode {
  id: string;
  type: 'conversation' | 'transition' | 'action' | 'integration' | 'ending' | 'welcome' | 'transfer';
  label: string;
  script?: string;
  conditions?: string[];
  integration?: {
    name: string;
    icon: 'calendar' | 'sms' | 'email' | 'sheets' | 'crm' | 'webhook';
    action: string;
  };
  position?: { row: number; col: number };
  connections?: string[];
}

export interface EnhancedWorkflow {
  title: string;
  description?: string;
  nodes: FlowNode[];
  color: string;
}

interface WorkflowFlowchartProps {
  isOpen: boolean;
  onClose: () => void;
  workflow: {
    title: string;
    steps?: string[];
    nodes?: FlowNode[];
    color: string;
  };
  businessName: string;
  businessUrl?: string;
  services?: string[];
}

const industryIcons: Record<string, typeof Stethoscope> = {
  medical: Stethoscope,
  dental: Stethoscope,
  hotel: Hotel,
  veterinary: Heart,
  legal: Scale,
  realestate: Home,
  restaurant: UtensilsCrossed,
  insurance: Shield,
  fitness: Dumbbell,
  automotive: Car,
  spa: Scissors,
  education: GraduationCap,
  construction: HardHat,
  property: Building2,
  travel: Plane,
  wealth: DollarSign,
};

function getWorkflowTypeFromTitle(title: string): WorkflowType {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('follow') || lowerTitle.includes('aftercare') || lowerTitle.includes('post')) {
    return 'followup';
  }
  if (lowerTitle.includes('emergency') || lowerTitle.includes('urgent') || lowerTitle.includes('escalat')) {
    return 'emergency';
  }
  return 'consultation';
}

function AgentMessageCard({ 
  node, 
  isFirst, 
  isActive, 
  businessName 
}: { 
  node: ConversationNode; 
  isFirst?: boolean; 
  isActive?: boolean;
  businessName: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        scale: isActive ? 1.02 : 1,
      }}
      className={`flex gap-3 max-w-2xl transition-all duration-300 ${isActive ? 'z-10' : ''}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center ${isActive ? 'ring-4 ring-rose-300 ring-opacity-50' : ''}`}>
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold text-rose-500">{businessName}</span>
          {isFirst && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 font-medium">
              Welcome
            </span>
          )}
          {isActive && (
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-1"
            >
              <Volume2 className="w-3 h-3 text-rose-500" />
              <span className="text-[10px] text-rose-500 font-medium">Speaking...</span>
            </motion.div>
          )}
        </div>
        <div className={`bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm border transition-all duration-300 ${isActive ? 'border-rose-300 shadow-rose-100 shadow-lg' : 'border-gray-100'}`}>
          <p className="text-gray-700 text-sm leading-relaxed">{node.agentScript}</p>
        </div>
        
        {node.conditions && node.conditions.length > 0 && !isActive && (
          <div className="mt-3 pl-2 border-l-2 border-amber-300">
            <div className="flex items-center gap-1.5 mb-2">
              <GitBranch className="w-3 h-3 text-amber-500" />
              <span className="text-xs font-medium text-amber-600">Decision Points</span>
            </div>
            <div className="space-y-1">
              {node.conditions.map((cond, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <Sparkles className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-500">{cond.condition}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function UserMessageCard({ node, isActive }: { node: ConversationNode; isActive?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        scale: isActive ? 1.02 : 1,
      }}
      className={`flex gap-3 max-w-2xl ml-auto flex-row-reverse transition-all duration-300 ${isActive ? 'z-10' : ''}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center ${isActive ? 'ring-4 ring-blue-300 ring-opacity-50' : ''}`}>
        <User className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1.5 justify-end">
          <span className="text-xs font-semibold text-blue-500">Caller</span>
          {isActive && (
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-1"
            >
              <Volume2 className="w-3 h-3 text-blue-500" />
              <span className="text-[10px] text-blue-500 font-medium">Speaking...</span>
            </motion.div>
          )}
        </div>
        <div className={`bg-blue-50 rounded-2xl rounded-tr-sm p-4 shadow-sm border transition-all duration-300 ${isActive ? 'border-blue-300 shadow-blue-100 shadow-lg' : 'border-blue-100'}`}>
          <p className="text-gray-700 text-sm leading-relaxed">{node.userResponse}</p>
        </div>
      </div>
    </motion.div>
  );
}

function IntegrationCard({ node, integrations, isActive }: { node: ConversationNode; integrations: any[]; isActive?: boolean }) {
  const integration = integrations.find(i => i.name === node.integrationName) || integrations[0];
  const IconComponent = integration?.category === 'scheduling' ? Calendar : 
                        integration?.category === 'communication' ? MessageSquare :
                        integration?.category === 'payment' ? DollarSign :
                        integration?.category === 'crm' ? Database : Webhook;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: isActive ? 1.05 : 1,
      }}
      className={`flex justify-center my-4 transition-all duration-300 ${isActive ? 'z-10' : ''}`}
    >
      <div className={`bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border max-w-lg shadow-sm transition-all duration-300 ${isActive ? 'border-amber-400 shadow-amber-100 shadow-lg' : 'border-amber-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm ${isActive ? 'animate-pulse' : ''}`}>
            <IconComponent className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-amber-700">{node.integrationName}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 font-medium">
                {isActive ? 'Processing...' : 'Integration'}
              </span>
            </div>
            <p className="text-xs text-amber-600 mt-1">{node.integrationAction}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EndCallCard({ node, isActive }: { node: ConversationNode; isActive?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center my-6"
    >
      <div className={`bg-gray-100 rounded-full px-6 py-3 border flex items-center gap-2 transition-all duration-300 ${isActive ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
        {isActive ? (
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        ) : (
          <PhoneOff className="w-4 h-4 text-gray-500" />
        )}
        <span className={`text-sm font-medium ${isActive ? 'text-green-600' : 'text-gray-600'}`}>
          {isActive ? 'Call Completed Successfully' : (node.agentScript || 'Call Ended')}
        </span>
      </div>
    </motion.div>
  );
}

function FlowConnector({ isActive }: { isActive?: boolean }) {
  return (
    <div className="flex justify-center my-2">
      <div className="flex flex-col items-center">
        <motion.div 
          className={`w-0.5 h-4 ${isActive ? 'bg-rose-400' : 'bg-gray-200'}`}
          animate={isActive ? { opacity: [0.5, 1, 0.5] } : {}}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
        <ArrowDown className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-gray-300'}`} />
      </div>
    </div>
  );
}

export function WorkflowFlowchart({ 
  isOpen, 
  onClose, 
  workflow, 
  businessName,
  businessUrl = '',
  services = ['General Consultation', 'Follow-up Appointment', 'New Patient Visit']
}: WorkflowFlowchartProps) {
  
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(-1);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const workflowType = useMemo(() => {
    return getWorkflowTypeFromTitle(workflow.title);
  }, [workflow.title]);
  
  const industry = useMemo(() => {
    return getIndustryFromUrl(businessUrl || businessName);
  }, [businessUrl, businessName]);
  
  const integrations = useMemo(() => {
    return industryIntegrations[industry] || industryIntegrations.medical;
  }, [industry]);
  
  const conversationFlow = useMemo(() => {
    return generateDetailedConversationFlow(businessName, industry, services, workflowType);
  }, [businessName, industry, services, workflowType]);

  const mainFlowPath = useMemo(() => {
    const mainPath: ConversationNode[] = [];
    const visited = new Set<string>();
    
    let currentId = 'welcome';
    while (currentId && !visited.has(currentId)) {
      visited.add(currentId);
      const node = conversationFlow.find(n => n.id === currentId);
      if (!node) break;
      
      mainPath.push(node);
      
      if (node.type === 'end') break;
      
      if (node.conditions && node.conditions.length > 0) {
        currentId = node.conditions[0].nextNodeId;
      } else if (node.nextNodeId) {
        currentId = node.nextNodeId;
      } else {
        break;
      }
    }
    
    return mainPath;
  }, [conversationFlow]);

  const IndustryIcon = industryIcons[industry] || Building2;

  const scrollToNode = useCallback((nodeId: string) => {
    const nodeEl = nodeRefs.current.get(nodeId);
    if (nodeEl && scrollContainerRef.current) {
      nodeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const startSimulation = useCallback(() => {
    setIsSimulating(true);
    setCurrentNodeIndex(0);
    setSimulationComplete(false);
  }, []);

  const pauseSimulation = useCallback(() => {
    setIsSimulating(false);
  }, []);

  const resetSimulation = useCallback(() => {
    setIsSimulating(false);
    setCurrentNodeIndex(-1);
    setSimulationComplete(false);
    setAudioError(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, []);

  const playNodeAudio = useCallback(async (node: ConversationNode): Promise<void> => {
    if (!voiceEnabled) return;
    
    const text = node.agentScript || node.userResponse;
    if (!text || node.type === 'integration' || node.type === 'end') return;
    
    const speaker = node.type === 'agent' ? 'agent' : 'caller';
    
    try {
      setIsLoadingAudio(true);
      abortControllerRef.current = new AbortController();
      
      const response = await fetch('/api/demo/simulation-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, speaker }),
        signal: abortControllerRef.current.signal,
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      return new Promise((resolve, reject) => {
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        
        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          URL.revokeObjectURL(audioUrl);
          setIsLoadingAudio(false);
          resolve();
        };
        audioRef.current.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          setIsLoadingAudio(false);
          reject(new Error('Audio playback failed'));
        };
        audioRef.current.play().catch(reject);
      });
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      console.error('Audio error:', error);
      setAudioError('Voice unavailable - using text simulation');
      setIsLoadingAudio(false);
    }
  }, [voiceEnabled]);

  useEffect(() => {
    if (!isSimulating || currentNodeIndex < 0) return;
    
    const currentNode = mainFlowPath[currentNodeIndex];
    if (!currentNode) {
      setIsSimulating(false);
      setSimulationComplete(true);
      return;
    }

    scrollToNode(currentNode.id);

    const getNodeDuration = (node: ConversationNode) => {
      const text = node.agentScript || node.userResponse || node.integrationAction || '';
      const wordCount = text.split(' ').length;
      const baseDuration = node.type === 'integration' ? 1500 : 2000;
      return Math.max(baseDuration, wordCount * 150);
    };

    const runNodeWithAudio = async () => {
      if (voiceEnabled && (currentNode.type === 'agent' || currentNode.type === 'user')) {
        try {
          await playNodeAudio(currentNode);
        } catch {
          await new Promise(resolve => setTimeout(resolve, getNodeDuration(currentNode)));
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, getNodeDuration(currentNode)));
      }
      
      if (currentNodeIndex < mainFlowPath.length - 1) {
        setCurrentNodeIndex(prev => prev + 1);
      } else {
        setIsSimulating(false);
        setSimulationComplete(true);
      }
    };

    runNodeWithAudio();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [isSimulating, currentNodeIndex, mainFlowPath, scrollToNode, voiceEnabled, playNodeAudio]);

  useEffect(() => {
    if (!isOpen) {
      resetSimulation();
    }
  }, [isOpen, resetSimulation]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-[95vw] max-w-4xl h-[90vh] rounded-2xl overflow-hidden shadow-2xl bg-gray-50"
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
                    <IndustryIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{workflow.title}</h2>
                    <p className="text-sm text-gray-500">{businessName} - Simulated Voice Conversation</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={`${voiceEnabled ? 'text-rose-500 border-rose-200' : 'text-gray-400'}`}
                    data-testid="button-toggle-voice"
                    title={voiceEnabled ? 'Voice enabled' : 'Voice disabled'}
                  >
                    {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </Button>
                  
                  {!isSimulating && currentNodeIndex === -1 && !simulationComplete && (
                    <Button
                      onClick={startSimulation}
                      className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white gap-2"
                      data-testid="button-run-simulation"
                    >
                      <Play className="w-4 h-4" />
                      Run Simulation {voiceEnabled && '(with Voice)'}
                    </Button>
                  )}
                  
                  {isSimulating && (
                    <Button
                      onClick={pauseSimulation}
                      variant="outline"
                      className="gap-2"
                      data-testid="button-pause-simulation"
                    >
                      <Pause className="w-4 h-4" />
                      Pause
                    </Button>
                  )}
                  
                  {!isSimulating && currentNodeIndex >= 0 && !simulationComplete && (
                    <Button
                      onClick={startSimulation}
                      className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white gap-2"
                      data-testid="button-resume-simulation"
                    >
                      <Play className="w-4 h-4" />
                      Resume
                    </Button>
                  )}
                  
                  {(currentNodeIndex >= 0 || simulationComplete) && (
                    <Button
                      onClick={resetSimulation}
                      variant="outline"
                      className="gap-2"
                      data-testid="button-reset-simulation"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                    data-testid="button-close-flowchart"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {(isSimulating || isLoadingAudio) && (
                <div className="relative">
                  <motion.div 
                    className="h-1 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentNodeIndex + 1) / mainFlowPath.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                  {isLoadingAudio && (
                    <div className="absolute right-2 -top-6 flex items-center gap-1 text-xs text-rose-500">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Loading audio...</span>
                    </div>
                  )}
                </div>
              )}
              
              {audioError && (
                <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-700 flex items-center gap-2">
                  <VolumeX className="w-3 h-3" />
                  {audioError}
                </div>
              )}

              <div ref={scrollContainerRef} className="flex-1 overflow-auto p-6">
                <div className="max-w-3xl mx-auto space-y-1">
                  {mainFlowPath.map((node, index) => {
                    const isActive = isSimulating && currentNodeIndex === index;
                    const isPast = currentNodeIndex > index || simulationComplete;
                    
                    return (
                      <div 
                        key={node.id}
                        ref={(el) => {
                          if (el) nodeRefs.current.set(node.id, el);
                        }}
                        className={`transition-opacity duration-300 ${
                          currentNodeIndex === -1 || isPast || isActive ? 'opacity-100' : 'opacity-40'
                        }`}
                      >
                        {node.type === 'agent' && (
                          <>
                            <AgentMessageCard 
                              node={node} 
                              isFirst={index === 0} 
                              isActive={isActive}
                              businessName={businessName}
                            />
                            <FlowConnector isActive={isActive} />
                          </>
                        )}
                        {node.type === 'user' && (
                          <>
                            <UserMessageCard node={node} isActive={isActive} />
                            <FlowConnector isActive={isActive} />
                          </>
                        )}
                        {node.type === 'integration' && (
                          <>
                            <IntegrationCard node={node} integrations={integrations} isActive={isActive} />
                            <FlowConnector isActive={isActive} />
                          </>
                        )}
                        {node.type === 'end' && (
                          <EndCallCard node={node} isActive={simulationComplete} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-500" />
                      <span className="text-xs text-gray-600">{businessName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-xs text-gray-600">Caller</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="text-xs text-gray-600">Integration</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {isSimulating && (
                      <div className="flex items-center gap-2 text-xs text-rose-500 font-medium">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="w-2 h-2 rounded-full bg-rose-500"
                        />
                        Simulating Call...
                      </div>
                    )}
                    {simulationComplete && (
                      <div className="flex items-center gap-2 text-xs text-green-500 font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Simulation Complete
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Industry: <span className="font-medium text-gray-700 capitalize">{industry}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Steps: <span className="font-medium text-gray-700">{mainFlowPath.length}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-2">Available Integrations for {industry}:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {integrations.slice(0, 8).map((int, i) => (
                      <span 
                        key={i}
                        className="text-[10px] px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium"
                      >
                        {int.name}
                      </span>
                    ))}
                    {integrations.length > 8 && (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-gray-200 text-gray-600 font-medium">
                        +{integrations.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
