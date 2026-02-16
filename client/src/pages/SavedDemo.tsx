import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useVoiceChat } from "@/hooks/useVoiceChat";
import { VOICE_CONFIG, chunkText } from "@/lib/voiceConfig";
import { 
  Phone, 
  PhoneOff, 
  ArrowLeft,
  Loader2,
  Globe,
  Building2,
  Sparkles,
  Copy,
  Check,
  LayoutDashboard,
  Mic,
  FileText,
  TrendingUp,
  Users,
  Clock,
  PhoneCall,
  Calendar,
  CheckCircle,
  XCircle,
  MessageSquare,
  BarChart3,
  Zap,
  Bot,
  Star,
  ArrowUpRight,
  Activity,
  Target,
  Headphones,
  Send,
  Mail,
  HeartHandshake,
  RefreshCcw,
  Shield,
  X,
  Workflow
} from "lucide-react";
import { ParticleField } from "@/components/ParticleField";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiSalesforce, SiHubspot, SiSlack, SiGooglecalendar, SiStripe, SiTwilio, SiZendesk, SiZoom } from "react-icons/si";
import { findIndustryByName } from "@/config/industries";
import voicelyAgentPortrait from "@assets/perfect_voicely_girl_1765701711958.png";
import { WorkflowFlowchart } from "@/components/WorkflowFlowchart";

interface BusinessInfo {
  businessName: string;
  industry: string;
  services: string[];
  hours: string;
  location: string;
  phone: string;
  email: string;
  description: string;
  uniqueSellingPoints: string[];
  commonQuestions: string[];
  bookingInfo: string;
  pricing: string;
}

interface SavedDemoAgent {
  slug: string;
  websiteUrl: string;
  businessName: string;
  industry: string;
  businessInfo: BusinessInfo;
  systemPrompt: string;
  greeting: string;
  workflows: any[];
  coldEmail: string;
  createdAt: string;
}

type ViewMode = 'demo' | 'details' | 'dashboard';

const industryColors: Record<string, string> = {
  "Dental": "#22d3ee",
  "Medical": "#10b981",
  "Healthcare": "#10b981",
  "Real Estate": "#f59e0b",
  "Legal": "#8b5cf6",
  "Automotive": "#ef4444",
  "Restaurant": "#f97316",
  "Restaurants": "#f97316",
  "Salon": "#ec4899",
  "Fitness": "#14b8a6",
  "Insurance": "#6366f1",
  "Finance": "#0ea5e9",
  "Financial Services": "#0ea5e9",
  "E-Commerce": "#f472b6",
  "Veterinary": "#22c55e",
  "Education": "#3b82f6",
  "Construction": "#f97316",
  "Property Management": "#8b5cf6",
  "Travel & Tourism": "#f472b6",
  "Wealth Management": "#1e3a5f",
  "Hotels": "#a855f7",
  "default": "#8b5cf6"
};

function seededRandom(seed: number) {
  let state = seed;
  return (min: number, max: number) => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return Math.floor((state / 0x7fffffff) * (max - min) + min);
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function generateMockData(businessName: string, industry: string) {
  const seed = hashString(businessName + industry);
  const random = seededRandom(seed);
  
  const totalCalls = random(1247, 3500);
  const answerRate = random(92, 99);
  const answeredCalls = Math.floor(totalCalls * (answerRate / 100));
  const avgDuration = random(180, 420);
  const satisfactionScore = (random(45, 49) / 10).toFixed(1);
  const appointmentsBooked = Math.floor(totalCalls * (random(35, 55) / 100));
  const leadsGenerated = Math.floor(totalCalls * (random(20, 40) / 100));
  
  const callerNames = ["John M.", "Sarah L.", "Mike R.", "Emily T.", "David K.", "Lisa P.", "James W.", "Anna B.", "Chris D.", "Rachel F."];
  const summaries = [
    "Scheduled appointment for next Tuesday",
    "Answered pricing questions, sent follow-up email",
    "Transferred to specialist for technical inquiry",
    "New customer inquiry, booked consultation",
    "Voicemail left, callback scheduled",
    "Resolved billing question, confirmed payment",
    "Product inquiry, sent detailed information",
    "Service request logged, technician scheduled",
    "Follow-up call, customer very satisfied",
    "Initial consultation completed, proposal sent"
  ];
  const times = ["2 min ago", "18 min ago", "45 min ago", "1 hr ago", "2 hrs ago"];
  
  const callLogs = [];
  for (let i = 0; i < 5; i++) {
    const callerIdx = random(0, callerNames.length);
    const summaryIdx = random(0, summaries.length);
    const mins = random(1, 6);
    const secs = random(0, 60);
    callLogs.push({
      id: i + 1,
      caller: callerNames[callerIdx],
      time: times[i],
      duration: `${mins}:${secs.toString().padStart(2, '0')}`,
      status: random(0, 10) > 1 ? "completed" : "missed",
      sentiment: random(0, 10) > 3 ? "positive" : "neutral",
      summary: summaries[summaryIdx]
    });
  }
  
  const weeklyData = [
    { day: "Mon", calls: random(150, 250) },
    { day: "Tue", calls: random(180, 280) },
    { day: "Wed", calls: random(200, 300) },
    { day: "Thu", calls: random(170, 270) },
    { day: "Fri", calls: random(220, 320) },
    { day: "Sat", calls: random(80, 150) },
    { day: "Sun", calls: random(40, 100) },
  ];
  
  return {
    totalCalls,
    answeredCalls,
    avgDuration,
    satisfactionScore,
    appointmentsBooked,
    leadsGenerated,
    callLogs,
    weeklyData,
    responseRate: ((answeredCalls / totalCalls) * 100).toFixed(1),
    avgWaitTime: random(2, 8),
  };
}

function MetricCard({ icon: Icon, label, value, subValue, color, trend, testId }: { 
  icon: any; 
  label: string; 
  value: string | number; 
  subValue?: string;
  color: string;
  trend?: string;
  testId?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      data-testid={testId}
    >
      <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-visible">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: `${color}20` }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            {trend && (
              <span className="text-xs text-green-400 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {trend}
              </span>
            )}
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
            {subValue && <p className="text-xs text-gray-500">{subValue}</p>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CallLogItem({ log, color, testId }: { log: any; color: string; testId?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/10"
      data-testid={testId}
    >
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
        style={{ background: `${color}30` }}
      >
        {log.caller.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium">{log.caller}</span>
          <span className="text-xs text-gray-500">{log.time}</span>
          {log.status === 'completed' ? (
            <CheckCircle className="w-3 h-3 text-green-400" />
          ) : (
            <XCircle className="w-3 h-3 text-yellow-400" />
          )}
        </div>
        <p className="text-sm text-gray-400 truncate">{log.summary}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-white">{log.duration}</p>
        <p className={`text-xs ${log.sentiment === 'positive' ? 'text-green-400' : 'text-gray-400'}`}>
          {log.sentiment === 'positive' ? '★ Positive' : 'Neutral'}
        </p>
      </div>
    </motion.div>
  );
}

function SimpleBarChart({ data, color }: { data: { day: string; calls: number }[]; color: string }) {
  const maxCalls = Math.max(...data.map(d => d.calls));
  
  return (
    <div className="flex items-end justify-between gap-2 h-32">
      {data.map((item, index) => (
        <motion.div
          key={item.day}
          initial={{ height: 0 }}
          animate={{ height: `${(item.calls / maxCalls) * 100}%` }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="flex-1 flex flex-col items-center gap-2"
        >
          <div 
            className="w-full rounded-t-md relative group cursor-pointer"
            style={{ 
              background: `linear-gradient(to top, ${color}40, ${color})`,
              height: '100%',
              minHeight: '8px'
            }}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {item.calls} calls
            </div>
          </div>
          <span className="text-xs text-gray-500">{item.day}</span>
        </motion.div>
      ))}
    </div>
  );
}

function IntegrationBadge({ icon: Icon, name, connected, testId }: { icon: any; name: string; connected: boolean; testId?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
        connected 
          ? 'bg-green-500/10 border-green-500/30' 
          : 'bg-white/5 border-white/10'
      }`}
      data-testid={testId}
    >
      <Icon className={`w-4 h-4 ${connected ? 'text-green-400' : 'text-gray-400'}`} />
      <span className={`text-xs ${connected ? 'text-green-400' : 'text-gray-400'}`}>{name}</span>
      {connected && <CheckCircle className="w-3 h-3 text-green-400" />}
    </motion.div>
  );
}

export default function SavedDemo() {
  const [, params] = useRoute("/demo/:slug");
  const [, navigate] = useLocation();
  const slug = params?.slug;
  
  const [isLoading, setIsLoading] = useState(true);
  const [demoAgent, setDemoAgent] = useState<SavedDemoAgent | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [callDuration, setCallDuration] = useState(0);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('demo');
  const startTimeRef = useRef<Date | null>(null);
  const messageIdRef = useRef(0);
  const { toast } = useToast();
  
  // Streaming subtitle state (matching Demo.tsx exactly)
  const [currentSubtitle, setCurrentSubtitle] = useState<{
    id: number;
    speaker: 'user' | 'agent';
    text: string;
    chunkIndex?: number;
    totalChunks?: number;
  } | null>(null);
  const [previousSubtitle, setPreviousSubtitle] = useState<{
    id: number;
    speaker: 'user' | 'agent';
    text: string;
  } | null>(null);
  
  const pendingAgentTextRef = useRef<{ id: number; text: string; chunks: string[] } | null>(null);
  const audioStartTimeRef = useRef<number | null>(null);
  const lastProcessedRef = useRef<{ speaker: string; text: string; isFinal?: boolean } | null>(null);
  const chunkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearSubtitleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Text input state for hybrid mode
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  
  // Modals
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [showColdEmailModal, setShowColdEmailModal] = useState(false);
  const [coldEmailCopied, setColdEmailCopied] = useState(false);
  const [emailViewMode, setEmailViewMode] = useState<'html' | 'plain'>('html');

  const generateHtmlEmail = useMemo(() => {
    if (!demoAgent?.coldEmail) return '';
    
    const businessName = demoAgent.businessName;
    const industry = demoAgent.industry;
    const workflows = demoAgent.workflows || [];
    
    const voicelyLogoUrl = 'https://i.imgur.com/aKa5Dwy.png';
    
    const workflowHtml = workflows.slice(0, 3).map((wf: any, idx: number) => {
      const accentColors = ['#8b5cf6', '#06b6d4', '#10b981'];
      return `
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
          <tr>
            <td bgcolor="#f8fafc" style="padding: 24px; border-left: 3px solid ${accentColors[idx % 3]};">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding-bottom: 16px;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="36" height="36" style="background-color: ${accentColors[idx % 3]}; color: #ffffff; text-align: center; font-size: 18px; font-weight: bold;">${idx + 1}</td>
                        <td style="padding-left: 14px;">
                          <p style="color: ${accentColors[idx % 3]}; font-size: 10px; font-weight: bold; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, Helvetica, sans-serif;">Workflow ${idx + 1}</p>
                          <p style="color: #1f2937; font-size: 16px; font-weight: bold; margin: 0; font-family: Arial, Helvetica, sans-serif;">${wf.title}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      ${(wf.steps || []).slice(0, 5).map((step: string, stepIdx: number) => `
                        <tr>
                          <td style="padding: 8px 0 8px 12px;">
                            <table cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td width="24" valign="top" style="color: ${accentColors[idx % 3]}; font-size: 13px; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">${stepIdx + 1}.</td>
                                <td style="color: #4b5563; font-size: 13px; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">${step}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      `).join('')}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;
    }).join('');
    
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table width="560" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
          
          <!-- Header with Voicely Logo -->
          <tr>
            <td align="center" style="padding: 0 20px 32px 20px;">
              <img src="${voicelyLogoUrl}" alt="VOICELY" width="140" height="auto" style="display: block; border: 0;" />
            </td>
          </tr>
          
          <!-- Hero Section -->
          <tr>
            <td align="center" style="padding: 0 20px 32px 20px;">
              <h1 style="color: #1f2937; font-size: 28px; font-weight: bold; margin: 0 0 12px 0; line-height: 1.4; font-family: Arial, Helvetica, sans-serif;">We Built a Custom AI Voice Agent for<br/><span style="color: #8b5cf6;">${businessName}!</span></h1>
              <p style="color: #6b7280; font-size: 15px; margin: 0; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">An intelligent voice AI trained specifically on your ${industry.toLowerCase()} services</p>
            </td>
          </tr>
          
          <!-- Introduction -->
          <tr>
            <td style="padding: 0 20px 24px 20px;">
              <p style="color: #1f2937; font-size: 15px; line-height: 1.7; margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif;">Dear ${businessName} Team,</p>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.7; margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif;">My name is Jay and I'm the Founder of VoicelyAgent.ai. I specialize in AI voice solutions for ${industry} businesses, and I have an idea that might interest you.</p>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.7; margin: 0; font-family: Arial, Helvetica, sans-serif;">Picture this: A potential customer calls at 9 PM on a Sunday. Instead of voicemail, they get instant answers, book an appointment, and receive confirmation - all without your team lifting a finger.</p>
            </td>
          </tr>
          
          <!-- Divider -->
          <tr>
            <td style="padding: 8px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-bottom: 1px solid #e5e7eb;">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Agentic Workflows Section -->
          <tr>
            <td style="padding: 24px 20px;">
              <p style="color: #8b5cf6; font-size: 11px; font-weight: bold; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 2px; font-family: Arial, Helvetica, sans-serif;">AGENTIC WORKFLOWS</p>
              <h2 style="color: #1f2937; font-size: 22px; font-weight: bold; margin: 0 0 20px 0; font-family: Arial, Helvetica, sans-serif;">What Your AI Voice Agent Can Do</h2>
              ${workflowHtml}
            </td>
          </tr>
          
          <!-- Why AI Section -->
          <tr>
            <td style="padding: 0 20px 24px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8fafc" style="padding: 24px;">
                <tr>
                  <td>
                    <h2 style="color: #1f2937; font-size: 18px; font-weight: bold; margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif;">Why AI for ${businessName}?</h2>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="50%" valign="top" style="padding: 12px 12px 12px 0;">
                          <p style="color: #1f2937; font-size: 14px; font-weight: bold; margin: 0 0 4px 0;">→ Never Miss a Lead</p>
                          <p style="color: #6b7280; font-size: 12px; margin: 0;">Capture every inquiry 24/7</p>
                        </td>
                        <td width="50%" valign="top" style="padding: 12px 0 12px 12px;">
                          <p style="color: #1f2937; font-size: 14px; font-weight: bold; margin: 0 0 4px 0;">→ Consistent Experience</p>
                          <p style="color: #6b7280; font-size: 12px; margin: 0;">Professional response every time</p>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" valign="top" style="padding: 12px 12px 12px 0;">
                          <p style="color: #1f2937; font-size: 14px; font-weight: bold; margin: 0 0 4px 0;">→ Free Up Your Team</p>
                          <p style="color: #6b7280; font-size: 12px; margin: 0;">Focus on high-value tasks</p>
                        </td>
                        <td width="50%" valign="top" style="padding: 12px 0 12px 12px;">
                          <p style="color: #1f2937; font-size: 14px; font-weight: bold; margin: 0 0 4px 0;">→ Scale Instantly</p>
                          <p style="color: #6b7280; font-size: 12px; margin: 0;">Handle unlimited calls</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- CTA -->
          <tr>
            <td align="center" style="padding: 24px 20px;">
              <p style="color: #374151; font-size: 14px; margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif;">Ready to see your AI agent in action?</p>
              <p style="color: #4b5563; font-size: 14px; margin: 0; font-family: Arial, Helvetica, sans-serif;">Looking forward to connecting,<br/><br/><strong>Jay</strong><br/>Founder & CEO, VoicelyAgent.ai</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }, [demoAgent]);
  
  // Workflow flowchart state
  const [selectedWorkflow, setSelectedWorkflow] = useState<{ title: string; steps: string[]; color: string } | null>(null);
  
  const agentColor = demoAgent ? (industryColors[demoAgent.industry] || industryColors.default) : industryColors.default;
  
  const mockData = useMemo(() => {
    if (!demoAgent) return null;
    return generateMockData(demoAgent.businessName, demoAgent.industry);
  }, [demoAgent]);

  // Voice chat hook - configured with Alice voice (same as Demo.tsx)
  const voiceChat = useVoiceChat({
    agentId: 'demo-agent',
    voiceId: 'cgSgspJ2msm6clMCkdW9', // Alice voice
    inlineConfig: demoAgent ? {
      systemPrompt: demoAgent.systemPrompt,
      greeting: demoAgent.greeting,
    } : undefined,
  });

  useEffect(() => {
    if (!slug) return;
    
    const fetchDemoAgent = async () => {
      try {
        const response = await fetch(`/api/demo/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setErrorMessage("This demo agent doesn't exist. It may have been removed or the URL is incorrect.");
          } else {
            throw new Error("Failed to load demo agent");
          }
          return;
        }
        
        const data = await response.json();
        setDemoAgent(data.demoAgent);
      } catch (error: any) {
        setErrorMessage(error.message || "Could not load demo agent");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDemoAgent();
  }, [slug]);

  // Sync subtitles with audio playback (matching Demo.tsx exactly)
  useEffect(() => {
    if (voiceChat.isSpeaking && pendingAgentTextRef.current) {
      if (clearSubtitleTimeoutRef.current) {
        clearTimeout(clearSubtitleTimeoutRef.current);
        clearSubtitleTimeoutRef.current = null;
      }
      
      const pending = pendingAgentTextRef.current;
      const chunks = pending.chunks;
      
      if (chunks.length === 0) return;
      
      if (chunkTimerRef.current) {
        clearTimeout(chunkTimerRef.current);
      }
      
      audioStartTimeRef.current = Date.now();
      
      const totalChars = pending.text.length;
      const estimatedDurationMs = Math.max(1500, (totalChars / 16) * 1000);
      
      const isShort = totalChars < 50;
      const minTimePerChunk = isShort ? 1000 : 1500;
      const maxTimePerChunk = 4000;
      const timePerChunk = Math.max(minTimePerChunk, Math.min(maxTimePerChunk, estimatedDurationMs / chunks.length));
      
      let currentChunkIndex = 0;
      
      const showChunk = () => {
        if (currentChunkIndex >= chunks.length) {
          chunkTimerRef.current = null;
          return;
        }
        
        if (currentSubtitle) {
          setPreviousSubtitle({
            id: currentSubtitle.id,
            speaker: currentSubtitle.speaker,
            text: currentSubtitle.text,
          });
        }
        
        setCurrentSubtitle({
          id: pending.id,
          speaker: 'agent',
          text: chunks[currentChunkIndex],
          chunkIndex: currentChunkIndex,
          totalChunks: chunks.length,
        });
        
        currentChunkIndex++;
        if (currentChunkIndex < chunks.length) {
          chunkTimerRef.current = setTimeout(showChunk, timePerChunk);
        }
      };
      
      showChunk();
    } else if (!voiceChat.isSpeaking && audioStartTimeRef.current) {
      audioStartTimeRef.current = null;
      if (chunkTimerRef.current) {
        clearTimeout(chunkTimerRef.current);
        chunkTimerRef.current = null;
      }
      
      if (clearSubtitleTimeoutRef.current) {
        clearTimeout(clearSubtitleTimeoutRef.current);
      }
      
      clearSubtitleTimeoutRef.current = setTimeout(() => {
        if (!voiceChat.isSpeaking) {
          setCurrentSubtitle(prev => {
            if (prev?.speaker === 'agent') {
              return null;
            }
            return prev;
          });
        }
        clearSubtitleTimeoutRef.current = null;
      }, 300);
      
      pendingAgentTextRef.current = null;
    }
  }, [voiceChat.isSpeaking]);

  // Process transcript updates (matching Demo.tsx exactly)
  useEffect(() => {
    const latestTranscript = voiceChat.transcript[voiceChat.transcript.length - 1];
    if (!latestTranscript) return;
    
    const currentKey = `${latestTranscript.speaker}-${latestTranscript.text}-${latestTranscript.isFinal}`;
    const lastKey = lastProcessedRef.current 
      ? `${lastProcessedRef.current.speaker}-${lastProcessedRef.current.text}-${lastProcessedRef.current.isFinal}`
      : null;
    
    if (currentKey === lastKey) return;
    lastProcessedRef.current = latestTranscript;
    
    if (latestTranscript.speaker === 'user') {
      const id = ++messageIdRef.current;
      
      if (currentSubtitle?.speaker !== 'user' || currentSubtitle.id !== id) {
        if (currentSubtitle) {
          setPreviousSubtitle({
            id: currentSubtitle.id,
            speaker: currentSubtitle.speaker,
            text: currentSubtitle.text,
          });
        }
      }
      
      setCurrentSubtitle({
        id,
        speaker: 'user',
        text: latestTranscript.text,
      });
    } else if (latestTranscript.speaker === 'agent' && latestTranscript.isFinal) {
      const id = ++messageIdRef.current;
      const text = latestTranscript.text;
      const chunks = chunkText(text, VOICE_CONFIG.SUBTITLE_MAX_CHARS);
      
      pendingAgentTextRef.current = { id, text, chunks };
      
      if (!voiceChat.isSpeaking) {
        if (currentSubtitle) {
          setPreviousSubtitle({
            id: currentSubtitle.id,
            speaker: currentSubtitle.speaker,
            text: currentSubtitle.text,
          });
        }
        setCurrentSubtitle({
          id,
          speaker: 'agent',
          text: chunks[0] || text,
          chunkIndex: 0,
          totalChunks: chunks.length,
        });
      }
    }
  }, [voiceChat.transcript, voiceChat.isSpeaking]);

  // Track call duration
  useEffect(() => {
    if (!voiceChat.isActive) {
      setCallDuration(0);
      startTimeRef.current = null;
      return;
    }

    if (!startTimeRef.current) {
      startTimeRef.current = new Date();
    }

    const interval = setInterval(() => {
      if (startTimeRef.current) {
        const elapsed = Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000);
        setCallDuration(elapsed);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [voiceChat.isActive]);

  const startCall = useCallback(async () => {
    startTimeRef.current = new Date();
    setCallDuration(0);
    setCurrentSubtitle(null);
    setPreviousSubtitle(null);
    
    try {
      await voiceChat.startSession();
    } catch (error: any) {
      console.error('[SavedDemo] Failed to start call:', error);
      toast({
        title: "Call Failed",
        description: "Could not start the voice call. Please try again.",
        variant: "destructive",
      });
      startTimeRef.current = null;
    }
  }, [voiceChat, toast]);

  const endCall = useCallback(() => {
    setCurrentSubtitle(null);
    setPreviousSubtitle(null);
    pendingAgentTextRef.current = null;
    if (chunkTimerRef.current) {
      clearTimeout(chunkTimerRef.current);
      chunkTimerRef.current = null;
    }
    
    voiceChat.endSession();
    startTimeRef.current = null;
  }, [voiceChat]);

  // Text message handlers
  const handleSendMessage = useCallback(() => {
    if (textInput.trim()) {
      voiceChat.sendTextMessage(textInput.trim());
      setTextInput("");
    }
  }, [textInput, voiceChat]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleServiceClick = useCallback((service: string) => {
    if (!voiceChat.isActive) {
      startCall().then(() => {
        setTimeout(() => {
          voiceChat.sendTextMessage(`Tell me about ${service}`);
        }, 3000);
      });
    } else {
      voiceChat.pauseSession();
      setTimeout(() => {
        voiceChat.sendTextMessage(`Tell me about ${service}`);
      }, 100);
    }
  }, [voiceChat, startCall]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyPermanentUrl = () => {
    const url = `${window.location.origin}/demo/${slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "URL Copied",
      description: "Permanent demo URL copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading demo agent...</p>
        </motion.div>
      </div>
    );
  }

  if (errorMessage || !demoAgent) {
    return (
      <div className="min-h-screen bg-[#050510] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <Globe className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Demo Not Found</h2>
          <p className="text-gray-400 mb-8">{errorMessage || "This demo agent could not be found."}</p>
          <Button
            onClick={() => navigate("/demo")}
            className="bg-purple-600 hover:bg-purple-500"
            data-testid="button-create-demo"
          >
            Create Your Own Demo
          </Button>
        </motion.div>
      </div>
    );
  }

  const renderDemoView = () => (
    <div className="min-h-full flex flex-col items-center justify-center p-6 pb-24">
      {/* Agent Avatar with voicelyAgentPortrait (matching Demo.tsx exactly) */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative mb-6"
      >
        {/* Glow Ring */}
        <motion.div
          className="absolute -inset-4 rounded-full opacity-50 blur-xl"
          style={{ background: agentColor }}
          animate={voiceChat.isActive ? {
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Avatar Container */}
        <div 
          className="relative w-24 h-24 rounded-full p-[3px]"
          style={{ background: `linear-gradient(to bottom right, ${agentColor}, ${agentColor}99)` }}
        >
          <div className="w-full h-full rounded-full overflow-hidden">
            <img 
              src={voicelyAgentPortrait} 
              alt="Voicely AI Voice Agent"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Speaking Indicator Dots */}
        <AnimatePresence>
          {voiceChat.isActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: agentColor }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Agent Info */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-6"
      >
        <h1 className="text-3xl font-bold text-white mb-1">{demoAgent.businessName}</h1>
        <p className="text-gray-400 flex items-center justify-center gap-2">
          <Star className="w-4 h-4" style={{ color: agentColor }} />
          {demoAgent.industry}
        </p>
      </motion.div>

      {/* Services Tags - Clickable (matching Demo.tsx exactly) */}
      {demoAgent.businessInfo?.services && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8 max-w-sm"
        >
          {demoAgent.businessInfo.services.slice(0, 4).map((service, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleServiceClick(service)}
              className="px-3 py-1.5 text-xs rounded-full border cursor-pointer transition-all duration-200"
              style={{ 
                borderColor: `${agentColor}50`,
                color: agentColor,
                background: `${agentColor}15`,
              }}
              data-testid={`button-service-${i}`}
            >
              {service}
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Streaming Subtitle Display (matching Demo.tsx exactly) */}
      <AnimatePresence mode="wait">
        {currentSubtitle && voiceChat.isActive && (
          <motion.div
            key={`${currentSubtitle.id}-${currentSubtitle.chunkIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md mb-8 text-center"
          >
            <div 
              className="px-6 py-4 rounded-2xl backdrop-blur-xl"
              style={{ 
                background: currentSubtitle.speaker === 'user' 
                  ? 'rgba(100, 100, 255, 0.15)' 
                  : `${agentColor}15`, 
                border: `1px solid ${currentSubtitle.speaker === 'user' ? 'rgba(100, 100, 255, 0.3)' : `${agentColor}30`}` 
              }}
            >
              {currentSubtitle.speaker === 'user' && (
                <p className="text-xs text-blue-300 mb-1 uppercase tracking-wider">You</p>
              )}
              <p className={`text-lg leading-relaxed ${currentSubtitle.speaker === 'user' ? 'text-blue-100 italic' : 'text-white'}`}>
                {currentSubtitle.speaker === 'user' ? `"${currentSubtitle.text}"` : currentSubtitle.text}
              </p>
              {currentSubtitle.totalChunks && currentSubtitle.totalChunks > 1 && currentSubtitle.speaker === 'agent' && (
                <div className="flex justify-center gap-1 mt-3">
                  {Array.from({ length: currentSubtitle.totalChunks }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        i === currentSubtitle.chunkIndex 
                          ? 'scale-125' 
                          : 'opacity-40'
                      }`}
                      style={{ background: agentColor }}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call Controls (matching Demo.tsx exactly) */}
      {!voiceChat.isActive ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            size="lg"
            onClick={startCall}
            className="h-16 px-12 text-white font-bold text-lg"
            style={{ 
              background: `linear-gradient(135deg, ${agentColor}, ${agentColor}cc)`,
            }}
            data-testid="button-start-call"
          >
            <Phone className="w-6 h-6 mr-3" />
            Call {demoAgent.businessName}
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full w-14 h-14 border-white/20"
                onClick={() => setShowTextInput(!showTextInput)}
                data-testid="button-toggle-text"
              >
                <MessageSquare className="w-5 h-5 text-gray-400" />
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                className="rounded-full bg-gradient-to-br from-red-500 to-rose-600 shadow-lg flex items-center justify-center"
                style={{ 
                  width: '56px', 
                  height: '56px', 
                  minWidth: '56px', 
                  minHeight: '56px',
                  boxShadow: '0 6px 24px rgba(239, 68, 68, 0.4)' 
                }}
                onClick={endCall}
                data-testid="button-end-call"
              >
                <PhoneOff className="w-6 h-6 text-white" />
              </button>
            </motion.div>
          </div>

          {/* Text Input (matching Demo.tsx exactly) */}
          <AnimatePresence>
            {showTextInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full max-w-sm"
              >
                <div className="flex gap-2 mt-4">
                  <Input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Type a message..."
                    className="bg-black/40 border-white/20 text-white placeholder:text-gray-500"
                    data-testid="input-text-message"
                  />
                  <Button
                    size="icon"
                    className="text-white"
                    style={{ background: agentColor }}
                    onClick={handleSendMessage}
                    disabled={!textInput.trim()}
                    data-testid="button-send-message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );

  const renderDetailsView = () => {
    const businessInfo = demoAgent.businessInfo;
    const industryConfig = findIndustryByName(demoAgent.industry);
    const IndustryIcon = industryConfig?.icon || Building2;
    
    return (
      <div className="p-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Business Card Header (matching Demo.tsx) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-purple-600/10 to-violet-600/5 border border-purple-500/20 backdrop-blur-xl"
          >
            <div className="flex items-start gap-6 mb-6">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ 
                  background: `linear-gradient(135deg, ${agentColor}40, ${agentColor}20)`,
                  border: `2px solid ${agentColor}60`,
                  boxShadow: `0 0 30px ${agentColor}30`
                }}
              >
                <IndustryIcon className="w-10 h-10" style={{ color: agentColor }} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">{demoAgent.businessName}</h2>
                <p className="text-gray-400 mb-3">{demoAgent.industry}</p>
                <a 
                  href={demoAgent.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-purple-400 hover:underline flex items-center gap-1"
                >
                  {demoAgent.websiteUrl}
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Agent Greeting */}
            <div className="p-4 rounded-xl bg-black/20 border border-white/5">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Agent Greeting</p>
              <p className="text-gray-300 italic">"{demoAgent.greeting}"</p>
            </div>
          </motion.div>

          {/* Services Section */}
          {businessInfo?.services && businessInfo.services.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5" style={{ color: agentColor }} />
                    Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {businessInfo.services.map((service, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1.5 rounded-full text-sm"
                        style={{ 
                          background: `${agentColor}15`,
                          color: agentColor,
                          border: `1px solid ${agentColor}30`
                        }}
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Value Proposition Section (matching Demo.tsx) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-purple-600/10 to-pink-600/5 border border-purple-500/20 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-100">Why AI for {demoAgent.businessName}?</h3>
                <p className="text-sm text-gray-400">Enhancement, not replacement</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200 text-sm">Never Miss a Lead</h4>
                    <p className="text-xs text-gray-400">Capture every inquiry 24/7, even during busy hours or after close</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200 text-sm">Free Up Your Team</h4>
                    <p className="text-xs text-gray-400">Let staff focus on high-value tasks while AI handles routine calls</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200 text-sm">Consistent Experience</h4>
                    <p className="text-xs text-gray-400">Every caller gets the same professional, knowledgeable response</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-200 text-sm">Scale Instantly</h4>
                    <p className="text-xs text-gray-400">Handle 1 or 1,000 simultaneous calls without hiring</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: RefreshCcw, label: "24/7 Availability" },
                { icon: BarChart3, label: "Call Analytics" },
                { icon: Shield, label: "HIPAA Compliant" },
                { icon: Zap, label: "Instant Response" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-gray-900/30">
                  <item.icon className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-gray-300">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Complex Agentic Workflows Section */}
          {demoAgent.workflows && demoAgent.workflows.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-4"
            >
              <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Complex Agentic Workflows for {demoAgent.businessName}
              </h4>
              
              {demoAgent.workflows.map((workflow: any, wIndex: number) => (
                <motion.div 
                  key={wIndex}
                  className="p-5 rounded-xl bg-gray-950/80 border border-gray-800 cursor-pointer group hover:border-purple-500/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + wIndex * 0.15 }}
                  onClick={() => setSelectedWorkflow(workflow)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  data-testid={`workflow-card-${wIndex}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        workflow.color === 'cyan' ? 'bg-cyan-500/20' : 
                        workflow.color === 'purple' ? 'bg-purple-500/20' : 'bg-green-500/20'
                      }`}>
                        <Workflow className={`w-4 h-4 ${
                          workflow.color === 'cyan' ? 'text-cyan-400' : 
                          workflow.color === 'purple' ? 'text-purple-400' : 'text-green-400'
                        }`} />
                      </div>
                      <h5 className="font-semibold text-gray-200 text-sm">{workflow.title}</h5>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity ${
                      workflow.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' : 
                      workflow.color === 'purple' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      View Flowchart
                    </div>
                  </div>
                  
                  <div className="space-y-2 pl-2">
                    {workflow.steps.map((step: string, sIndex: number) => (
                      <motion.div 
                        key={sIndex}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + wIndex * 0.15 + sIndex * 0.05 }}
                      >
                        <div className="flex flex-col items-center">
                          <div className={`w-2 h-2 rounded-full mt-1.5 ${
                            workflow.color === 'cyan' ? 'bg-cyan-400' : 
                            workflow.color === 'purple' ? 'bg-purple-400' : 'bg-green-400'
                          }`} />
                          {sIndex < workflow.steps.length - 1 && (
                            <div className={`w-0.5 h-4 ${
                              workflow.color === 'cyan' ? 'bg-cyan-400/30' : 
                              workflow.color === 'purple' ? 'bg-purple-400/30' : 'bg-green-400/30'
                            }`} />
                          )}
                        </div>
                        <span className="text-xs text-gray-400 leading-relaxed">{step}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => setShowPromptModal(true)}
              className="h-12 px-6 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold"
              data-testid="button-view-prompt"
            >
              <FileText className="w-5 h-5 mr-2" />
              View Agent Prompt
            </Button>
            {demoAgent.coldEmail && (
              <Button
                size="lg"
                onClick={() => setShowColdEmailModal(true)}
                className="h-12 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold"
                data-testid="button-view-cold-email"
              >
                <Mail className="w-5 h-5 mr-2" />
                View Cold Email
              </Button>
            )}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center"
          >
            <Button
              size="lg"
              onClick={() => {
                setViewMode('demo');
                startCall();
              }}
              className="h-16 px-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-lg"
              data-testid="button-call-from-details"
            >
              <Phone className="w-6 h-6 mr-3" />
              Call Your AI Voice Agent
            </Button>
          </motion.div>
        </div>
      </div>
    );
  };

  const renderDashboardView = () => {
    if (!mockData) return null;
    
    return (
      <div className="p-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold text-white">{demoAgent.businessName}</h2>
              <p className="text-gray-400">AI Voice Agent Performance Dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-green-400">Live</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="metrics-row-1">
            <MetricCard 
              icon={PhoneCall} 
              label="Total Calls" 
              value={mockData.totalCalls.toLocaleString()}
              subValue="This month"
              color={agentColor}
              trend="+12%"
              testId="metric-total-calls"
            />
            <MetricCard 
              icon={CheckCircle} 
              label="Answer Rate" 
              value={`${mockData.responseRate}%`}
              subValue={`${mockData.answeredCalls} answered`}
              color="#22c55e"
              trend="+3%"
              testId="metric-answer-rate"
            />
            <MetricCard 
              icon={Clock} 
              label="Avg Duration" 
              value={`${Math.floor(mockData.avgDuration / 60)}:${(mockData.avgDuration % 60).toString().padStart(2, '0')}`}
              subValue="Per call"
              color="#f59e0b"
              testId="metric-avg-duration"
            />
            <MetricCard 
              icon={Star} 
              label="Satisfaction" 
              value={`${mockData.satisfactionScore}/5`}
              subValue="Customer rating"
              color="#8b5cf6"
              trend="+0.2"
              testId="metric-satisfaction"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="metrics-row-2">
            <MetricCard 
              icon={Calendar} 
              label="Appointments" 
              value={mockData.appointmentsBooked}
              subValue="Booked this month"
              color="#3b82f6"
              trend="+18%"
              testId="metric-appointments"
            />
            <MetricCard 
              icon={Target} 
              label="Leads Generated" 
              value={mockData.leadsGenerated}
              subValue="Qualified leads"
              color="#10b981"
              trend="+25%"
              testId="metric-leads"
            />
            <MetricCard 
              icon={Zap} 
              label="Avg Wait Time" 
              value={`${mockData.avgWaitTime}s`}
              subValue="To answer"
              color="#f472b6"
              trend="-2s"
              testId="metric-wait-time"
            />
            <MetricCard 
              icon={Headphones} 
              label="24/7 Coverage" 
              value="100%"
              subValue="Always available"
              color="#22d3ee"
              testId="metric-coverage"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/5 border-white/10" data-testid="card-weekly-calls">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" style={{ color: agentColor }} />
                    Weekly Call Volume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleBarChart data={mockData.weeklyData} color={agentColor} />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/5 border-white/10" data-testid="card-integrations">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5" style={{ color: agentColor }} />
                    Connected Integrations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <IntegrationBadge icon={SiSalesforce} name="Salesforce" connected={true} testId="integration-salesforce" />
                    <IntegrationBadge icon={SiHubspot} name="HubSpot" connected={true} testId="integration-hubspot" />
                    <IntegrationBadge icon={SiGooglecalendar} name="Calendar" connected={true} testId="integration-calendar" />
                    <IntegrationBadge icon={SiSlack} name="Slack" connected={true} testId="integration-slack" />
                    <IntegrationBadge icon={SiStripe} name="Stripe" connected={false} testId="integration-stripe" />
                    <IntegrationBadge icon={SiTwilio} name="Twilio" connected={true} testId="integration-twilio" />
                    <IntegrationBadge icon={SiZendesk} name="Zendesk" connected={false} testId="integration-zendesk" />
                    <IntegrationBadge icon={SiZoom} name="Zoom" connected={true} testId="integration-zoom" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" style={{ color: agentColor }} />
                  Recent Calls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3" data-testid="call-logs-list">
                {mockData.callLogs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <CallLogItem log={log} color={agentColor} testId={`call-log-${log.id}`} />
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center py-6"
          >
            <p className="text-gray-500 text-sm">
              Demo dashboard showing simulated metrics for {demoAgent.businessName}
            </p>
          </motion.div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050510]">
      {viewMode === 'demo' && (
        <div className="absolute inset-0">
          <ParticleField 
            primaryColor={agentColor}
            secondaryColor={agentColor}
          />
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: agentColor }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
          style={{ background: agentColor }}
        />
      </div>

      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-white/10">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-white"
            onClick={() => navigate("/demo")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center gap-1 bg-white/5 rounded-full p-1">
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full px-4 ${viewMode === 'demo' ? 'bg-white/10 text-white' : 'text-gray-400'}`}
              onClick={() => setViewMode('demo')}
              data-testid="tab-demo"
            >
              <Mic className="w-4 h-4 mr-2" />
              Demo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full px-4 ${viewMode === 'details' ? 'bg-white/10 text-white' : 'text-gray-400'}`}
              onClick={() => setViewMode('details')}
              data-testid="tab-details"
            >
              <FileText className="w-4 h-4 mr-2" />
              Details
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full px-4 ${viewMode === 'dashboard' ? 'bg-white/10 text-white' : 'text-gray-400'}`}
              onClick={() => setViewMode('dashboard')}
              data-testid="tab-dashboard"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
            onClick={copyPermanentUrl}
            data-testid="button-copy-url"
          >
            {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'demo' && (
            <motion.div
              key="demo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto"
            >
              {renderDemoView()}
            </motion.div>
          )}
          {viewMode === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto"
            >
              {renderDetailsView()}
            </motion.div>
          )}
          {viewMode === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto"
            >
              {renderDashboardView()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Prompt Modal */}
      <AnimatePresence>
        {showPromptModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setShowPromptModal(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl max-h-[80vh] overflow-auto bg-gradient-to-br from-gray-900 to-gray-950 border border-purple-500/30 rounded-3xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Agent System Prompt</h3>
                    <p className="text-sm text-gray-400">AI instructions for {demoAgent.businessName}</p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                  onClick={() => setShowPromptModal(false)}
                  data-testid="button-close-prompt-modal"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="relative">
                <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono bg-black/40 p-6 rounded-2xl border border-white/5 max-h-96 overflow-auto">
                  {demoAgent.systemPrompt}
                </pre>
                <Button
                  size="sm"
                  className="absolute top-3 right-3 bg-purple-600 hover:bg-purple-500"
                  onClick={() => {
                    navigator.clipboard.writeText(demoAgent.systemPrompt);
                    setPromptCopied(true);
                    setTimeout(() => setPromptCopied(false), 2000);
                  }}
                  data-testid="button-copy-prompt"
                >
                  {promptCopied ? (
                    <>
                      <Check className="w-4 h-4 mr-1" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" /> Copy
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cold Email Modal */}
      <AnimatePresence>
        {showColdEmailModal && demoAgent.coldEmail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setShowColdEmailModal(false)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl max-h-[80vh] overflow-auto bg-gradient-to-br from-gray-900 to-gray-950 border border-pink-500/30 rounded-3xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Cold Email Template</h3>
                    <p className="text-sm text-gray-400">Gmail-compatible HTML email</p>
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                  onClick={() => setShowColdEmailModal(false)}
                  data-testid="button-close-cold-email-modal"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 mb-4">
                <Button
                  size="sm"
                  variant={emailViewMode === 'html' ? 'default' : 'outline'}
                  onClick={() => setEmailViewMode('html')}
                  className={emailViewMode === 'html' ? 'bg-pink-600' : ''}
                  data-testid="button-email-view-html"
                >
                  Preview
                </Button>
                <Button
                  size="sm"
                  variant={emailViewMode === 'plain' ? 'default' : 'outline'}
                  onClick={() => setEmailViewMode('plain')}
                  className={emailViewMode === 'plain' ? 'bg-pink-600' : ''}
                  data-testid="button-email-view-plain"
                >
                  HTML Code
                </Button>
              </div>
              
              <div className="relative">
                {emailViewMode === 'html' ? (
                  <div 
                    className="bg-white rounded-2xl p-6 max-h-96 overflow-auto"
                    dangerouslySetInnerHTML={{ __html: generateHtmlEmail }}
                  />
                ) : (
                  <pre className="text-gray-300 text-xs whitespace-pre-wrap font-mono bg-black/40 p-6 rounded-2xl border border-white/5 max-h-96 overflow-auto">
                    {generateHtmlEmail}
                  </pre>
                )}
                <Button
                  size="sm"
                  className="absolute top-3 right-3 bg-pink-600 hover:bg-pink-500"
                  onClick={async () => {
                    const copyRichText = () => {
                      const temp = document.createElement('div');
                      temp.innerHTML = generateHtmlEmail;
                      temp.style.position = 'absolute';
                      temp.style.left = '-9999px';
                      temp.style.whiteSpace = 'pre-wrap';
                      document.body.appendChild(temp);
                      
                      const range = document.createRange();
                      range.selectNodeContents(temp);
                      const selection = window.getSelection();
                      if (selection) {
                        selection.removeAllRanges();
                        selection.addRange(range);
                      }
                      
                      document.execCommand('copy');
                      
                      if (selection) {
                        selection.removeAllRanges();
                      }
                      document.body.removeChild(temp);
                    };
                    
                    try {
                      if (navigator.clipboard && navigator.clipboard.write) {
                        const blob = new Blob([generateHtmlEmail], { type: 'text/html' });
                        const plainText = generateHtmlEmail.replace(/<[^>]*>/g, '');
                        const textBlob = new Blob([plainText], { type: 'text/plain' });
                        await navigator.clipboard.write([
                          new ClipboardItem({
                            'text/html': blob,
                            'text/plain': textBlob,
                          }),
                        ]);
                      } else {
                        copyRichText();
                      }
                      setColdEmailCopied(true);
                      setTimeout(() => setColdEmailCopied(false), 2000);
                      toast({
                        title: "Copied for Gmail",
                        description: "Paste directly into Gmail compose window",
                      });
                    } catch (err) {
                      copyRichText();
                      setColdEmailCopied(true);
                      setTimeout(() => setColdEmailCopied(false), 2000);
                      toast({
                        title: "Copied for Gmail",
                        description: "Paste directly into Gmail compose window",
                      });
                    }
                  }}
                  data-testid="button-copy-cold-email"
                >
                  {coldEmailCopied ? (
                    <>
                      <Check className="w-4 h-4 mr-1" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" /> Copy for Gmail
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workflow Flowchart Modal */}
      {demoAgent && (
        <WorkflowFlowchart
          isOpen={selectedWorkflow !== null}
          onClose={() => setSelectedWorkflow(null)}
          workflow={selectedWorkflow || { title: '', steps: [], color: 'purple' }}
          businessName={demoAgent.businessName}
          businessUrl={demoAgent.websiteUrl || ''}
          services={demoAgent.businessInfo?.services || ['General Consultation', 'Follow-up Appointment', 'New Patient Visit']}
        />
      )}
    </div>
  );
}
