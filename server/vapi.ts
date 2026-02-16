import axios from 'axios';
import { getVapiVoiceId } from './voiceMapping';

const VAPI_API_KEY = process.env.VAPI_API_KEY;
const VAPI_BASE_URL = 'https://api.vapi.ai';

if (!VAPI_API_KEY) {
  console.warn('VAPI_API_KEY not set - Vapi integration will not work');
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface VapiChatResponse {
  id: string;
  assistantId: string;
  messages: ChatMessage[];
  output: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  orgId?: string;
  sessionId?: string;
  name?: string;
}

interface SendChatMessageOptions {
  assistantId: string;
  input: string;
  previousChatId?: string;
  variableValues?: Record<string, string>;
}

interface CreateAssistantOptions {
  name: string;
  firstMessage: string;
  systemPrompt: string;
  voiceId?: string;
  model?: string;
  maxTokens?: number;
  tools?: any[];
}

interface UpdateAssistantOptions {
  assistantId: string;
  name?: string;
  firstMessage?: string;
  systemPrompt?: string;
  voiceId?: string;
  tools?: any[];
}

interface VapiAssistant {
  id: string;
  name: string;
  firstMessage?: string;
  model: any;
  voice: any;
  transcriber: any;
  createdAt: string;
  updatedAt: string;
}

/**
 * Send a chat message to a Vapi assistant
 */
export async function sendChatMessage(options: SendChatMessageOptions): Promise<VapiChatResponse> {
  if (!VAPI_API_KEY) {
    throw new Error('VAPI_API_KEY is not configured');
  }

  const { assistantId, input, previousChatId, variableValues } = options;

  const requestBody: any = {
    assistantId,
    input,
  };

  if (previousChatId) {
    requestBody.previousChatId = previousChatId;
  }

  if (variableValues) {
    requestBody.assistantOverrides = {
      variableValues,
    };
  }

  try {
    const response = await axios.post<VapiChatResponse>(
      `${VAPI_BASE_URL}/chat`,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Vapi chat error:', error.response?.data || error.message);
    throw new Error(`Failed to send chat message: ${error.response?.data?.message || error.message}`);
  }
}

/**
 * Extract the assistant's response from a Vapi chat response
 */
export function extractAssistantResponse(chatResponse: VapiChatResponse): string {
  if (chatResponse.output && chatResponse.output.length > 0) {
    return chatResponse.output[0].content;
  }
  return '';
}

/**
 * Get the chat ID from a response for maintaining conversation context
 */
export function getChatId(chatResponse: VapiChatResponse): string {
  return chatResponse.id;
}

/**
 * Create a new assistant in Vapi
 * Now hardcoded to use DeepSeek v3 for all agents
 */
export async function createAssistant(options: CreateAssistantOptions): Promise<VapiAssistant> {
  if (!VAPI_API_KEY) {
    throw new Error('VAPI_API_KEY is not configured');
  }

  const {
    name,
    firstMessage,
    systemPrompt,
    voiceId = '21m00Tcm4TlvDq8ikWAM', // Default ElevenLabs voice (Alice)
    maxTokens = 150,
    tools = [],
  } = options;

  // Map Voicely voice ID to Vapi voice ID (currently same, but abstracted for future flexibility)
  const vapiVoiceId = getVapiVoiceId(voiceId);

  const requestBody: any = {
    name,
    firstMessage,
    model: {
      provider: 'deep-seek',
      model: 'deepseek-chat', // DeepSeek v3
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
      ],
      maxTokens,
      temperature: 0.7,
    },
    voice: {
      provider: '11labs',
      voiceId: vapiVoiceId,
    },
    transcriber: {
      provider: 'deepgram',
      model: 'nova-2',
    },
    firstMessageMode: 'assistant-speaks-first',
    endCallMessage: 'Thank you for chatting with me. Goodbye!',
    maxDurationSeconds: 1800, // 30 minutes
  };

  // Add tools if provided
  if (tools && tools.length > 0) {
    requestBody.model.tools = tools;
  }

  try {
    const response = await axios.post<VapiAssistant>(
      `${VAPI_BASE_URL}/assistant`,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Vapi create assistant error:', error.response?.data || error.message);
    throw new Error(`Failed to create Vapi assistant: ${error.response?.data?.message || error.message}`);
  }
}

/**
 * Update an existing assistant in Vapi
 * Enables real-time sync from Voicely Agent Studio → Vapi Dashboard
 */
export async function updateAssistant(options: UpdateAssistantOptions): Promise<VapiAssistant> {
  if (!VAPI_API_KEY) {
    throw new Error('VAPI_API_KEY is not configured');
  }

  const {
    assistantId,
    name,
    firstMessage,
    systemPrompt,
    voiceId,
    tools,
  } = options;

  const requestBody: any = {};

  // Only include fields that are being updated
  if (name !== undefined) {
    requestBody.name = name;
  }

  if (firstMessage !== undefined) {
    requestBody.firstMessage = firstMessage;
  }

  // Update model configuration if system prompt is provided
  if (systemPrompt !== undefined || tools !== undefined) {
    requestBody.model = {
      provider: 'deep-seek',
      model: 'deepseek-chat',
      temperature: 0.7,
    };

    if (systemPrompt !== undefined) {
      requestBody.model.messages = [
        {
          role: 'system',
          content: systemPrompt,
        },
      ];
    }

    if (tools !== undefined && tools.length > 0) {
      requestBody.model.tools = tools;
    }
  }

  // Update voice if provided
  if (voiceId !== undefined) {
    const vapiVoiceId = getVapiVoiceId(voiceId);
    requestBody.voice = {
      provider: '11labs',
      voiceId: vapiVoiceId,
    };
  }

  try {
    const response = await axios.patch<VapiAssistant>(
      `${VAPI_BASE_URL}/assistant/${assistantId}`,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`[VAPI] Assistant ${assistantId} updated successfully`);
    return response.data;
  } catch (error: any) {
    console.error('Vapi update assistant error:', error.response?.data || error.message);
    throw new Error(`Failed to update Vapi assistant: ${error.response?.data?.message || error.message}`);
  }
}
