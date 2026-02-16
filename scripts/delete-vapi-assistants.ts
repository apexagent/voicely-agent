#!/usr/bin/env tsx
/**
 * Delete Unused Vapi Assistants
 */

const VAPI_API_KEY = process.env.VAPI_API_KEY;

// IDs to delete
const assistantsToDelete = [
  { id: '6cf189ec-cf12-45c4-a011-3d0f2683a2a3', name: 'VapiTest PQHy' },
  { id: 'a6c2d01c-151d-44cf-a0af-d6c603f1ba9a', name: 'Test Agent dE3ZC-' },
  { id: '7186c2cc-e2f1-4322-8404-2cff21e476d9', name: 'Alice (duplicate)' },
];

async function deleteAssistant(id: string, name: string) {
  const response = await fetch(`https://api.vapi.ai/assistant/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${VAPI_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to delete ${name}: ${error}`);
  }

  console.log(`✅ Deleted: ${name}`);
}

async function deleteAll() {
  console.log('\n🗑️  Deleting unused Vapi assistants...\n');
  
  for (const assistant of assistantsToDelete) {
    await deleteAssistant(assistant.id, assistant.name);
  }
  
  console.log('\n✨ Cleanup complete! Only 4 production agents remain.\n');
}

deleteAll().catch(console.error);
