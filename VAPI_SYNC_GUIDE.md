# Vapi Dashboard Synchronization Guide

This guide explains how to create matching Vapi assistants for your Voicely agents and link them for seamless integration.

## Overview

Voicely Agent now maintains **4 production agents** in the database. Each agent needs a corresponding Vapi assistant to enable voice conversations and chat functionality.

## Production Agents

| Agent ID | Name | Type | Voice ID | Avatar |
|----------|------|------|----------|--------|
| `demo-support-agent` | Alice - Support Agent | support | 21m00Tcm4TlvDq8ikWAM | b47fb970-cdb6-40cc-937b-3c9239ba0648_1763286130384.png |
| `demo-sales-agent` | Sarah - Sales Agent | sales | EXAVITQu4vr4xnSDxMaL | c0001dae-d4fe-4559-964d-817e77c4df0f_1762597948605.png |
| `demo-receptionist-agent` | Emma - Receptionist | receptionist | 21m00Tcm4TlvDq8ikWAM | 6d2e3129-7027-46ab-a628-de3766dedf07_1763287429962.png |
| `demo-followup-agent` | Maya - Appointment Agent | appointments | EXAVITQu4vr4xnSDxMaL | 77912688-291a-4713-b923-54cec485ff01_1762607585723.png |

## Step 1: Access Vapi Dashboard

1. Log in to [Vapi Dashboard](https://dashboard.vapi.ai/)
2. Navigate to **Assistants** section
3. Have your Vapi API key ready (stored in `VAPI_API_KEY` secret)

## Step 2: Create Vapi Assistants

For each of the 4 agents, create a matching Vapi assistant:

### Alice - Support Agent

**Configuration:**
```
Name: Alice - Support Agent
Model: deepseek-chat (DeepSeek v3)
Voice Provider: ElevenLabs
Voice ID: 21m00Tcm4TlvDq8ikWAM
Temperature: 0.7
Max Tokens: 60

System Prompt:
You are Alice, a helpful customer support agent for Voicely. You specialize in troubleshooting technical issues and providing clear solutions. Listen to customer problems, provide step-by-step solutions, and make them feel heard. Be patient, empathetic, and professional. Keep responses under 3 sentences for natural conversation flow.

First Message:
Hi! I'm Alice from Voicely support. How can I help you today?
```

### Sarah - Sales Agent

**Configuration:**
```
Name: Sarah - Sales Agent
Model: deepseek-chat (DeepSeek v3)
Voice Provider: ElevenLabs
Voice ID: EXAVITQu4vr4xnSDxMaL
Temperature: 0.8
Max Tokens: 80

System Prompt:
You are Sarah, a confident sales agent for Voicely. You help businesses understand how AI voice agents can transform their customer service. Ask qualifying questions, understand customer needs, and guide them toward solutions. Be enthusiastic but professional. Keep responses under 3 sentences for natural conversation.

First Message:
Hi! I'm Sarah from Voicely. I help businesses automate their customer interactions with AI. What brings you here today?
```

### Emma - Receptionist

**Configuration:**
```
Name: Emma - Receptionist
Model: deepseek-chat (DeepSeek v3)
Voice Provider: ElevenLabs
Voice ID: 21m00Tcm4TlvDq8ikWAM
Temperature: 0.6
Max Tokens: 80

System Prompt:
You are Emma, a professional receptionist for Voicely. You greet callers warmly, find out how you can help them, and direct them to the right person or department. Be courteous, organized, and efficient. Keep responses under 3 sentences for smooth call routing.

First Message:
Hello! You've reached Voicely. I'm Emma, how may I direct your call today?
```

### Maya - Appointment Agent

**Configuration:**
```
Name: Maya - Appointment Agent
Model: deepseek-chat (DeepSeek v3)
Voice Provider: ElevenLabs
Voice ID: EXAVITQu4vr4xnSDxMaL
Temperature: 0.7
Max Tokens: 80

System Prompt:
You are Maya, an appointment scheduling assistant for Voicely. You help people find available times and book appointments efficiently. Ask for their preferred date and time, confirm details, and provide clear next steps. Be friendly and organized. Keep responses under 3 sentences.

First Message:
Hi! I'm Maya, your scheduling assistant. I'd be happy to help you book an appointment. What date and time works best for you?
```

## Step 3: Configure Advanced Settings

For each assistant in Vapi:

1. **Voice Settings:**
   - Enable streaming: Yes
   - Optimize for latency: Maximum (level 4)
   - Stability: 0.5
   - Similarity boost: 0.75

2. **Response Settings:**
   - Enable interruptions: Yes
   - Endpointing: 120ms (Alice: 80ms for faster responses)
   - Background sound: None

3. **Model Settings:**
   - Provider: DeepSeek
   - Model: deepseek-chat
   - Use streaming: Yes
   - First message delay: 0ms (immediate greeting)

## Step 4: Link Vapi Assistants to Voicely Agents

After creating each Vapi assistant, copy its Assistant ID and update the corresponding Voicely agent:

### Method 1: Using SQL (Recommended)

```sql
-- Update Alice
UPDATE agents 
SET vapi_assistant_id = 'YOUR_ALICE_ASSISTANT_ID' 
WHERE id = 'demo-support-agent';

-- Update Sarah
UPDATE agents 
SET vapi_assistant_id = 'YOUR_SARAH_ASSISTANT_ID' 
WHERE id = 'demo-sales-agent';

-- Update Emma
UPDATE agents 
SET vapi_assistant_id = 'YOUR_EMMA_ASSISTANT_ID' 
WHERE id = 'demo-receptionist-agent';

-- Update Maya
UPDATE agents 
SET vapi_assistant_id = 'YOUR_MAYA_ASSISTANT_ID' 
WHERE id = 'demo-followup-agent';
```

### Method 2: Using Agent Studio UI

1. Navigate to **Agent Studio** in Voicely
2. Click on each agent to edit
3. Paste the Vapi Assistant ID in the "Vapi Assistant ID" field
4. Save changes

## Step 5: Verify Integration

1. **Test Chat Functionality:**
   - Go to Agent Studio
   - Select an agent with a linked Vapi assistant
   - Copy the shareable link or embed code
   - Test the chat widget on a test page

2. **Test Voice Functionality:**
   - Navigate to the mobile demo pages
   - Try voice conversations with each agent
   - Verify responses match the agent's personality

3. **Check Logs:**
   - Monitor Voice Logs page for session data
   - Verify transcripts are accurate
   - Check sentiment analysis is working

## Troubleshooting

### Agent Not Responding
- Verify `VAPI_API_KEY` is set correctly
- Check Vapi dashboard for assistant status
- Ensure `vapiAssistantId` matches exactly (no spaces)

### Voice Quality Issues
- Confirm Voice ID matches between Voicely and Vapi
- Check ElevenLabs API key in Vapi dashboard
- Verify streaming settings are enabled

### Chat Widget Not Loading
- Check browser console for errors
- Verify public key in embed code
- Ensure Vapi assistant is active (not archived)

## Best Practices

1. **Consistent Naming:** Keep agent names identical in Voicely and Vapi for easy tracking
2. **Regular Testing:** Test each agent after updates to ensure quality
3. **Monitor Usage:** Check Vapi dashboard for conversation metrics and costs
4. **Backup IDs:** Keep a record of all Assistant IDs in case of emergency

## Next Steps

- Set up custom tools/functions in Vapi for appointment booking
- Configure knowledge bases for domain-specific responses
- Add custom actions for CRM integration
- Monitor analytics and optimize prompts based on performance

---

**Need Help?** Contact the Voicely team or check the [Vapi Documentation](https://docs.vapi.ai/)
