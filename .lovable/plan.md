
# How-To Guide + Calisthenics Wiki + TLC Branding Enhancement

## 1. New "GUIDE" Nav Section — How to Use the App

Add a new nav item "GUIDE" (BookOpen icon) that shows an interactive walkthrough of the app's features:

- **Getting Started** — overview of the 4 sections (Library, Coach, Progress, Settings)
- **Using the Coach** — how to paste URLs, ask for exercises, build workouts, search videos
- **Library & Map** — how to browse exercises, filter categories, follow progression chains
- **Progress Tracking** — streaks, heatmap, workout logs
- **Keyboard Shortcuts** — ⌘K search, theme toggle, navigation

Each section uses expandable accordion cards with icons and short descriptions. Feels like a journal field guide.

## 2. New "WIKI" Tab Inside Library

Add a 4th tab to UnifiedLibrary: **WIKI** — a massive reference encyclopedia covering:

### Categories (accordion sections):
- **Calisthenics** — Progressive overload, skill tiers (beginner→elite), push/pull/legs/core fundamentals, static vs dynamic holds, programming principles
- **Ballet** — Port de bras, positions (1st-5th), relevé, plié, arabesque, turnout mechanics, conditioning for athletes
- **Yoga** — Sun salutations, warrior series, inversions, breathing (pranayama), flexibility vs mobility
- **Gymnastics** — Rings fundamentals, pommel horse basics, floor skills, iron cross progression, strength standards
- **Mobility** — Joint-by-joint approach, CARs, end-range training, stretching protocols
- **Nutrition** — Fueling for bodyweight athletes, protein timing, hydration
- **Recovery** — Deload weeks, sleep optimization, active recovery protocols

Each entry: title, 2-3 paragraph description, key exercises list, pro tips. All in notebook journal style.

## 3. TLC Branding Enhancements

- Welcome message in Coach → "Welcome to TLC Coach"
- HeroSection subtitle → add "⚡ TLC" badge
- Wiki footer → "TLC Calisthenics Knowledge Base"
- Guide header → "TLC Field Guide"

## 4. Text Enhancements

- All section headers use `text-editorial` + `text-embossed` + thunder accents
- Wiki entries use `text-journal` body with `notebook-ruled` backgrounds
- Guide cards use `skeuo-card` styling with thunder borders

## Files

| File | Change |
|------|--------|
| `src/components/sections/GuideSection.tsx` | **New** — interactive how-to walkthrough |
| `src/components/sections/WikiSection.tsx` | **New** — massive calisthenics/ballet/yoga/gymnastics encyclopedia |
| `src/components/sections/UnifiedLibrary.tsx` | Add WIKI tab |
| `src/components/layout/Navigation.tsx` | Add GUIDE nav item |
| `src/pages/Index.tsx` | Wire Guide section |
| `src/components/CoachCare/hooks/useChatHistory.ts` | Update welcome message branding |
| `src/components/sections/HeroSection.tsx` | Enhanced TLC branding |

**7 files (2 new, 5 modified), 0 new dependencies**
