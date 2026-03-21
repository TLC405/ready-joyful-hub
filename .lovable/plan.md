

# CoachCare Editorial Restyle + Notebook Feel + Atomic Sweep

## Overview

Restyle all CoachCare components to match the newspaper editorial brutalism design system. Add a "training notebook" feel across the app — ruled-line textures, handwritten-style annotations, log-like layouts. Fix critical issues (AnalyticsCanvas using old blue colors, DocumentCanvas using `prose-invert` in light theme, rounded corners everywhere contradicting editorial flat style).

## 1. CSS: Add Notebook Utilities (`src/index.css`)

Add new utility classes:
- `.notebook-ruled` — repeating horizontal lines background (like ruled paper), subtle gray, 1.5rem spacing
- `.notebook-margin` — left red vertical margin line (classic notebook)
- `.notebook-entry` — bordered-bottom entry row with timestamp feel
- Update `.surface-raised` border-radius references: everything goes `rounded-none` or `rounded-sm` max

## 2. CoachCareStudio.tsx — Editorial Frame

- Remove `rounded-2xl` from ResizablePanelGroup → `rounded-none`
- Mobile drawer: `rounded-t-2xl` → `rounded-none`, add top border instead
- Mobile canvas trigger button: square, bordered, not rounded-full

## 3. ChatPanel.tsx — Notebook Chat Log

- Header: Replace `badge-coin rounded-lg bg-primary` icon with flat bordered square, red text "COACH CARE" with `.text-label` style
- Messages area: Add `notebook-ruled` background so messages sit on "ruled paper"
- Add a date separator between messages: thin divider + small caps timestamp

## 4. ChatMessage.tsx — Editorial Bubbles

- Replace `rounded-2xl` with `rounded-none` (sharp rectangular)
- Coach messages: white bg, thin black border (flat card). No `surface-raised` gradients
- User messages: solid red bg stays, but sharp corners
- Type badges: add thin left border accent instead of inline icon label
- "Open on Canvas →" link: red text, uppercase, editorial style

## 5. ChatInput.tsx — Notebook Input

- Replace `surface-inset rounded-xl` input container with flat bordered, no radius
- Quick action buttons: squared, thin border, editorial hover (bg-foreground text-card)
- Send button: squared, not rounded-lg

## 6. IdleCanvas.tsx — Editorial Action Grid

- Remove emoji from heading. Use "WHAT SHOULD WE WORK ON?" in `.text-editorial-sm`
- Action cards: `rounded-xl` → `rounded-none`, thin border, newspaper column divider between them
- Remove `surface-inset rounded-xl` from icon containers → flat bordered square
- whileHover: just border-color change to primary, no y translation

## 7. VideoCanvas.tsx — Editorial Analysis

- `rounded-xl` → `rounded-none` everywhere
- Analysis card: thin black borders, red section headers
- Score badge: rectangular, bordered, not rounded-full

## 8. ExerciseCanvas.tsx — Already close, minor fixes

- `rounded-xl` → `rounded-none` or `rounded-sm`
- `rounded-full` badges → rectangular
- Image container: no rounded, hard crop

## 9. TemplateCanvas.tsx — Notebook Workout Log

- Template blocks: look like notebook entries with ruled-line feel
- Number badges: square, not rounded-full
- Input fields: flat bordered, no radius
- "ADD EXERCISE" button: editorial bordered, full-width

## 10. DocumentCanvas.tsx — Notebook Editor

- Remove `prose-invert` (breaks light theme)
- Flat bordered toolbar and content area
- Edit/Preview toggle: editorial tab style (bg-foreground text-card for active)

## 11. AnalyticsCanvas.tsx — Fix Colors + Editorial

- Replace all hardcoded blue `hsl(220, 70%, 55%)` with red primary `hsl(0, 65%, 42%)`
- COLORS array: use editorial palette (red, black, muted gray, amber, dark green)
- Tooltip: use `bg-card border-foreground/15` (not dark theme hardcoded)
- Cards: `rounded-xl` → `rounded-none`
- Grid lines: use `foreground/10` not hardcoded dark values

## 12. Atomic Sweep — Other Components

Audit remaining components for stale styles:
- **HeroSection.tsx**: Already editorial, fine
- **Navigation.tsx**: Already editorial, fine
- **ProgressDashboard.tsx**: Check for any remaining `rounded-xl` → `rounded-sm`
- **SettingsPanel.tsx**: Check rounded corners on form groups
- **ExerciseLibrary.tsx**: Check for remaining old styles

## Files Changed

| File | Change |
|------|--------|
| `src/index.css` | Add notebook utilities (ruled lines, margin, entry) |
| `src/components/CoachCare/CoachCareStudio.tsx` | Remove rounded corners, editorial frame |
| `src/components/CoachCare/ChatPanel.tsx` | Notebook ruled background, editorial header |
| `src/components/CoachCare/ChatMessage.tsx` | Sharp rectangles, editorial type badges |
| `src/components/CoachCare/ChatInput.tsx` | Flat bordered input, square buttons |
| `src/components/CoachCare/Canvas/IdleCanvas.tsx` | Editorial grid, no emoji, flat cards |
| `src/components/CoachCare/Canvas/VideoCanvas.tsx` | Sharp corners, editorial analysis cards |
| `src/components/CoachCare/Canvas/ExerciseCanvas.tsx` | Minor corner/badge fixes |
| `src/components/CoachCare/Canvas/TemplateCanvas.tsx` | Notebook entry style blocks |
| `src/components/CoachCare/Canvas/DocumentCanvas.tsx` | Fix prose-invert, flat borders |
| `src/components/CoachCare/Canvas/AnalyticsCanvas.tsx` | Fix blue→red colors, editorial cards |
| `src/components/sections/ProgressDashboard.tsx` | Corner radius sweep |
| `src/components/sections/SettingsPanel.tsx` | Corner radius sweep |

**13 files, 0 new files, 0 new dependencies**

