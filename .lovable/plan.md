

# STACKED -- Design System + Layout Shell + Component Reskin + Progression Engine

This is a 4-layer build that establishes a complete design foundation, wraps the app in a HUD-style layout shell, reskins every component to use shared tokens, and adds the client-side progression engine.

---

## Layer 1: Global Design Tokens + Utility Classes

**File: `src/index.css`**

Expand the existing CSS variables with new spatial, typographic, and surface tokens:

- **Spacing scale**: `--space-xs` through `--space-3xl` (4px to 64px) mapped to consistent padding/margins
- **Type scale**: `--text-xs` through `--text-display` with matching line-heights and letter-spacing values
- **Surface tokens**: `--surface-0` (darkest, app bg), `--surface-1` (card), `--surface-2` (elevated card), `--surface-3` (modal/popover) with increasing lightness
- **Border tokens**: `--border-subtle` (hsla 6% opacity), `--border-default` (current), `--border-active` (primary)
- **HUD-specific tokens**: `--grid-color`, `--scanline-opacity`, `--grid-size`

**File: `tailwind.config.ts`**

Map new tokens into Tailwind:
- Add `surface-0/1/2/3` to colors referencing the CSS variables
- Add `spacing` entries for the spatial scale
- Add `fontSize` entries for the type scale

New utility classes in `src/index.css`:
- `.hud-grid` -- repeating CSS grid lines using `--grid-color` and `--grid-size`
- `.scanline` -- pseudo-element overlay with repeating horizontal lines at very low opacity
- `.surface-glass` -- backdrop-blur + surface-1 at 85% opacity + border-subtle
- `.surface-elevated` -- surface-2 + shadow-premium
- `.text-label` -- font-chalk + text-xs + tracking-widest + uppercase (for all section labels)
- `.text-heading` -- font-chalk + responsive size + tracking-tight
- `.accent-line` -- 2px bottom border that animates width on hover (replaces repeated inline hover patterns)

---

## Layer 2: Layout Shell

**New file: `src/components/layout/AppShell.tsx`**

A wrapper component applied at the app root (`Index.tsx`) that provides:

- A full-viewport background layer with the `.hud-grid` pattern (subtle blueprint grid lines)
- An optional `.scanline` overlay (thin horizontal lines at ~2% opacity for CRT/technical feel)
- A noise texture using a tiny inline SVG filter (`feTurbulence`) at very low opacity for surface grain
- Corner "bracket" decorations (4 L-shaped SVG elements in corners, like a targeting HUD)
- The main content area passes through as `children`

This component wraps `<main>` in `Index.tsx`, so every section automatically gets the background treatment without touching individual section files.

**Edit: `src/pages/Index.tsx`**

- Import and wrap content in `<AppShell>`
- The existing `<main className="lg:pl-20">` moves inside AppShell

---

## Layer 3: Component Reskin (using shared tokens)

All components switch from ad-hoc color values to the new token classes. No layout or logic changes.

### `src/components/layout/Navigation.tsx`
- Desktop nav background: `surface-glass` instead of `bg-card/95 backdrop-blur-xl`
- Logo badge: add a subtle `border border-primary/30` for more definition
- Tooltip popover: use `surface-elevated` class
- Mobile overlay: use `surface-glass` with full opacity

### `src/components/sections/HeroSection.tsx`
- Remove the inline `backgroundImage` style for the grid -- it now comes from AppShell
- Badge: use `.text-label` utility
- Stats cards: use `surface-elevated` class, replace inline border logic with token classes
- Headline: use `.text-heading` utility

### `src/components/sections/ExerciseLibrary.tsx`
- Section header badge: `.text-label`
- Search bar: `surface-glass` instead of `border border-border bg-card`
- Filter buttons: standardize to use `surface-0` (inactive) and `bg-primary` (active)
- Exercise cards: `surface-elevated` + `.accent-line` for hover bottom border
- Detail modal backdrop: consistent with AppShell surface treatment

### `src/components/sections/TrackLadder.tsx`
- Track selector buttons: same filter-button pattern as Library
- Track info card: `surface-elevated`
- Ladder nodes: use surface tokens for different unlock states
- Vertical line: use `--border-default` color

### `src/components/sections/ProgressDashboard.tsx`
- All stat cards: `surface-elevated`
- Streak card (featured): `surface-elevated` + `border-primary`
- Activity calendar cells: use primary token consistently
- Achievement grid: `surface-elevated` for unlocked, `surface-0` + opacity for locked

### `src/components/sections/AdminPanel.tsx`
- Stat cards: `surface-elevated`
- Form container: `surface-elevated`
- Select/Input/Textarea: consistent `bg-surface-0 border-border focus:border-primary`
- History cards: `surface-glass`

### `src/components/sections/SkillsLibrary.tsx`
- Cards: `surface-elevated` + `.accent-line`
- Filter bar: `surface-glass`

### `src/components/sections/skills/SkillDetailModal.tsx`
- Modal card: `surface-elevated`
- Tab content blocks: consistent surface tokens
- Movement briefing cards: `surface-glass`

---

## Layer 4: Progression Engine

This is the client-side state machine that tracks unlock states, enforces Try Mode guardrails, and handles graduation checks. All local state for now (no database), designed to be swapped to Supabase later.

### New file: `src/lib/progression-engine.ts`

Core module containing:

**Types:**
```text
ProgressionState {
  unlockedExercises: Map<exerciseId, UnlockState>
  exerciseLogs: ExerciseLog[]
  tryModeState: Map<exerciseId, TryModeRecord>
  softLocks: Map<exerciseId, { until: Date; reason: string }>
}

ExerciseLog {
  exerciseId: string
  date: Date
  sets: number
  reps?: number
  holdSec?: number
  qualityScore: 1-5
  painScore: 0-10
  notes?: string
}

TryModeRecord {
  setsUsedToday: number
  lastSessionDate: Date
  qualityFailCount: number
  painFlagCount: number
}
```

**Functions:**

- `initProgressionState(tracks)` -- Seeds initial state: first node of each track = unlocked, rest based on prereqs
- `getExerciseState(exerciseId)` -- Returns current UnlockState accounting for soft locks
- `canAttemptExercise(exerciseId)` -- Checks if user can log (respects Try Mode caps and soft locks)
- `logExercise(log: ExerciseLog)` -- Records a set, updates Try Mode counters
- `checkTryModeGuardrails(exerciseId, log)` -- Enforces:
  - Max 2 sets per session in try_mode
  - Max 10-15 sec hold or 3 reps per set
  - If quality < 3 twice: auto-regress + 72-hour soft lock
  - If pain > 3/10: auto-regress + 72-hour soft lock
  - Returns `{ allowed: boolean; reason?: string; action?: 'regress' | 'soft_lock' }`
- `checkGraduation(exerciseId)` -- Checks if the unlock test for the next node is met based on logged data (e.g., "held 30 sec for 3 sets" meets a hold test)
- `graduateExercise(exerciseId)` -- Moves next node from locked/preview to unlocked, returns the newly unlocked exercise

### New file: `src/hooks/use-progression.ts`

React hook wrapping the engine:

- `useProgression()` returns:
  - `state: ProgressionState`
  - `getState(exerciseId): UnlockState`
  - `canAttempt(exerciseId): boolean`
  - `logSet(log): { success: boolean; message?: string; graduated?: string }`
  - `getSoftLock(exerciseId): { until: Date; reason: string } | null`
- Uses `useState` + `localStorage` persistence (serializes/deserializes on mount)
- Exposes a `reset()` function for development

### Edit: `src/components/sections/TrackLadder.tsx`

- Replace `getMockUnlockState()` with `useProgression().getState(exerciseId)`
- Each node shows real state from the engine
- Clicking an unlocked/try_mode node could open the exercise detail

### Edit: `src/components/sections/ExerciseLibrary.tsx`

- Import `useProgression`
- Show unlock state badge on each exercise card (small icon in corner)
- In the detail modal, show a "LOG SET" button for unlocked exercises
- For try_mode exercises, show remaining attempts ("1/2 sets remaining")
- For locked exercises, show what's needed to unlock

---

## File Summary

| File | Action |
|------|--------|
| `src/index.css` | Edit -- add tokens, utility classes |
| `tailwind.config.ts` | Edit -- map new tokens |
| `src/components/layout/AppShell.tsx` | Create -- layout shell with HUD grid, scanlines, noise |
| `src/pages/Index.tsx` | Edit -- wrap in AppShell |
| `src/components/layout/Navigation.tsx` | Edit -- use surface tokens |
| `src/components/sections/HeroSection.tsx` | Edit -- use tokens, remove inline grid |
| `src/components/sections/ExerciseLibrary.tsx` | Edit -- tokens + progression integration |
| `src/components/sections/TrackLadder.tsx` | Edit -- tokens + progression integration |
| `src/components/sections/ProgressDashboard.tsx` | Edit -- surface tokens |
| `src/components/sections/AdminPanel.tsx` | Edit -- surface tokens |
| `src/components/sections/SkillsLibrary.tsx` | Edit -- surface tokens |
| `src/components/sections/skills/SkillDetailModal.tsx` | Edit -- surface tokens |
| `src/lib/progression-engine.ts` | Create -- state machine, guardrails, graduation |
| `src/hooks/use-progression.ts` | Create -- React hook with localStorage |

**Total: 3 new files, 11 edited files**

## What Does NOT Change
- Exercise data (`exercises.ts`), track data (`tracks.ts`), types (`types.ts`) -- untouched
- Skills data (`skills-data.ts`) -- untouched
- All shadcn/ui primitives -- untouched
- Routing, React Query setup, toasters -- untouched
- Framer Motion animations -- preserved, just restyled

