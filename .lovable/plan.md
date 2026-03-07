

# Skeuomorphic Visual Overhaul + Coach Care Studio

## Part 1: Brutal Elegant Skeuomorphism — Design System

### New CSS Tokens and Utilities (`src/index.css`)

Add skeuomorphic utility classes that create physical depth:

```css
/* Raised surface — like a physical button/card sitting above the desk */
.surface-raised {
  background: linear-gradient(180deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-1)) 100%);
  box-shadow: 
    0 1px 0 0 hsla(var(--foreground), 0.05) inset,   /* top bevel highlight */
    0 -1px 0 0 hsla(0, 0%, 0%, 0.15) inset,          /* bottom inner shadow */
    0 4px 12px hsla(0, 0%, 0%, 0.3),                   /* drop shadow */
    0 1px 3px hsla(0, 0%, 0%, 0.2);
  border: 1px solid hsla(var(--foreground), 0.06);
}

/* Pressed/inset — like a recessed input or indicator well */
.surface-inset {
  background: hsl(var(--surface-0));
  box-shadow: 
    0 2px 4px hsla(0, 0%, 0%, 0.3) inset,
    0 1px 2px hsla(0, 0%, 0%, 0.2) inset;
  border: 1px solid hsla(0, 0%, 0%, 0.15);
}

/* Embossed text */
.text-embossed {
  text-shadow: 0 1px 0 hsla(var(--foreground), 0.1), 0 -1px 0 hsla(0, 0%, 0%, 0.3);
}

/* Brushed metal texture overlay */
.texture-brushed { ... }
```

The light theme gets inverse bevels (light highlights on top, dark shadows below).

### Component Upgrades

Every card, button, stat block, nav item, filter bar, modal, badge, and table gets the skeuomorphic treatment:

| Element | Treatment |
|---------|-----------|
| **Cards** (stat cards, achievement cards, exercise cards) | `surface-raised` with top bevel highlight, physical drop shadow, subtle gradient |
| **Navigation sidebar** | Brushed metal texture, active item gets `surface-inset` pressed state |
| **Buttons** | Raised 3D with pressed `:active` state that shifts shadow inward |
| **Filter dropdowns & search** | `surface-inset` recessed wells, raised dropdown arrows |
| **Table rows** | Subtle inner shadow on header, separator lines with bevel |
| **Progress bars** | Inset track with raised glossy fill bar |
| **Badges** (difficulty, status) | Embossed with inner glow and slight bevel |
| **Modals** | Deep layered shadow (4+ shadow layers), beveled close button |
| **Tab triggers** | Raised inactive, pressed active state |
| **Activity calendar cells** | Inset wells, active cells raised with glow |
| **Achievement badges** | Coin-like circular bevel with metallic gradient |

### Files Changed for Skeuomorphism
- `src/index.css` — New utility classes, updated shadow/surface tokens
- `src/components/layout/Navigation.tsx` — Pressed active states, brushed sidebar
- `src/components/layout/AppShell.tsx` — Richer background texture
- `src/components/sections/HeroSection.tsx` — Raised stat cards, embossed headings
- `src/components/sections/ExerciseLibrary.tsx` — Inset search/filters, raised cards, beveled table
- `src/components/sections/TrackLadder.tsx` — Raised track items, inset track line
- `src/components/sections/ProgressDashboard.tsx` — Raised stats, inset progress tracks, coin achievements
- `src/components/sections/AdminPanel.tsx` — Raised stat cards, inset form fields
- `src/components/sections/SkillsLibrary.tsx` — Raised skill cards, beveled filter pills
- `src/components/sections/skills/SkillDetailModal.tsx` — Deep shadow modal, raised tab triggers
- `src/pages/Index.tsx` — Featured cards get raised treatment

---

## Part 2: Coach Care Studio — Split-Pane AI Workspace

### New Navigation Tab
Add "COACH" tab to Navigation between TRACKS and PROGRESS (using `MessageSquare` icon).

### File Structure
```
src/components/CoachCare/
├── CoachCareStudio.tsx     — Main split-pane (ResizablePanel)
├── ChatPanel.tsx           — Messages + smart input
├── ChatMessage.tsx         — Rich typed message bubbles
├── ChatInput.tsx           — Input + action buttons + URL detection
├── Canvas/
│   ├── CanvasRouter.tsx    — Switches canvas mode
│   ├── IdleCanvas.tsx      — Quick-action card grid
│   ├── VideoCanvas.tsx     — YouTube/IG/TikTok embed
│   ├── ExerciseCanvas.tsx  — Exercise detail from database
│   ├── TemplateCanvas.tsx  — Workout template builder
│   ├── DocumentCanvas.tsx  — Editable markdown doc
│   └── AnalyticsCanvas.tsx — Recharts dashboard
├── hooks/
│   ├── useCanvasState.ts   — Canvas mode + data state
│   └── useChatHistory.ts   — localStorage-persisted messages
└── types.ts                — All interfaces
```

### Layout
Desktop: `ResizablePanelGroup` with chat (35% default) and canvas (65%), resizable handle between them.

Mobile: Chat fills the screen, canvas opens as a `vaul` drawer from bottom.

### Chat Intelligence (Prototype)
Smart pattern matching for polished prototype responses:

- Paste YouTube/IG/TikTok URL → Detects platform, opens VideoCanvas with embed, returns mock form analysis
- Type exercise name (fuzzy matched against `exerciseDatabase`) → Opens ExerciseCanvas with full detail
- "build me a [X] template/program" → Opens TemplateCanvas with pre-filled blocks from exercise database
- "show my stats/progress" → Opens AnalyticsCanvas with mock recharts
- "write/create [document]" → Opens DocumentCanvas
- General fitness questions → Smart contextual text responses referencing canvas state

### Canvas Modes

1. **Idle** — 6 quick-action cards in a grid ("Analyze Video", "Build Program", "Create Template", "Explore Exercise", "View Stats", "Search Social")
2. **Video** — iframe embed + mock timestamp analysis overlay
3. **Exercise** — Full exercise card from database (reuses existing detail layout)
4. **Template** — Draggable blocks (exercise name, sets, reps, rest, notes) with add/remove/reorder. Save to localStorage
5. **Document** — Textarea with markdown preview (split or toggle). Generated content from chat
6. **Analytics** — Recharts area/bar/donut charts with mock training data

### Rich Message Types
Messages render as typed cards:
- `text` — Normal bubble
- `video-card` — Thumbnail + "Open on Canvas →"
- `exercise-card` — Mini card with difficulty badge + "Explore →"
- `template-preview` — Block count summary + "Open Builder →"
- `chart` — Inline sparkline + "Full View →"

### Two-Way Sync
- Clicking a quick action on canvas sends a contextual message to chat
- Chat responses can update canvas state
- Editing template blocks on canvas reflects in chat log

---

## Implementation Order (within one pass)

1. CSS skeuomorphic utilities + updated tokens in `index.css`
2. `AppShell.tsx` + `Navigation.tsx` — structural skeuo + new Coach tab
3. All section components — apply raised/inset/embossed treatments
4. Coach Care types + hooks
5. Chat components (ChatPanel, ChatInput, ChatMessage)
6. Canvas components (CanvasRouter, all 6 canvas modes)
7. CoachCareStudio main layout
8. Wire into Index.tsx routing

## Summary

**~18 files changed/created, 0 new dependencies** (uses existing `react-resizable-panels`, `vaul`, `recharts`, `framer-motion`). All AI responses are smart hardcoded prototype — no backend needed.

