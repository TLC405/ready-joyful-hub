

# Add Instagram Reel Exercises + Expand Compression Track + Yoga Integration

## What Changes

### 1. Add `creator` and `instagramUrl` fields to Exercise type

In `src/lib/types.ts`, add two optional fields:
```ts
creator?: string;        // e.g. "@alessiakoff"
instagramUrl?: string;   // direct IG post link
```

### 2. Add `'yoga'` category and `'press'` + `'yoga-flow'` tracks

- `Category`: add `'yoga'`
- `TrackId`: add `'press'` and `'yoga-flow'`

### 3. Add ~18 new exercises to `exercises.ts`

**From your Instagram reels (5 structured exercises from your earlier breakdown):**

| Exercise | Creator | IG Link | Category | Track |
|----------|---------|---------|----------|-------|
| Wall Compression Stretch | @alessiakoff | DVbYLGDjE1T | core | compression, press |
| Elevated Chair Compression Drill | @balancenotion | DUQhN8pFHm9 | core | compression, press |
| Crocodile Pose (One-Arm Balance) | @balancenotion | DUHXfxxiFYL | skills | general |
| HSPU Capacity Builder | @andry_strong | DU5jYLADGCp | push | handstand |
| Band-Assisted Progressions | @cali.maxi | DUB-JFgDZtn | push | general |

**Press Handstand exercises (new):**

| Exercise | Category | Track |
|----------|----------|-------|
| Straddle Press to Handstand | skills | press, handstand, compression |
| Stalder Press to Handstand | skills | press, handstand, compression |

**Yoga poses (new, all with real cues/fail signs):**

| Exercise | Difficulty | Track |
|----------|------------|-------|
| Warrior I | easy | yoga-flow |
| Warrior II | easy | yoga-flow |
| Warrior III | intermediate | yoga-flow |
| Tree Pose | easy | yoga-flow |
| Chair Pose (Utkatasana) | beginner | yoga-flow |
| Child's Pose | easy | yoga-flow |
| Triangle Pose | beginner | yoga-flow |
| Crow Pose | intermediate | yoga-flow, planche |
| Half Moon Pose | intermediate | yoga-flow |
| Wheel Pose (Urdhva Dhanurasana) | advanced | yoga-flow |
| Camel Pose | beginner | yoga-flow |

**Re-tag existing mobility exercises** (Downward Dog, Cobra, Pigeon, Bridge, Cat-Cow) to also belong to `yoga-flow` track.

**Remaining 10 IG links** added as `instagramUrl` on existing or new exercises where they match (shoulder strengtheners → HSPU/handstand exercises, press-to-handstand journey → press exercises, human flag → human-flag exercise, stalder press → stalder exercise, core training → core exercises). Those that are visual-only reference reels get attached to the most relevant exercise.

### 4. Rework Compression Track → Press Handstand Pipeline

Current compression track ends at L-sit. Extend it:

```text
Hollow Body → Seated Pike Lift → Seated Straddle Lift → L-Sit
  → Wall Compression Stretch → Chair Compression Drill
    → Straddle Press to HS → Stalder Press to HS
```

### 5. Add new tracks to `tracks.ts`

**Press Track:**
```text
Wall Compression → Chair Compression → Straddle Press to HS → Stalder Press to HS
```

**Yoga Flow Track:**
```text
Child's Pose → Cat-Cow → Downward Dog → Warrior I → Warrior II
  → Triangle → Tree → Warrior III → Chair Pose → Crow Pose
    → Camel → Half Moon → Bridge → Wheel Pose
```

### 6. Update ExerciseLibrary filters

Add `'yoga'` to category dropdown. Add `'Press'` and `'Yoga Flow'` to track dropdown.

### 7. Update Exercise Detail Modal

Show `creator` credit and `instagramUrl` as a clickable "Watch on Instagram" link when present.

## Files Changed

| File | Change |
|------|--------|
| `src/lib/types.ts` | Add `yoga` category, `press` + `yoga-flow` tracks, `creator` + `instagramUrl` fields |
| `src/lib/exercises.ts` | Add ~18 new exercises, attach IG URLs to relevant exercises, re-tag mobility→yoga-flow |
| `src/lib/tracks.ts` | Add Press track, Yoga Flow track, extend Compression track |
| `src/components/sections/ExerciseLibrary.tsx` | Add yoga category + press/yoga-flow to filter dropdowns, show creator/IG link in modal |
| `src/components/CoachCare/Canvas/ExerciseCanvas.tsx` | Show creator + IG link |

**~5 files, 0 new files, 0 new dependencies**

