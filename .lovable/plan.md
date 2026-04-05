

# Navigation Restructure + Dev Tools Admin + UX Power Features

## 1. Combine Library + Tracks + TV into One Section

Merge three nav items into a single **"LIBRARY"** section with internal tabs:

```text
NAV (before):  Home | Library | Tracks | Coach | Progress | Settings
NAV (after):   Home | Library | Coach | Progress | Settings
                       ├── Browse (current ExerciseLibrary)
                       ├── Map (current ProgressionMap)
                       └── TLC TV (current ExerciseBrowser from VideoPage)
```

- **Navigation.tsx**: Remove `tracks` nav item. 5 items total.
- **New `src/components/sections/UnifiedLibrary.tsx`**: Wraps all three views with a tab bar at the top (BROWSE | MAP | TLC TV). Each tab renders the existing component. Clicking an exercise in Browse or Map can switch to TLC TV tab with that exercise loaded.
- **Index.tsx**: Replace `library` and `tracks` cases with single `library` rendering `UnifiedLibrary`.
- **VideoPage.tsx**: Stays as `/video/:exerciseId` route for direct links, but the ExerciseBrowser is now accessible via the Library tab too.

## 2. Dev Tools Admin (Settings Overhaul)

Replace current Settings with a tabbed admin hub:

**Tabs**: PROFILE | APPEARANCE | TRAINING | DATA | DEV TOOLS

- **PROFILE**: Display name, bio, units (existing)
- **APPEARANCE**: Theme toggle (existing)
- **TRAINING**: Rest timer, default difficulty, notifications (existing)
- **DATA**: Export JSON, export exercise list as CSV, clear data. **Remove GitHub button**.
- **DEV TOOLS** (new):
  - Download ZIP button (source code)
  - Exercise list viewer — searchable table of all exercises with ID, name, category, difficulty, video status, track
  - Inline exercise editor — tap a row to edit fields (name, cues, video URLs) and save to localStorage override layer
  - Track builder — reorder exercises within tracks, add/remove nodes
  - App stats — total exercises, exercises with video, track count, version info

**File**: Rewrite `SettingsPanel.tsx` with tabs.

## 3. Breadcrumb Navigation

- **New `src/components/shared/Breadcrumb.tsx`**: Renders path like `HOME > LIBRARY > PUSH > PLANCHE LEAN`
- Add to: UnifiedLibrary (showing active tab + any filter), VideoPage (HOME > TLC TV > Exercise Name), ProgressionMap (HOME > LIBRARY > MAP > Track Name)
- Compact — single line, clickable segments

## 4. Global Quick-Access Search

- **New `src/components/shared/CommandSearch.tsx`**: Modal overlay (Cmd+K / Ctrl+K trigger), searches all exercises by name. Shows top 8 results with category + difficulty badge. Enter navigates to `/video/:id` or opens detail modal.
- Accessible from: keyboard shortcut anywhere, search icon in nav sidebar
- Uses `cmdk`-style UI but built with existing components (no new dep — just a dialog + input + filtered list)

## 5. Swipe Gestures (Mobile)

- In `Index.tsx`, wrap the section content with touch handlers: swipe left/right cycles through the nav sections (Home → Library → Coach → Progress → Settings)
- Use `onTouchStart`/`onTouchEnd` with a 50px threshold — no new dependency
- Visual indicator: subtle horizontal dots at bottom showing current section position

## 6. Keyboard Shortcuts

- **New `src/hooks/use-keyboard-shortcuts.ts`**: Global keydown listener
  - `1-5`: Jump to nav sections
  - `/` or `Cmd+K`: Open search
  - `Esc`: Close any modal/overlay
  - `←` / `→`: Navigate sections (same as swipe)
- Register in `Index.tsx`

## Files

| File | Change |
|------|--------|
| `src/components/layout/Navigation.tsx` | Remove `tracks` item, add search icon, 5 items |
| `src/components/sections/UnifiedLibrary.tsx` | **New** — tabbed wrapper for Browse + Map + TLC TV |
| `src/components/sections/ExerciseLibrary.tsx` | Minor: remove own header (UnifiedLibrary provides it) |
| `src/components/sections/ProgressionMap.tsx` | Minor: remove own header |
| `src/components/sections/SettingsPanel.tsx` | Full rewrite — tabbed admin hub with dev tools |
| `src/components/shared/Breadcrumb.tsx` | **New** — contextual breadcrumb bar |
| `src/components/shared/CommandSearch.tsx` | **New** — Cmd+K search overlay |
| `src/hooks/use-keyboard-shortcuts.ts` | **New** — global keyboard shortcut handler |
| `src/pages/Index.tsx` | Swap library/tracks for UnifiedLibrary, add swipe + shortcuts |
| `src/pages/VideoPage.tsx` | Add breadcrumb, minor cleanup |

**10 files (4 new, 6 modified), 0 new dependencies**

