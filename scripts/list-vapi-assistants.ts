#!/usr/bin/env tsx
/**
 * List All Vapi Assistants
 */

const VAPI_API_KEY = process.env.VAPI_API_KEY;

async function listAssistants() {
  const response = await fetch('https://api.vapi.ai/assistant', {
    headers: {
      'Authorization': `Bearer ${VAPI_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch: ${await response.text()}`);
  }

  const assistants = await response.json();
  
  console.log('\n📋 Vapi Assistants:\n');
  console.log('='.repeat(80));
  
  assistants.forEach((assistant: any, index: number) => {
    console.log(`\n${index + 1}. ${assistant.name}`);
    console.log(`   ID: ${assistant.id}`);
    console.log(`   Voice: ${assistant.voice?.voiceId || 'N/A'}`);
    console.log(`   Model: ${assistant.model?.model || 'N/A'}`);
  });
  
  console.log('\n' + '='.repeat(80));
  console.log(`\nTotal: ${assistants.length} assistants\n`);
}

listAssistants().catch(console.error);
