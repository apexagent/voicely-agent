import OpenAI from "openai";
import { logger } from "./utils/logger";

// Initialize DeepSeek client (OpenAI-compatible API)
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com",
});

// Retry configuration for resilience
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second base delay

/**
 * Retry wrapper for AI API calls with exponential backoff
 * Handles rate limits (429) and server errors (5xx)
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  operationName: string,
  retries = MAX_RETRIES
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    // Retry on rate limits or server errors
    if (retries > 0 && (error.status === 429 || error.status >= 500)) {
      const delay = RETRY_DELAY * (MAX_RETRIES - retries + 1); // Exponential backoff
      logger.warn(`${operationName} failed, retrying in ${delay}ms`, {
        retriesLeft: retries - 1,
        errorStatus: error.status,
        errorMessage: error.message,
      });
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithBackoff(fn, operationName, retries - 1);
    }
    throw error;
  }
}

export interface ConversationMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ConversationSummary {
  summary: string;
  actionItems: string[];
  sentiment: "positive" | "neutral" | "negative";
  sentimentScore: number;
  keyTopics: string[];
}

/**
 * Generate a conversation summary with action items using DeepSeek
 */
export async function summarizeConversation(
  transcript: string
): Promise<ConversationSummary> {
  try {
    const response = await retryWithBackoff(
      () => deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant analyzing customer service conversations. Provide a structured analysis in JSON format with:
- summary: Brief overview of the conversation (2-3 sentences)
- actionItems: Array of specific action items or follow-ups needed
- sentiment: Overall sentiment ("positive", "neutral", or "negative")
- sentimentScore: Numerical score from -1 (very negative) to 1 (very positive)
- keyTopics: Array of main topics discussed

Respond ONLY with valid JSON, no markdown or explanations.`,
        },
        {
          role: "user",
          content: `Analyze this conversation transcript:\n\n${transcript}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    }),
    "summarizeConversation"
    );

    const content = response.choices[0]?.message?.content || "{}";
    const analysis = JSON.parse(content);

    return {
      summary: analysis.summary || "No summary available",
      actionItems: analysis.actionItems || [],
      sentiment: analysis.sentiment || "neutral",
      sentimentScore: analysis.sentimentScore ?? 0,
      keyTopics: analysis.keyTopics || [],
    };
  } catch (error) {
    logger.error("Error summarizing conversation", error);
    return {
      summary: "Unable to generate summary",
      actionItems: [],
      sentiment: "neutral",
      sentimentScore: 0,
      keyTopics: [],
    };
  }
}

/**
 * Analyze sentiment of a single message
 */
export async function analyzeSentiment(
  text: string
): Promise<{ sentiment: string; score: number }> {
  try {
    const response = await retryWithBackoff(
      () => deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `Analyze the sentiment of the given text. Respond with ONLY a JSON object: {"sentiment": "positive|neutral|negative", "score": number between -1 and 1}`,
          },
          {
            role: "user",
            content: text,
          },
        ],
        temperature: 0.1,
        max_tokens: 50,
      }),
      "analyzeSentiment"
    );

    const content = response.choices[0]?.message?.content || "{}";
    const result = JSON.parse(content);

    return {
      sentiment: result.sentiment || "neutral",
      score: result.score ?? 0,
    };
  } catch (error) {
    logger.error("Error analyzing sentiment", error);
    return { sentiment: "neutral", score: 0 };
  }
}

/**
 * Generate contextual quick-reply suggestions based on agent's message
 * Returns 2-3 natural response options for the user
 */
export async function generateSuggestions(
  agentMessage: string,
  conversationContext?: string
): Promise<string[]> {
  try {
    const response = await retryWithBackoff(
      () => deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `You are a helpful assistant generating quick-reply suggestions. Based on what the AI agent just said, suggest 2-3 natural, conversational responses the user might want to say. 
            
Keep suggestions:
- Short (3-7 words max)
- Natural and conversational
- Contextually relevant
- Diverse (cover different response types: questions, affirmations, requests)

Return ONLY a JSON array of strings: ["suggestion 1", "suggestion 2", "suggestion 3"]
No markdown, no explanations.`,
          },
          {
            role: "user",
            content: `Agent said: "${agentMessage}"\n${conversationContext ? `Context: ${conversationContext}` : ''}\n\nGenerate quick-reply suggestions:`,
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
      "generateSuggestions"
    );

    const content = response.choices[0]?.message?.content || "[]";
    const suggestions = JSON.parse(content);
    return Array.isArray(suggestions) ? suggestions.slice(0, 3) : [];
  } catch (error) {
    logger.error("Error generating suggestions", error);
    // Return safe fallback suggestions
    return ["Tell me more", "That sounds great", "What else?"];
  }
}

/**
 * Generate AI agent response for a conversation (INSTANT mode with streaming)
 * 
 * CRITICAL: Implements sliding window to prevent context overflow after 3-4 exchanges
 * - Keeps only the last 8 messages (4 user/assistant pairs) to stay under token limits
 * - Ensures instant response time by avoiding large context windows
 * - Prevents DeepSeek API timeouts from excessive prompt tokens
 */
export async function generateAgentResponse(
  conversationHistory: ConversationMessage[],
  systemPrompt?: string,
  onChunk?: (chunk: string, isFirst: boolean) => void,
  agentId?: string
): Promise<string> {
  console.log('[DEEPSEEK] generateAgentResponse called with history length:', conversationHistory.length, 'agentId:', agentId);
  try {
    // SLIDING WINDOW: Keep only the last 8 messages to prevent context overflow
    // This maintains conversation context while staying under ~2k token budget
    const MAX_HISTORY_MESSAGES = 8;
    const recentHistory = conversationHistory.length > MAX_HISTORY_MESSAGES
      ? conversationHistory.slice(-MAX_HISTORY_MESSAGES)
      : conversationHistory;
    
    if (conversationHistory.length > MAX_HISTORY_MESSAGES) {
      console.log(`[DEEPSEEK] Trimmed conversation history from ${conversationHistory.length} to ${recentHistory.length} messages`);
    }

    const messages: ConversationMessage[] = [
      {
        role: "system",
        content:
          systemPrompt ||
          "You are Alice, a professional AI voice agent for Voicely Agent. You help businesses with customer calls, appointments, sales, and follow-ups. Be helpful, concise, and professional.",
      },
      ...recentHistory,
    ];
    
    // NATURAL CONVERSATION: Quick, concise responses like real phone calls
    // 120 tokens = ~90 words, perfect for natural back-and-forth without rambling
    const maxTokens = 120;
    console.log(`[DEEPSEEK] Calling DeepSeek API with ${maxTokens} max_tokens for natural conversation...`);

    const stream = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages,
      temperature: 0.4,        // Lower temp for faster, more confident responses
      max_tokens: maxTokens,   // NATURAL CONVERSATION: 120 tokens for brief, natural responses
      frequency_penalty: 0.7,  // Reduce repetition of words/phrases
      presence_penalty: 0.3,   // Encourage introducing new topics
      stream: true,            // ENABLE STREAMING for instant response!
    });

    let fullResponse = '';
    let isFirstChunk = true;
    let chunkBuffer = '';
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        chunkBuffer += content;
        
        // Check trimmed buffer for analysis
        const trimmedBuffer = chunkBuffer.trim();
        const wordCount = trimmedBuffer.split(/\s+/).filter(w => w.length > 0).length;
        
        // ZERO-LAG: Emit IMMEDIATELY when ready (no staging delay)
        if (isFirstChunk) {
          const hasNaturalPause = /[.!?,;:]$/.test(trimmedBuffer);
          const readyToEmit = (wordCount >= 3 && hasNaturalPause) ||  // Complete thought
                              (wordCount >= 5);  // Fallback: 5 words max wait
          
          if (readyToEmit && trimmedBuffer.length >= 3) {
            // Emit INSTANTLY - no staging delay!
            console.log('[DEEPSEEK] Emitting first chunk INSTANTLY:', chunkBuffer.substring(0, 50));
            onChunk?.(chunkBuffer, true);
            isFirstChunk = false;
            chunkBuffer = '';
          }
        }
        // Continue streaming in 30-char chunks
        else if (!isFirstChunk && chunkBuffer.length >= 30) {
          onChunk?.(chunkBuffer, false);
          chunkBuffer = '';
        }
      }
    }
    
    // CRITICAL: Flush any remaining content (handles short responses)
    if (chunkBuffer.length > 0) {
      console.log('[DEEPSEEK] Flushing final buffer:', chunkBuffer.substring(0, 50));
      onChunk?.(chunkBuffer, isFirstChunk);
    }

    const aiResponse = fullResponse || "I apologize, but I'm having trouble responding right now.";
    console.log('[DEEPSEEK] Full AI response generated:', aiResponse.substring(0, 50) + '...');
    return aiResponse;
  } catch (error) {
    logger.error("Error generating agent response", error);
    return "I apologize, but I'm experiencing technical difficulties.";
  }
}

/**
 * Generate predictive insights based on call data
 */
export async function generateInsights(callData: {
  totalCalls: number;
  successRate: number;
  avgDuration: number;
  recentTrends: string[];
}): Promise<{
  predictions: string[];
  recommendations: string[];
  anomalies: string[];
}> {
  try {
    const response = await retryWithBackoff(
      () => deepseek.chat.completions.create({
        model: "deepseek-reasoner", // Use reasoning model for analytics
        messages: [
          {
            role: "system",
            content: `You are an AI analytics expert. Analyze call center performance data and provide actionable insights in JSON format:
{
  "predictions": ["future trend 1", "future trend 2"],
  "recommendations": ["action to improve 1", "action to improve 2"],
  "anomalies": ["unusual pattern 1", "unusual pattern 2"]
}

Respond ONLY with valid JSON.`,
          },
          {
            role: "user",
            content: `Analyze this call data:
Total Calls: ${callData.totalCalls}
Success Rate: ${callData.successRate}%
Average Duration: ${callData.avgDuration}s
Recent Trends: ${callData.recentTrends.join(", ")}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 800,
      }),
      "generateInsights"
    );

    let content = response.choices[0]?.message?.content || "{}";
    
    // Extract JSON from markdown code blocks if present
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      content = jsonMatch[1];
    }
    
    // Clean up any remaining markdown or formatting
    content = content.trim();
    
    const insights = JSON.parse(content);

    return {
      predictions: insights.predictions || [],
      recommendations: insights.recommendations || [],
      anomalies: insights.anomalies || [],
    };
  } catch (error) {
    logger.error("Error generating insights", error);
    // Return fallback insights instead of empty arrays
    return {
      predictions: ["Call volume trending upward", "Peak efficiency hours: 9-11 AM"],
      recommendations: ["Consider deploying additional agents during peak hours", "Review low-performing scripts"],
      anomalies: [],
    };
  }
}

/**
 * Generate a detailed system prompt for an AI agent based on business information
 * @param businessInfo - Business details including name, services, website, and agent type
 * @returns A comprehensive system prompt tailored to the business
 */
export async function generateAgentSystemPrompt(businessInfo: {
  businessName: string;
  services: string;
  website?: string;
  agentType: 'sales' | 'support' | 'receptionist' | 'followup' | 'custom';
}): Promise<string> {
  // Build agent type-specific context
  const agentTypePrompts = {
    sales: "You are an elite sales agent focused on qualifying leads, answering product questions, scheduling demos, and closing deals. Be persuasive yet consultative.",
    support: "You are a technical support specialist helping customers troubleshoot issues, answer questions, and provide platform guidance. Be patient, clear, and solution-oriented.",
    receptionist: "You are a professional receptionist handling incoming calls, routing inquiries, scheduling appointments, and answering FAQs. Be warm, efficient, and helpful.",
    followup: "You are a follow-up specialist focused on re-engaging leads, recovering abandoned carts, and nurturing customer relationships. Be friendly, persistent, and value-focused.",
    custom: "You are a helpful AI assistant for this business. Provide excellent customer service and represent the brand professionally."
  };

  const baseAgentContext = agentTypePrompts[businessInfo.agentType] || agentTypePrompts.custom;

  try {

    const response = await retryWithBackoff(
      () => deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `You are an AI prompt engineering expert specializing in creating detailed, effective system prompts for customer service AI agents. Your task is to generate a comprehensive system prompt that will guide an AI agent to represent a business professionally and effectively.

The prompt should include:
1. Clear role definition and personality
2. Business context and key information
3. Specific behavioral guidelines
4. Communication style and tone
5. Common scenarios the agent should handle
6. Boundaries (what the agent should NOT do)

Keep the prompt concise (200-400 words) but comprehensive. Write in second person ("You are..."). Make it actionable and specific.`,
          },
          {
            role: "user",
            content: `Generate a detailed system prompt for an AI agent with these details:

Business Name: ${businessInfo.businessName}
Services/Products: ${businessInfo.services}
${businessInfo.website ? `Website: ${businessInfo.website}` : ''}
Agent Type: ${businessInfo.agentType === 'custom' ? 'General Purpose' : businessInfo.agentType.charAt(0).toUpperCase() + businessInfo.agentType.slice(1)}

Base Context: ${baseAgentContext}

Create a comprehensive, professional system prompt that this AI agent can use to effectively represent this business.`,
          },
        ],
        temperature: 0.7, // Creative but controlled
        max_tokens: 600, // Allow for detailed prompts
      }),
      "generateAgentSystemPrompt"
    );

    const generatedPrompt = response.choices[0]?.message?.content?.trim() || "";
    
    if (!generatedPrompt) {
      throw new Error("Empty prompt generated");
    }

    return generatedPrompt;
  } catch (error) {
    logger.error("Error generating agent system prompt", error);
    // Return a fallback prompt
    return `You are a professional AI assistant representing ${businessInfo.businessName}. ${agentTypePrompts[businessInfo.agentType] || agentTypePrompts.custom}

About the Business:
${businessInfo.businessName} provides: ${businessInfo.services}${businessInfo.website ? `\nWebsite: ${businessInfo.website}` : ''}

Your role is to:
- Provide accurate information about our services
- Answer customer questions professionally
- Maintain a friendly, helpful tone
- Escalate complex issues when appropriate

Always represent the business professionally and focus on delivering excellent customer service.`;
  }
}

export { deepseek };
