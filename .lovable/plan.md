

# Clickable Exercises Everywhere + Mobile Overflow Fix + Progression UX Upgrade

## Problems

1. **Track Ladder nodes aren't clickable** — tapping an exercise in Tracks does nothing, no detail view opens
2. **Home featured cards** navigate to Library instead of opening the exercise detail
3. **Horizontal overflow on mobile** — the app can scroll sideways, showing empty space
4. **Progression info is hidden** — unlock requirements and progress aren't visible enough

## Changes

### 1. Shared Exercise Detail Modal (new file)

Create `src/components/shared/ExerciseDetailModal.tsx` — extract the existing `ExerciseDetailModal` from `ExerciseLibrary.tsx` into its own shared component. Every page imports and uses the same modal.

### 2. Make Track Ladder nodes open the modal

In `TrackLadder.tsx`:
- Add `selectedExercise` state
- On node click (when not locked), call `setSelectedExercise(exercise)`
- Render the shared modal
- Show unlock progress bar on each node (e.g., "2/3 sets logged toward unlock")

### 3. Make Home featured cards open the modal

In `Index.tsx`:
- Add `selectedExercise` state
- Featured card `onClick` → open modal instead of navigating to library
- Import shared modal

### 4. Fix mobile horizontal overflow

In `src/index.css` or `AppShell.tsx`:
- Add `overflow-x: hidden` to `html` and `body`
- Audit any elements with negative margins (`-mx-4`, `-mx-8`) that cause overflow — constrain them with `overflow-hidden` on parent

In `ExerciseLibrary.tsx`:
- The sticky filter bar uses `-mx-4` / `-mx-8` which can cause horizontal scroll — wrap in `overflow-hidden` container

### 5. Upgrade progression display on Track nodes

In `TrackLadder.tsx`, for each node:
- Show a mini progress indicator (e.g., "2/3 qualifying sets") when in `try_mode` or `preview`
- Add a tap hint (subtle arrow or "Tap to view") for unlocked/try_mode exercises
- Locked nodes show what's needed: "Unlock [prerequisite] first"

## Files

| File | Action |
|------|--------|
| `src/components/shared/ExerciseDetailModal.tsx` | **New** — extracted shared modal |
| `src/components/sections/ExerciseLibrary.tsx` | Remove inline modal, import shared one; fix overflow on filter bar |
| `src/components/sections/TrackLadder.tsx` | Add click → open modal; show progression info on nodes |
| `src/pages/Index.tsx` | Featured cards open modal instead of navigating |
| `src/components/layout/AppShell.tsx` | Add `overflow-x-hidden` to root container |

**5 files, 1 new, 0 new dependencies**

