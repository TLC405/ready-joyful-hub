

# Fix All Gaps: Library Rendering, Ballet Thumbnails, Layout Issues + Comprehensive QA

## Issues Found (from browser testing)

1. **Library section appears completely blank** — when navigating to Library from the sidebar, the UnifiedLibrary content (tabs, search, exercises) exists in the DOM but is visually invisible. There's a massive empty gap at the top of the content area (~300px of nothing). The breadcrumbs, tabs, and exercise table only become visible after scrolling far down. Root cause: the `section` wrapper in `UnifiedLibrary` uses `py-6` padding but the real issue is the `main` element renders all content below the sidebar's fixed height with no content pushing it up.

2. **Ballet thumbnails all broken** — all 12 ballet exercises show grey YouTube placeholder icons. The YouTube video IDs in exercises.ts were fabricated and don't correspond to real videos. Need to find real ballet tutorial YouTube URLs.

3. **Nav sidebar scrolls away** — at certain scroll positions the sidebar icons disappear, suggesting the sidebar's `fixed` positioning is being disrupted or occluded.

4. **Home section is mostly empty** — only shows a small hero text and a featured grid. The stat bars were removed but nothing replaced them — feels hollow.

5. **Console errors** — `Function components cannot be given refs` warning from App component (not critical but noisy).

## Plan

### 1. Fix Library Section Visibility (`Index.tsx` + `UnifiedLibrary.tsx`)
- The AnimatePresence content area needs the sections to render immediately visible without relying on scrolling
- Add `scroll-mt-0` and ensure the `main` element with `lg:pl-20` properly positions content at the top of the viewport
- The problem: the `motion.div` with `pageTransition` has `y: 8` initial offset AND the `min-h-screen` on the parent makes the content shift. Fix by ensuring each section fills the available viewport immediately
- Add `pt-4 lg:pt-6` to the main content wrapper to give consistent top spacing without excess

### 2. Fix Ballet Thumbnails (`exercises.ts`)
Replace all 12 fabricated YouTube URLs with real ballet tutorial videos:
- Relevé, Plié, Tendu, Grand Plié, Port de Bras, Passé Balance, Arabesque Hold, Développé, Rond de Jambe, Grand Battement, Attitude Hold, Penché
- Use established ballet YouTube channels (Kathryn Morgan, Ballet Beautiful, etc.)

### 3. Fix Nav Sidebar Z-Index (`Navigation.tsx`)
- Ensure sidebar uses `z-50` consistently and isn't being overlapped by the content `z-10` layer
- The sidebar already has `z-50` but the main content's `relative z-10` inside AppShell may create a stacking context issue — verify and fix

### 4. Fix Home Section Feel (`HeroSection.tsx` + `Index.tsx`)
- The "featured skills" section should be more prominent
- Add a "Quick Start" row or category cards below the hero to make the home page feel complete
- Ensure the featured grid shows thumbnails from YouTube where available (use same `getThumb` logic)

### 5. Fix Ref Warning (`App.tsx`)
- The `Function components cannot be given refs` warning comes from how `App` is exported — wrap with `forwardRef` or ensure the component tree doesn't pass refs down

### 6. Verify Push-Strength Track on Map
- Ensure the push-strength track appears in the track dropdown on the Map tab
- Test that clicking exercises in the Map navigates to their video pages

## Files

| File | Change |
|------|--------|
| `src/pages/Index.tsx` | Fix main content area spacing, ensure sections render at viewport top |
| `src/components/sections/UnifiedLibrary.tsx` | Adjust section padding/positioning |
| `src/lib/exercises.ts` | Replace 12 ballet YouTube URLs with real videos |
| `src/components/layout/Navigation.tsx` | Fix sidebar z-index stacking |
| `src/components/sections/HeroSection.tsx` | Add more content to home section |

**5 files modified, 0 new files, 0 new dependencies**

