

# Rebrand to TLC + Unlock Everything + Add Settings with Download

## What Changes

### 1. Rebrand: Remove all Lovable/STK/STACKED → TLC

| Location | Current | New |
|----------|---------|-----|
| `index.html` | "Lovable App", Lovable meta tags, lovable OG images | "TLC Calisthenics", TLC meta, remove lovable OG image URLs |
| `Navigation.tsx` | `STK` logo, `STACKED` text | `TLC` logo, `TLC CALISTHENICS` text |
| `DownloadSection.tsx` | "Built with ❤️ using Lovable" | "Built with ❤️ by TLC" |
| `HeroSection.tsx` | "MASTER YOUR STACK" | "MASTER YOUR BODY" |

### 2. Unlock Everything — Remove All Gating

- **SubscriptionPlans.tsx**: Remove locked features arrays. Show single "ALL ACCESS" plan with everything included, no paywall UI
- **ProgressDashboard.tsx**: Set all achievements to `unlocked: true`, remove opacity/disabled states
- **SkillsLibrary.tsx / ExerciseLibrary.tsx**: Remove any lock icons or premium badges — all exercises fully accessible
- **HeroSection.tsx**: Stats show full counts (e.g., `14/14` skills instead of `3/14`)

### 3. Replace ADMIN with SETTINGS Section

Rename the "ADMIN" nav item to "SETTINGS". Replace the current `AdminPanel` content with a full Settings page containing:

- **Profile section** — Display name, bio, units preference (mock editable fields)
- **Appearance** — Theme toggle (reuse existing dark/light), accent color selector
- **Training preferences** — Rest timer default, difficulty filter default, notification toggles
- **Data** — Export training data (JSON), clear local data button
- **App Download** — Integrate `DownloadSection` content here (ZIP download, GitHub link, what's included grid, Capacitor info)
- **About** — App version, "TLC Calisthenics v1.0", credits

All wrapped in skeuomorphic `surface-raised` cards with `surface-inset` form fields.

### 4. Navigation Icon Update

Change ADMIN's `Settings` icon stays the same, just relabel to "SETTINGS".

## Files Changed

| File | Change |
|------|--------|
| `index.html` | Replace all Lovable branding with TLC |
| `src/components/layout/Navigation.tsx` | `STK` → `TLC`, `STACKED` → `TLC CALISTHENICS`, `ADMIN` → `SETTINGS`, nav id `admin` → `settings` |
| `src/components/sections/HeroSection.tsx` | "MASTER YOUR STACK" → "MASTER YOUR BODY", stats `3/14` → `14/14` |
| `src/components/sections/DownloadSection.tsx` | Remove Lovable footer text → "Built with ❤️ by TLC" |
| `src/components/sections/ProgressDashboard.tsx` | All achievements `unlocked: true` |
| `src/components/sections/SubscriptionPlans.tsx` | Remove locked arrays, single unlocked plan, or delete file entirely |
| `src/components/sections/AdminPanel.tsx` | **Full rewrite** → `SettingsPanel.tsx`: Profile, Appearance, Training, Data/Download, About sections |
| `src/pages/Index.tsx` | Update Section type `admin` → `settings`, render `SettingsPanel` instead of `AdminPanel`, remove SubscriptionPlans if unused |

**~8 files changed, 0 new files, 0 new dependencies**

