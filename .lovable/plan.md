

# STACKED — Full Visual Overhaul

## Direction

Replacing the current warm gold/amber luxury palette with a **cold, technical "blueprint/ink"** aesthetic. Think: architectural drawings, aviation instruments, technical manuals. No gradients, no glow, no metallic sheen.

## New Design System

### Color Palette
- **Background**: Near-black with a cool blue undertone (`220 15% 4%`) instead of warm neutral
- **Primary accent**: Cool steel blue (`210 40% 52%`) — replaces all gold/amber
- **Secondary accent**: Muted slate (`215 15% 18%`)
- **Destructive/Warning**: Stays red but desaturated (`0 55% 50%`)
- **Success**: Cool green-gray (`160 20% 55%`)
- **Difficulty tiers**: Slate (beginner) -> Steel blue (intermediate) -> Ice white (advanced) -> Bright cyan (master)
- **Borders**: Cool gray (`215 10% 16%`) — sharper, more architectural
- **Muted foreground**: Blue-gray (`215 10% 50%`)

### Typography
- **Display/Headers**: Replace Oswald with **"Space Grotesk"** — geometric, technical, modern. Used for all `.font-chalk` instances
- **Body**: Keep **Inter** — already clean and readable
- Letter-spacing on headers increases slightly for that "blueprint label" feel

### Utility Classes Overhaul
- Remove all `text-gradient` gold shimmer effects — replace with solid color or `text-primary`
- Remove `glow`, `glow-text`, `glow-subtle`, `shimmer`, `metallic` utilities — they conflict with the blueprint aesthetic
- Keep `glass` and `glass-premium` but retune to cool blue tones
- `card-hover` keeps the lift but drops the gold shadow — uses a subtle cool border highlight instead
- Difficulty badges get new cool-tone colors
- `image-overlay` gradient retunes to the new background hue

## Files to Change (10 files)

### 1. `src/index.css`
- Swap Google Fonts import: Oswald -> Space Grotesk
- Rewrite all CSS custom properties (`:root` block) to the new cool palette
- Update `.font-chalk` to use `'Space Grotesk'`
- Retune all utility classes (`text-gradient`, `glow`, `glass`, `border-brutal`, `shimmer`, `metallic`, difficulty badges, `image-overlay`) to cool blue tones
- Remove gold-specific animations (metallic shine, pulse-glow gold)
- Focus ring color changes to new primary

### 2. `tailwind.config.ts`
- Update `fontFamily.chalk` to `Space Grotesk`
- Replace `gold`, `platinum`, `bronze` color tokens with `steel`, `slate`, `ice` equivalents
- Update `boxShadow` presets — remove gold-glow, add subtle blue-tint shadows
- Update `backgroundImage` presets — remove gold gradients, add blueprint-style ones

### 3. `src/components/sections/HeroSection.tsx`
- Replace gradient orb background with subtle grid-only pattern (blueprint feel)
- Replace `text-gradient` on "UNLEASH" with solid `text-primary`
- Change stat card styling — remove orange fire gradient, use cool accent
- Update badge/CTA button colors to new primary
- Change copy from "TRANSFORM YOUR BODY" to something calmer: "BODYWEIGHT SKILL SYSTEM"
- Replace fire/streak language with skill-focused language

### 4. `src/components/sections/ExerciseLibrary.tsx`
- Replace `text-gradient` on "EXERCISE" with `text-primary`
- All filter buttons use new palette
- Card hover bottom accent line uses new primary
- Difficulty badges use new cool-tone classes
- Modal coach notes sections use new tones

### 5. `src/components/sections/TrackLadder.tsx`
- Replace `text-gradient` on "TRACK" with `text-primary`
- Track selector buttons use new palette
- Node state colors (unlocked/preview/try_mode) retune to cool blue spectrum
- Vertical line and dot indicators use new border/primary colors

### 6. `src/components/sections/ProgressDashboard.tsx`
- Replace `text-gradient` on "PROGRESS" with `text-primary`
- Remove fire/streak gamification styling (orange gradients, pulsing flames)
- Streak card becomes a clean stat card with cool accent
- Activity calendar uses new primary for active days
- Progress bars use solid primary color (no `from-primary to-yellow-400` gradient)
- Remove emoji achievements — replace with clean icon-based display

### 7. `src/components/sections/AdminPanel.tsx`
- Replace `text-gradient` on "COMMAND" with `text-primary`
- Notification type badges use muted, cool-toned category colors
- Stat cards use new palette
- Form elements (select, input, textarea) use new border/focus colors

### 8. `src/components/sections/SkillsLibrary.tsx`
- Replace `text-gradient` on "SKILL" with `text-primary`
- Card hover shadow uses new cool shadow instead of gold
- Filter buttons use new palette

### 9. `src/components/sections/skills/SkillDetailModal.tsx`
- Tabs and section headers use new primary color
- Coach note blocks (mechanic/brutality/watch out/recovery) retune backgrounds
- Action button uses new primary

### 10. `src/components/layout/Navigation.tsx`
- Logo badge uses new primary color
- Active nav indicator uses new primary
- Mobile overlay uses new palette

## What Does NOT Change
- Component structure, layout, and logic stay identical
- All exercise data, track data, types stay untouched
- Framer Motion animations stay (they work well)
- All existing functionality preserved
- No files deleted, no components removed

## Technical Notes
- The Google Fonts import switches from `Oswald` to `Space+Grotesk` with the same weight range (400-700)
- All HSL values shift from warm (hue 38-45) to cool (hue 200-220)
- The `font-chalk` class name is kept for backward compatibility even though it no longer references a "chalk" font

