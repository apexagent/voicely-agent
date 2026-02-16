import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import type {
  VoiceTelemetryEvent,
  VoiceStageStatusEvent,
  StageStatus,
  StageType,
  SentimentScore,
  IntentDetection,
} from "@shared/voiceAnalytics";

export interface TelemetryStageMetrics {
  latencyMs: number;
  confidence: number;
  status: StageStatus;
}

export interface TelemetryFeedState {
  stages: Record<StageType, TelemetryStageMetrics>;
  sentiment: SentimentScore | null;
  intent: IntentDetection | null;
  conversionProbability: number;
  packetsProcessed: number;
  totalTokens: { prompt: number; completion: number };
}

const initialStage: TelemetryStageMetrics = {
  latencyMs: 0,
  confidence: 0,
  status: "idle",
};

const initialState: TelemetryFeedState = {
  stages: {
    deepgram: { ...initialStage },
    deepseek: { ...initialStage },
    elevenlabs: { ...initialStage },
  },
  sentiment: null,
  intent: null,
  conversionProbability: 0,
  packetsProcessed: 0,
  totalTokens: { prompt: 0, completion: 0 },
};

export function useTelemetryFeed(socket: Socket | null, sessionId: string | null) {
  const [telemetry, setTelemetry] = useState<TelemetryFeedState>(initialState);

  useEffect(() => {
    if (!socket || !sessionId) {
      setTelemetry(initialState);
      return;
    }

    // Handle stage status updates
    const handleStageStatus = (event: VoiceStageStatusEvent) => {
      if (event.sessionId !== sessionId) return;

      setTelemetry((prev) => ({
        ...prev,
        stages: {
          ...prev.stages,
          [event.stage]: {
            ...prev.stages[event.stage],
            status: event.status,
          },
        },
      }));
    };

    // Handle telemetry updates with metrics
    const handleTelemetryUpdate = (event: VoiceTelemetryEvent) => {
      if (event.sessionId !== sessionId) return;

      const { telemetry: stageTelemetry } = event;

      setTelemetry((prev) => {
        const updated: TelemetryFeedState = {
          ...prev,
          stages: {
            ...prev.stages,
            [stageTelemetry.stage]: {
              latencyMs: stageTelemetry.latencyMs,
              confidence: stageTelemetry.confidence || 0,
              status: stageTelemetry.status,
            },
          },
        };

        // Track Deepgram packets
        if (stageTelemetry.stage === "deepgram" && "packetsProcessed" in stageTelemetry) {
          updated.packetsProcessed = stageTelemetry.packetsProcessed;
        }

        // Track DeepSeek tokens
        if (stageTelemetry.stage === "deepseek" && "promptTokens" in stageTelemetry) {
          updated.totalTokens = {
            prompt: prev.totalTokens.prompt + stageTelemetry.promptTokens,
            completion: prev.totalTokens.completion + (stageTelemetry.completionTokens || 0),
          };
        }

        // Simulated sentiment/intent (in production, derive from AI analysis)
        if (Math.random() < 0.1) { // Update occasionally
          updated.sentiment = {
            label: ["positive", "neutral", "negative"][Math.floor(Math.random() * 3)] as any,
            score: Math.random() * 2 - 1, // -1 to 1
            confidence: 0.8 + Math.random() * 0.15,
          };

          updated.intent = {
            label: ["information_request", "booking_appointment", "sales_inquiry", "support_request"][Math.floor(Math.random() * 4)] as any,
            confidence: 0.75 + Math.random() * 0.2,
          };

          updated.conversionProbability = 0.6 + Math.random() * 0.35;
        }

        return updated;
      });
    };

    socket.on("voice:stage-status", handleStageStatus);
    socket.on("voice:telemetry-update", handleTelemetryUpdate);

    return () => {
      socket.off("voice:stage-status", handleStageStatus);
      socket.off("voice:telemetry-update", handleTelemetryUpdate);
    };
  }, [socket, sessionId]);

  return telemetry;
}
