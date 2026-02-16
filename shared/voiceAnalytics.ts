/**
 * Voice Analytics Type Definitions
 * Shared TypeScript contracts for real-time voice telemetry and session analytics
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export type StageType = 'deepgram' | 'deepseek' | 'elevenlabs';

export type StageStatus = 'idle' | 'running' | 'complete' | 'error';

export type SentimentLabel = 'positive' | 'neutral' | 'negative';

export type IntentLabel = 
  | 'information_request'
  | 'booking_appointment'
  | 'complaint'
  | 'sales_inquiry'
  | 'support_request'
  | 'follow_up'
  | 'general_conversation';

// ============================================================================
// TELEMETRY PAYLOADS (Stage-Specific)
// ============================================================================

export interface BaseTelemetry {
  stage: StageType;
  status: StageStatus;
  latencyMs: number;
  confidence: number | null;
  updatedAt: string;
}

export interface DeepgramTelemetry extends BaseTelemetry {
  stage: 'deepgram';
  chunkId: string;
  transcript: string;
  isFinal: boolean;
  packetsProcessed: number;
}

export interface DeepSeekTelemetry extends BaseTelemetry {
  stage: 'deepseek';
  promptTokens: number;
  completionTokens: number;
  reasoningTrace?: string;
}

export interface ElevenLabsTelemetry extends BaseTelemetry {
  stage: 'elevenlabs';
  audioChunkUrl?: string;
  queueDepth?: number;
}

export type StageTelemetry = DeepgramTelemetry | DeepSeekTelemetry | ElevenLabsTelemetry;

// ============================================================================
// SOCKET EVENT PAYLOADS
// ============================================================================

export interface VoiceTelemetryEvent {
  sessionId: string;
  timestamp: string;
  telemetry: StageTelemetry;
}

export interface VoiceStageStatusEvent {
  sessionId: string;
  stage: StageType;
  status: StageStatus;
  timestamp: string;
}

export interface SentimentScore {
  label: SentimentLabel;
  score: number; // -1 to 1
  confidence: number; // 0 to 1
}

export interface IntentDetection {
  label: IntentLabel;
  confidence: number; // 0 to 1
  extractedEntities?: Record<string, string>;
}

export interface TranscriptPartial {
  sessionId: string;
  speaker: 'user' | 'agent';
  text: string;
  confidence: number;
  timestamp: string;
  isFinal: boolean;
}

export interface TranscriptFinal {
  sessionId: string;
  speaker: 'user' | 'agent';
  text: string;
  sentiment?: SentimentScore;
  intent?: IntentDetection;
  timestamp: string;
}

// ============================================================================
// REAL-TIME ANALYTICS STATE (UI Display)
// ============================================================================

export interface TalkListenRatio {
  userSeconds: number;
  agentSeconds: number;
}

export interface StageMetrics {
  latencies: number[]; // Rolling window of last N latencies
  confidences: number[]; // Rolling window of last N confidence scores
  errors: number;
  successCount: number;
}

export interface RealtimeAnalyticsState {
  // Session Info
  sessionId: string;
  startedAt: string;
  durationSeconds: number;
  
  // Current Processing State
  stageStatus: Record<StageType, StageStatus>;
  aiSpeaking: boolean;
  userSpeaking: boolean;
  
  // Transcripts
  transcriptPartials: TranscriptPartial[];
  transcriptFinals: TranscriptFinal[];
  
  // Current Sentiment & Intent
  currentSentiment?: SentimentScore;
  currentIntent?: IntentDetection;
  
  // Rolling Metrics (for real-time charts)
  latencyByStage: Record<StageType, number[]>;
  confidenceByStage: Record<StageType, number[]>;
  
  // Talk/Listen Tracking
  talkListenRatio: TalkListenRatio;
  
  // Conversion Probability (ML-predicted)
  conversionProbability?: number; // 0 to 1
  
  // Interruptions & Overlaps
  interruptionCount: number;
  
  // Waveform Data (for visualization)
  audioWaveform: number[]; // 0 to 1, rolling window
}

// ============================================================================
// SESSION ANALYTICS SUMMARY (Persisted to DB)
// ============================================================================

export interface SentimentDataPoint {
  timestamp: string;
  score: number; // -1 to 1
  label: SentimentLabel;
}

export interface IntentDataPoint {
  timestamp: string;
  intent: IntentLabel;
  confidence: number;
}

export interface StageReliability {
  errors: number;
  avgLatencyMs: number;
  avgConfidence: number;
  totalProcessed: number;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  ttsCharacters: number;
}

export interface SessionAnalyticsSummary {
  // Session Metadata
  sessionId: string;
  startedAt: string;
  endedAt: string;
  durationSeconds: number;
  
  // Latency Metrics
  averageLatencyMs: number;
  peakLatencyMs: number;
  latencyByStage: Record<StageType, number>;
  
  // Sentiment Analysis
  overallSentiment: SentimentLabel;
  averageSentimentScore: number;
  sentimentTrajectory: SentimentDataPoint[]; // Clipped to ~1Hz
  
  // Intent Timeline
  detectedIntents: IntentLabel[];
  intentTimeline: IntentDataPoint[];
  
  // Stage Performance
  stageReliability: Record<StageType, StageReliability>;
  
  // Conversation Metrics
  talkListenRatio: TalkListenRatio;
  interruptionCount: number;
  turnCount: number; // Number of back-and-forth exchanges
  
  // Token Usage
  tokens: TokenUsage;
  
  // Outcome Prediction
  conversionProbability?: number;
  outcomeLabel?: 'success' | 'partial' | 'failed';
}

// ============================================================================
// ANALYTICS SUMMARY EVENT (Final Socket Event)
// ============================================================================

export interface AnalyticsSummaryEvent {
  sessionId: string;
  timestamp: string;
  summary: SessionAnalyticsSummary;
}
