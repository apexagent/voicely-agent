#!/usr/bin/env tsx
/**
 * Update All Vapi Assistants to DeepSeek v3
 */

const VAPI_API_KEY = process.env.VAPI_API_KEY;

const assistants = [
  { id: '9a850270-0aea-467f-bf3f-4673fe73323d', name: 'Alice - Support Agent' },
  { id: '9f706aff-f978-49b8-9372-3abeee9aee28', name: 'Sarah - Sales Agent' },
  { id: '9257b3e7-897a-455d-aed7-88b6f467f039', name: 'Emma - Receptionist' },
  { id: '274ad6cf-4ea9-4e98-99c4-4c44a4215c60', name: 'Maya - Appointment Agent' },
];

async function updateToDeepSeek(id: string, name: string) {
  const response = await fetch(`https://api.vapi.ai/assistant/${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${VAPI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: {
        provider: 'deep-seek',
        model: 'deepseek-chat',
        temperature: 0.7,
      }
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to update ${name}: ${error}`);
  }

  console.log(`✅ Updated ${name} to DeepSeek v3`);
}

async function updateAll() {
  console.log('\n🔄 Updating all Vapi assistants to DeepSeek v3...\n');
  
  for (const assistant of assistants) {
    await updateToDeepSeek(assistant.id, assistant.name);
  }
  
  console.log('\n✨ All assistants now use DeepSeek v3 (deepseek-chat)!\n');
}

updateAll().catch(console.error);
