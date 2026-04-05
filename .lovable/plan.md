# Fix Missing Filters + Thumbnails + Simplify UI Readability

## Problems Found

1. **Ballet exercises have YouTube URLs** — thumbnails already auto-generate via `getThumb()`, but the `**ballet` category is missing from ExerciseLibrary's filter dropdown** (line 9-18 of ExerciseLibrary.tsx), so ballet exercises are invisible when filtering by category
2. `**push-strength` and `ballet` tracks missing from track filter list** (line 29-43 of ExerciseLibrary.tsx)
3. **App is visually overwhelming** — too much text, too many elements competing for attention. Needs: reduced text density, better visual hierarchy, breathing room, and progressive disclosure (show less by default, expand on demand) ADD ALL PAGES TO HOMESCREEN THEN OPTIMIZE FDOR MOBILE. ENAHCEN COLORS OR ADD THUNDER COLORS ADD LARGE FADED ART OKC THUNDER LOGO LIKE MOST FAMOUS ARTIST EVER PAINTE IT WITH TLC SIGFNFATURE. ON AEVERY PAGE IN ABCKDGOUDN LIKE 70 PERCETN OF IT IN MIIDDLE. BE CREATVIE AND COMPLEX

## Plan

### 1. Add Missing Filters (`ExerciseLibrary.tsx`)

- Add `{ id: 'ballet', label: 'Ballet' }` to the categories array
- Add `{ id: 'ballet', label: 'Ballet' }` and `{ id: 'push-strength', label: 'Push Strength' }` to trackFilters array

### 2. Simplify Visual Density Across Key Components

**HeroSection.tsx** — Declutter:

- Remove the stat bar entirely (it shows hardcoded fake data anyway)
- Keep just the headline + subtitle + single CTA button
- Add more vertical breathing room (larger padding)

**ExerciseLibrary.tsx** — Reduce cognitive load:

- Collapse the 3 filter dropdowns into a single row with smaller, pill-style buttons
- Default to grid view (remove the grid/list toggle — always grid)
- Reduce card info to just: thumbnail, name, difficulty badge (hide shortPurpose unless hovered)
- Reduce items per page from 20 to 12

**UnifiedLibrary.tsx** — Cleaner TV browser:

- When category is "all", show only the category filter row (don't show every category group header AND cards — just the flat grid)
- Reduce card text: name only visible, purpose on hover
- Add subtle separator lines between category groups instead of heavy headers

**ProgressionMap.tsx** — Tighter nodes:

- Reduce per-node card padding
- Hide cue stack and fail signs by default — show on tap/click
- Collapse long track descriptions to 1 line with "..." expand

**Navigation.tsx** — Simpler labels:

- Use icons-only on desktop sidebar (labels appear on hover tooltip only)
- Mobile bottom bar: icons only, active label appears below active icon only

### 3. Typography Hierarchy Fix (`index.css` + components)

- Reduce base body font size slightly for dense views
- Make section headers more distinct: larger gap before, thinner weight after
- Muted secondary text more aggressively (opacity 0.5 instead of muted-foreground)

## Files


| File                                          | Change                                                                     |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| `src/components/sections/ExerciseLibrary.tsx` | Add ballet + push-strength filters, simplify card layout, reduce page size |
| `src/components/sections/UnifiedLibrary.tsx`  | Flatten TV browser view, reduce text on cards                              |
| `src/components/sections/HeroSection.tsx`     | Remove stat bar, simplify to headline + CTA only                           |
| `src/components/sections/ProgressionMap.tsx`  | Tighter nodes, collapsible details                                         |
| `src/components/layout/Navigation.tsx`        | Icons-only desktop sidebar, cleaner mobile bar                             |
| `src/index.css`                               | Minor typography spacing adjustments                                       |


**6 files modified, 0 new files, 0 new dependencies**