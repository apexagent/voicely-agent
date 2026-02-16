/**
 * Voice Mapping Configuration
 * Maps Voicely's ElevenLabs voices to Vapi-compatible voice IDs
 */

export interface VoiceMapping {
  voicelyId: string;
  vapiVoiceId: string;
  name: string;
  description: string;
  gender: string;
  teamMember: string;
}

/**
 * Official voice mappings for Voicely agents
 * These ElevenLabs voice IDs are used across both our voice pipeline and Vapi integration
 */
export const VOICE_MAPPINGS: VoiceMapping[] = [
  {
    voicelyId: "cgSgspJ2msm6clMCkdW9",
    vapiVoiceId: "cgSgspJ2msm6clMCkdW9", // Same ID - ElevenLabs voices work directly with Vapi
    name: "Alice",
    description: "Warm and friendly support specialist",
    gender: "female",
    teamMember: "Alice"
  },
  {
    voicelyId: "EXAVITQu4vr4xnSDxMaL",
    vapiVoiceId: "EXAVITQu4vr4xnSDxMaL",
    name: "Sarah",
    description: "Strong and confident sales expert",
    gender: "female",
    teamMember: "Sarah"
  },
  {
    voicelyId: "21m00Tcm4TlvDq8ikWAM",
    vapiVoiceId: "21m00Tcm4TlvDq8ikWAM",
    name: "Emma",
    description: "Soft and gentle receptionist",
    gender: "female",
    teamMember: "Emma"
  },
  {
    voicelyId: "ThT5KcBeYPX3keUQqHPh",
    vapiVoiceId: "ThT5KcBeYPX3keUQqHPh",
    name: "Ava",
    description: "Professional appointment scheduler",
    gender: "female",
    teamMember: "Ava"
  }
];

/**
 * Get Vapi voice ID from Voicely voice ID
 */
export function getVapiVoiceId(voicelyVoiceId: string): string {
  const mapping = VOICE_MAPPINGS.find(m => m.voicelyId === voicelyVoiceId);
  return mapping?.vapiVoiceId || "cgSgspJ2msm6clMCkdW9"; // Default to Alice if not found
}

/**
 * Get voice details by ID
 */
export function getVoiceDetails(voiceId: string): VoiceMapping | undefined {
  return VOICE_MAPPINGS.find(m => m.voicelyId === voiceId);
}

/**
 * Generate contextual first message based on agent type
 */
export function generateFirstMessage(agentType: string, businessName?: string): string {
  const businessGreeting = businessName ? ` from ${businessName}` : '';
  
  switch (agentType) {
    case 'sales':
      return `Hi! I'm a sales specialist${businessGreeting}. I'd love to learn about your needs and see how we can help. What brings you here today?`;
    
    case 'support':
      return `Hello! I'm here to help${businessGreeting}. What can I assist you with today?`;
    
    case 'receptionist':
      return `Good day! Thank you for calling${businessGreeting}. How may I direct your call?`;
    
    case 'appointments':
      return `Hi there! I'm here to help you schedule an appointment${businessGreeting}. What date and time works best for you?`;
    
    default:
      return `Hello! How can I help you today?`;
  }
}
