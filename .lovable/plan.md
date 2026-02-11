

# Layout and Organization Overhaul

## Problems Identified

1. **Every section forces `min-h-screen`** -- creates huge empty padding even when content is short
2. **Hero section takes a full viewport** just to show a heading and 3 stat cards
3. **Exercise Library** -- 70+ cards in an endless vertical grid. Three rows of filter chips stacked on top add visual noise. No pagination or compact view
4. **Track Ladder** -- shows one track at a time as a tall vertical list. 9 track selector buttons wrap across full width. The track nodes are just a flat list with no sense of progression density
5. **Progress Dashboard** -- stat cards and calendar are spaced out with too much vertical padding
6. **Admin Panel** -- functional but spaciously padded
7. **Home page stacks Hero + full Exercise Library** which means scrolling through 2 full "pages" of content

## Solution: Tighter, Denser, App-Like Layout

### Principle
Switch from a "marketing landing page" feel (big sections, lots of whitespace) to a **dashboard/app feel** (dense, organized, everything reachable without endless scrolling).

---

### 1. Remove `min-h-screen` from All Sections

**Files:** `HeroSection.tsx`, `ExerciseLibrary.tsx`, `TrackLadder.tsx`, `ProgressDashboard.tsx`, `AdminPanel.tsx`

Every section currently has `min-h-screen` forcing them to fill the entire viewport even when content is smaller. Replace with natural height + sensible padding (`py-8 lg:py-12` instead of `py-20`).

---

### 2. Hero Section -- Compact Header Bar

**File:** `src/components/sections/HeroSection.tsx`

Current: Full-screen centered hero with massive typography, "SCROLL TO EXPLORE" indicator, and staggered animations.

New: A **compact header strip** at the top of the home page:
- Remove the full-viewport centering layout
- Make it a horizontal bar: "MASTER YOUR STACK" headline on left, 3 stat cards in a tight row on right
- Remove the "SCROLL TO EXPLORE" indicator entirely
- Remove the CTA buttons (user is already in the app -- "START TRAINING" just navigates to Library, which the nav already does)
- Keep the badge but make it smaller inline
- Height target: approximately 200-250px total instead of 100vh

---

### 3. Exercise Library -- Table/List View + Pagination

**File:** `src/components/sections/ExerciseLibrary.tsx`

Current: 4-column card grid showing all 70+ exercises at once with image thumbnails. Three separate rows of filter chips.

New layout:
- **Compact filter bar**: Combine category, difficulty, and track filters into a single horizontal row using dropdown `<select>` elements instead of chip rows. This collapses 3 rows of buttons into 1 row of 3 dropdowns
- **View toggle**: Add a grid/list toggle button. Default to **list view** (compact table rows with exercise name, difficulty badge, category, and track tags -- no images). Grid view available as alternate
- **Pagination**: Show 20 exercises per page with simple prev/next controls at the bottom. No more infinite scroll through 70+ cards
- **Sticky search + filter bar**: The search input and filter dropdowns stick to the top of the section when scrolling so they're always accessible
- Cards in grid mode become smaller (3 columns max, not 4, with smaller aspect ratio)

---

### 4. Track Ladder -- Side-by-Side Panel Layout

**File:** `src/components/sections/TrackLadder.tsx`

Current: Full-width track selector buttons, then a single vertical node list centered on page.

New layout:
- **Two-panel layout**: Left panel (narrow, ~250px) shows the track list as a vertical menu. Right panel (flex-1) shows the selected track's nodes
- Track list in left panel: each track is a compact row with icon + name + node count badge. Vertical, always visible -- no wrapping
- Right panel nodes: keep the vertical ladder but make it more compact (less padding per node, smaller images)
- Remove the separate "track info" card between the selector and nodes -- fold the description into the left panel under the track name when selected
- This makes the entire Tracks section fit in one viewport without scrolling for most tracks

---

### 5. Progress Dashboard -- Tighter Grid

**File:** `src/components/sections/ProgressDashboard.tsx`

- Reduce stat card sizes (smaller icon containers, less internal padding)
- Make the 4 stat cards a single compact row (all same size, no featured/enlarged streak card)
- Activity calendar and achievements side-by-side stay, but reduce internal padding
- Skill progression bars: make them a compact table-like layout instead of oversized rows
- Section heading: smaller (text-3xl instead of text-7xl)

---

### 6. Admin Panel -- Compact

**File:** `src/components/sections/AdminPanel.tsx`

- Smaller section heading (text-3xl instead of text-7xl)
- Reduce stat card internal padding
- Tighter spacing throughout

---

### 7. Home Page Composition

**File:** `src/pages/Index.tsx`

Currently the home page stacks `HeroSection` + `ExerciseLibrary` making it extremely long. 

New: Home page shows only the compact Hero header + a **preview row** of 6-8 featured exercises (horizontal scroll or single row), not the full library. The full library is only on the Library tab.

---

### 8. Section Headings -- Consistent and Smaller

**All section files**

Current headings are massive (`text-5xl sm:text-6xl lg:text-7xl`). Scale down to `text-2xl sm:text-3xl` across all sections. The giant headings waste vertical space and feel like landing page marketing, not an app.

---

## File Summary

| File | Changes |
|------|---------|
| `src/components/sections/HeroSection.tsx` | Compact header bar layout, remove full-screen centering, remove scroll indicator and CTAs |
| `src/components/sections/ExerciseLibrary.tsx` | Dropdown filters, list/grid view toggle, pagination (20/page), sticky filter bar, smaller cards |
| `src/components/sections/TrackLadder.tsx` | Two-panel layout (track menu left, nodes right), compact nodes |
| `src/components/sections/ProgressDashboard.tsx` | Smaller headings, tighter stat cards, reduced padding |
| `src/components/sections/AdminPanel.tsx` | Smaller headings, reduced padding |
| `src/pages/Index.tsx` | Home shows compact hero + featured exercise preview row (not full library) |

**Total: 6 files edited, 0 new files**

## What Does NOT Change
- Navigation component (already compact and well-organized)
- AppShell / HUD background (looks good)
- Color palette and design tokens
- Exercise data, track data, progression engine
- Modal/detail views
- All functionality preserved
