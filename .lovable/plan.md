

# Fix Layout: Remove YouTube Overlays from TLC TV + Reduce White

## Problems

1. **TLC TV / Video Player has excessive overlay elements** — tape corner SVGs, notebook-ruled backgrounds, leather headers, bezel frames, dark overlays on thumbnails — all competing for attention and covering the actual video content
2. **Too much white** — background `hsl(40 20% 96%)` is very light cream, cards are `hsl(0 0% 100%)` pure white, surfaces are near-white. The whole app washes out
3. **`skeuo-grain::after`** creates a `position: absolute; inset: 0` overlay that can cause z-index stacking issues with content (already confirmed invisible content bug)

## Changes

### 1. Simplify TLCNotebookPlayer (the main video player)

Remove from `src/components/shared/TLCNotebookPlayer.tsx`:
- Tape corner SVGs (lines 158-168)
- Notebook-ruled repeating gradient background (line 100-101)
- Thunder-colored margin line (line 103)
- Dark overlay on play button area (the `bg-foreground/30` and `bg-foreground/50` hover)
- Excessive `skeuo-bezel` + `skeuo-leather` wrapper chrome

Replace with a clean, minimal TLC-branded player:
- Simple dark frame with subtle border, no bezel gradients
- Small "TLC TV" label top-left with thunder-led dot
- Clean play button overlay (thunder-orange circle, no dark scrim)
- Platform badge (YouTube/Instagram) as a small pill
- Coaching cues sidebar stays but simplified

### 2. Simplify TLCVideoPlayer

Same cleanup in `src/components/shared/TLCVideoPlayer.tsx`:
- Remove `skeuo-bezel`, `skeuo-leather` wrapper
- Simple border frame, small "TLC" label
- Clean play overlay without heavy dark scrim

### 3. Fix app-wide whiteness — warm up color palette

In `src/index.css` light theme variables:
- `--background`: `40 20% 96%` → `38 18% 93%` (warmer, slightly darker cream)
- `--card`: `0 0% 100%` → `39 16% 96%` (warm off-white instead of pure white)
- `--surface-0`: `40 15% 94%` → `38 14% 91%` (more visible surface distinction)
- `--surface-1`: `0 0% 100%` → `39 15% 95%`
- `--surface-2`: `40 10% 98%` → `39 12% 94%`
- `--sidebar-background`: `0 0% 100%` → `38 16% 95%`

### 4. Fix skeuo-grain z-index stacking

In `src/index.css` `.skeuo-grain::after`, change `z-index: 0` to `z-index: -1` to ensure the grain texture never sits above content. This fixes the invisible content bug.

### 5. Clean up TV grid cards in UnifiedLibrary

In `src/components/sections/UnifiedLibrary.tsx` InlineTVBrowser:
- Remove `skeuo-card skeuo-grain` from exercise cards (line 120) — these add unnecessary overlays and shadows
- Simplify to clean cards with subtle border and hover state

## Files

| File | Change |
|------|--------|
| `src/components/shared/TLCNotebookPlayer.tsx` | Remove tape SVGs, notebook-ruled bg, margin line, heavy bezels; clean player |
| `src/components/shared/TLCVideoPlayer.tsx` | Remove skeuo-bezel/leather; simple frame |
| `src/index.css` | Warm up all white tones, fix skeuo-grain z-index to -1 |
| `src/components/sections/UnifiedLibrary.tsx` | Remove skeuo-card skeuo-grain from TV grid cards |

**4 files modified, 0 new files, 0 new dependencies**

