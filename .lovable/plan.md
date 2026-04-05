

# Fix "Find a Video" + Clickable Category Cards + More Visuals

## Problems

1. **"Find a video" doesn't work in Coach** — The coach correctly detects the query and opens `SocialCanvas` with a query string, but `SocialCanvas` never auto-triggers search on mount. It initializes with `results: []` and waits for the user to manually click "GO". Fix: add a `useEffect` that fires `handleSearch` when the component mounts with a non-empty query and empty results.

2. **Category cards on Home do nothing** — The 4 cards (Calisthenics, Yoga, Ballet, Mobility) are plain `div`s with no `onClick`. They should navigate to the Library tab with that category pre-selected.

3. **More visuals needed** — Category cards should show thumbnail previews from exercises in that category, and the SocialCanvas results need richer visual treatment.

## Changes

### 1. Fix SocialCanvas Auto-Search (`SocialCanvas.tsx`)
- Add `useEffect` that calls `handleSearch(data.query)` when component mounts with a query but no results
- This makes "find a video of planche" immediately show results on the canvas

### 2. Make Category Cards Navigate to Library (`HeroSection.tsx` + `Index.tsx`)
- Accept an `onCategoryClick` prop in `HeroSection`
- Each card calls `onCategoryClick('calisthenics')` etc.
- In `Index.tsx`, wire this to set `activeSection` to `'library'` and pass a `defaultCategory` filter to `UnifiedLibrary`
- Add thumbnail images to each card: pick one representative exercise per category and show its YouTube thumbnail as a background

### 3. Add Visual Thumbnails to Category Cards (`HeroSection.tsx`)
- For each category, pick the first exercise that has a YouTube URL and extract the video ID for a thumbnail background
- Show the thumbnail as a blurred background behind the emoji/label for a rich visual card

### 4. Visual Polish on SocialCanvas (`SocialCanvas.tsx`)
- Add a subtle entrance animation on search trigger
- Show a "No results? Try these:" section with exercise-based suggestions when search returns few results
- Larger thumbnail cards with channel avatars

## Files

| File | Change |
|------|--------|
| `src/components/CoachCare/Canvas/SocialCanvas.tsx` | Add `useEffect` auto-search on mount, richer result cards |
| `src/components/sections/HeroSection.tsx` | Add `onCategoryClick` prop, thumbnail backgrounds on cards |
| `src/pages/Index.tsx` | Wire category click to Library nav with filter, pass `defaultCategory` |
| `src/components/sections/UnifiedLibrary.tsx` | Accept optional `defaultCategory` prop to pre-filter |

**4 files modified, 0 new files, 0 new dependencies**

