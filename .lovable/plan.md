

# Fix Clutch Flag + Fill Exercise Gaps + Add Ballet Track + UI Deepening

## Problems Found

1. **Clutch Flag shares the same YouTube URL as Human Flag** (`NWskCNO3rCo`) — needs its own unique video source
2. **20 exercises exist in the data but are NOT assigned to any track** — they're invisible on the Map view (plank, skin-the-cat, push-up, diamond push-up, headstand, back-lever, etc.)
3. **No ballet/dance category or track** — ballet moves (relevé, arabesque, grand plié, développé, etc.) would integrate naturally with the existing mobility, legs, and flexibility content
4. **Category type missing `ballet`** — needs to be added to the `Category` union type and `TrackId` type

## Plan

### 1. Fix Clutch Flag Video (`exercises.ts`)
- Replace the shared Human Flag URL with a dedicated Clutch Flag tutorial video (different YouTube source)
- Ensure `regressTo` includes `dragon-flag` (currently empty)

### 2. Assign All Orphan Exercises to Tracks (`tracks.ts`)
Add these 20 orphaned exercises to their logical tracks:

| Exercise | Track to add to |
|----------|----------------|
| `plank` | `general` (new) or `compression` |
| `push-up`, `diamond-push-up`, `archer-push-up`, `pike-push-up`, `handstand-push-up`, `parallel-bar-dip`, `tiger-bend-pushup` | `planche` (push pipeline) |
| `skin-the-cat`, `pullover`, `back-lever` | `pull-strength` |
| `headstand` | `inversions` |
| `single-arm-elbow-lever` | `handstand` |
| `crocodile-pose` | `handstand` |
| `calf-raise` | `legs` |
| `deep-squat-hold`, `shoulder-dislocate`, `worlds-greatest-stretch` | `mobility` |
| `hspu-capacity-builder`, `band-assisted-progressions` | `press` |

Create a new **Push Strength** track (`push-strength`) to properly house the push-up → HSPU pipeline instead of cramming them into planche.

### 3. Add Ballet Category + Track (`exercises.ts`, `tracks.ts`, `types.ts`)
Add ~12 ballet exercises across all difficulty levels:

- **Easy**: Relevé (calf rises on balls of feet), First Position Plié, Tendu (foot slides)
- **Beginner**: Grand Plié, Port de Bras (arm flow), Passé Balance
- **Intermediate**: Arabesque Hold, Développé (unfolding leg extension), Rond de Jambe
- **Advanced**: Grand Battement, Attitude Hold, Penché (deep arabesque lean)

Each gets:
- Proper `cueStack`, `failSigns`, `doThis` prescription
- YouTube video sources from reputable ballet channels
- Muscle groups, equipment (floor/barre)
- `progressTo`/`regressTo` chains

New track: **Ballet Foundations** — Relevé → Plié → Tendu → Passé → Arabesque → Développé → Attitude → Penché

### 4. Update Types (`types.ts`)
- Add `'ballet'` to `Category` union
- Add `'ballet'` and `'push-strength'` to `TrackId` union

### 5. UI Deepening — Small Touches Across Components

- **VideoPage**: Add a "Related Exercises" row below the accordion showing exercises from the same track — gives context and prevents dead-ends
- **ExerciseBrowser / UnifiedLibrary TV tab**: Add exercise count badge per category filter button
- **ProgressionMap**: Add a subtle completion percentage indicator per track header (counts exercises with video vs total)
- **Navigation**: Add a subtle pulse dot on the Library icon when new exercises are added (stored in localStorage)

## Files

| File | Change |
|------|--------|
| `src/lib/types.ts` | Add `ballet` to Category, `ballet` + `push-strength` to TrackId |
| `src/lib/exercises.ts` | Fix clutch flag video URL + regressTo, add ~12 ballet exercises |
| `src/lib/tracks.ts` | Assign 20 orphans to tracks, add Ballet + Push Strength tracks |
| `src/pages/VideoPage.tsx` | Add "Related Exercises" row, exercise count badges on filters |
| `src/components/sections/UnifiedLibrary.tsx` | Exercise count badges on TV tab category filters |
| `src/components/sections/ProgressionMap.tsx` | Track completion % indicator on headers |

**6 files modified, 0 new files, 0 new dependencies**

