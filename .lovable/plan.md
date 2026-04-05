
# TLC TV — Exercise Video System

## Architecture

### 1. Video Data Model (Hybrid)

**Hardcoded defaults** — Add `videoSources` array to exercises in `exercises.ts`:
```ts
videoSources?: {
  platform: 'youtube' | 'instagram' | 'x' | 'facebook';
  url: string;
  label?: string; // e.g. "Front Angle", "Slow Mo"
  primary?: boolean;
}[];
```

**Database overlay** — Create `exercise_videos` table in Lovable Cloud for community/user-submitted videos that merge with hardcoded ones at runtime.

### 2. Dedicated Video Page (`/video/:exerciseId`)

A full route at `/video/:exerciseId` that shows:
- **TLC TV Notebook Player** — Video in a ruled-paper frame with handwritten-style coaching annotations
- Exercise name, difficulty badge, description
- Cue stack displayed as margin notes alongside the video
- Fail signs as red-flagged annotations
- "MORE ANGLES" expandable section showing alternate platform sources
- Progression links (regress/progress to) as navigable cards below

### 3. TLC TV Notebook Player Component

New `TLCNotebookPlayer.tsx`:
- Ruled-line background texture (CSS repeating-linear-gradient)
- Red margin line on the left
- Video iframe embedded in a "taped-in" style frame
- Platform badge (YT/IG/X/FB icon) in corner
- Coaching cues appear as handwritten margin notes
- Exercise title in chalk/handwriting font above
- "TLC TV" brand tag in red, top-right corner

### 4. Multi-Source "More Angles" Panel

Below the primary video:
- Horizontal row of thumbnail cards, one per alternate source
- Each shows platform icon + label
- Tapping swaps the primary player source
- Editorial flat borders, notebook ruled lines continue

### 5. Populate Video URLs

Research and add real YouTube tutorial URLs for common calisthenics exercises. For IG links, use the user's existing IG posts. For exercises without videos, show "VIDEO COMING SOON" placeholder in notebook style.

### 6. Exercise Cards — Play Button

On all exercise cards (library, featured, track nodes), add a small Play triangle overlay. Tapping it navigates to `/video/:exerciseId` instead of opening the detail modal. The detail modal also gets a "WATCH ON TLC TV" button that links to the video page.

## Files

| File | Action |
|------|--------|
| `src/lib/types.ts` | Add `VideoSource` type and `videoSources` field to `Exercise` |
| `src/lib/exercises.ts` | Add `videoSources` arrays with real YouTube/IG URLs to exercises |
| `src/components/shared/TLCNotebookPlayer.tsx` | **New** — notebook-style video player |
| `src/pages/VideoPage.tsx` | **New** — dedicated `/video/:exerciseId` route |
| `src/App.tsx` | Add `/video/:exerciseId` route |
| `src/components/shared/ExerciseDetailModal.tsx` | Add "WATCH ON TLC TV" button |
| `src/pages/Index.tsx` | Add play button overlay to featured cards |
| `src/components/sections/ExerciseLibrary.tsx` | Add play button to library cards |
| DB migration | Create `exercise_videos` table for community submissions |

**9 files, 2 new components, 1 new page, 1 migration**
