

# Full-App Skeuomorphism 2.0 Sweep + Journal-Line Text Alignment

## Problem

Text across the app doesn't sit on the notebook ruled lines — the `notebook-ruled` utility creates 1.5rem (24px) line spacing but most text uses arbitrary `line-height` values that don't align. Additionally, many components lack the tactile skeuo treatment (grain, raised cards, stitched dividers, embossed text, leather strips) that exists in the TLC TV player but is absent from Navigation, HeroSection, ProgressDashboard, CoachCare canvases, ExerciseLibrary cards, CommandSearch, Breadcrumbs, and Settings.

## Approach

### 1. Journal-Line Text System (`index.css`)

Add a `--journal-line` variable (`1.5rem`) and create utility classes that snap text to this grid:
- `.text-journal` — `line-height: 1.5rem` for body text (sits on ruled lines)
- `.text-journal-lg` — `line-height: 3rem` for headings (spans 2 lines)
- `.text-journal-sm` — `line-height: 1.5rem; font-size: 0.75rem` for labels
- Update `.text-editorial`, `.text-editorial-sm`, `.font-chalk`, `.text-label` to use multiples of `1.5rem` line-height so all text snaps to the ruled grid

### 2. Navigation Skeuo Treatment (`Navigation.tsx`)

- Desktop sidebar: `skeuo-grain` background, `skeuo-leather` strip at the top behind the TLC logo, embossed label text on hover tooltips, `skeuo-card` treatment on the active indicator
- Mobile bottom bar: `skeuo-leather` background strip, `skeuo-stitch` top border replacing the plain `border-t`
- Mobile full-screen menu: `notebook-ruled notebook-margin` background, entries styled as notebook entries with `notebook-entry` class

### 3. HeroSection Notebook Feel (`HeroSection.tsx`)

- Wrap in `notebook-ruled notebook-margin` container
- Stat bar cells get `skeuo-card` with `skeuo-grain`
- CTA button gets `btn-raised` + `skeuo-pressed` active state
- All text snapped to journal line grid

### 4. CoachCare Canvas Sweep (all 6 canvas files + ChatPanel + ChatInput)

- **IdleCanvas**: Action grid cells get `skeuo-card skeuo-grain`, icon containers get `surface-inset`, header text gets `text-embossed`
- **VideoCanvas**: Video frame gets `skeuo-bezel`, analysis cards get `skeuo-card`, score badge gets `skeuo-metal`
- **DocumentCanvas**: Toolbar gets `skeuo-leather` strip, edit area gets `notebook-ruled notebook-margin`, mode toggle buttons get `skeuo-pressed` active state
- **TemplateCanvas**: Each block row gets `notebook-entry`, grip handle gets `surface-inset`, save button gets `btn-raised`
- **AnalyticsCanvas**: Stat boxes get `skeuo-card`, chart containers get `surface-inset` with `skeuo-grain`
- **ChatPanel**: Header gets `skeuo-leather` strip, icon container gets `surface-inset`
- **ChatInput**: Quick action buttons get `skeuo-card`, input bar gets `surface-inset`, send button gets `btn-raised`
- **ChatMessage**: Coach bubbles get `skeuo-card skeuo-grain`, user bubbles keep primary but add `skeuo-pressed` inset feel

### 5. ExerciseLibrary Cards (`ExerciseLibrary.tsx`)

- Each exercise card gets `skeuo-card skeuo-grain`
- Filter dropdowns get `surface-inset` treatment
- Search bar gets `surface-inset` style
- Pagination buttons get `btn-raised`

### 6. ProgressionMap Nodes (`ProgressionMap.tsx`)

- Track accordion headers get `skeuo-leather` strip
- Each exercise node card gets `skeuo-card`
- Connector lines get stitched-border style (`skeuo-stitch`)
- Difficulty badges keep current colors but add `skeuo-metal` sheen

### 7. ProgressDashboard (`ProgressDashboard.tsx`)

- Empty state card gets `skeuo-card skeuo-grain notebook-ruled`
- Stat placeholder boxes get `surface-inset`
- Heading gets `text-embossed`

### 8. SettingsPanel (`SettingsPanel.tsx`)

- Tab bar gets `skeuo-leather` strip
- Active tab gets `skeuo-pressed` inset
- Input fields get `surface-inset`
- Save/action buttons get `btn-raised`
- Dev tools table gets `notebook-ruled` background

### 9. CommandSearch + Breadcrumb (`CommandSearch.tsx`, `Breadcrumb.tsx`)

- Search modal gets `skeuo-card skeuo-grain`, border becomes `skeuo-bezel`-like dark frame
- Result rows get notebook-entry spacing
- Breadcrumb gets `text-embossed` on the last (current) item
- Keyboard hint badges get `skeuo-metal`

### 10. UnifiedLibrary Tabs (`UnifiedLibrary.tsx`)

- Tab bar gets `skeuo-leather` strip
- Active tab gets `skeuo-pressed` inset, inactive tabs get `btn-raised` hover
- TLC TV browser cards within get same `skeuo-card skeuo-grain` treatment

### 11. ExerciseDetailModal (`ExerciseDetailModal.tsx`)

- Already has `skeuo-grain skeuo-card` — add `notebook-ruled` background to the main content area
- Progression link buttons get `btn-raised`
- Creator badge gets `skeuo-metal` sheen on the icon container

### 12. VideoPage (`VideoPage.tsx`)

- Exercise browser cards get `skeuo-card skeuo-grain`
- Accordion panels get `skeuo-stitch` dividers and `notebook-ruled` content areas
- Top bar already has `skeuo-leather` — keep as-is

### 13. AppShell (`AppShell.tsx`)

- Already has `skeuo-grain` — add `notebook-ruled` as a subtle global background pattern on the main content area

## Files

| File | Change |
|------|--------|
| `src/index.css` | Add journal-line text utilities, update typography classes to snap to 1.5rem grid |
| `src/components/layout/Navigation.tsx` | Skeuo grain/leather/stitch on sidebar and mobile bar |
| `src/components/layout/AppShell.tsx` | Add notebook-ruled to main content |
| `src/components/sections/HeroSection.tsx` | Notebook ruled + skeuo cards on stats + journal text |
| `src/components/sections/ExerciseLibrary.tsx` | Skeuo cards, inset search/filters |
| `src/components/sections/ProgressionMap.tsx` | Leather accordion headers, skeuo nodes |
| `src/components/sections/ProgressDashboard.tsx` | Skeuo grain card, inset stats, embossed heading |
| `src/components/sections/SettingsPanel.tsx` | Leather tab bar, inset inputs, raised buttons |
| `src/components/sections/UnifiedLibrary.tsx` | Leather tab strip, skeuo TV cards |
| `src/components/CoachCare/ChatPanel.tsx` | Leather header strip |
| `src/components/CoachCare/ChatInput.tsx` | Skeuo cards on quick actions, inset input |
| `src/components/CoachCare/ChatMessage.tsx` | Skeuo card on coach bubbles, grain overlay |
| `src/components/CoachCare/Canvas/IdleCanvas.tsx` | Skeuo cards, inset icons, embossed text |
| `src/components/CoachCare/Canvas/VideoCanvas.tsx` | Bezel frame, skeuo cards, metal score badge |
| `src/components/CoachCare/Canvas/DocumentCanvas.tsx` | Leather toolbar, notebook-ruled editor |
| `src/components/CoachCare/Canvas/TemplateCanvas.tsx` | Notebook entries, raised save button |
| `src/components/CoachCare/Canvas/AnalyticsCanvas.tsx` | Skeuo cards, inset chart containers |
| `src/components/shared/CommandSearch.tsx` | Skeuo grain card, metal kbd badges, notebook entries |
| `src/components/shared/Breadcrumb.tsx` | Embossed current item |
| `src/components/shared/ExerciseDetailModal.tsx` | Notebook-ruled body, raised progression buttons |
| `src/pages/VideoPage.tsx` | Skeuo cards on browser, stitched accordion dividers |

**21 files, 0 new files, 0 new dependencies**

