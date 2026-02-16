# Vapi Integration Guide

## Overview

Your Voicely Agent platform now **automatically** integrates with Vapi's managed AI assistant infrastructure. When you create an agent in Voicely Agent Studio, the system automatically:
- ✨ Creates a matching assistant in Vapi
- 🔗 Links them together seamlessly  
- ⚙️ Configures the assistant with your agent's settings
- 🎯 Keeps everything synchronized

**No manual configuration needed!**

## How Automatic Creation Works

When you create an agent in Voicely Agent Studio:

1. **You fill in the agent details**
   - Name, voice, system prompt, business info
   - Choose voice model and personality
   - Configure AI instructions

2. **Click "Create Agent"**
   - Voicely creates the agent in your database
   - Automatically creates matching Vapi assistant
   - Links them with a Vapi assistant ID

3. **Ready to Use**
   - Agent can immediately handle chat conversations
   - Voice and chat interfaces work seamlessly
   - Everything managed from one place

**The entire Vapi setup happens automatically behind the scenes!**

## What Gets Created in Vapi

For each Voicely agent, the system creates a Vapi assistant with:

- **Name**: Same as your Voicely agent
- **First Message**: "Hi! I'm [Agent Name]. How can I help you today?"
- **System Prompt**: Your agent's configured system instructions
- **Voice**: Your selected ElevenLabs voice ID
- **Model**: GPT-4 with optimized settings
- **Transcriber**: Deepgram Nova-2 for speech-to-text
- **Max Duration**: 30 minutes per conversation
- **Max Tokens**: 150 tokens per response (fast, concise replies)

All of this is configured automatically based on your agent settings!

## Testing Your Integration

### Method 1: Using the Chat API

Test agent conversations via the REST API:

```bash
curl -X POST https://your-voicely-domain/api/agents/{agentId}/chat \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=YOUR_SESSION_COOKIE" \
  -d '{
    "message": "Hello! I need help with my account"
  }'
```

Expected response:
```json
{
  "success": true,
  "response": "Hi! I'd be happy to help with your account. What specific issue are you experiencing?",
  "chatId": "chat_abc123",
  "fullData": { ... }
}
```

### Method 2: Multi-turn Conversations

Continue conversations by including the `previousChatId`:

```bash
curl -X POST https://your-voicely-domain/api/agents/{agentId}/chat \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=YOUR_SESSION_COOKIE" \
  -d '{
    "message": "I forgot my password",
    "previousChatId": "chat_abc123"
  }'
```

The assistant maintains full conversation context!

## Architecture

```
User Message
    ↓
Your Voicely UI (Custom Branding)
    ↓
Your Backend API (/api/agents/:id/chat)
    ↓
Automatic Vapi Assistant (Created on agent setup)
    ↓
Response back through your system
    ↓
Your Voicely UI (Custom Branding)
```

**Key Benefits:**
- ✅ Single source of truth (Voicely Agent Studio)
- ✅ No manual Vapi configuration needed
- ✅ Automatic synchronization
- ✅ Your branding throughout
- ✅ Managed AI infrastructure

## Embedding on Client Websites

When you embed Voicely chat widgets on client websites:

```html
<!-- Your custom chat widget -->
<script src="https://your-domain/voicely-widget.js"></script>
<script>
  VoicelyChat.init({
    agentId: "alice-support-agent-id",
    theme: "purple"
  });
</script>
```

Behind the scenes:
- Your widget renders with custom branding
- Messages route through your backend to Vapi
- You maintain full control over UX
- Clients see only your Voicely brand
- Vapi assistant was created automatically when you set up the agent

## Graceful Error Handling

If Vapi assistant creation fails (API key missing, rate limits, etc.):

- ✅ Your Voicely agent is still created successfully
- ⚠️ The agent works for voice calls using the original voice pipeline
- 📝 You'll receive a warning in the response
- 🔧 Once Vapi API key is configured, new agents will automatically get Vapi assistants

The system uses **graceful degradation** - agents always work even if Vapi integration fails.

## Advanced: Manual Vapi Configuration

If you want to customize assistants beyond Voicely's automatic setup:

1. Go to [dashboard.vapi.ai](https://dashboard.vapi.ai/)
2. Log in with your Vapi account
3. Find the assistant (named after your Voicely agent)
4. Customize advanced settings:
   - Add custom tools/functions
   - Configure webhooks
   - Adjust model parameters
   - Set up analytics

**Note:** Changes in Vapi dashboard won't sync back to Voicely automatically.

## Troubleshooting

### "Failed to create Vapi assistant"

**Cause**: VAPI_API_KEY not configured or invalid

**Solution**:
1. Get your API key from the Vapi dashboard
2. Add it to your Replit secrets as `VAPI_API_KEY`
3. Restart your application
4. Create a new agent - it will automatically get a Vapi assistant

### "This agent is not configured with a Vapi assistant ID"

**Cause**: Agent was created before Vapi integration was enabled

**Options**:
1. Delete and recreate the agent (automatic Vapi assistant)
2. Manually create assistant in Vapi and update the agent record
3. Use the original voice pipeline (still works!)

### Vapi Assistant Not Responding

**Check**:
1. Verify VAPI_API_KEY is set correctly
2. Check Vapi dashboard for assistant status
3. Review server logs for error messages
4. Ensure you're passing valid messages

## What's Next

1. **Create your agents** in Voicely Agent Studio
2. **They automatically get Vapi assistants** - no manual setup!
3. **Test the chat endpoint** to verify conversations work
4. **Embed on websites** using your custom chat widgets
5. **Monitor in one place** - everything managed from Voicely

## API Reference

### POST /api/agents
Creates a new agent and automatically creates matching Vapi assistant.

**Response**:
```json
{
  "success": true,
  "agent": { ... },
  "vapiAssistantCreated": true
}
```

### POST /api/agents/:id/chat
Send messages to agent's Vapi assistant.

**Request**:
```json
{
  "message": "Your message here",
  "previousChatId": "chat_123" // optional for context
}
```

**Response**:
```json
{
  "success": true,
  "response": "Assistant's reply",
  "chatId": "chat_456",
  "fullData": { ... }
}
```

## Support

For questions or issues:
- Check Voicely server logs for error details
- Visit [Vapi Documentation](https://docs.vapi.ai/)
- Review your Vapi dashboard for assistant status

**The automatic integration means you spend less time configuring and more time building amazing voice experiences!** 🚀
