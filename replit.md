# Voicely Agent - Technical Documentation

## Overview

Voicely Agent is a production-ready AI voice workforce platform designed to provide real-time AI voice agents for customer service, sales, and various business functions. It offers ultra-low latency, natural voice conversations mimicking human interaction, and features a cryptocurrency token economy ($VOICE), advanced voice analytics, and comprehensive professional admin dashboards. The platform holds significant market potential in automated communication solutions with a polished UI and a stable voice pipeline.

## User Preferences

I prefer simple language and explanations.
I want iterative development.
Ask before making major changes.
Do not make changes to the folder `shared/`.
Do not make changes to the file `server/voiceAnalytics.ts`.

## System Architecture

### UI/UX Decisions

The user interface features a dark navy background with vibrant purple and cyan accents. Typography uses Orbitron for headings and Inter for body text. Design elements include glassmorphism cards, gradient accents, animated counters and charts, and terminal-style interfaces, all built with a mobile-first and responsive approach. UI components leverage `shadcn/ui` and `Radix UI`. The platform supports dynamic agent color theming for waveforms and background patterns.

### Technical Implementations

**Frontend:**
- **Framework:** React 18 with TypeScript and Vite
- **Routing:** Wouter
- **State Management:** TanStack Query
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS
- **Real-time:** Socket.IO Client

**Backend:**
- **Framework:** Express.js with TypeScript
- **Database:** PostgreSQL (Neon Database) with Drizzle ORM
- **Real-time:** Socket.IO
- **Authentication:** Dynamic.xyz
- **Logging:** Winston
- **Security:** Helmet

**Voice Pipeline:**
The core voice pipeline is optimized for ultra-low latency (<350ms perceived latency) using Deepgram for STT, DeepSeek AI for response generation, and ElevenLabs for TTS. Latency optimizations include 40ms audio chunks, instant streaming from DeepSeek AI, and ElevenLabs TTS with `eleven_turbo_v2_5` in maximum speed mode.

**Audio Capture Modes:**
- **Desktop/Android:** MediaRecorder with WebM/Opus.
- **iOS Safari:** Web Audio API with PCM16 encoding.

**Session Modes:**
1. Voice-only
2. Voice + Text (hybrid)
3. Text-only

### Feature Specifications

**Core Features:**
- Real-time voice conversations with three session modes.
- **Agent Studio:** For creating and editing agents with voice preview, 7 ElevenLabs voices, photo/URL fields, and AI-powered prompt generation.
- **Voice Logs:** Session history with transcript viewer and sentiment analysis.
- **Admin Dashboard:** For system monitoring and management.
- **CRM System:** For lead and campaign management.
- Production-ready authentication.

**AI Services:**
- DeepSeek Integration powers AI conversation responses and system prompt generation. AI endpoints are protected with rate limiting.

**WebSocket Events:**
- **Client → Server:** `voice:start-session`, `voice:audio-chunk`, `voice:text-message`, `voice:end-session`.
- **Server → Client:** `voice:session-started`, `voice:transcript`, `voice:agent-response`, `voice:audio-response`, `voice:session-ended`, `voice:error`.

### System Design Choices

**Database Schema:** Key tables include `users`, `agents`, `calls`, `voiceSessions`, `userStats`, `activities`, `leads`, `campaigns`, and `waitlist`.

**Security:**
- IDOR Protection through user ownership validation.
- CSP Headers via Helmet middleware.
- Session Security with PostgreSQL-backed sessions.
- Input Validation using Zod schemas.
- Rate Limiting with Express rate limiter.

## External Dependencies

-   **Deepgram:** Speech-to-text (STT) service.
-   **DeepSeek:** AI model for response generation.
-   **ElevenLabs:** Text-to-speech (TTS) service.
-   **Jupiter Terminal v3:** Solana token swap integration.
-   **Neon Database:** Managed PostgreSQL database.
-   **Dynamic.xyz:** Web3 authentication provider.

## Recent Changes (December 2025)

### Business Model Pivot (Enterprise Lead Capture)
- **Contact Tab:** Replaced "Account" tab with "Contact" in mobile navigation - leads to Alice voice concierge
- **Alice Voice Concierge:** New MobileContact.tsx page featuring Alice, a voice agent designed to collect business lead information
- **Lead Capture Flow:** Alice guides prospects through discovery conversation (name, company, agent needs, contact info)
- **Email Integration:** Backend `/api/lead-capture` endpoint collects transcript and extracts lead info, sends to voicelyagent@gmail.com via Resend
- **Rate Limiting:** Lead capture endpoint protected with 10 requests/hour/IP limit to prevent abuse

### Bug Fixes
- **Conversation Loop Fix:** Fixed critical bug where conversations stopped after 2-3 exchanges. Issue was caused by stale `state.sessionId` closure in audio callbacks - now uses `sessionIdRef.current` to ensure `voice:playback-finished` events are always sent correctly.

### UI Improvements
- **Streaming Subtitles (SharedAgent):** Agent responses now appear as streaming subtitles in waves (like movie captions) instead of displaying the full text at once. Chunks cycle every ~2.5 seconds to match speech timing, with progress dots indicator.
- **Real-time Bidirectional Subtitles:** Both user speech AND agent responses now display as real-time subtitles. User speech shows immediately as interim transcripts arrive from Deepgram (no chunking delay). Agent responses continue to use streaming chunks timed to match TTS playback. Updated in both IndustryAgent.tsx and MobileContact.tsx.
- **Avatar Image Display Fix:** IndustryAgent.tsx now properly displays agent avatar images when available, falling back to first-letter initial if no image is set.

### Contact-Only Platform Changes
- **Removed Public Auth UI:** Platform is now contact-only. All public-facing Sign In buttons and login screens have been removed.
- **Protected Route Redirects:** Visitors accessing protected routes (dashboard, settings, etc.) are redirected to `/mobile/contact` instead of seeing login UI.
- **Navbar Updates:** Replaced "Agents" link with "Contact", replaced "Sign In" button with "Talk to Alice" CTA.
- **Header Updates:** Removed authenticated user dropdown menu, simplified to contact-focused menu with "Talk to Alice" and "Documentation" links.
- **Route Redirect:** `/sign-in` route now redirects to `/mobile/contact`.

### Industry Agent Expansion (December 2025)
- **Expanded to 19 Industries:** Added 8 new industry verticals: Dental Practices (Dr. Lisa), Luxury Hotels (Victoria), Veterinary (Dr. Amy), Higher Education (Professor Claire), Construction (Frank), Property Management (Patricia), Travel & Tourism (Isabella), Wealth Management (William)
- **Consultative Conversation Approach:** All agent system prompts updated to be more consultative. Agents now focus on learning about the prospect's business, explaining value with specific examples, and only collecting contact info when genuine interest is expressed. Replaced "YOUR GOAL" sections with "CONVERSATION APPROACH" emphasizing discovery-first engagement.
- **Real Estate Agent Update:** Changed from Marcus (male) to Lauren (female) with new Voicely branded avatar

### Homepage Industries Section (December 2025)
- **IndustriesSection Component:** New homepage section showcasing all 19 industry verticals in a responsive grid
- **Industry Cards:** Each card displays icon, name, and description with hover effects
- **Key Features Banner:** Highlights 24-48hr Setup, Custom Training, CRM Integration, 24/7 Availability, Natural Conversations
- **Mobile Industries Page:** Full listing at /mobile/industries with detailed features per industry

### Demo Page Feature (December 2025)
- **New /demo Route:** Allows visitors to try a custom AI voice agent for their own business
- **Website Analysis:** Enter any business URL and Gemini AI analyzes the content to extract business info (name, industry, services, hours, location, FAQs, etc.)
- **Dynamic Agent Generation:** Creates a customized system prompt based on extracted business data
- **Voice Interface:** Uses the same IndustryAgent pattern with ParticleField background, avatar display, streaming subtitles, and call controls
- **Navigation Update:** Replaced Token tab with Demo across Header, MobileTabBar, and Footer
- **API Endpoint:** POST /api/demo/analyze-website for website analysis with Gemini 2.5 Flash