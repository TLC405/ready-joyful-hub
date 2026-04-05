

# Atomic Upgrade: Coach Care Studio + Social Search + World-Class UI Polish

## Current State Assessment

The Coach is functional but basic: hardcoded responses, no real AI, no social media search, static analytics, no workout history. The canvas modes work but lack depth. The rest of the app has Thunder branding but several components still feel thin (Progress Dashboard is empty, Settings is minimal).

## Plan

### 1. Add Social Media Canvas Mode — In-App Search (`types.ts`, `CanvasRouter.tsx`, new `SocialCanvas.tsx`)

New canvas mode `social` that lets users search YouTube, Instagram, and X for calisthenics content directly inside the app:

- Add `'social'` to `CanvasMode` union type
- New `SocialCanvasData` type with `query`, `results[]`, `platform` filter
- New `SocialCanvas.tsx`: search bar with platform filter pills (YouTube/Instagram/All), renders results as thumbnail cards with embedded preview on click
- YouTube search via YouTube Data API oEmbed thumbnails (no API key needed for thumbnails — use `https://www.youtube.com/results?search_query=` iframe or construct search URLs)
- For MVP: construct search URLs and display as linkable cards with thumbnails, with a "Watch In-App" button that opens the video in the existing `VideoCanvas`
- Search queries auto-suggested from exercise names in the library

### 2. Upgrade Coach Intelligence (`CoachCareStudio.tsx`)

Replace the basic `generateResponse` with a smarter engine:

- **Progression advisor**: When user mentions an exercise, suggest the next progression AND regression based on `progressTo`/`regressTo` chains
- **Workout history awareness**: Read saved templates from localStorage and reference them ("You last trained push 3 days ago")
- **Multi-turn context**: Track last 3 messages for context (e.g., "what about harder?" refers to the last exercise discussed)
- **Social search trigger**: Detect queries like "find videos of..." or "show me..." to trigger social canvas
- **Daily tip**: On first message of session, Coach gives a rotating training tip
- **Streak tracker**: Count consecutive days with saved workouts and mention it

### 3. Upgrade Chat UI (`ChatPanel.tsx`, `ChatMessage.tsx`, `ChatInput.tsx`)

- **Typing indicator**: Animated dots when Coach is "thinking"
- **Message reactions**: Thumbs up/down on coach messages (stored in localStorage for future training)
- **Quick reply chips**: After coach responses, show 2-3 contextual follow-up suggestions as tappable pills
- **Rich exercise cards**: When Coach mentions an exercise, render an inline mini-card with thumbnail, difficulty badge, and "Open" button instead of plain text
- **Voice input button**: Add mic icon (browser SpeechRecognition API) for voice commands
- **Attachment button**: Quick action to paste image URLs for form analysis

### 4. Upgrade Canvas Panels

**ExerciseCanvas** improvements:
- Add video thumbnail with play button that opens `VideoCanvas`
- Add progression chain visualization: `← regression | CURRENT | progression →`
- Add "Add to Workout" button that creates a template block

**AnalyticsCanvas** improvements:
- Replace hardcoded data with localStorage workout history
- Add "streak" heatmap calendar (GitHub-style contribution grid)
- Add "skills radar" chart showing proficiency across categories
- Thunder gradient fills on all charts

**TemplateCanvas** improvements:
- Add exercise search/autocomplete when adding blocks
- Add superset grouping with visual brackets
- Add estimated duration calculator
- Add "Share" button that copies as formatted text

**VideoCanvas** improvements:
- Add playback speed controls (0.5x, 1x, 1.5x)
- Add "Save timestamp" button to bookmark form notes
- Thunder LED status light on the bezel

### 5. Progress Dashboard Overhaul (`ProgressDashboard.tsx`)

Replace the empty placeholder with real content:

- **Streak counter**: Large skeuo counter showing consecutive training days
- **Weekly heatmap**: 7-day grid with Thunder gradient intensity based on volume
- **Skill progress bars**: Per-track completion percentage with Thunder gradient fills
- **Recent workouts**: List of last 5 saved templates with date and exercise count
- **Goals section**: Set and track numeric goals (e.g., "30s L-sit hold") with progress rings
- All data from localStorage (templates, workout logs)

### 6. Settings Panel Enhancement (`SettingsPanel.tsx`)

- **Training preferences**: Set preferred categories, session duration, rest day schedule
- **Coach personality**: Toggle between "motivational", "technical", "chill" response styles
- **Data export**: Download all saved templates and workout history as JSON
- **Data import**: Upload JSON to restore data
- **Notification preferences**: Daily reminder toggle (browser notification API)
- **Theme customization**: Thunder intensity slider (subtle vs. full Thunder)

### 7. Global UI Polish — Every Component

- **Idle Canvas**: Add animated Thunder bolt icon, pulsing gradient border on action cards
- **All skeuo cards**: Ensure consistent `skeuo-thunder-card` treatment with grain
- **Loading states**: Thunder-branded skeleton loaders instead of blank states
- **Empty states**: Custom illustrations with Thunder colors for all empty views
- **Micro-interactions**: Button press haptic feedback CSS (`transform: scale(0.97)`), card hover lifts
- **Mobile**: Ensure all new canvases work in the drawer, coach quick-replies scroll horizontally

## Files

| File | Change |
|------|--------|
| `src/components/CoachCare/types.ts` | Add `social` mode, `SocialCanvasData`, quick-reply types |
| `src/components/CoachCare/Canvas/SocialCanvas.tsx` | **New** — social media search canvas |
| `src/components/CoachCare/Canvas/CanvasRouter.tsx` | Add social route |
| `src/components/CoachCare/CoachCareStudio.tsx` | Smart response engine, progression advisor, context tracking |
| `src/components/CoachCare/ChatPanel.tsx` | Typing indicator, quick-reply chips |
| `src/components/CoachCare/ChatMessage.tsx` | Rich exercise cards, reactions, inline thumbnails |
| `src/components/CoachCare/ChatInput.tsx` | Voice input, social search action, attachment button |
| `src/components/CoachCare/Canvas/ExerciseCanvas.tsx` | Video preview, progression chain, add-to-workout |
| `src/components/CoachCare/Canvas/AnalyticsCanvas.tsx` | Real data, streak heatmap, skills radar |
| `src/components/CoachCare/Canvas/TemplateCanvas.tsx` | Exercise autocomplete, superset groups, duration calc |
| `src/components/CoachCare/Canvas/VideoCanvas.tsx` | Speed controls, save timestamps, Thunder bezel |
| `src/components/CoachCare/Canvas/IdleCanvas.tsx` | Animated Thunder bolt, gradient borders |
| `src/components/sections/ProgressDashboard.tsx` | Full overhaul — streaks, heatmap, skill bars, recent workouts |
| `src/components/sections/SettingsPanel.tsx` | Training prefs, coach personality, data export/import |

**14 files (1 new, 13 modified), 0 new dependencies**

