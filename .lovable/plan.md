

# In-App Video Proxy + Fitted Accordion Player + Hybrid Skeuomorphism 2.0

## Overview

Three major upgrades: (1) proxy all Instagram reels through a backend edge function so they play natively in-app without leaving to a browser, (2) rebuild the video page as a fitted single-screen accordion layout with zero scroll, and (3) apply a "Hybrid Editorial-Skeuo" design layer — tactile depth, stitched borders, textured card stock, glossy video bezel — while keeping the newspaper brutalism grid.

## 1. Instagram Video Proxy (Edge Function)

Create a `proxy-instagram` edge function that:
- Accepts an IG post/reel URL
- Uses Instagram's oEmbed endpoint (`https://graph.facebook.com/v18.0/instagram_oembed`) to fetch the embed HTML and thumbnail
- Returns the thumbnail URL and a proxied embed URL that works inside an iframe without leaving the app
- Fallback: if oEmbed fails, return the thumbnail and a direct link styled as an in-app overlay

Frontend changes in `TLCNotebookPlayer.tsx`:
- For IG sources, call the edge function to get the proxied embed
- Render IG content in an in-app iframe with `sandbox` attributes to prevent navigation away
- Show a loading skeleton while the proxy resolves

## 2. Fitted Accordion Video Page (No Scroll)

Rebuild `VideoPage.tsx` to fill exactly one viewport:
- **Top bar**: sticky TLC TV header (compact, 40px)
- **Video player**: takes ~60% of remaining height, aspect-ratio preserved with letterboxing
- **Accordion panels below**: Prescription, Coaching Cues, Mistakes & Fixes, Progression Path — each expands/collapses, only one open at a time
- Container uses `h-screen` with `overflow-hidden` on the page — zero vertical scroll
- Mobile: video takes ~50vh, accordion fills the rest with touch-friendly tap targets
- "More Angles" becomes a horizontal strip between player and accordion

Update `ExerciseBrowser` (the browse-all view at `/video`) similarly: fitted grid with `h-screen overflow-hidden` and internal scroll only within the grid area.

## 3. Hybrid Editorial-Skeuomorphism 2.0

### Global CSS additions (`index.css`)
- `--skeuo-shadow-pressed`: inset shadow for pressed buttons
- `--skeuo-shadow-raised`: subtle outer shadow + inner highlight for raised cards
- `--skeuo-grain`: paper grain texture via CSS noise (tiny SVG data-uri background)
- `--skeuo-bezel`: glossy border-image for the video player frame
- `--skeuo-stitch`: repeating dash border pattern for section dividers

### Component-level skeuo treatments
- **Video bezel**: The TLC TV player gets a dark glossy frame — `box-shadow` with multiple layers simulating a real monitor bezel, subtle inner glow
- **Card stock**: Exercise cards get a paper grain texture overlay (CSS `::after` pseudo-element), slightly warm-tinted background, micro-shadow on hover as if lifting off the desk
- **Buttons**: Raised 3D feel with `box-shadow` top-highlight, press state uses `inset` shadow + 1px `translateY`
- **Accordion headers**: Stitched top border (dashed 2px with alternating gaps), leather-like dark strip texture on the active panel header
- **Tape corners on video**: Upgrade from flat divs to semi-transparent SVG tape strips with slight wrinkle texture
- **Notebook lines**: Keep the ruled-line background but add a faint coffee-stain watermark in one corner (CSS radial-gradient)
- **Navigation**: Add subtle embossed/debossed text effect on nav labels using `text-shadow`

### TLC TV Player skeuo upgrades
- Glossy black bezel frame with rounded inner edge (like a real TV screen border)
- Red LED power indicator dot (CSS animation, subtle pulse)
- Platform badge gets a brushed-metal look (linear-gradient silver)
- Play button gets a physical pressed-button feel with depth

## Files

| File | Change |
|------|--------|
| `supabase/functions/proxy-instagram/index.ts` | **New** — IG oEmbed proxy edge function |
| `src/components/shared/TLCNotebookPlayer.tsx` | IG proxy integration, skeuo bezel, LED indicator, upgraded tape corners |
| `src/pages/VideoPage.tsx` | Fitted `h-screen` accordion layout, no scroll, skeuo card treatments |
| `src/index.css` | Skeuo CSS variables, grain texture, stitch borders, embossed text utilities |
| `src/components/shared/ExerciseDetailModal.tsx` | Skeuo card depth, pressed buttons, grain overlay |
| `src/components/layout/AppShell.tsx` | Ensure `h-screen overflow-hidden` on video routes |
| `src/components/shared/TLCVideoPlayer.tsx` | Skeuo bezel treatment matching notebook player |

**7 files, 1 new edge function, 0 new dependencies**

