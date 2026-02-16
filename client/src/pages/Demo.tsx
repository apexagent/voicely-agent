import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, Phone, PhoneOff, Loader2, Building2, MapPin, Clock, 
  Mail, CheckCircle, ArrowRight, ArrowLeft, Star, MessageSquare, Send,
  Scan, Database, Wand2, FileText, Copy, Check, X, Calendar, CreditCard,
  Users, BarChart3, Zap, Shield, Bot, Workflow, HeartHandshake, TrendingUp,
  Sparkles, Brain, Link2, RefreshCcw, BellRing, Stethoscope, Scale, Home,
  Heart, Utensils, GraduationCap, Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useVoiceChat } from "@/hooks/useVoiceChat";
import { VOICE_CONFIG } from "@/lib/voiceConfig";
import { ParticleField } from "@/components/ParticleField";
import { ParticleRing } from "@/components/ParticleRing";
import voicelyWaveformIcon from "@assets/IMAGE_2025-11-10_22_12_52-removebg-preview_(1)_1765378653714.png";
import voicelyAgentPortrait from "@assets/perfect_voicely_girl_1765701711958.png";
import { findIndustryByName } from "@/config/industries";
import { AlertCircle, RefreshCw } from "lucide-react";
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
  customerTerminology?: string;
  staffRoles?: string[];
  specificScenarios?: string[];
  testimonialHighlights?: string[];
  serviceDetails?: Record<string, string>;
  urgentIssueExamples?: string[];
  followUpServices?: string[];
  toneDescriptors?: string[];
  competitiveAdvantages?: string[];
  targetAudience?: string;
  brandVoice?: string;
}

interface AgenticWorkflow {
  title: string;
  steps: string[];
  color: string;
}

type DemoStage = 'input' | 'analyzing' | 'ready' | 'calling' | 'error';

export default function Demo() {
  const [stage, setStage] = useState<DemoStage>('input');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [greeting, setGreeting] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [callDuration, setCallDuration] = useState(0);
  const startTimeRef = useRef<Date | null>(null);
  const messageIdRef = useRef(0);
  const { toast } = useToast();
  
  // Subtitle state for streaming effect
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
  
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
  const [showColdEmailModal, setShowColdEmailModal] = useState(false);
  const [coldEmailCopied, setColdEmailCopied] = useState(false);
  const [emailViewMode, setEmailViewMode] = useState<'html' | 'plain'>('html');
  
  // Pre-generated personalized content from backend
  const [generatedColdEmail, setGeneratedColdEmail] = useState<string>('');
  const [generatedWorkflows, setGeneratedWorkflows] = useState<AgenticWorkflow[]>([]);
  const [emailWorkflowsText, setEmailWorkflowsText] = useState<string>('');
  const [teamAmplificationPoints, setTeamAmplificationPoints] = useState<string[]>([]);
  
  // Validation flags for deciding when to use pre-generated vs fallback content
  const [hasValidWorkflows, setHasValidWorkflows] = useState<boolean>(false);
  const [hasValidColdEmail, setHasValidColdEmail] = useState<boolean>(false);
  
  // Permanent demo URL
  const [permanentUrl, setPermanentUrl] = useState<string>('');
  const [permanentSlug, setPermanentSlug] = useState<string>('');
  const [urlCopied, setUrlCopied] = useState(false);
  
  // Workflow flowchart state
  const [selectedWorkflow, setSelectedWorkflow] = useState<AgenticWorkflow | null>(null);

  // Voice chat hook - configured with dynamic system prompt and greeting
  const voiceChat = useVoiceChat({
    agentId: 'demo-agent',
    voiceId: 'cgSgspJ2msm6clMCkdW9', // Alice voice
    inlineConfig: systemPrompt ? {
      systemPrompt: systemPrompt,
      greeting: greeting,
    } : undefined,
  });

  // Sync subtitles with audio playback
  useEffect(() => {
    if (voiceChat.isSpeaking && pendingAgentTextRef.current) {
      // Cancel any pending clear timeout - agent is speaking again
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
      
      // ElevenLabs turbo mode speaks at ~15-18 chars/second
      // Using 16 chars/sec for better sync with turbo TTS
      const totalChars = pending.text.length;
      const estimatedDurationMs = Math.max(1500, (totalChars / 16) * 1000);
      
      // Dynamic chunk timing based on content length
      // Short utterances (<50 chars): faster timing (1s min)
      // Normal utterances: 1.5-4s per chunk
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
      // Audio ended - clear agent subtitle since agent stopped speaking
      audioStartTimeRef.current = null;
      if (chunkTimerRef.current) {
        clearTimeout(chunkTimerRef.current);
        chunkTimerRef.current = null;
      }
      
      // Cancel any previous clear timeout
      if (clearSubtitleTimeoutRef.current) {
        clearTimeout(clearSubtitleTimeoutRef.current);
      }
      
      // Clear agent subtitle after a brief moment - but check speaking state first
      clearSubtitleTimeoutRef.current = setTimeout(() => {
        // Only clear if agent is STILL not speaking (prevents race condition)
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

  // Process transcript updates
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

  // Track if we're intentionally ending the session
  const isEndingCallRef = useRef(false);

  // Handle voice chat errors (but not when intentionally ending call)
  useEffect(() => {
    if (voiceChat.error && !isEndingCallRef.current) {
      // Suppress playback errors that occur during normal session end
      const isPlaybackAbortError = 
        voiceChat.error.toLowerCase().includes('playback') ||
        voiceChat.error.toLowerCase().includes('aborted') ||
        voiceChat.error.toLowerCase().includes('interrupted');
      
      if (!isPlaybackAbortError) {
        toast({
          title: "Voice Demo Error",
          description: voiceChat.error,
          variant: "destructive",
        });
      }
    }
  }, [voiceChat.error, toast]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const chunkText = (text: string, maxChars: number): string[] => {
    const words = text.split(' ');
    const chunks: string[] = [];
    let currentChunk = '';
    
    for (const word of words) {
      if ((currentChunk + ' ' + word).trim().length <= maxChars) {
        currentChunk = (currentChunk + ' ' + word).trim();
      } else {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = word;
      }
    }
    if (currentChunk) chunks.push(currentChunk);
    
    return chunks;
  };

  const getComplexWorkflows = () => {
    if (!businessInfo) return { workflows: [], emailWorkflows: '' };
    
    // Use pre-generated content from Gemini if validated by backend
    if (hasValidWorkflows && generatedWorkflows.length > 0 && emailWorkflowsText) {
      return {
        workflows: generatedWorkflows,
        emailWorkflows: emailWorkflowsText,
      };
    }
    
    const industry = businessInfo.industry.toLowerCase();
    const services = businessInfo.services;
    const businessName = businessInfo.businessName;
    
    // Get specific services for unique workflows
    const svc1 = services[0] || "services";
    const svc2 = services[1] || services[0] || "consultations";
    const svc3 = services[2] || services[1] || services[0] || "treatments";
    const svc4 = services[3] || services[2] || "follow-up care";
    const location = businessInfo.location || "your location";
    const businessShort = businessName.split(' ').slice(0, 2).join(' ');
    
    // Industry-specific complex workflows with unique service integration
    if (industry.includes('medical') || industry.includes('aesthetic') || industry.includes('dermatolog') || industry.includes('skin') || industry.includes('dental') || industry.includes('healthcare') || industry.includes('clinic')) {
      return {
        workflows: [
          {
            title: `New Patient ${svc1} Consultation Booking`,
            steps: [
              `Patient calls ${businessShort} inquiring about ${svc1}`,
              "AI verifies insurance eligibility in real-time via API",
              `Checks provider availability for ${svc1} appointment duration`,
              `Books ${svc1} consultation with appropriate specialist`,
              `Sends ${businessShort} intake forms via secure patient portal`,
              `Creates patient record in ${businessShort}'s EHR system`,
              `Triggers ${businessShort} reminder sequence (48hr, 24hr, 2hr)`,
              `Notifies ${businessShort} clinical team via Slack with patient summary`
            ],
            color: "cyan"
          },
          {
            title: `${svc2} Follow-Up & Care Coordination`,
            steps: [
              `Patient calls post-${svc2.toLowerCase()} with concern`,
              `AI pulls recent ${svc2} history from EHR`,
              `Assesses symptom severity for ${svc2}-related concerns`,
              `For minor concerns: Provides ${svc2} aftercare instructions`,
              `For urgent ${svc2} concerns: Immediately pages on-call provider`,
              `Schedules ${svc3} follow-up appointment if needed`,
              `Documents interaction in ${businessShort} patient chart`,
              `Triggers ${businessShort} satisfaction survey 48 hours later`
            ],
            color: "purple"
          },
          {
            title: `${svc3} Package Upsell & Payment Processing`,
            steps: [
              `Existing patient calls about ${svc3} packages`,
              `AI reviews history and recommends complementary ${svc4}`,
              `Explains ${businessShort} package pricing and financing options`,
              `Collects deposit via ${businessShort}'s payment processing`,
              `Applies ${businessShort} loyalty discount automatically`,
              `Schedules multi-session ${svc3} appointments`,
              `Sends ${svc3} prep instructions specific to patient`,
              `Updates ${businessShort} revenue forecast in practice management`
            ],
            color: "green"
          }
        ],
        emailWorkflows: `
COMPLEX AGENTIC WORKFLOWS BUILT FOR ${businessName.toUpperCase()}:

WORKFLOW 1: New Patient Intake & Consultation Booking
When a prospective patient calls about ${services[0] || 'your services'}:
→ AI verifies insurance eligibility in real-time via API integration
→ Checks provider availability against treatment duration requirements  
→ Books consultation with the appropriate specialist based on patient needs
→ Sends digital intake forms via secure patient portal link
→ Creates patient record in your EHR/practice management system
→ Triggers automated reminder sequence (48hr, 24hr, 2hr before appointment)
→ Notifies clinical team via Slack/Teams with patient summary

WORKFLOW 2: Treatment Follow-Up & Care Coordination
When a patient calls with post-procedure concerns:
→ AI pulls their recent treatment history from your EHR
→ Assesses symptom severity using clinical decision protocols
→ For minor concerns: Provides specific aftercare instructions for their exact procedure
→ For urgent concerns: Immediately pages on-call provider with patient context
→ Schedules follow-up appointment if clinically appropriate
→ Documents the entire interaction in patient chart for compliance
→ Triggers patient satisfaction survey 48 hours later

WORKFLOW 3: Treatment Package Upsell & Revenue Optimization
When an existing patient inquires about additional services:
→ AI reviews their complete treatment history and outcomes
→ Recommends complementary services based on their profile
→ Explains package pricing and available financing options (CareCredit, Affirm)
→ Collects deposit via secure PCI-compliant payment processing
→ Applies loyalty rewards and referral credits automatically
→ Schedules multi-session treatment appointments
→ Sends personalized pre-treatment preparation instructions
→ Updates revenue forecast in your practice management dashboard`
      };
    }
    
    if (industry.includes('real estate') || industry.includes('property') || industry.includes('realty')) {
      return {
        workflows: [
          {
            title: `${businessShort} Buyer Lead Qualification`,
            steps: [
              `Prospect calls ${businessShort} about ${svc1 || 'property listing'}`,
              `AI qualifies budget, timeline, and financing for ${location} area`,
              `Cross-references requirements against ${businessShort}'s MLS inventory`,
              `Identifies matching ${svc1} properties and presents top 3 options`,
              `Checks ${businessShort} agent calendar and schedules showings`,
              `Sends ${businessShort} property comparison report via email`,
              `Creates lead in ${businessShort}'s CRM with qualification data`,
              `Triggers ${businessShort} automated drip campaign`
            ],
            color: "cyan"
          },
          {
            title: `${svc2 || 'Seller'} Consultation & Market Analysis`,
            steps: [
              `Homeowner calls ${businessShort} about selling in ${location}`,
              `AI gathers property details for ${svc2 || 'listing'} evaluation`,
              `Pulls ${location} comparable sales data from MLS`,
              `Provides preliminary market value range for ${location}`,
              `Schedules ${businessShort} listing consultation`,
              `Sends ${businessShort} pre-listing preparation checklist`,
              `Creates seller lead with ${location} property details`,
              `Notifies ${businessShort} agent with full property brief`
            ],
            color: "purple"
          },
          {
            title: `${businessShort} Transaction & Closing Support`,
            steps: [
              `Client calls ${businessShort} with escrow question`,
              `AI pulls transaction status from ${businessShort}'s system`,
              `Provides specific ${location} closing timeline update`,
              `Answers ${businessShort}-specific closing questions`,
              `Escalates complex issues to ${businessShort} coordinator`,
              `Schedules final walkthrough in ${location}`,
              `Sends ${businessShort} closing document checklist`,
              `Updates ${businessShort} transaction notes`
            ],
            color: "green"
          }
        ],
        emailWorkflows: `
COMPLEX AGENTIC WORKFLOWS BUILT FOR ${businessName.toUpperCase()}:

WORKFLOW 1: ${businessShort} Buyer Lead Qualification & Property Matching
When a prospect calls ${businessShort} about ${svc1 || 'property listings'}:
→ AI qualifies budget range, timeline, and pre-approval status for ${location}
→ Cross-references requirements against ${businessShort}'s MLS inventory
→ Identifies matching ${svc1} properties and presents top 3 with details
→ Checks ${businessShort} agent availability and schedules showings
→ Sends personalized ${businessShort} property comparison report
→ Creates qualified lead in ${businessShort}'s CRM with full data
→ Triggers ${businessShort} automated nurture sequence

WORKFLOW 2: ${businessShort} Seller Consultation & ${location} Market Analysis
When a ${location} homeowner calls about selling:
→ AI gathers property details and condition for ${svc2 || 'listing'} evaluation
→ Pulls recent ${location} comparable sales from MLS
→ Provides preliminary ${location} market value range
→ Schedules ${businessShort} in-person listing consultation
→ Sends ${businessShort} pre-listing preparation checklist
→ Creates seller lead with complete ${location} property profile
→ Notifies ${businessShort} agent with seller motivation brief

WORKFLOW 3: ${businessShort} Transaction Coordination & Closing Support
When a ${businessShort} client calls during escrow:
→ AI pulls real-time status from ${businessShort}'s transaction system
→ Provides ${location}-specific closing timeline updates
→ Answers ${businessShort} closing process questions
→ Escalates complex issues to ${businessShort} transaction coordinator
→ Schedules ${location} final walkthrough logistics
→ Sends ${businessShort} closing document checklist
→ Updates ${businessShort} transaction notes for history`
      };
    }
    
    if (industry.includes('legal') || industry.includes('law') || industry.includes('attorney')) {
      return {
        workflows: [
          {
            title: `${businessShort} ${svc1 || 'Case'} Intake & Conflict Check`,
            steps: [
              `Potential client calls ${businessShort} about ${svc1 || 'legal matter'}`,
              `AI captures ${svc1} case type and key facts`,
              `Runs conflict check against ${businessShort}'s client database`,
              `Assesses ${svc1} viability using ${businessShort}'s criteria`,
              `Schedules consultation with ${businessShort} ${svc1} attorney`,
              `Sends ${businessShort} retainer and intake forms`,
              `Creates matter in ${businessShort}'s practice management`,
              `Notifies ${businessShort} attorney with case brief`
            ],
            color: "cyan"
          },
          {
            title: `${businessShort} ${svc2 || 'Case'} Status & Document Coordination`,
            steps: [
              `Existing ${businessShort} client calls for ${svc2 || 'case'} update`,
              `AI pulls ${svc2} status from ${businessShort}'s system`,
              `Provides latest ${svc2} milestone and next steps`,
              `Answers ${businessShort} ${svc2} procedural questions`,
              `Schedules ${businessShort} attorney callback if complex`,
              `Sends ${svc2} documents or court dates via email`,
              `Logs interaction in ${businessShort} client file`,
              `Updates ${businessShort} billing with call duration`
            ],
            color: "purple"
          }
        ],
        emailWorkflows: `
COMPLEX AGENTIC WORKFLOWS BUILT FOR ${businessName.toUpperCase()}:

WORKFLOW 1: ${businessShort} ${svc1 || 'Case'} Intake & Automated Conflict Check
When a potential client calls ${businessShort} about ${svc1 || 'legal matters'}:
→ AI captures ${svc1} case type, key facts, and opposing parties
→ Runs automated conflict check against ${businessShort}'s client database
→ Assesses ${svc1} viability using ${businessShort}'s intake criteria
→ Schedules consultation with ${businessShort} ${svc1} specialist attorney
→ Sends ${businessShort} engagement letter and digital intake forms
→ Creates preliminary ${svc1} matter in ${businessShort}'s system
→ Notifies assigned ${businessShort} attorney with case brief

WORKFLOW 2: ${businessShort} ${svc2 || 'Client'} Case Status & Document Coordination
When an existing ${businessShort} client calls for ${svc2 || 'case'} update:
→ AI authenticates and pulls ${svc2} status from ${businessShort}'s system
→ Provides latest ${svc2} milestone updates and deadlines
→ Answers ${businessShort} ${svc2} procedural questions
→ For complex ${svc2} questions: Schedules ${businessShort} attorney callback
→ Sends ${svc2} document requests, court dates, or confirmations
→ Logs interaction in ${businessShort} client file for compliance
→ Updates ${businessShort} time tracking automatically`
      };
    }
    
    // Default complex workflows for any business - highly customized
    return {
      workflows: [
        {
          title: "Lead Qualification & Appointment Booking",
          steps: [
            "Customer calls inquiring about " + (services[0] || "services"),
            "AI qualifies needs, budget, and timeline",
            "Checks availability across team calendars",
            "Books appointment with right team member",
            "Collects deposit if required",
            "Sends confirmation with preparation details",
            "Creates record in CRM with full context",
            "Triggers follow-up reminder sequence"
          ],
          color: "cyan"
        },
        {
          title: "Service Inquiry & Custom Quote Generation",
          steps: [
            "Customer calls about " + (services[1] || "pricing"),
            "AI gathers project requirements and specifications",
            "Pulls pricing from service catalog",
            "Calculates custom quote based on scope",
            "Presents options and packages",
            "Sends detailed quote via email",
            "Schedules follow-up call",
            "Updates sales pipeline with opportunity"
          ],
          color: "purple"
        },
        {
          title: "Customer Support & Issue Resolution",
          steps: [
            "Existing customer calls with issue",
            "AI pulls customer history and past interactions",
            "Diagnoses issue using troubleshooting protocols",
            "For simple issues: Provides resolution steps",
            "For complex issues: Creates ticket and escalates",
            "Schedules service appointment if needed",
            "Sends follow-up satisfaction survey",
            "Updates customer record with resolution"
          ],
          color: "green"
        }
      ],
      emailWorkflows: `
COMPLEX AGENTIC WORKFLOWS FOR ${businessName.toUpperCase()}:

WORKFLOW 1: Lead Qualification & Intelligent Appointment Booking
When a customer calls inquiring about ${services[0] || 'your services'}:
→ AI qualifies their needs, budget range, and timeline requirements
→ Checks real-time availability across all team member calendars
→ Matches customer needs with the right specialist/team member
→ Books appointment directly in your scheduling system
→ Collects deposit or payment if required for booking
→ Sends confirmation with personalized preparation details
→ Creates complete customer record in your CRM with full context
→ Triggers automated reminder and follow-up sequence

WORKFLOW 2: Service Inquiry & Custom Quote Generation
When a customer calls about ${services[1] || 'pricing or custom work'}:
→ AI gathers detailed project requirements and specifications
→ Pulls current pricing from your service/product catalog
→ Calculates custom quote based on scope and requirements
→ Presents tiered options and package recommendations
→ Sends professionally formatted quote via email instantly
→ Schedules follow-up call to discuss proposal
→ Updates sales pipeline with qualified opportunity
→ Notifies sales team of high-value prospects

WORKFLOW 3: Customer Support & Intelligent Issue Resolution
When an existing customer calls with a concern:
→ AI authenticates and pulls complete customer history
→ Reviews past interactions, purchases, and preferences
→ Diagnoses issue using your custom troubleshooting protocols
→ For simple issues: Provides step-by-step resolution guidance
→ For complex issues: Creates support ticket and escalates to specialist
→ Schedules on-site service appointment if physical intervention needed
→ Triggers satisfaction survey after resolution
→ Updates customer record with complete interaction history`
    };
  };

  const generateColdEmail = (): string => {
    if (!businessInfo) return '';
    
    // Use pre-generated cold email from Gemini if validated by backend
    if (hasValidColdEmail && generatedColdEmail) {
      return generatedColdEmail;
    }
    
    const servicesText = businessInfo.services.slice(0, 4).join(', ');
    const { emailWorkflows } = getComplexWorkflows();
    
    // Generate unique elements based on business characteristics
    const uniqueId = Date.now().toString(36).slice(-4).toUpperCase();
    const businessNameShort = businessInfo.businessName.split(' ').slice(0, 2).join(' ');
    const primaryService = businessInfo.services[0] || 'your services';
    const secondaryService = businessInfo.services[1] || businessInfo.services[0] || 'consultations';
    const location = businessInfo.location || 'your area';
    
    // Randomized subject lines
    const subjectLines = [
      `I built an AI voice agent for ${businessNameShort} - 60 second demo inside [${uniqueId}]`,
      `${businessNameShort}: Your custom AI receptionist is ready to test [${uniqueId}]`,
      `Quick question about ${businessInfo.industry} call handling at ${businessNameShort} [${uniqueId}]`,
      `${businessNameShort} + AI = Never miss a ${primaryService} inquiry again [${uniqueId}]`,
      `I analyzed ${businessInfo.businessName}'s website - here's what AI can do [${uniqueId}]`,
    ];
    const subject = subjectLines[Math.floor(Math.random() * subjectLines.length)];
    
    // Randomized opening lines
    const openingLines = [
      `I hope this message finds you well. After researching ${businessInfo.businessName}, I was impressed by your focus on ${primaryService} and wanted to share something relevant.`,
      `I recently came across ${businessInfo.businessName} while researching top ${businessInfo.industry.toLowerCase()} providers in ${location}, and I have an idea that might interest you.`,
      `I built something specifically for ${businessInfo.businessName} that I think you'll find valuable - a custom AI voice agent trained on your exact services.`,
      `As a ${businessInfo.industry.toLowerCase()} business offering ${primaryService}, you probably know the challenge of handling call volume while delivering quality ${secondaryService}.`,
      `I spent time analyzing ${businessInfo.businessName}'s website and created a working AI demo that understands ${servicesText} - I'd love to show you.`,
    ];
    const opening = openingLines[Math.floor(Math.random() * openingLines.length)];
    
    // Randomized value propositions
    const valueProps = [
      `Imagine: A caller asks about ${primaryService} pricing at 9 PM on Sunday. Instead of voicemail, they get instant answers, book an appointment, and receive a confirmation - all without your team lifting a finger.`,
      `Picture this: While you're focused on delivering excellent ${secondaryService}, an AI handles the phones - qualifying leads, booking ${primaryService} appointments, and ensuring no opportunity slips through.`,
      `Here's the scenario: A potential customer calls about ${primaryService} during your busiest hour. Instead of hold music or missed calls, they get immediate, knowledgeable assistance and leave impressed.`,
      `Consider: Every ${businessInfo.industry.toLowerCase()} call answered instantly, every ${primaryService} inquiry handled professionally, every appointment booked automatically - 24/7/365.`,
    ];
    const valueProp = valueProps[Math.floor(Math.random() * valueProps.length)];
    
    // Randomized closing lines
    const closingLines = [
      `I'd love to schedule a quick 15-minute call to walk you through what I've built for ${businessInfo.businessName}. When works best?`,
      `Want to hear your AI voice agent in action? Reply and I'll send you the demo link - takes 60 seconds to experience it yourself.`,
      `I'm confident this will make a real difference for ${businessNameShort}. Would you be open to a brief call this week?`,
      `The demo is live and ready. Reply "DEMO" and I'll send the link immediately - no commitment, just see what's possible.`,
    ];
    const closing = closingLines[Math.floor(Math.random() * closingLines.length)];
    
    return `Subject: ${subject}

Dear [Contact Name],

${opening}

My name is [Your Name] from VoicelyAgent.ai, and I specialize in AI voice solutions for ${businessInfo.industry.toLowerCase()} businesses.


WHY I'M REACHING OUT TO ${businessInfo.businessName.toUpperCase()}:

${valueProp}

Studies show 85% of callers who can't reach a business won't call back - they call your competitor. For a ${businessInfo.industry.toLowerCase()} practice like yours, each missed call about ${primaryService} could mean significant lost revenue.


WHAT I'VE BUILT FOR ${businessNameShort.toUpperCase()}:

I created a custom AI voice agent trained specifically on your services:
- ${servicesText}
- ${businessInfo.industry} industry knowledge and terminology
- Your specific business hours, location, and policies
- Natural conversation flow that matches your brand voice

${emailWorkflows}


WHY BUSINESSES LIKE ${businessNameShort.toUpperCase()} CHOOSE AI:

- Answer every call instantly, 24/7/365 - no more missed ${primaryService} opportunities
- Handle ${businessInfo.industry.toLowerCase()}-specific questions with expert knowledge
- Book appointments directly into your calendar system
- Free your team to focus on delivering exceptional ${secondaryService}

This isn't about replacing your team - it's about giving them superpowers. Your receptionist becomes a customer success manager. Your ${businessInfo.industry.toLowerCase()} experts focus on what they do best.


YOUR NEXT STEP:

${closing}

If you like what you see, we can have your custom AI voice agent live within 24-48 hours.

Looking forward to connecting,

[Your Name]
Founder & CEO, VoicelyAgent.ai
www.VoicelyAgent.ai
[Your Phone Number]

P.S. - I genuinely believe this will transform how ${businessInfo.businessName} handles customer communication. The demo I built is waiting for you.`;
  };

  const generateHtmlEmail = (): string => {
    if (!businessInfo) return '';
    
    const plainText = generateColdEmail();
    const lines = plainText.split('\n');
    
    // Extract subject line
    const subjectLine = lines[0]?.replace('Subject: ', '') || '';
    
    // Get the email body (everything after Subject line)
    const bodyLines = lines.slice(2);
    
    // Parse sections
    const sections: { type: 'text' | 'header' | 'list' | 'workflow'; content: string }[] = [];
    let currentWorkflow: string[] = [];
    let inWorkflow = false;
    
    for (const line of bodyLines) {
      if (line.startsWith('WORKFLOW ') || line.startsWith('WHY I\'M') || line.startsWith('WHAT I\'VE') || line.startsWith('WHY BUSINESSES') || line.startsWith('YOUR NEXT') || line.startsWith('COMPLEX AGENTIC')) {
        if (inWorkflow && currentWorkflow.length > 0) {
          sections.push({ type: 'workflow', content: currentWorkflow.join('|||') });
          currentWorkflow = [];
        }
        inWorkflow = line.startsWith('WORKFLOW ');
        sections.push({ type: 'header', content: line.replace(':', '') });
      } else if (line.startsWith('→') || line.startsWith('->')) {
        currentWorkflow.push(line.replace(/^[→\->]\s*/, ''));
      } else if (line.startsWith('- ')) {
        sections.push({ type: 'list', content: line.replace('- ', '') });
      } else if (line.trim()) {
        if (inWorkflow && currentWorkflow.length > 0) {
          sections.push({ type: 'workflow', content: currentWorkflow.join('|||') });
          currentWorkflow = [];
          inWorkflow = false;
        }
        sections.push({ type: 'text', content: line });
      }
    }
    
    if (currentWorkflow.length > 0) {
      sections.push({ type: 'workflow', content: currentWorkflow.join('|||') });
    }
    
    // Build HTML
    let htmlContent = '';
    let inListGroup = false;
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const nextSection = sections[i + 1];
      
      if (section.type === 'header') {
        if (inListGroup) {
          htmlContent += '</ul>';
          inListGroup = false;
        }
        const isWorkflowHeader = section.content.startsWith('WORKFLOW ');
        htmlContent += `
          <h2 style="color: ${isWorkflowHeader ? '#8b5cf6' : '#1a1a2e'}; font-size: ${isWorkflowHeader ? '16px' : '18px'}; font-weight: 700; margin: ${isWorkflowHeader ? '24px 0 12px 0' : '28px 0 14px 0'}; padding-bottom: 8px; ${!isWorkflowHeader ? 'border-bottom: 2px solid #8b5cf6;' : ''}">${section.content}</h2>`;
      } else if (section.type === 'workflow') {
        const steps = section.content.split('|||');
        htmlContent += `
          <table style="width: 100%; border-collapse: collapse; margin: 12px 0 20px 0;">
            ${steps.map((step, idx) => `
              <tr>
                <td style="width: 28px; vertical-align: top; padding: 6px 0;">
                  <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #8b5cf6, #06b6d4); border-radius: 50%; color: white; font-size: 12px; font-weight: 600; text-align: center; line-height: 24px;">${idx + 1}</div>
                </td>
                <td style="padding: 6px 0 6px 12px; color: #374151; font-size: 14px; line-height: 1.5;">${step}</td>
              </tr>
            `).join('')}
          </table>`;
      } else if (section.type === 'list') {
        if (!inListGroup) {
          htmlContent += '<ul style="margin: 12px 0; padding-left: 0; list-style: none;">';
          inListGroup = true;
        }
        htmlContent += `
          <li style="padding: 8px 0 8px 28px; position: relative; color: #374151; font-size: 14px; line-height: 1.6;">
            <span style="position: absolute; left: 0; top: 8px; width: 20px; height: 20px; background: linear-gradient(135deg, #10b981, #06b6d4); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 12px;">✓</span>
            </span>
            ${section.content}
          </li>`;
        if (!nextSection || nextSection.type !== 'list') {
          htmlContent += '</ul>';
          inListGroup = false;
        }
      } else {
        if (inListGroup) {
          htmlContent += '</ul>';
          inListGroup = false;
        }
        htmlContent += `<p style="color: #374151; font-size: 15px; line-height: 1.7; margin: 12px 0;">${section.content}</p>`;
      }
    }
    
    // Get workflow data for display
    const { workflows: displayWorkflows } = getComplexWorkflows();
    const workflowsToShow = (hasValidWorkflows && generatedWorkflows.length > 0) 
      ? generatedWorkflows.slice(0, 3) 
      : displayWorkflows.slice(0, 3);
    
    // Thin line icons for workflows (Gmail compatible - no emojis)
    const workflowIcons = ['○', '◇', '□'];
    
    // Generate workflow HTML with Gmail-compatible cards - WHITE BACKGROUND
    const workflowHtml = workflowsToShow.map((wf, idx) => {
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
                      ${wf.steps.slice(0, 5).map((step, stepIdx) => `
                        <tr>
                          <td style="padding: 8px 0 8px 12px; border-left: none;">
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
    
    // Thin line icons for benefits (Gmail compatible - no emojis)
    const benefits = [
      { icon: '→', text: `Answer every call instantly, 24/7/365 - no more missed opportunities`, color: '#10b981' },
      { icon: '→', text: `Handle ${businessInfo.industry.toLowerCase()}-specific questions with expert knowledge`, color: '#8b5cf6' },
      { icon: '→', text: `Book appointments directly into your calendar system`, color: '#06b6d4' },
      { icon: '→', text: `Free your team to focus on delivering exceptional service`, color: '#f59e0b' }
    ];
    
    const benefitsHtml = benefits.map(b => `
      <tr>
        <td style="padding: 10px 0;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td width="24" valign="top" style="font-size: 14px; color: ${b.color};">${b.icon}</td>
              <td style="padding-left: 10px; color: #374151; font-size: 14px; line-height: 1.6; font-family: Arial, Helvetica, sans-serif;">${b.text}</td>
            </tr>
          </table>
        </td>
      </tr>
    `).join('');
    
    const servicesText = businessInfo.services.slice(0, 4).join(', ');
    const primaryService = businessInfo.services[0] || 'your services';
    const secondaryService = businessInfo.services[1] || businessInfo.services[0] || 'consultations';
    
    // Randomized "Picture this" scenarios - unique for each client
    const pictureThisScenarios = [
      `Picture this: A potential customer calls about ${primaryService} at 9 PM on a Sunday. Instead of voicemail, they get instant answers, book an appointment, and receive confirmation - all without your team lifting a finger.`,
      `Imagine: While you're focused on delivering excellent ${secondaryService}, an AI handles the phones - qualifying leads, booking ${primaryService} appointments, and ensuring no opportunity slips through.`,
      `Here's the scenario: A caller asks about ${primaryService} pricing during your busiest hour. Instead of hold music or missed calls, they get immediate, knowledgeable assistance and leave impressed.`,
      `Consider this: Every ${businessInfo.industry.toLowerCase()} call answered instantly, every ${primaryService} inquiry handled professionally, every appointment booked automatically - 24/7/365.`,
      `Think about it: A new customer discovers ${businessInfo.businessName} at midnight and wants to book ${primaryService}. Your AI voice agent answers, schedules them, and sends confirmation - you wake up to new revenue.`,
      `The reality: Your competitor misses a call about ${primaryService}. That same caller reaches ${businessInfo.businessName} and gets instant, professional service. Who wins that customer?`,
    ];
    const valueProp = pictureThisScenarios[Math.floor(Math.random() * pictureThisScenarios.length)];
    
    // Voicely BLACK logo - direct hosted URL
    const voicelyLogoUrl = 'https://i.imgur.com/aKa5Dwy.png';
    
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
                    <p style="color: #1f2937; font-size: 24px; font-weight: bold; margin: 0; font-family: Arial, Helvetica, sans-serif; display: none;">VOICELY</p>
            </td>
          </tr>
          
          <!-- Hero Section -->
          <tr>
            <td align="center" style="padding: 0 20px 32px 20px;">
              <h1 style="color: #1f2937; font-size: 28px; font-weight: bold; margin: 0 0 12px 0; line-height: 1.4; font-family: Arial, Helvetica, sans-serif;">We Built a Custom AI Voice Agent for<br/><span style="color: #8b5cf6;">${businessInfo.businessName}!</span></h1>
              <p style="color: #6b7280; font-size: 15px; margin: 0; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">An intelligent voice AI trained specifically on your ${businessInfo.industry.toLowerCase()} services</p>
            </td>
          </tr>
          
          <!-- Introduction -->
          <tr>
            <td style="padding: 0 20px 24px 20px;">
              <p style="color: #1f2937; font-size: 15px; line-height: 1.7; margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif;">Dear ${businessInfo.businessName} Team,</p>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.7; margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif;">My name is Jay and I'm the Founder of VoicelyAgent.ai. I specialize in AI voice solutions for ${businessInfo.industry} businesses, and I have an idea that might interest you.</p>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.7; margin: 0; font-family: Arial, Helvetica, sans-serif;">${valueProp}</p>
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
          
          <!-- What We've Built Section -->
          <tr>
            <td style="padding: 0 20px 24px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8fafc" style="padding: 24px;">
                <tr>
                  <td>
                    <p style="color: #06b6d4; font-size: 10px; font-weight: bold; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 2px; font-family: Arial, Helvetica, sans-serif;">CUSTOM BUILT</p>
                    <h2 style="color: #1f2937; font-size: 18px; font-weight: bold; margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif;">Trained on Your Business</h2>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 8px 0;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="24" valign="top" style="color: #8b5cf6; font-size: 14px;">✓</td>
                              <td style="padding-left: 8px; color: #374151; font-size: 13px; font-family: Arial, Helvetica, sans-serif;">${servicesText}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="24" valign="top" style="color: #06b6d4; font-size: 14px;">✓</td>
                              <td style="padding-left: 8px; color: #374151; font-size: 13px; font-family: Arial, Helvetica, sans-serif;">${businessInfo.industry} industry knowledge & terminology</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="24" valign="top" style="color: #10b981; font-size: 14px;">✓</td>
                              <td style="padding-left: 8px; color: #374151; font-size: 13px; font-family: Arial, Helvetica, sans-serif;">Your specific business hours, location & policies</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="24" valign="top" style="color: #f59e0b; font-size: 14px;">✓</td>
                              <td style="padding-left: 8px; color: #374151; font-size: 13px; font-family: Arial, Helvetica, sans-serif;">Natural conversation flow matching your brand voice</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Why AI Section - White Background -->
          <tr>
            <td style="padding: 0 20px 24px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8fafc" style="padding: 24px;">
                <tr>
                  <td>
                    <!-- Header -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                      <tr>
                        <td width="36" height="36" style="background-color: #f3e8ff; text-align: center; font-size: 16px; color: #8b5cf6;">♥</td>
                        <td style="padding-left: 14px;">
                          <p style="color: #1f2937; font-size: 18px; font-weight: bold; margin: 0 0 4px 0; font-family: Arial, Helvetica, sans-serif;">Why AI for ${businessInfo.businessName}?</p>
                          <p style="color: #6b7280; font-size: 13px; margin: 0; font-family: Arial, Helvetica, sans-serif;">Enhancement, not replacement</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- 2x2 Benefits Grid -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="50%" valign="top" style="padding: 12px 12px 12px 0;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="24" valign="top" style="font-size: 14px; color: #ec4899;">→</td>
                              <td style="padding-left: 10px;">
                                <p style="color: #1f2937; font-size: 14px; font-weight: bold; margin: 0 0 4px 0; font-family: Arial, Helvetica, sans-serif;">Never Miss a Lead</p>
                                <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">Capture every inquiry 24/7, even during busy hours or after close</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td width="50%" valign="top" style="padding: 12px 0 12px 12px;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="24" valign="top" style="font-size: 14px; color: #8b5cf6;">→</td>
                              <td style="padding-left: 10px;">
                                <p style="color: #1f2937; font-size: 14px; font-weight: bold; margin: 0 0 4px 0; font-family: Arial, Helvetica, sans-serif;">Consistent Experience</p>
                                <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">Every caller gets the same professional, knowledgeable response</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td width="50%" valign="top" style="padding: 12px 12px 12px 0;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="24" valign="top" style="font-size: 14px; color: #10b981;">→</td>
                              <td style="padding-left: 10px;">
                                <p style="color: #1f2937; font-size: 14px; font-weight: bold; margin: 0 0 4px 0; font-family: Arial, Helvetica, sans-serif;">Free Up Your Team</p>
                                <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">Let staff focus on high-value tasks while AI handles routine calls</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td width="50%" valign="top" style="padding: 12px 0 12px 12px;">
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="24" valign="top" style="font-size: 14px; color: #06b6d4;">→</td>
                              <td style="padding-left: 10px;">
                                <p style="color: #1f2937; font-size: 14px; font-weight: bold; margin: 0 0 4px 0; font-family: Arial, Helvetica, sans-serif;">Scale Instantly</p>
                                <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">Handle 1 or 1,000 simultaneous calls without hiring</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Quote Banner - Superpowers Emphasis -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
                      <tr>
                        <td bgcolor="#f3e8ff" style="padding: 20px; border-left: 3px solid #8b5cf6;">
                          <p style="color: #374151; font-size: 14px; font-style: italic; margin: 0; line-height: 1.8; font-family: Arial, Helvetica, sans-serif;">"AI doesn't replace your team—it <strong style="color: #8b5cf6;">amplifies</strong> them. Your receptionist becomes a <strong style="color: #0891b2;">customer success manager</strong>. Your office manager becomes a <strong style="color: #059669;">strategic planner</strong>."</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Beyond Reception: Full Business Automation - White Background -->
          <tr>
            <td style="padding: 0 20px 24px 20px;">
              <!-- Section Header -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="36" height="36" style="background-color: #ecfeff; text-align: center; font-size: 16px; color: #06b6d4;">◈</td>
                        <td style="padding-left: 14px;">
                          <p style="color: #1f2937; font-size: 18px; font-weight: bold; margin: 0 0 4px 0; font-family: Arial, Helvetica, sans-serif;">Beyond Reception: Full Business Automation</p>
                          <p style="color: #6b7280; font-size: 13px; margin: 0; font-family: Arial, Helvetica, sans-serif;">What AI can do for ${businessInfo.businessName}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Integration Cards 2x2 - Light Gray Cards -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td width="50%" valign="top" style="padding: 0 8px 12px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8fafc" style="padding: 16px;">
                      <tr>
                        <td>
                          <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 10px;">
                            <tr>
                              <td width="24" style="color: #10b981; font-size: 14px;">○</td>
                              <td style="padding-left: 8px;">
                                <p style="color: #1f2937; font-size: 14px; font-weight: bold; margin: 0; font-family: Arial, Helvetica, sans-serif;">Smart Scheduling</p>
                              </td>
                            </tr>
                          </table>
                          <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px 0; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">Automatically book appointments, send confirmations, and manage your calendar.</p>
                          <p style="color: #10b981; font-size: 11px; margin: 0; font-family: Arial, Helvetica, sans-serif;">→ Google Calendar, Calendly, Acuity</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="50%" valign="top" style="padding: 0 0 12px 8px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8fafc" style="padding: 16px;">
                      <tr>
                        <td>
                          <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 10px;">
                            <tr>
                              <td width="24" style="color: #06b6d4; font-size: 14px;">○</td>
                              <td style="padding-left: 8px;">
                                <p style="color: #1f2937; font-size: 14px; font-weight: bold; margin: 0; font-family: Arial, Helvetica, sans-serif;">Payment Processing</p>
                              </td>
                            </tr>
                          </table>
                          <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px 0; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">Collect deposits, process payments, and send invoices during the call.</p>
                          <p style="color: #06b6d4; font-size: 11px; margin: 0; font-family: Arial, Helvetica, sans-serif;">→ Stripe, Square, PayPal, QuickBooks</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td width="50%" valign="top" style="padding: 0 8px 0 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8fafc" style="padding: 16px;">
                      <tr>
                        <td>
                          <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 10px;">
                            <tr>
                              <td width="24" style="color: #8b5cf6; font-size: 14px;">○</td>
                              <td style="padding-left: 8px;">
                                <p style="color: #1f2937; font-size: 14px; font-weight: bold; margin: 0; font-family: Arial, Helvetica, sans-serif;">CRM Integration</p>
                              </td>
                            </tr>
                          </table>
                          <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px 0; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">Auto-log calls, create leads, update customer records, and trigger follow-up sequences.</p>
                          <p style="color: #8b5cf6; font-size: 11px; margin: 0; font-family: Arial, Helvetica, sans-serif;">→ Salesforce, HubSpot, Zoho, Monday</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="50%" valign="top" style="padding: 0 0 0 8px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8fafc" style="padding: 16px;">
                      <tr>
                        <td>
                          <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 10px;">
                            <tr>
                              <td width="24" style="color: #f59e0b; font-size: 14px;">○</td>
                              <td style="padding-left: 8px;">
                                <p style="color: #1f2937; font-size: 14px; font-weight: bold; margin: 0; font-family: Arial, Helvetica, sans-serif;">Smart Notifications</p>
                              </td>
                            </tr>
                          </table>
                          <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px 0; line-height: 1.5; font-family: Arial, Helvetica, sans-serif;">Instant alerts via SMS, email, or Slack. Escalate urgent matters to the right team member.</p>
                          <p style="color: #f59e0b; font-size: 11px; margin: 0; font-family: Arial, Helvetica, sans-serif;">→ Twilio, SendGrid, Slack, Teams</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Integrates with 40+ Apps Section -->
          <tr>
            <td style="padding: 0 20px 24px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8fafc" style="padding: 24px;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
                      <tr>
                        <td style="font-size: 14px; color: #8b5cf6;">◈</td>
                        <td style="padding-left: 8px;">
                          <p style="color: #1f2937; font-size: 16px; font-weight: bold; margin: 0; font-family: Arial, Helvetica, sans-serif;">Integrates with 40+ Apps</p>
                        </td>
                      </tr>
                    </table>
                    <!-- App Badges Row 1 -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 8px;">
                      <tr>
                        <td style="padding: 4px;">
                          <table cellpadding="0" cellspacing="0" border="0" style="padding: 6px 12px; background-color: #f3f4f6;">
                            <tr><td style="color: #374151; font-size: 12px; font-family: Arial, Helvetica, sans-serif;">Salesforce</td></tr>
                          </table>
                        </td>
                        <td style="padding: 4px;">
                          <table cellpadding="0" cellspacing="0" border="0" style="padding: 6px 12px; background-color: #f3f4f6;">
                            <tr><td style="color: #374151; font-size: 12px; font-family: Arial, Helvetica, sans-serif;">HubSpot</td></tr>
                          </table>
                        </td>
                        <td style="padding: 4px;">
                          <table cellpadding="0" cellspacing="0" border="0" style="padding: 6px 12px; background-color: #f3f4f6;">
                            <tr><td style="color: #374151; font-size: 12px; font-family: Arial, Helvetica, sans-serif;">Slack</td></tr>
                          </table>
                        </td>
                        <td style="padding: 4px;">
                          <table cellpadding="0" cellspacing="0" border="0" style="padding: 6px 12px; background-color: #f3f4f6;">
                            <tr><td style="color: #374151; font-size: 12px; font-family: Arial, Helvetica, sans-serif;">Google Calendar</td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    <!-- App Badges Row 2 -->
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding: 4px;">
                          <table cellpadding="0" cellspacing="0" border="0" style="padding: 6px 12px; background-color: #f3f4f6;">
                            <tr><td style="color: #374151; font-size: 12px; font-family: Arial, Helvetica, sans-serif;">Stripe</td></tr>
                          </table>
                        </td>
                        <td style="padding: 4px;">
                          <table cellpadding="0" cellspacing="0" border="0" style="padding: 6px 12px; background-color: #f3f4f6;">
                            <tr><td style="color: #374151; font-size: 12px; font-family: Arial, Helvetica, sans-serif;">Twilio</td></tr>
                          </table>
                        </td>
                        <td style="padding: 4px;">
                          <table cellpadding="0" cellspacing="0" border="0" style="padding: 6px 12px; background-color: #f3f4f6;">
                            <tr><td style="color: #374151; font-size: 12px; font-family: Arial, Helvetica, sans-serif;">Zendesk</td></tr>
                          </table>
                        </td>
                        <td style="padding: 4px;">
                          <table cellpadding="0" cellspacing="0" border="0" style="padding: 6px 12px; background-color: #f3f4f6;">
                            <tr><td style="color: #374151; font-size: 12px; font-family: Arial, Helvetica, sans-serif;">Zoom</td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Stats Row - White Background -->
          <tr>
            <td style="padding: 0 20px 32px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f8fafc">
                <tr>
                  <td width="33%" align="center" style="padding: 20px 12px;">
                    <p style="color: #1f2937; font-size: 28px; font-weight: bold; margin: 0; font-family: Arial, Helvetica, sans-serif;">24/7</p>
                    <p style="color: #6b7280; font-size: 10px; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, Helvetica, sans-serif;">AVAILABILITY</p>
                  </td>
                  <td width="33%" align="center" style="padding: 20px 12px; border-left: none; border-right: none;">
                    <p style="color: #06b6d4; font-size: 28px; font-weight: bold; margin: 0; font-family: Arial, Helvetica, sans-serif;">&lt;350ms</p>
                    <p style="color: #6b7280; font-size: 10px; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, Helvetica, sans-serif;">RESPONSE</p>
                  </td>
                  <td width="33%" align="center" style="padding: 20px 12px;">
                    <p style="color: #10b981; font-size: 28px; font-weight: bold; margin: 0; font-family: Arial, Helvetica, sans-serif;">100%</p>
                    <p style="color: #6b7280; font-size: 10px; margin: 6px 0 0 0; text-transform: uppercase; letter-spacing: 1px; font-family: Arial, Helvetica, sans-serif;">ANSWERED</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Closing -->
          <tr>
            <td style="padding: 0 20px 24px 20px;">
              <p style="color: #4b5563; font-size: 14px; line-height: 1.8; margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif;">This isn't about replacing your team - it's about giving them superpowers. Your receptionist becomes a customer success manager. Your ${businessInfo.industry.toLowerCase()} experts focus on what they do best.</p>
              <p style="color: #1f2937; font-size: 14px; line-height: 1.8; margin: 0 0 16px 0; font-family: Arial, Helvetica, sans-serif;">We'd love to schedule a quick 15-minute call to show you what we've built for ${businessInfo.businessName}. If you like it, we can have your custom AI voice agent live within 24-48 hours.</p>
              <p style="color: #4b5563; font-size: 14px; line-height: 1.8; margin: 0; font-family: Arial, Helvetica, sans-serif;">Looking forward to help take your business to the next level!</p>
            </td>
          </tr>
          
          <!-- Signature -->
          <tr>
            <td style="padding: 20px 20px 32px 20px;">
              <p style="color: #1f2937; font-size: 15px; font-weight: bold; margin: 0 0 4px 0; font-family: Arial, Helvetica, sans-serif;">Jay Alexander</p>
              <p style="color: #6b7280; font-size: 13px; margin: 0 0 4px 0; font-family: Arial, Helvetica, sans-serif;">Founder & CEO, Voicely</p>
              <p style="color: #8b5cf6; font-size: 13px; margin: 0 0 4px 0; font-family: Arial, Helvetica, sans-serif;">+1 (424) 977-0091</p>
              <p style="color: #06b6d4; font-size: 13px; margin: 0; font-family: Arial, Helvetica, sans-serif;">voicelyagent.ai</p>
            </td>
          </tr>
          
          <!-- Footer with Logo -->
          <tr>
            <td align="center" style="padding: 24px 20px;">
              <img src="${voicelyLogoUrl}" alt="VOICELY" width="100" height="auto" style="display: block; margin-bottom: 12px; border: 0;" />
              <p style="color: #6b7280; font-size: 11px; margin: 0; font-family: Arial, Helvetica, sans-serif;">AI Voice Workforce for Modern Businesses</p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  };

  const copyHtmlToClipboard = async () => {
    const htmlContent = generateHtmlEmail();
    
    try {
      // Create a temporary element to hold the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      document.body.appendChild(tempDiv);
      
      // Select the content
      const range = document.createRange();
      range.selectNodeContents(tempDiv);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      
      // Copy as rich text
      document.execCommand('copy');
      
      // Clean up
      selection?.removeAllRanges();
      document.body.removeChild(tempDiv);
      
      setColdEmailCopied(true);
      setTimeout(() => setColdEmailCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "HTML email copied - paste directly into Gmail",
      });
    } catch (err) {
      // Fallback to plain HTML
      await navigator.clipboard.writeText(htmlContent);
      setColdEmailCopied(true);
      setTimeout(() => setColdEmailCopied(false), 2000);
      toast({
        title: "Copied as HTML code",
        description: "Paste into Gmail's HTML editor",
      });
    }
  };

  const analyzeWebsite = async () => {
    if (!websiteUrl.trim()) {
      toast({
        title: "Please enter a URL",
        description: "Enter your business website URL to generate a custom voice agent",
        variant: "destructive",
      });
      return;
    }

    // Normalize URL
    let url = websiteUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    setIsAnalyzing(true);
    setStage('analyzing');

    try {
      const response = await fetch('/api/demo/analyze-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to analyze website');
      }

      const data = await response.json();
      setBusinessInfo(data.businessInfo);
      setSystemPrompt(data.systemPrompt);
      setGreeting(data.greeting);
      
      // Set pre-generated personalized content with validation flags
      setGeneratedColdEmail(data.coldEmail || '');
      setGeneratedWorkflows(data.workflows || []);
      setEmailWorkflowsText(data.emailWorkflowsText || '');
      setTeamAmplificationPoints(data.teamAmplificationPoints || []);
      
      // Use backend validation flags for fallback decisions
      setHasValidWorkflows(data.hasValidWorkflows === true);
      setHasValidColdEmail(data.hasValidColdEmail === true);
      
      // Save the demo agent to get a permanent URL
      try {
        const saveResponse = await fetch('/api/demo/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            websiteUrl: url,
            businessName: data.businessInfo.businessName,
            industry: data.businessInfo.industry,
            businessInfo: data.businessInfo,
            systemPrompt: data.systemPrompt,
            greeting: data.greeting,
            workflows: data.workflows,
            coldEmail: data.coldEmail,
          }),
        });
        
        if (saveResponse.ok) {
          const saveData = await saveResponse.json();
          setPermanentSlug(saveData.slug);
          setPermanentUrl(`${window.location.origin}/demo/${saveData.slug}`);
          console.log('[DEMO] Saved with permanent URL:', saveData.permanentUrl);
        }
      } catch (saveError) {
        console.error('[DEMO] Failed to save demo agent:', saveError);
        // Non-critical error - continue without permanent URL
      }
      
      setStage('ready');
    } catch (error: any) {
      setErrorMessage(error.message || "Could not analyze the website. Please try again.");
      setStage('error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startCall = async () => {
    setStage('calling');
    startTimeRef.current = new Date();
    setCallDuration(0);
    setCurrentSubtitle(null);
    setPreviousSubtitle(null);
    
    try {
      await voiceChat.startSession();
    } catch (error) {
      console.error('Failed to start call:', error);
      toast({
        title: "Call Failed",
        description: "Could not start the voice call. Please try again.",
        variant: "destructive",
      });
      setStage('ready');
    }
  };

  const endCall = async () => {
    // Mark that we're intentionally ending - suppress playback errors
    isEndingCallRef.current = true;
    
    // Clear subtitles immediately
    setCurrentSubtitle(null);
    setPreviousSubtitle(null);
    pendingAgentTextRef.current = null;
    if (chunkTimerRef.current) {
      clearTimeout(chunkTimerRef.current);
      chunkTimerRef.current = null;
    }
    
    await voiceChat.endSession();
    setStage('ready');
    
    // Reset the flag after a short delay to allow error events to be suppressed
    setTimeout(() => {
      isEndingCallRef.current = false;
    }, 1000);
  };

  const resetDemo = () => {
    setStage('input');
    setWebsiteUrl('');
    setBusinessInfo(null);
    setSystemPrompt('');
    setGreeting('');
    setCurrentSubtitle(null);
    setPreviousSubtitle(null);
    setErrorMessage('');
  };

  const handleSendMessage = () => {
    if (textInput.trim()) {
      voiceChat.sendTextMessage(textInput.trim());
      setTextInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleServiceClick = (service: string) => {
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
  };

  // Always use purple theme for demo
  const agentColor = '#8b5cf6';

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-cyan-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20">
        <AnimatePresence mode="wait">
          {/* Stage 1: URL Input */}
          {stage === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl text-center relative"
            >
              <h1 className="text-4xl md:text-6xl font-black mb-6">
                <span className="text-gray-200">Try Your </span>
                <motion.span 
                  className="bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent inline-block"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  AI Receptionist
                </motion.span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto">
                Enter your website URL and we'll create a custom AI voice agent trained on your business in seconds.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto relative">
                {/* Glow effect behind input */}
                <motion.div
                  className="absolute -inset-4 rounded-2xl opacity-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse at center, rgba(139,92,246,0.3) 0%, transparent 70%)",
                  }}
                  animate={{
                    opacity: websiteUrl.length > 0 ? 0.6 : 0,
                    scale: websiteUrl.length > 0 ? 1.02 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
                
                <div className="relative flex-1 group">
                  <motion.div
                    className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-600 opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-300"
                  />
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
                    <Input
                      type="url"
                      placeholder="yourwebsite.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && analyzeWebsite()}
                      className="pl-12 h-14 bg-gray-900/80 border-purple-500/30 text-gray-200 placeholder:text-gray-500 text-lg focus:border-purple-500 transition-all duration-300"
                      data-testid="input-website-url"
                    />
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    onClick={analyzeWebsite}
                    className="h-14 px-8 bg-gradient-to-r from-purple-600 via-violet-600 to-purple-600 text-gray-200 font-bold relative overflow-hidden group"
                    data-testid="button-analyze-website"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-cyan-500/20"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <Wand2 className="w-5 h-5 mr-2 relative z-10" />
                    <span className="relative z-10">Generate Agent</span>
                  </Button>
                </motion.div>
              </div>

              <motion.p 
                className="text-sm text-gray-500 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Works with any business website • No signup required • Free demo
              </motion.p>
            </motion.div>
          )}

          {/* Stage 2: Analyzing - Corporate Professional Loading */}
          {stage === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="text-center relative w-full max-w-4xl mx-auto px-4"
            >
              {/* Header Section */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  Building Your AI Voice Agent
                </h2>
                <p className="text-gray-400 text-lg">
                  Analyzing your business to create a custom AI receptionist
                </p>
              </motion.div>

              {/* URL being analyzed */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-gray-900/50 border border-gray-700/50 mb-10"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Globe className="w-5 h-5 text-cyan-400" />
                </motion.div>
                <span className="text-gray-300 font-mono text-sm truncate max-w-xs">
                  {websiteUrl}
                </span>
                <motion.div
                  className="flex gap-1"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </motion.div>
              </motion.div>

              {/* Industries Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-10"
              >
                <p className="text-gray-500 text-sm uppercase tracking-wider mb-4 font-medium">
                  Trusted Across Industries
                </p>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3 max-w-2xl mx-auto">
                  {[
                    { name: 'Healthcare', icon: Stethoscope },
                    { name: 'Legal', icon: Scale },
                    { name: 'Real Estate', icon: Home },
                    { name: 'Finance', icon: Building2 },
                    { name: 'Dental', icon: Heart },
                    { name: 'Insurance', icon: Shield },
                    { name: 'Hospitality', icon: Utensils },
                    { name: 'Education', icon: GraduationCap },
                  ].map((industry, i) => (
                    <motion.div
                      key={industry.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30"
                    >
                      <motion.div
                        animate={{ 
                          boxShadow: [
                            '0 0 0px rgba(139,92,246,0)',
                            '0 0 15px rgba(139,92,246,0.3)',
                            '0 0 0px rgba(139,92,246,0)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                        className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/20 to-cyan-600/20 flex items-center justify-center"
                      >
                        <industry.icon className="w-5 h-5 text-gray-300" />
                      </motion.div>
                      <span className="text-xs text-gray-500 hidden md:block">{industry.name}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Integrations Banner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-purple-600/10 via-cyan-600/10 to-purple-600/10 border border-purple-500/20"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Layers className="w-6 h-6 text-purple-400" />
                  <span className="text-xl font-semibold text-white">Integrates with 40+ Apps</span>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {['Salesforce', 'HubSpot', 'Slack', 'Google Calendar', 'Stripe', 'Twilio', 'Zendesk', 'Zoom'].map((app, i) => (
                    <motion.div
                      key={app}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4 + i * 0.1 }}
                      className="px-3 py-1.5 rounded-full bg-gray-800/50 border border-gray-700/50 text-sm text-gray-400"
                    >
                      {app}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Progress Steps */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="space-y-3 max-w-lg mx-auto"
              >
                {[
                  { icon: Database, label: "Extracting business information", delay: 0.3 },
                  { icon: Scan, label: "Identifying services & workflows", delay: 1.5 },
                  { icon: Wand2, label: "Configuring AI voice agent", delay: 2.7 },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: step.delay }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800/50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-gray-300 font-medium text-sm">{step.label}</p>
                      <div className="w-full h-1 mt-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2.5, delay: step.delay, ease: "easeInOut" }}
                        />
                      </div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: step.delay + 2.5 }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}


          {/* Stage 3: Ready to Call */}
          {stage === 'ready' && businessInfo && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-3xl"
            >
              {/* Business Card */}
              {(() => {
                const industryConfig = findIndustryByName(businessInfo.industry);
                const IndustryIcon = industryConfig.icon;
                return (
              <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-600/10 to-violet-600/5 border border-purple-500/20 backdrop-blur-xl mb-8">
                <div className="flex items-start gap-6 mb-6">
                  <div className="flex flex-col items-center gap-2 flex-shrink-0">
                    <motion.div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center"
                      style={{ 
                        background: `linear-gradient(135deg, ${industryConfig.color}40, ${industryConfig.color}20)`,
                        border: `2px solid ${industryConfig.color}60`,
                        boxShadow: `0 0 30px ${industryConfig.color}30`
                      }}
                      animate={{
                        boxShadow: [
                          `0 0 20px ${industryConfig.color}20`,
                          `0 0 40px ${industryConfig.color}40`,
                          `0 0 20px ${industryConfig.color}20`
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <IndustryIcon className="w-10 h-10" style={{ color: industryConfig.color }} />
                    </motion.div>
                    <span className="text-xs font-medium text-gray-400 text-center max-w-[80px]">
                      {industryConfig.name}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-200 mb-2">
                      {businessInfo.businessName}
                    </h2>
                    <p className="font-medium mb-3" style={{ color: industryConfig.color }}>
                      {businessInfo.industry}
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {businessInfo.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {businessInfo.location && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">{businessInfo.location}</span>
                    </div>
                  )}
                  {businessInfo.hours && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">{businessInfo.hours}</span>
                    </div>
                  )}
                  {businessInfo.phone && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <Phone className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">{businessInfo.phone}</span>
                    </div>
                  )}
                  {businessInfo.email && (
                    <div className="flex items-center gap-3 text-gray-300">
                      <Mail className="w-4 h-4 text-purple-400" />
                      <span className="text-sm">{businessInfo.email}</span>
                    </div>
                  )}
                </div>

                {businessInfo.services.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {businessInfo.services.slice(0, 6).map((service, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-purple-600/20 border border-purple-500/30 text-sm text-purple-300"
                        >
                          {service}
                        </span>
                      ))}
                      {businessInfo.services.length > 6 && (
                        <span className="px-3 py-1 text-sm text-gray-500">
                          +{businessInfo.services.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-600/10 border border-green-500/30 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 font-medium">
                    Your AI receptionist is ready! Call now to test it.
                  </span>
                </div>
                
                {permanentUrl && (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-purple-600/10 border border-purple-500/30">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Link2 className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 mb-1">Permanent Demo URL</p>
                        <p className="text-purple-300 font-mono text-sm truncate">
                          voicelyagent.ai/demo/{permanentSlug}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(permanentUrl);
                        setUrlCopied(true);
                        setTimeout(() => setUrlCopied(false), 2000);
                        toast({
                          title: "URL Copied",
                          description: "Permanent demo URL copied to clipboard",
                        });
                      }}
                      className="ml-3 flex-shrink-0"
                      data-testid="button-copy-permanent-url"
                    >
                      {urlCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                )}
              </div>
                );
              })()}

              {/* Advanced Integrations Section */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-cyan-600/10 to-purple-600/5 border border-cyan-500/20 backdrop-blur-xl mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30 flex items-center justify-center">
                    <Workflow className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-100">Beyond Reception: Full Business Automation</h3>
                    <p className="text-sm text-gray-400">What AI can do for {businessInfo.businessName}</p>
                  </div>
                </div>

                {/* Integration Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <motion.div 
                    className="p-4 rounded-xl bg-gray-900/50 border border-gray-800"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <span className="font-semibold text-gray-200">Smart Scheduling</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">Automatically book appointments, send confirmations, and manage your calendar in real-time.</p>
                    <div className="flex items-center gap-2 text-xs text-cyan-400">
                      <Link2 className="w-3 h-3" />
                      <span>Google Calendar, Calendly, Acuity</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="p-4 rounded-xl bg-gray-900/50 border border-gray-800"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <CreditCard className="w-5 h-5 text-green-400" />
                      <span className="font-semibold text-gray-200">Payment Processing</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">Collect deposits, process payments, and send invoices during the call.</p>
                    <div className="flex items-center gap-2 text-xs text-cyan-400">
                      <Link2 className="w-3 h-3" />
                      <span>Stripe, Square, PayPal, QuickBooks</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="p-4 rounded-xl bg-gray-900/50 border border-gray-800"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="w-5 h-5 text-blue-400" />
                      <span className="font-semibold text-gray-200">CRM Integration</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">Auto-log calls, create leads, update customer records, and trigger follow-up sequences.</p>
                    <div className="flex items-center gap-2 text-xs text-cyan-400">
                      <Link2 className="w-3 h-3" />
                      <span>Salesforce, HubSpot, Zoho, Monday</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="p-4 rounded-xl bg-gray-900/50 border border-gray-800"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <BellRing className="w-5 h-5 text-orange-400" />
                      <span className="font-semibold text-gray-200">Smart Notifications</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">Instant alerts via SMS, email, or Slack. Escalate urgent matters to the right team member.</p>
                    <div className="flex items-center gap-2 text-xs text-cyan-400">
                      <Link2 className="w-3 h-3" />
                      <span>Twilio, SendGrid, Slack, Teams</span>
                    </div>
                  </motion.div>
                </div>

                {/* Complex Workflow Visualization */}
                <div className="space-y-4 mb-6">
                  <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Complex Agentic Workflows for {businessInfo.businessName}
                  </h4>
                  
                  {getComplexWorkflows().workflows.map((workflow, wIndex) => (
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
                        {workflow.steps.map((step, sIndex) => (
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
                </div>

                {/* More Capabilities */}
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
              </div>

              {/* Value Proposition Section */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-600/10 to-pink-600/5 border border-purple-500/20 backdrop-blur-xl mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                    <HeartHandshake className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-100">Why AI for {businessInfo.businessName}?</h3>
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

                <div className="p-4 rounded-xl bg-purple-600/10 border border-purple-500/20">
                  <p className="text-sm text-gray-300 text-center italic">
                    "AI doesn't replace your team—it amplifies them. Your receptionist becomes a customer success manager. Your office manager becomes a strategic planner."
                  </p>
                </div>
              </div>

              {/* Cold Email Button */}
              <div className="flex justify-center mb-8">
                <Button
                  size="lg"
                  onClick={() => setShowColdEmailModal(true)}
                  className="h-14 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold"
                  data-testid="button-cold-email"
                >
                  <Mail className="w-5 h-5 mr-3" />
                  Get Pre-Written Cold Email
                </Button>
              </div>

              {/* Call Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={startCall}
                  className="h-16 px-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-lg"
                  data-testid="button-start-call"
                >
                  <Phone className="w-6 h-6 mr-3" />
                  Call Your AI Voice Agent
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={resetDemo}
                  className="h-16 px-8 border-gray-700 text-gray-300 hover:bg-gray-800"
                  data-testid="button-try-another"
                >
                  Try Another Website
                </Button>
              </div>

              {/* View Agent Prompt Button */}
              <div className="flex justify-center mt-6">
                <Button
                  variant="ghost"
                  onClick={() => setShowPromptModal(true)}
                  className="text-purple-400 hover:text-purple-300 hover:bg-purple-600/10"
                  data-testid="button-view-prompt"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Agent Prompt
                </Button>
              </div>
            </motion.div>
          )}

          {/* Agent Prompt Modal */}
          <Dialog open={showPromptModal} onOpenChange={setShowPromptModal}>
            <DialogContent className="max-w-4xl max-h-[85vh] bg-gray-900 border-purple-500/30 overflow-hidden flex flex-col">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle className="text-xl font-bold text-gray-100 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Agent System Prompt
                  {businessInfo && (
                    <span className="text-sm font-normal text-gray-400">
                      — {businessInfo.businessName}
                    </span>
                  )}
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 overflow-hidden flex flex-col gap-4 mt-4">
                {/* Copy Button */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(systemPrompt);
                      setPromptCopied(true);
                      setTimeout(() => setPromptCopied(false), 2000);
                      toast({
                        title: "Copied!",
                        description: "Agent prompt copied to clipboard",
                      });
                    }}
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-600/20"
                    data-testid="button-copy-prompt"
                  >
                    {promptCopied ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Prompt
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Prompt Content */}
                <div className="flex-1 overflow-auto rounded-xl bg-gray-950 border border-gray-800 p-6">
                  <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono leading-relaxed">
                    {systemPrompt}
                  </pre>
                </div>
                
                {/* Stats */}
                <div className="flex gap-4 text-xs text-gray-500 flex-shrink-0">
                  <span>{systemPrompt.length.toLocaleString()} characters</span>
                  <span>•</span>
                  <span>{systemPrompt.split(/\s+/).length.toLocaleString()} words</span>
                  <span>•</span>
                  <span>~{Math.ceil(systemPrompt.length / 4).toLocaleString()} tokens</span>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Cold Email Modal */}
          <Dialog open={showColdEmailModal} onOpenChange={setShowColdEmailModal}>
            <DialogContent className="max-w-4xl max-h-[85vh] bg-gray-900 border-purple-500/30 overflow-hidden flex flex-col">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle className="text-xl font-bold text-gray-100 flex items-center gap-3">
                  <Mail className="w-5 h-5 text-pink-400" />
                  Cold Email Template
                  {businessInfo && (
                    <span className="text-sm font-normal text-gray-400">
                      — Ready to Send to {businessInfo.businessName}
                    </span>
                  )}
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 overflow-hidden flex flex-col gap-4 mt-4">
                {/* View Toggle & Copy Button */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant={emailViewMode === 'html' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEmailViewMode('html')}
                      className={emailViewMode === 'html' ? 'bg-purple-600 hover:bg-purple-700' : 'border-gray-600'}
                      data-testid="button-email-html-view"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Styled Email
                    </Button>
                    <Button
                      variant={emailViewMode === 'plain' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEmailViewMode('plain')}
                      className={emailViewMode === 'plain' ? 'bg-gray-600 hover:bg-gray-700' : 'border-gray-600'}
                      data-testid="button-email-plain-view"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Plain Text
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (emailViewMode === 'html') {
                        copyHtmlToClipboard();
                      } else {
                        const coldEmailContent = generateColdEmail();
                        navigator.clipboard.writeText(coldEmailContent);
                        setColdEmailCopied(true);
                        setTimeout(() => setColdEmailCopied(false), 2000);
                        toast({
                          title: "Copied!",
                          description: "Plain text email copied to clipboard",
                        });
                      }
                    }}
                    className="border-pink-500/30 text-pink-300 hover:bg-pink-600/20"
                    data-testid="button-copy-cold-email"
                  >
                    {coldEmailCopied ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-400" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        {emailViewMode === 'html' ? 'Copy for Gmail' : 'Copy Text'}
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Email Content */}
                {emailViewMode === 'html' ? (
                  <div className="flex-1 overflow-auto rounded-xl bg-white border border-gray-300">
                    <iframe
                      srcDoc={generateHtmlEmail()}
                      className="w-full h-full min-h-[400px] rounded-xl"
                      title="Email Preview"
                      sandbox="allow-same-origin"
                    />
                  </div>
                ) : (
                  <div className="flex-1 overflow-auto rounded-xl bg-gray-950 border border-gray-800 p-6">
                    <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-sans">
                      {generateColdEmail()}
                    </pre>
                  </div>
                )}
                
                {/* Tips */}
                <div className="p-3 rounded-lg bg-purple-600/10 border border-purple-500/20 flex-shrink-0">
                  <p className="text-xs text-gray-400">
                    {emailViewMode === 'html' ? (
                      <>
                        <span className="text-purple-400 font-semibold">How to use:</span> Click "Copy for Gmail" then paste directly into Gmail compose window. The styling will be preserved automatically.
                      </>
                    ) : (
                      <>
                        <span className="text-purple-400 font-semibold">Tip:</span> The opening line is automatically personalized based on achievements, news, or milestones found on their website. Review and adjust as needed before sending.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Stage: Error */}
          {stage === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-xl text-center"
            >
              {/* Error Animation Container */}
              <div className="relative mb-8">
                {/* Pulsing error glow */}
                <motion.div
                  className="absolute inset-0 rounded-full mx-auto w-32 h-32"
                  style={{
                    background: "radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)",
                  }}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Error emoji container */}
                <motion.div
                  className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-red-600/20 to-red-800/10 border border-red-500/30 flex items-center justify-center"
                  initial={{ rotate: -10 }}
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                    className="text-5xl"
                  >
                    😔
                  </motion.div>
                </motion.div>
              </div>

              {/* Error Message */}
              <motion.h2
                className="text-2xl md:text-3xl font-bold text-gray-200 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                data-testid="text-error-title"
              >
                Unable to Analyze Website
              </motion.h2>
              
              <motion.p
                className="text-gray-400 mb-8 max-w-md mx-auto"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                data-testid="text-error-message"
              >
                {errorMessage || "Unfortunately we could not access the website from an unknown restriction. Please make sure the URL is correct and the site is publicly accessible."}
              </motion.p>

              {/* Suggestions */}
              <motion.div
                className="mb-8 p-4 rounded-xl bg-gray-900/50 border border-gray-800 text-left"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                data-testid="container-error-suggestions"
              >
                <p className="text-sm text-gray-500 mb-3">Try the following:</p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span>Make sure the URL is correct and the website is publicly accessible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span>Try a different page on the website (e.g., About or Services page)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span>Ensure the website has text content (not just images)</span>
                  </li>
                </ul>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  size="lg"
                  onClick={() => {
                    setErrorMessage('');
                    setStage('input');
                  }}
                  className="h-14 px-8 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold"
                  data-testid="button-try-again"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Try Again
                </Button>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Stage 4: Active Call - Full Screen IndustryAgent Style */}
      {stage === 'calling' && businessInfo && (
        <div className="fixed inset-0 z-50 bg-[#050510]">
          {/* Particle Background */}
          <div className="absolute inset-0">
            <ParticleField 
              primaryColor={agentColor}
              secondaryColor={agentColor}
            />
          </div>

          {/* Gradient Overlays */}
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

          {/* Content */}
          <div className="relative z-10 flex flex-col min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 hover:text-white"
                onClick={endCall}
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: voiceChat.isActive ? '#22c55e' : agentColor }}
                />
                <span className="text-sm text-gray-400">
                  {voiceChat.isActive ? `Live ${formatDuration(callDuration)}` : businessInfo.industry}
                </span>
              </div>
              <div className="w-10" />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              {/* Agent Avatar */}
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
                  <div 
                    className="w-full h-full rounded-full overflow-hidden"
                  >
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
                <h1 className="text-3xl font-bold text-white mb-1">{businessInfo.businessName}</h1>
                <p className="text-gray-400 flex items-center justify-center gap-2">
                  <Star className="w-4 h-4" style={{ color: agentColor }} />
                  {businessInfo.industry}
                </p>
              </motion.div>

              {/* Services Tags - Clickable */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-2 mb-8 max-w-sm"
              >
                {businessInfo.services.slice(0, 4).map((service, i) => (
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

              {/* Subtitle Display */}
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

              {/* Call Controls */}
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

                {/* Text Input */}
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
            </div>

            {/* Footer */}
            <div className="p-4 text-center">
              <p className="text-xs text-gray-500">
                Powered by Voicely Agent
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Flowchart Modal */}
      {businessInfo && (
        <WorkflowFlowchart
          isOpen={selectedWorkflow !== null}
          onClose={() => setSelectedWorkflow(null)}
          workflow={selectedWorkflow || { title: '', steps: [], color: 'purple' }}
          businessName={businessInfo.businessName}
          businessUrl={websiteUrl}
          services={businessInfo.services || ['General Consultation', 'Follow-up Appointment', 'New Patient Visit']}
        />
      )}
    </div>
  );
}
