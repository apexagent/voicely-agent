# Voicely Agent - AI Voice Workforce Platform

**Production-ready AI voice agent platform with real-time conversations, analytics, and token economy.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)

## Overview

Voicely Agent is an enterprise-grade SaaS platform that provides AI-powered voice agents for customer service, sales, reception, appointments, and follow-ups. Built with modern web technologies and real-time voice streaming, the platform delivers human-like conversations at scale.

### Key Features

- **Real-Time Voice Conversations** - WebSocket-based audio streaming with Deepgram STT, DeepSeek AI, and ElevenLabs TTS
- **Agent Management** - Create, configure, and deploy custom voice agents with personality and business context
- **Voice Analytics** - Track performance metrics, sentiment analysis, and conversation insights
- **Multi-Modal Communication** - Support for voice, text, and hybrid conversation modes
- **Token Economy** - $VOICE token integration with Solana DEX (Jupiter Terminal v3)
- **Production Auth** - Replit OIDC with PostgreSQL session management
- **Admin Dashboard** - System monitoring, user management, and analytics

## Tech Stack

### Frontend
- **React 18** with TypeScript and Vite
- **Wouter** for client-side routing
- **TanStack Query** for server state management
- **Framer Motion** for animations
- **Tailwind CSS** + shadcn/ui components
- **Socket.IO Client** for WebSocket communication

### Backend
- **Express.js** with TypeScript
- **PostgreSQL** (Neon Database) with Drizzle ORM
- **Socket.IO** for real-time bidirectional communication
- **Passport.js** with Replit OIDC
- **Winston** for structured logging
- **Helmet** for security headers

### AI & Voice APIs
- **Deepgram** - Real-time speech-to-text transcription
- **DeepSeek** - AI response generation and conversation analysis
- **ElevenLabs** - High-quality text-to-speech synthesis

### Infrastructure
- **Neon Database** - Managed PostgreSQL with connection pooling
- **Replit** - Hosting and deployment platform
- **Redis** (optional) - Session store and caching

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database
- API keys for Deepgram, DeepSeek, and ElevenLabs

### Environment Setup

```bash
# Required API Keys
DEEPGRAM_API_KEY=your_deepgram_key
DEEPSEEK_API_KEY=your_deepseek_key
ELEVENLABS_API_KEY=your_elevenlabs_key

# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Session Management
SESSION_SECRET=your_random_secret_string

# Optional
REDIS_URL=redis://localhost:6379
```

### Installation

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

## Database Schema

### Core Tables
- `users` - User accounts and profiles
- `agents` - AI agent configurations (name, prompt, voice, business context)
- `calls` - Call records and outcomes
- `voiceSessions` - Real-time voice session tracking with transcripts
- `userStats` - Weekly/monthly user statistics
- `activities` - Activity feed and audit logs
- `leads` - CRM lead management
- `campaigns` - Marketing campaign tracking

### Schema Management

```bash
# Update schema in development
npm run db:push

# Force update if warnings
npm run db:push --force

# Generate migrations (advanced)
npm run db:migrate
```

## API Reference

### Authentication
All authenticated endpoints require session cookie. Use Replit OIDC for production or `/api/dev-login` in development.

### Agent Endpoints

```typescript
POST   /api/agents              // Create agent
GET    /api/agents              // List user's agents
GET    /api/agents/:id          // Get agent details
PATCH  /api/agents/:id          // Update agent
DELETE /api/agents/:id          // Delete agent
GET    /api/agents/summary      // Active agents summary
```

### Voice Session Endpoints

```typescript
POST   /api/agents/:id/sessions // Start voice session
GET    /api/voice-sessions      // List sessions
GET    /api/voice-sessions/:id  // Get session details
POST   /api/voice/tts           // Text-to-speech generation
GET    /api/voice/voices        // List available voices
```

### Analytics Endpoints

```typescript
GET    /api/stats                      // Platform-wide statistics
GET    /api/user/stats                 // User statistics
GET    /api/agents/:id/analytics       // Per-agent analytics
POST   /api/conversations/analyze      // AI conversation analysis
GET    /api/insights                   // AI-generated insights
```

### CRM Endpoints

```typescript
POST   /api/leads                // Create lead
GET    /api/leads                // List leads (filterable)
GET    /api/leads/:id            // Get lead
PATCH  /api/leads/:id            // Update lead
DELETE /api/leads/:id            // Delete lead

POST   /api/campaigns            // Create campaign
GET    /api/campaigns            // List campaigns
PATCH  /api/campaigns/:id        // Update campaign
```

### Health Checks

```typescript
GET    /api/health              // Basic health check
GET    /api/ready               // Database connectivity check
GET    /api/metrics             // System metrics (CPU, memory)
```

## WebSocket Events

### Client → Server

```typescript
'voice:start-session'   // Start new voice session
'voice:audio-chunk'     // Send audio data
'voice:text-message'    // Send text message
'voice:end-session'     // End voice session
```

### Server → Client

```typescript
'voice:session-started' // Session initialized
'voice:transcript'      // Speech-to-text result
'voice:agent-response'  // AI response (text)
'voice:audio-response'  // TTS audio chunk
'voice:session-ended'   // Session terminated
'voice:error'           // Error occurred
```

## Architecture

### Voice Pipeline Flow

```
Client Audio → Deepgram STT → DeepSeek AI → ElevenLabs TTS → Client Playback
      ↓                           ↓                  ↓
  WebSocket              Conversation          Audio Stream
   Chunks                  Context              Synthesis
```

### Security Features

- **IDOR Protection** - All agent/lead operations validate user ownership
- **CSP Headers** - Content Security Policy via Helmet middleware
- **Session Security** - PostgreSQL-backed sessions with secure cookies
- **Input Validation** - Zod schemas for all API requests
- **Rate Limiting** - Express rate limiter on all routes

### Performance Optimizations

- **Connection Pooling** - Neon Database serverless pooling
- **In-Memory Sessions** - Optional Redis for distributed deployments
- **Query Optimization** - Drizzle ORM with prepared statements
- **Frontend Caching** - TanStack Query with intelligent invalidation

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Route pages
│   │   ├── hooks/            # Custom hooks
│   │   └── lib/              # Utilities
├── server/
│   ├── index.ts              # Express server entry
│   ├── routes.ts             # API route definitions
│   ├── storage.ts            # Database operations
│   ├── auth.ts               # Authentication setup
│   ├── websocket.ts          # Socket.IO handlers
│   └── voiceAnalytics.ts     # Voice processing
├── shared/
│   └── schema.ts             # Shared Drizzle schema
└── db/
    └── migrations/           # Database migrations
```

## Deployment

### Production Checklist

- [ ] Set all environment variables
- [ ] Configure database with connection pooling
- [ ] Enable Redis for session management
- [ ] Set up SSL/TLS certificates
- [ ] Configure CSP headers for your domain
- [ ] Enable rate limiting
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure backup strategy for database
- [ ] Test voice pipeline end-to-end
- [ ] Verify webhook endpoints

### Scaling Considerations

- **Horizontal Scaling** - Stateless design supports multiple instances
- **Database Pooling** - Use Neon's connection pooling or PgBouncer
- **Session Store** - Move to Redis for distributed sessions
- **File Storage** - Consider S3 for audio recordings
- **CDN** - Serve static assets via CDN

## Development

### Code Style

- TypeScript strict mode enabled
- ESLint + Prettier for formatting
- Zod for runtime validation
- Drizzle for type-safe queries

### Testing

```bash
# Run tests (when available)
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

### Common Tasks

```bash
# Add a new package
npm install package-name

# Database operations
npm run db:push          # Push schema changes
npm run db:studio        # Open Drizzle Studio
npm run db:migrate       # Generate migrations

# Development
npm run dev              # Start dev server
npm run build            # Build for production
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

- Documentation: [Voicely Docs](https://voicelyagent.ai/docs)
- Issues: [GitHub Issues](https://github.com/voicely/agent/issues)
- Email: support@voicelyagent.ai

---

**Built with ❤️ by the Voicely Team**
