# Fix Track Organization + Add Mobility/Flexibility + Bruce Lee Icon

## Problems

1. **Forearm Stand and Elbow Stand are separate tracks** — they're both forearm-supported inversions and should be one track
2. **No Mobility & Flexibility track** — flexibility exercises exist but aren't organized into a dedicated track
3. **Handstand track doesn't follow elbow lever** — the progression should flow through elbow lever skills into handstand
4. **Dragon Flag exists but isn't in any meaningful track** — just tagged `general`
5. **No `flag` track defined** despite `flag` being a valid `TrackId` and exercises referencing it
6. **Bruce Lee exercises (Dragon Flag) have no visual credit** — user wants a cute Bruce Lee cartoon icon next to exercises he made famous and all others that are in famous moves then bruce lee categfory and jean claude for splits and so forth for all that you can find online. make this fun and creative and intriguweiung for leanrign 

## Changes

### 1. Merge Forearm Stand + Elbow Stand → "Inversions" track (`src/lib/tracks.ts`)

Combine into a single **"Inversions"** track. Progression:

- Dolphin Pose → Forearm Stand Toe Pulls → Forearm Stand Line Hold → Elbow Stand Wall Hold → Elbow Stand Straddle Entry → Elbow Stand Exit

This makes sense because forearm stand IS an elbow-supported inversion.

### 2. Create "Flag" track (`src/lib/tracks.ts`)

Add the missing track that exercises already reference:

- Dragon Flag → Clutch Flag → Human Flag

Dragon Flag gets re-tagged from `general` to `flag`. The `creator` field gets set to `'Bruce Lee'` on Dragon Flag.

### 3. Create "Mobility & Flexibility" track (`src/lib/tracks.ts`)

New track for dedicated flexibility work:

- Cat-Cow Stretch → Pigeon Pose → Cossack Squat → Pancake Stretch (new exercise) → Middle Split Hold (new exercise) → Needle Pose → Wheel Pose

### 4. Update Handstand track to flow from Elbow Lever (`src/lib/tracks.ts`)

Revised handstand progression:

- Frog Stand → Elbow Lever → Hollow Body Hold → Chest-to-Wall → Straddle Kick-Up → HS Shrugs → Wall Pull-Aways → Bail → Freestanding HS → Bent-Arm Handstand (Tiger Bend)

### 5. Add new exercises (`src/lib/exercises.ts`)

- **Pancake Stretch** — seated straddle fold, flexibility staple
- **Middle Split Hold** — isometric split hold
- Tag Dragon Flag with `creator: 'Bruce Lee'` and add `flag` track

### 6. Bruce Lee cartoon icon (`src/components/shared/ExerciseDetailModal.tsx`)

- Add custom lovable bruce lee martial arts icon (🥋 + custom CSS styling) next to any exercise where `creator === 'Bruce Lee'`
- Show "BRUCE LEE ORIGINAL" badge in editorial style with a cute cartoon silhouette drawn via CSS/SVG (fighting stance, simple shapes)
- Generate a small Bruce Lee cartoon image using AI image generation and store as an asset

### 7. Update types (`src/lib/types.ts`)

- Remove `'forearm-stand'` and `'elbow-stand'` from `TrackId`, add `'inversions'` and `'mobility'`
- Update `Category` to include `'flexibility'` or keep using `'mobility'`

## Files


| File                                            | Change                                                                                                     |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `src/lib/types.ts`                              | Update `TrackId`: remove `forearm-stand`, `elbow-stand`, add `inversions`, `mobility`                      |
| `src/lib/tracks.ts`                             | Merge forearm/elbow → Inversions, add Flag track, add Mobility track, update Handstand progression         |
| `src/lib/exercises.ts`                          | Add Pancake Stretch + Middle Split Hold, re-tag Dragon Flag, update track references on affected exercises |
| `src/components/shared/ExerciseDetailModal.tsx` | Add Bruce Lee cartoon badge for `creator === 'Bruce Lee'` exercises                                        |
| `src/components/sections/ExerciseLibrary.tsx`   | Update filter dropdowns for new track names                                                                |
| Generated asset                                 | Bruce Lee cartoon image via AI image generation                                                            |


**6 files, 0-1 new assets, 0 new dependencies**