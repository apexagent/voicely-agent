#!/usr/bin/env tsx
/**
 * Update Alice's Voice in Vapi
 * Changes Alice to Jessica voice
 */

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const ALICE_VAPI_ID = '9a850270-0aea-467f-bf3f-4673fe73323d';
const JESSICA_VOICE_ID = 'cgSgspJ2msm6clMCkdW9';

async function updateVoice() {
  console.log('🎤 Updating Alice to Jessica voice in Vapi...\n');

  const response = await fetch(`https://api.vapi.ai/assistant/${ALICE_VAPI_ID}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${VAPI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      voice: {
        provider: '11labs',
        voiceId: JESSICA_VOICE_ID,
        model: 'eleven_turbo_v2_5',
        stability: 0.5,
        similarityBoost: 0.75,
        optimizeStreamingLatency: 4,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update: ${error}`);
  }

  const result = await response.json();
  console.log('✅ Successfully updated Alice to Jessica voice!');
  console.log('   Voice ID:', result.voice.voiceId);
  console.log('   Provider:', result.voice.provider);
}

updateVoice().catch(console.error);
