#!/usr/bin/env tsx
/**
 * Check All Vapi Assistants in Detail
 */

const VAPI_API_KEY = process.env.VAPI_API_KEY;

async function getAssistantDetails(id: string) {
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

async function checkAll() {
  const listResponse = await fetch('https://api.vapi.ai/assistant', {
    headers: {
      'Authorization': `Bearer ${VAPI_API_KEY}`,
    },
  });

  if (!listResponse.ok) {
    throw new Error(`Failed to fetch list: ${await listResponse.text()}`);
  }

  const assistants = await listResponse.json();
  
  console.log('\n📋 Vapi Assistants Detailed Check:\n');
  console.log('='.repeat(80));
  
  for (const assistant of assistants) {
    const details = await getAssistantDetails(assistant.id);
    
    console.log(`\n${assistant.name}`);
    console.log(`ID: ${assistant.id}`);
    console.log(`Model Provider: ${details.model?.provider || 'N/A'}`);
    console.log(`Model: ${details.model?.model || 'N/A'}`);
    console.log(`Voice: ${details.voice?.voiceId || 'N/A'}`);
    console.log(`System Prompt: ${details.model?.messages?.[0]?.content ? 'YES (' + details.model.messages[0].content.substring(0, 50) + '...)' : 'MISSING!'}`);
    console.log(`First Message: ${details.firstMessage || 'N/A'}`);
  }
  
  console.log('\n' + '='.repeat(80) + '\n');
}

checkAll().catch(console.error);
