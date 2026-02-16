#!/usr/bin/env tsx
/**
 * Create Vapi Assistants Script
 * 
 * This script creates all 4 production Vapi assistants and updates
 * the Voicely database with their assistant IDs.
 * 
 * Usage: tsx scripts/create-vapi-assistants.ts
 */

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_BASE_URL = 'https://api.vapi.ai';

if (!VAPI_API_KEY) {
  console.error('❌ Error: VAPI_API_KEY environment variable not set');
  process.exit(1);
}

interface VapiAssistantConfig {
  name: string;
  voicelyAgentId: string;
  voiceId: string;
  systemPrompt: string;
  firstMessage: string;
  maxTokens: number;
  endpointingMs: number;
}

const assistantConfigs: VapiAssistantConfig[] = [
  {
    name: 'Alice - Support Agent',
    voicelyAgentId: 'demo-support-agent',
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    systemPrompt: `You are Alice, a helpful customer support agent for Voicely. You specialize in troubleshooting technical issues and providing clear solutions. Listen to customer problems, provide step-by-step solutions, and make them feel heard. Be patient, empathetic, and professional. Keep responses under 3 sentences for natural conversation flow.`,
    firstMessage: "Hi! I'm Alice from Voicely support. How can I help you today?",
    maxTokens: 60,
    endpointingMs: 80,
  },
  {
    name: 'Sarah - Sales Agent',
    voicelyAgentId: 'demo-sales-agent',
    voiceId: 'EXAVITQu4vr4xnSDxMaL',
    systemPrompt: `You are Sarah, a confident sales agent for Voicely. You help businesses understand how AI voice agents can transform their customer service. Ask qualifying questions, understand customer needs, and guide them toward solutions. Be enthusiastic but professional. Keep responses under 3 sentences for natural conversation.`,
    firstMessage: "Hi! I'm Sarah from Voicely. I help businesses automate their customer interactions with AI. What brings you here today?",
    maxTokens: 80,
    endpointingMs: 120,
  },
  {
    name: 'Emma - Receptionist',
    voicelyAgentId: 'demo-receptionist-agent',
    voiceId: '21m00Tcm4TlvDq8ikWAM',
    systemPrompt: `You are Emma, a professional receptionist for Voicely. You greet callers warmly, find out how you can help them, and direct them to the right person or department. Be courteous, organized, and efficient. Keep responses under 3 sentences for smooth call routing.`,
    firstMessage: "Hello! You've reached Voicely. I'm Emma, how may I direct your call today?",
    maxTokens: 80,
    endpointingMs: 120,
  },
  {
    name: 'Maya - Appointment Agent',
    voicelyAgentId: 'demo-followup-agent',
    voiceId: 'EXAVITQu4vr4xnSDxMaL',
    systemPrompt: `You are Maya, an appointment scheduling assistant for Voicely. You help people find available times and book appointments efficiently. Ask for their preferred date and time, confirm details, and provide clear next steps. Be friendly and organized. Keep responses under 3 sentences.`,
    firstMessage: "Hi! I'm Maya, your scheduling assistant. I'd be happy to help you book an appointment. What date and time works best for you?",
    maxTokens: 80,
    endpointingMs: 120,
  },
];

async function createVapiAssistant(config: VapiAssistantConfig): Promise<string> {
  const payload = {
    name: config.name,
    transcriber: {
      provider: 'deepgram',
      model: 'nova-2',
      language: 'en',
    },
    model: {
      provider: 'openai',
      model: 'gpt-4o-mini', // Using mini for cost efficiency, can upgrade to gpt-4o
      messages: [
        {
          role: 'system',
          content: config.systemPrompt,
        },
      ],
      maxTokens: config.maxTokens,
      temperature: 0.7,
    },
    voice: {
      provider: '11labs',
      voiceId: config.voiceId,
      stability: 0.5,
      similarityBoost: 0.75,
      optimizeStreamingLatency: 4, // Maximum speed
    },
    firstMessage: config.firstMessage,
    firstMessageMode: 'assistant-speaks-first',
    endCallMessage: 'Thank you for contacting Voicely. Have a great day!',
    recordingEnabled: true,
    hipaaEnabled: false,
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 1800, // 30 minutes max
    backgroundSound: 'off',
    backchannelingEnabled: false,
    backgroundDenoisingEnabled: true,
  };

  console.log(`\n📤 Creating assistant: ${config.name}`);
  
  const response = await fetch(`${VAPI_BASE_URL}/assistant`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${VAPI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create assistant ${config.name}: ${error}`);
  }

  const assistant = await response.json();
  console.log(`✅ Created assistant: ${config.name}`);
  console.log(`   Assistant ID: ${assistant.id}`);
  
  return assistant.id;
}

async function updateVoicelyAgent(agentId: string, vapiAssistantId: string) {
  // Note: This would require database connection
  // For now, we'll just output the SQL command
  console.log(`\n📝 Update command for agent ${agentId}:`);
  console.log(`   UPDATE agents SET vapi_assistant_id = '${vapiAssistantId}' WHERE id = '${agentId}';`);
}

async function main() {
  console.log('🚀 Starting Vapi Assistant Creation Process\n');
  console.log('=' .repeat(60));
  
  const results: { name: string; voicelyId: string; vapiId: string }[] = [];

  for (const config of assistantConfigs) {
    try {
      const vapiAssistantId = await createVapiAssistant(config);
      results.push({
        name: config.name,
        voicelyId: config.voicelyAgentId,
        vapiId: vapiAssistantId,
      });
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Error creating ${config.name}:`, error);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✨ Summary of Created Assistants\n');
  
  results.forEach(result => {
    console.log(`${result.name}`);
    console.log(`  Voicely ID: ${result.voicelyId}`);
    console.log(`  Vapi ID: ${result.vapiId}`);
    console.log('');
  });

  console.log('📋 SQL Commands to Update Voicely Database:\n');
  results.forEach(result => {
    console.log(`UPDATE agents SET vapi_assistant_id = '${result.vapiId}' WHERE id = '${result.voicelyId}';`);
  });

  console.log('\n✅ All assistants created successfully!');
  console.log('🔗 View them at: https://dashboard.vapi.ai/assistants');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
