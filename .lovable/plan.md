

# Rebuild Homepage + Simplify UX

## Problem
The homepage is thin — just a headline, 4 category cards, and a featured grid. There's no clear learning path, no "what should I do first?" guidance, and no quick access to the app's best features (Coach, Wiki, TV). The overall UX has too many sections competing for attention.

## New Homepage Design

Replace the current Hero + Featured grid with a single-scroll homepage that acts as a **learning dashboard**:

### Section 1: Compact Hero (keep, simplify)
- Keep headline "MASTER YOUR BODY" and subtitle
- Remove the 4 category emoji cards (they duplicate Library filters)
- Add a single prominent CTA: "START TRAINING →" that opens Coach

### Section 2: "Your Path" — 3 Action Cards
Three large, clear cards in a row that answer "what can I do here?":
- **EXPLORE** (→ Library) — "Browse 80+ exercises across calisthenics, yoga, ballet & mobility"
- **LEARN** (→ Wiki/Guide) — "Read the encyclopedia — technique breakdowns, nutrition, recovery"  
- **TRAIN** (→ Coach) — "Ask the AI coach to build your workout or find a video"

Each card: icon, title, one-line description, thumbnail background from exercises. Click navigates directly.

### Section 3: "Featured Skills" (keep, clean up)
- Reduce from 8 → 6 cards for cleaner grid (2×3 on mobile, 3×2 on desktop)
- Larger thumbnails, bigger text, remove tiny difficulty badge clutter
- Single "VIEW ALL →" link to Library

### Section 4: "Quick Start" — Discipline Row
Four horizontal pills (not cards): Calisthenics · Yoga · Ballet · Mobility
- Click goes straight to Library with that filter pre-set
- Minimal — just text pills with exercise count, no emojis, no thumbnails

### Section 5: Compact Footer CTA
"Need help? Ask the TLC Coach →" — small text link to Coach section

## Files

| File | Change |
|------|--------|
| `src/components/sections/HeroSection.tsx` | Full rewrite — compact hero + 3 action cards + discipline pills + featured grid |
| `src/pages/Index.tsx` | Remove duplicate featured grid code (move into HeroSection), simplify home rendering |

**2 files modified, 0 new files, 0 new dependencies**

