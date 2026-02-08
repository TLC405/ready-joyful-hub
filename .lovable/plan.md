

# Add Planche Progressions + New Track Exercises

## Overview

Add ~18 new exercises with YouTube thumbnails and tutorial links, update ~8 existing exercises with media, and create 3 new track ladders (Forearm Stand, Elbow Stand, Grip). This is a data-layer-heavy change touching 3 files.

## What Already Exists (update with media only)

These exercises are already in the library and just need `thumbnailUrl` and `videoUrl` fields added:

- `pseudo-planche-push-up` -- add thumbnail + video
- `planche-lean` -- add thumbnail + video
- `tuck-planche` -- add thumbnail + video
- `chest-to-wall-handstand` -- add thumbnail + video (matches "Handstand Wall Drills")
- `wall-pull-aways` -- add thumbnail + video (matches "Handstand Pull-Aways")
- `ring-support-hold` -- add thumbnail + video
- `rto-support-hold` -- add thumbnail + video
- `ring-row` -- add thumbnail + video (matches "Ring Rows")
- `ring-dip` -- add thumbnail + video
- `seated-straddle-lift` -- add thumbnail + video (matches "Seated Straddle Compression Lifts")
- `pistol-squat` -- add thumbnail + video
- `nordic-curl` -- add thumbnail + video
- `calf-raise` -- add thumbnail + video
- `l-sit` -- add thumbnail + video

## New Exercises to Add (18 entries)

### Handstand Track additions
1. `straddle-hs-kick-up` -- Straddle Handstand Kick-Ups (beginner, inversion control)
2. `handstand-bail` -- Handstand Exits / Bail-Outs (intermediate, inversion control)

### Forearm Stand (Pincha) Track (entirely new)
3. `dolphin-pose` -- Dolphin Pose / Pincha Prep (easy, mobility)
4. `forearm-stand-toe-pulls` -- Forearm Stand Toe Pulls (intermediate, skills)
5. `forearm-stand-line-hold` -- Forearm Stand Line Holds (advanced, skills)

### Elbow Stand Track (entirely new)
6. `elbow-stand-wall-hold` -- Elbow Stand Wall Holds (beginner, skills)
7. `elbow-stand-straddle-entry` -- Elbow Stand Straddle Leg Entry (intermediate, skills)
8. `elbow-stand-exit` -- Elbow Stand Exits / Safe Dismounts (intermediate, skills)

### Grip Track (entirely new)
9. `dead-hang` -- Dead Hangs (easy, pull)
10. `towel-hang` -- Towel Hangs (beginner, pull)
11. `extensor-band` -- Extensor Band Exercises (easy, mobility, equipment: resistance band)

### Compression additions
12. `seated-pike-lift` -- Seated Pike Compression Lifts (beginner, core)

### Legs additions
13. `lunge` -- Lunges / Bodyweight Lunges (easy, legs)
14. `cossack-squat` -- Cossack Squats (beginner, legs)

## New Tracks to Add

### Forearm Stand Track
`id: 'forearm-stand'`
Nodes: dolphin-pose -> forearm-stand-toe-pulls -> forearm-stand-line-hold

### Elbow Stand Track
`id: 'elbow-stand'`
Nodes: elbow-stand-wall-hold -> elbow-stand-straddle-entry -> elbow-stand-exit

### Grip Track
`id: 'grip'`
Nodes: dead-hang -> towel-hang -> extensor-band (parallel node, no prereq on towel-hang)

## Files to Change

### 1. `src/lib/types.ts`
- Add `'forearm-stand' | 'elbow-stand' | 'grip'` to `TrackId` type

### 2. `src/lib/exercises.ts`
- Add `thumbnailUrl` and `videoUrl` to the 14 existing exercises listed above
- Add 14 new exercise entries with full Exercise card data (id, name, category, difficulty, muscles, equipment, tracks, shortPurpose, description, doThis, cueStack, failSigns, regressTo, progressTo, thumbnailUrl, videoUrl)
- Each new exercise follows the established content standard (3 cues max, 3 fail signs max, coach-tone descriptions)

### 3. `src/lib/tracks.ts`
- Add 3 new track definitions (Forearm Stand, Elbow Stand, Grip) with nodes and unlock tests
- Update Handstand track to include `straddle-hs-kick-up` and `handstand-bail` as new nodes
- Update Compression track to include `seated-pike-lift` as a node
- Update Legs track to include `lunge` and `cossack-squat` as nodes

### 4. `src/components/sections/ExerciseLibrary.tsx`
- Add `'forearm-stand'`, `'elbow-stand'`, and `'grip'` to the `trackFilters` array so users can filter by the new tracks

### 5. `src/components/sections/TrackLadder.tsx`
- Add icon mappings for the 3 new tracks (e.g., `Hand` for Forearm Stand, `Triangle` for Elbow Stand, `Grip` for Grip)

## Content Standard for New Entries

Every new exercise follows the existing pattern:
- `shortPurpose`: 1 line, action-oriented
- `description`: 2-3 sentences, calm and technical
- `doThis`: realistic sets/reps/hold ranges
- `cueStack`: max 3 bullets, concrete body cues
- `failSigns`: max 3 bullets, observable failures
- `regressTo` / `progressTo`: linked to existing exercise IDs where possible
- `thumbnailUrl`: YouTube thumbnail from user's list
- `videoUrl`: YouTube tutorial URL from user's list

## What Does NOT Change

- No exercises removed
- No existing exercise data modified (beyond adding media URLs)
- No UI layout or styling changes
- All existing tracks preserved as-is

