# Voicely Agent - Design System

## Design Philosophy

**Dark Cyber-Elite Aesthetic** - Futuristic AI voice agent platform with holographic visuals, neon accents, and glassmorphism effects. The design emphasizes real-time voice capabilities, professional data visualization, and immersive user experience.

## Color System

### Backgrounds
```css
--cyber-black: 0 0 0;              /* #000000 - Pure black */
--cyber-dark: 10 11 30;            /* #0A0B1E - Deep navy */
--cyber-card: 20 20 40;            /* #141428 - Card backgrounds */
```

### Accent Colors
```css
--cyber-purple: 139 92 246;        /* #8B5CF6 - Primary */
--cyber-cyan: 6 182 212;           /* #06B6D4 - Secondary */
--cyber-green: 16 185 129;         /* #10B981 - Success */
```

### Text Hierarchy
```css
--text-primary: 255 255 255;       /* #FFFFFF - Headers */
--text-secondary: 209 213 219;     /* #D1D5DB - Body */
--text-tertiary: 156 163 175;      /* #9CA3AF - Labels */
```

### Glassmorphism
```css
--glass-bg: rgba(20, 20, 40, 0.6);
--glass-border: rgba(139, 92, 246, 0.3);
--backdrop-blur: blur(16px);
```

## Typography

### Font Stack
```css
--font-display: "Orbitron", Inter, sans-serif;  /* Futuristic headers */
--font-sans: Inter, system-ui, sans-serif;       /* Body text */
--font-mono: 'JetBrains Mono', monospace;        /* Code/data */
```

### Type Scale
```css
--text-xs: 0.75rem;      /* 12px - Small labels */
--text-sm: 0.875rem;     /* 14px - Secondary */
--text-base: 1rem;       /* 16px - Body */
--text-xl: 1.25rem;      /* 20px - Card titles */
--text-2xl: 1.5rem;      /* 24px - Page headers */
--text-4xl: 2.25rem;     /* 36px - Hero text */
```

## Agent Character System

### Sarah (Sales Agent)
```
Portrait: AI_sales_agent_male_cyborg_69e78b01.png
Color: Purple (#8B5CF6)
Voice: Professional
Personality: Persuasive, data-driven
```

### Emma (Receptionist)
```
Portrait: Emma_Receptionist_Professional.png
Color: Cyan (#06B6D4)
Voice: Warm, efficient
Personality: Professional, organized
```

### Ava (Appointment Agent)
```
Portrait: AI_receptionist_female_holographic_589d40b2.png
Color: Green (#10B981)
Voice: Efficient
Personality: Organized, precise
```

### Maya (Follow-Up Agent)
```
Portrait: AI_analytics_agent_data_dashboard_ca6eaa2f.png
Color: Orange (#F59E0B)
Voice: Persuasive
Personality: Analytical, empathetic
```

### Alice (Support Agent)
```
Portrait: AI_customer_service_friendly_smile_0efbdc51.png
Color: Cyan (#06B6D4)
Voice: Friendly
Personality: Patient, solution-focused
```

## Component Design

### Agent Cards
```css
Background: backdrop-blur-xl + bg-black/60
Border: 2px solid rgba(139, 92, 246, 0.3)
Border Radius: 12px (rounded-xl)
Padding: 24px (p-6)
Box Shadow: 0 0 20px rgba(139, 92, 246, 0.5)

Hover: scale(1.02) + increased glow
```

### Voice Interface
```css
- Real-time waveform visualization
- Live transcript with speaker labels
- Sentiment analysis overlay
- Duration timer
- Glassmorphism background
```

### Navigation
```css
Sidebar:
- Background: #0A0B1E
- Width: 240px
- Purple accent on active items
- Border-left glow indicator

Mobile Tab Bar:
- Glassmorphism background
- Purple/cyan active states
- 64px elevated center button
```

## Buttons

### Primary (CTA)
```css
Background: linear-gradient(135deg, #8B5CF6, #EC4899)
Padding: 12px 24px (px-6 py-3)
Border Radius: 8px (rounded-lg)
Shadow: 0 4px 16px rgba(139, 92, 246, 0.4)
```

### Secondary (Outline)
```css
Background: transparent
Border: 2px solid #8B5CF6
Color: #A78BFA
Box Shadow: 0 0 10px rgba(139, 92, 246, 0.3)
```

## Visual Effects

### Allowed Effects
✅ Glassmorphism with backdrop-blur-xl
✅ Neon gradient borders (purple/cyan)
✅ Smooth transitions (200ms ease)
✅ Card elevation on hover
✅ Voice waveform animations
✅ Pulsing glow on active elements

### Performance Rules
- All animations use GPU-accelerated transforms
- No layout shifts from animations
- Particle systems use absolute positioning
- Backdrop filters with WebKit prefix for Safari

## Spacing System

```css
--space-2: 8px     /* Close spacing */
--space-3: 12px    /* Default gap */
--space-4: 16px    /* Card gap */
--space-6: 24px    /* Section padding */
--space-8: 32px    /* Large spacing */
```

## Animation Timing

```css
--transition-fast: 150ms;     /* Hover states */
--transition-base: 200ms;     /* Default */
--transition-slow: 300ms;     /* Complex */
```

## Accessibility

- **Contrast Ratios**: AAA compliance on dark backgrounds
- **Focus States**: 2px purple ring with glow
- **ARIA Labels**: All interactive elements
- **Keyboard Navigation**: Full app navigable
- **Screen Reader**: Semantic HTML5, live regions
- **Reduced Motion**: Respect `prefers-reduced-motion`

## Brand Voice

**Cyber-Elite Language:**
- Agent Studio (not "agent management")
- Command Center (not "dashboard")
- Voice Fleet (agent collection)
- Talk to [Agent] (start conversation)
- Neural Network (AI system)

**Tone**: Futuristic, powerful, professional, voice-first, cutting-edge AI

## Minimalistic Speech Bubble Interface (Shared Agent Landing Page)

### Design Philosophy
A distraction-free, immersive voice experience with a centered speech bubble as the focal point. The interface should feel like a real conversation with a minimalist aesthetic that puts the agent's voice and personality first.

### Layout Structure
```
┌───────────────────────────────────────┐
│         Animated Background           │
│                                       │
│     ┌─────────────────────┐          │
│     │   Agent Avatar +    │          │
│     │   Speech Bubble     │          │
│     │  (center focal pt)  │          │
│     └─────────────────────┘          │
│                                       │
│      [Typewriter Transcript]          │
│     (fades after 5 seconds)           │
│                                       │
│    [Start] [Switch Mode] [End]        │
└───────────────────────────────────────┘
```

### Speech Bubble Design
```css
- Size: Large circular avatar (200-300px)
- Position: Vertically and horizontally centered
- Animation: Subtle pulse when agent is speaking
- Border: Animated gradient ring (purple/cyan) when active
- Shadow: Large soft glow matching agent personality color
- Hover: Slight scale transform (1.05)
```

### Background Animation
```css
- Base: Gradient from deep navy to black
- Particle Field: Floating purple/cyan particles (50-100)
- Movement: Slow drift with parallax effect
- Grid Overlay: Subtle animated grid lines (optional)
- Blur: Radial gradient blur from center outward
```

### Typewriter Transcript
```css
Position: Below speech bubble, center-aligned
Max Width: 600px
Font Size: 18-24px
Font Weight: 500
Color: White with 90% opacity
Background: Semi-transparent dark backdrop (optional)
Animation: 
  - Typewriter effect (50ms per character)
  - Fade in when text appears
  - Auto-fade out after 5 seconds
  - Slide up 20px during fade out
Behavior:
  - Only shows latest agent message
  - Disappears like subtitles
  - No user messages shown (voice-only mode)
```

### Mode Toggle
```css
Position: Bottom center or top-right corner
Options: "Voice Mode" (default) | "Chat Mode"
Style: Pill-shaped toggle button
Visual: 
  - Voice Mode: Microphone icon, purple glow
  - Chat Mode: Message bubble icon, cyan glow
Transition: Smooth fade between modes (300ms)
```

### Voice Mode (Default)
```
- Centered speech bubble with avatar
- Typewriter transcript below (auto-fading)
- Minimal UI (start/end buttons only)
- Full-screen animated background
- No visible chat history
```

### Chat Mode
```
- Speech bubble moves to top
- Chat interface slides up from bottom
- Full conversation history visible
- Transcript becomes part of chat
- Background remains animated but dimmed
```

### Control Buttons
```css
Start Button:
  - Size: Large (160px × 56px)
  - Position: Below transcript area
  - Icon: Microphone
  - Gradient: Purple to violet
  - Label: "Start Conversation"
  - Glow: Pulsing purple shadow

End Button:
  - Size: Medium (120px × 48px)
  - Position: Next to start button
  - Icon: Phone off
  - Gradient: Red to pink
  - Label: "End Call"
  - Visible only when active

Mode Toggle:
  - Size: Small (100px × 36px)
  - Position: Bottom-right corner
  - Style: Outline button
  - Label: "Chat Mode" or "Voice Mode"
```

### Animation Specifications
```css
Speech Bubble Pulse (when speaking):
  - Scale: 1.0 → 1.05 → 1.0
  - Duration: 1.5s
  - Easing: ease-in-out
  - Infinite loop while speaking

Gradient Ring (when speaking):
  - Rotation: 0deg → 360deg
  - Duration: 3s
  - Colors: Purple → Cyan → Purple
  - Width: 4px
  - Blur: 8px

Typewriter Effect:
  - Character delay: 50ms
  - Cursor blink: 500ms
  - Fade in: 200ms
  - Fade out: 800ms (after 5s delay)
  - Slide up: 20px during fade out

Background Particles:
  - Count: 80 particles
  - Size: 2-6px
  - Speed: 10-30s drift
  - Opacity: 10-40%
  - Colors: Purple/Cyan mix
```

### Responsive Behavior
```css
Desktop (>1024px):
  - Avatar: 280px
  - Transcript: 24px font
  - Full particle field

Tablet (768-1024px):
  - Avatar: 220px
  - Transcript: 20px font
  - Reduced particles (50)

Mobile (<768px):
  - Avatar: 180px
  - Transcript: 18px font
  - Minimal particles (30)
  - Buttons stack vertically
```

### Color Palette for Speech Bubble Interface
```css
Primary: #8B5CF6 (Purple)
Secondary: #06B6D4 (Cyan)
Background Start: #0A0B1E (Deep Navy)
Background End: #000000 (Pure Black)
Text: #FFFFFF (White)
Text Muted: rgba(255, 255, 255, 0.7)
Particle: rgba(139, 92, 246, 0.3)
Glow: rgba(139, 92, 246, 0.5)
```
