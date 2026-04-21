

# Real Video Search + State-of-the-Art Logging + Calendar

## Three goals

1. **Real video search from the internet** in the Coach (currently mocked with hardcoded results)
2. **Real workout logging system + calendar view** to log sets and see history (currently no writes happen — heatmap is `Math.random()`)
3. **Remove the EXPLORE / LEARN / TRAIN path cards** from the homepage

---

## 1. Real Video Search via YouTube Data API

**Currently:** `SocialCanvas.tsx` calls `generateMockResults()` which only returns videos from the local `exercises` array. No actual internet search.

**Fix:** Create a new edge function `youtube-search` that calls the official **YouTube Data API v3** (free tier: 10k requests/day, no cost). The user provides a YouTube Data API key once — stored as a Supabase secret `YOUTUBE_API_KEY`.

- New file: `supabase/functions/youtube-search/index.ts` — accepts `{ query, maxResults }`, calls `https://www.googleapis.com/youtube/v3/search?...&type=video`, returns normalized `SocialSearchResult[]` (id, title, thumbnail, channel, embedUrl).
- Update `SocialCanvas.tsx` `handleSearch` to call this edge function via `supabase.functions.invoke('youtube-search', ...)` and remove `generateMockResults` for YouTube path.
- Instagram tab keeps using local exercise sources (Instagram Search has no public API; covered later if needed).
- Show toast on 403/quota errors.

**Why this saves credits:** YouTube Data API is free, real, and doesn't use Lovable AI tokens.

---

## 2. State-of-the-Art Logging + Calendar System

**Currently:** `tlc-workout-logs` localStorage key is read but **never written** anywhere. Streak and heatmap are placeholders/random.

### Data model (localStorage, no auth required)

```ts
type WorkoutLog = {
  id: string;           // uuid
  date: string;         // ISO date "2026-04-21"
  exerciseId: string;
  exerciseName: string;
  sets: { reps?: number; timeSec?: number; weight?: number; rpe?: number }[];
  notes?: string;
  durationMin?: number;
  createdAt: string;    // ISO timestamp
};
```

Stored under `tlc-workout-logs` so existing reads stay compatible.

### New shared module `src/lib/workout-log.ts`
- `getAllLogs()`, `getLogsForDate(date)`, `getLogsForRange(start, end)`
- `addLog(log)`, `updateLog(id, patch)`, `deleteLog(id)`
- `getStreak()`, `getHeatmapData(weeks)` — replaces all the duplicated localStorage code in 3 files
- Subscribes via a small custom event so components re-render when logs change

### New section: `src/components/sections/LogbookSection.tsx`

A calendar-first logging hub replacing the current "progress" tab content above the existing stats:

- **Top row — KPIs:** Streak, total workouts, total sets this week, this month. Real numbers.
- **Big calendar (month view)** using existing `src/components/ui/calendar.tsx` (react-day-picker):
  - Custom `DayContent` renders a small thunder-orange dot/intensity square on days with logs
  - Heatmap-style background tint per day based on number of sets
  - Click a date → opens day detail panel below calendar
  - Month/Week toggle + prev/next month navigation
- **Day Detail Panel** (right side on desktop, below on mobile):
  - Shows all logs for selected date grouped by exercise
  - Each log: sets/reps/time/RPE with edit + delete buttons
  - "Log workout" button opens a quick-log dialog
- **Quick-Log Dialog (`LogWorkoutDialog`):**
  - Exercise search (autocomplete from `exercises` lib)
  - Add sets dynamically (reps OR time, optional weight + RPE)
  - Notes field, duration field
  - Save button writes via `addLog()`, toast confirms
- **Weekly trend chart** under calendar using existing `recharts`: total sets per day for last 14 days
- **CSV export button:** download all logs for the year

### Wire-up
- `Navigation.tsx`: rename "Progress" item to **"Logbook"** (icon: `CalendarDays`), point to `'logbook'` section
- `Index.tsx`: add `'logbook'` to `Section` union and route it to `<LogbookSection />`. Keep `<ProgressDashboard />` accessible for legacy stats but optional — better to merge stats into the new logbook.
- Update `ProgressDashboard.tsx`, `AnalyticsCanvas.tsx`, `CoachCareStudio.tsx` to import from `workout-log.ts` so the random heatmap becomes real data.
- Add a "📒 Log this workout" quick reply in Coach when an exercise is loaded → opens the quick-log dialog pre-filled.

---

## 3. Homepage cleanup

In `HeroSection.tsx`:
- **Remove** the entire "Section 2: Your Path — 3 Action Cards" (EXPLORE / LEARN / TRAIN block + `pathCards` const + `pathThumbs`)
- Keep: compact hero + featured skills grid + discipline pills + footer CTA
- Add a small "Today's logged sets: X" badge under the hero CTA that links to Logbook

---

## Files

| File | Action |
|------|--------|
| `supabase/functions/youtube-search/index.ts` | **NEW** — proxy YouTube Data API v3 |
| `src/lib/workout-log.ts` | **NEW** — single source of truth for logs |
| `src/components/sections/LogbookSection.tsx` | **NEW** — calendar + KPIs + day detail |
| `src/components/sections/log/LogWorkoutDialog.tsx` | **NEW** — quick-log form |
| `src/components/sections/log/CalendarHeatmap.tsx` | **NEW** — calendar with intensity dots |
| `src/components/sections/log/DayDetailPanel.tsx` | **NEW** — list/edit logs for a day |
| `src/components/CoachCare/Canvas/SocialCanvas.tsx` | Replace mock search with edge function call |
| `src/components/sections/HeroSection.tsx` | Remove path cards section |
| `src/components/layout/Navigation.tsx` | Rename Progress → Logbook, update icon |
| `src/pages/Index.tsx` | Add logbook route |
| `src/components/sections/ProgressDashboard.tsx` | Use real `workout-log.ts` data, drop `Math.random` heatmap |
| `src/components/CoachCare/Canvas/AnalyticsCanvas.tsx` | Use real `workout-log.ts` data |
| `src/components/CoachCare/CoachCareStudio.tsx` | Use real `workout-log.ts` + add "Log this" quick reply |

**6 new files, 7 modified, 0 new deps**

## Required from you

- **YouTube Data API key** (free at https://console.cloud.google.com → APIs & Services → enable "YouTube Data API v3" → create API key). I'll prompt to add it as the secret `YOUTUBE_API_KEY` once you approve.

