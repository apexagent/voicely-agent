#!/usr/bin/env tsx
/**
 * Show Full Assistant Details
 */

const VAPI_API_KEY = process.env.VAPI_API_KEY;

async function getFullDetails(id: string) {
  const response = await fetch(`https://api.vapi.ai/assistant/${id}`, {
    headers: {
      'Authorization': `Bearer ${VAPI_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${await response.text()}`);
  }

  return response.json();
}

async function showAlice() {
  console.log('\n🔍 Alice - Support Agent Full Details:\n');
  console.log('='.repeat(80));
  
  const alice = await getFullDetails('9a850270-0aea-467f-bf3f-4673fe73323d');
  
  console.log('\nName:', alice.name);
  console.log('Model Provider:', alice.model?.provider);
  console.log('Model:', alice.model?.model);
  console.log('Voice:', alice.voice?.voiceId);
  console.log('\nSystem Prompt Length:', alice.model?.messages?.[0]?.content?.length || 0, 'characters');
  console.log('\nFull System Prompt:');
  console.log('---');
  console.log(alice.model?.messages?.[0]?.content || 'MISSING!');
  console.log('---');
  console.log('\n' + '='.repeat(80) + '\n');
}

showAlice().catch(console.error);
