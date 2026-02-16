import { ElevenLabsClient } from "elevenlabs";
import { logger } from "./utils/logger";

// Initialize ElevenLabs client
const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export interface VoiceConfig {
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
}

/**
 * Convert text to speech using ElevenLabs
 * @param text - The text to convert to speech
 * @param voiceConfig - Optional voice configuration
 * @returns Audio buffer as Uint8Array
 */
export async function textToSpeech(
  text: string,
  voiceConfig?: VoiceConfig
): Promise<Buffer> {
  try {
    const voiceId = voiceConfig?.voiceId || "EXAVITQu4vr4xnSDxMaL"; // Default: Bella - Soft and gentle

    const audio = await elevenlabs.generate({
      voice: voiceId,
      text,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: voiceConfig?.stability ?? 0.5,
        similarity_boost: voiceConfig?.similarityBoost ?? 0.75,
      },
    });

    // Convert audio stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of audio) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  } catch (error) {
    logger.error("Error generating speech", error);
    throw new Error("Failed to generate speech");
  }
}

/**
 * Get available voices from ElevenLabs
 */
export async function getVoices() {
  try {
    const voices = await elevenlabs.voices.getAll();
    return voices.voices.map((voice) => ({
      id: voice.voice_id,
      name: voice.name,
      category: voice.category,
    }));
  } catch (error) {
    logger.error("Error fetching voices", error);
    return [];
  }
}

/**
 * Stream text-to-speech for real-time audio playback
 * @param text - The text to convert
 * @param voiceId - Optional voice ID
 */
export async function* streamTextToSpeech(
  text: string,
  voiceId?: string
): AsyncGenerator<Uint8Array> {
  try {
    const audio = await elevenlabs.generate({
      voice: voiceId || "EXAVITQu4vr4xnSDxMaL", // Bella - Soft and gentle
      text,
      model_id: "eleven_turbo_v2_5",  // Ultra-low latency model (was eleven_monolingual_v1)
      stream: true,
      optimize_streaming_latency: 4,  // ZERO-LAG: Maximum speed mode (was 2) - 0=best quality, 4=fastest
      output_format: "mp3_44100_128",  // Explicit format prevents iOS Safari resampling/crackling
      voice_settings: {
        stability: 0.6,  // Moderate stability for natural expressiveness
        similarity_boost: 0.8,  // High similarity for authentic voice character
      },
    });

    for await (const chunk of audio) {
      yield chunk;
    }
  } catch (error) {
    logger.error("Error streaming speech", error);
    throw new Error("Failed to stream speech");
  }
}

export { elevenlabs };
