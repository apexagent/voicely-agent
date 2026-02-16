#!/usr/bin/env tsx
/**
 * Get Vapi Assistant Details
 * Fetches the current configuration from Vapi
 */

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const ALICE_VAPI_ID = '9a850270-0aea-467f-bf3f-4673fe73323d';

async function getAssistant() {
  const response = await fetch(`https://api.vapi.ai/assistant/${ALICE_VAPI_ID}`, {
    headers: {
      'Authorization': `Bearer ${VAPI_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${await response.text()}`);
  }

  const assistant = await response.json();
  
  console.log('\n🎤 Alice\'s Current Vapi Configuration:\n');
  console.log('Voice Provider:', assistant.voice?.provider);
  console.log('Voice ID:', assistant.voice?.voiceId);
  console.log('Voice Name:', assistant.voice?.name || 'N/A');
  console.log('\nFull Voice Config:', JSON.stringify(assistant.voice, null, 2));
}

getAssistant().catch(console.error);
