

# Real AI Coach + TLC Branding Sweep + Detail Polish

## Overview

Three changes: (1) Replace the hardcoded `generateResponse` with real AI via Lovable AI gateway so the Coach learns context and generates real responses, (2) remove all "Lovable" references and add "Created with TLC" branding throughout, (3) add more polish details.

## 1. Real AI Coach via Edge Function

Create a new edge function `supabase/functions/coach-chat/index.ts` that:
- Uses `LOVABLE_API_KEY` (already configured) to call `https://ai.gateway.lovable.dev/v1/chat/completions`
- System prompt: expert calisthenics coach personality with knowledge of the exercise library, progression chains, and training principles
- Streams responses token-by-token back to the client
- Handles 429/402 errors with friendly messages

### Client-side changes (`CoachCareStudio.tsx`):
- Keep the existing deterministic handlers for URLs, exercise detection, template building, and social search — these are structural commands that open canvas modes
- For **general/conversational messages** that don't match any pattern, call the AI edge function instead of returning random hardcoded responses
- Stream tokens into the chat message for a live typing effect
- Pass recent message history (last 10 messages) as context so the AI maintains conversation continuity
- The Coach personality is read from `localStorage('tlc-coach-personality')` and sent to the edge function

### New streaming utility (`src/components/CoachCare/hooks/useCoachAI.ts`):
- `streamCoachResponse(messages, onDelta, onDone, onError)` function
- Calls the edge function with fetch + SSE parsing
- Handles rate limit and payment errors with toast notifications

## 2. Remove Lovable Branding + Add TLC Branding

| Location | Change |
|----------|--------|
| `vite.config.ts` | Remove `lovable-tagger` import and plugin usage |
| `src/components/layout/Navigation.tsx` | Add "Created with TLC" footer text in sidebar |
| `src/components/CoachCare/Canvas/IdleCanvas.tsx` | Add "Powered by TLC" subtle text |
| `src/components/sections/HeroSection.tsx` | Add "TLC" watermark/badge |
| `src/components/layout/AppShell.tsx` | Add subtle "TLC" footer bar at bottom of all pages |

## 3. Detail Polish

- **IdleCanvas**: Add "TLC COACH" branding with a subtle "AI-Powered" badge
- **ChatPanel header**: Show "TLC COACH · AI" instead of just "COACH CARE"  
- **Navigation footer**: "© 2026 TLC Calisthenics" at bottom of sidebar
- **AppShell**: Thin footer bar with "Created with TLC · AI-Powered Training"

## Files

| File | Change |
|------|--------|
| `supabase/functions/coach-chat/index.ts` | **New** — AI gateway edge function with calisthenics system prompt |
| `src/components/CoachCare/hooks/useCoachAI.ts` | **New** — streaming fetch utility for coach AI |
| `src/components/CoachCare/CoachCareStudio.tsx` | Route general messages through AI, keep structural commands local |
| `src/components/CoachCare/ChatPanel.tsx` | Update header branding to "TLC COACH · AI" |
| `src/components/CoachCare/Canvas/IdleCanvas.tsx` | Add "TLC" branding, "AI-Powered" badge |
| `src/components/layout/Navigation.tsx` | Add "© 2026 TLC" footer in sidebar |
| `src/components/layout/AppShell.tsx` | Add subtle TLC footer bar |
| `vite.config.ts` | Remove lovable-tagger |

**8 files (2 new, 6 modified), 0 new dependencies**

