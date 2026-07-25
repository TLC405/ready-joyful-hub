# CONTROL TLC — TLC AI Handoff for Lovable

## Repository context

Extend the existing implementation. Do not start from an empty template.

- Repository: `TLC405/ready-joyful-hub`
- Branch: `agent/beginner-first-prime-rebuild`
- Draft PR: `#1 Beginner-first CONTROL TLC prime rebuild`

Run the project and inspect the current branch before editing.

## Product goal

CONTROL TLC is a workout-first calisthenics learning app. The intelligent guide is named **TLC AI** everywhere. TLC AI is not a separate novelty chat tab; it connects Home, Train, Skills, Library, Progress, Learn, and Settings.

A user should quickly understand:

1. What should I train today?
2. What am I currently capable of?
3. Which progression path fits me?
4. What is the smallest useful next step?
5. Where do I go in the app to do it?

## Work already added

Preserve and verify:

- Workout-first Home.
- Navigation: Home · Train · Skills · Library · Progress.
- Beginner-first learning paths replacing the inaccurate skill tree.
- `src/lib/athlete-profile.ts` with assessment data, recommendation rules, and local persistence.
- `src/components/onboarding/TLCAIAssessment.tsx`.
- `src/components/shared/TLCAIGuide.tsx`.
- TLC AI chat receives assessment context.
- Streaming chat now uses the signed-in user's Supabase access token.
- `supabase/functions/coach-chat/index.ts` is branded and prompted as TLC AI.

## Assessment

Show it for new users, when the user chooses “Update my assessment,” or when their schedule/equipment/limitations materially change.

Collect only inputs that change recommendations:

- Experience.
- Up to three goals.
- Clean push-up, row, pull-up, squat, hollow-hold, wall-handstand, and mobility capacity.
- Days per week and minutes per session.
- Equipment available most weeks.
- Current limiting or painful areas.
- Preferred coaching style: supportive, direct, or technical.

Use “Not yet” rather than failure language. Do not require maximum-effort tests or calculate a fake overall readiness score.

## Recommendation rules

The output must include up to three path IDs, one workout ID, a reason, and one first action.

- Use `start-here` when basic push, pull, squat, or trunk foundations are missing.
- Use `pull-up` before front lever when pulling capacity is insufficient.
- Use foundations before planche when straight-arm pushing and trunk control are insufficient.
- Use rings foundations before muscle-up work.
- Treat mobility as a parallel practice rather than a fake linear unlock tree.
- Respect real equipment and session duration.
- Pain flags modify suggestions but never diagnose.

Applying a recommendation should set the active workout, follow the recommended paths, set the current path, and update Home.

## TLC AI across the app

**Home:** recommend one action, explain why, resume workout, open current path, or start assessment.

**Train:** explain workout selection, offer approved regressions, adjust session duration, add warm-up, and start timers.

**Skills:** show “You are here,” explain readiness checks, and present alternative routes where progression can branch.

**Library:** search by movement, muscle, goal, equipment, and difficulty; recommend regressions; add an exercise after confirmation.

**Progress:** summarize only real logs. Never invent PRs, streaks, volume, mastery, or completed sessions.

**Learn:** recommend the shortest relevant lesson and resume incomplete learning.

## Typed action layer

Do not execute arbitrary side effects from AI prose. Add a validated action dispatcher:

```ts
type TLCAction =
  | { type: 'NAVIGATE'; section: 'home' | 'train' | 'skills' | 'library' | 'progress' | 'learn' | 'settings' }
  | { type: 'OPEN_ASSESSMENT' }
  | { type: 'SELECT_WORKOUT'; workoutId: string }
  | { type: 'FOLLOW_PATH'; pathId: string }
  | { type: 'OPEN_PATH'; pathId: string }
  | { type: 'FILTER_LIBRARY'; query?: string; category?: string; equipment?: string[] }
  | { type: 'ADD_EXERCISE'; exerciseId: string }
  | { type: 'SWAP_EXERCISE'; fromExerciseId: string; toExerciseId: string }
  | { type: 'SET_SESSION_LENGTH'; minutes: 20 | 30 | 45 | 60 }
  | { type: 'START_REST_TIMER'; seconds: number }
  | { type: 'CREATE_CHANGE_REQUEST'; title: string; description: string; affectedFiles?: string[] };
```

Execute navigation, opening, filtering, and timers immediately. Require visible confirmation for workout changes, exercise mutations, assessment changes, progress completion, deletion, export, or sharing.

Validate all IDs against current app data. Show success/failure feedback. Keep an action audit for debugging.

## Code-change boundary

Ordinary TLC AI users must not be told that production code was silently changed or deployed.

For app-development requests, TLC AI should create a **Change Request** containing:

- Goal and reason.
- User impact.
- Affected screens and likely files.
- Data changes.
- Acceptance criteria.
- Risks and tests.

Provide actions such as “Copy for Lovable” or “Create GitHub issue.” A code change is only complete after the repository changed and validation ran.

## Chat requirements

- Visible identity is TLC AI everywhere.
- Stream responses and render safe Markdown.
- Persist one conversation initially.
- Cancel active requests on unmount or stop.
- Send only useful context: assessment, current screen, active workout, current path/step, limited recent real logs, equipment, pain flags, and coaching style.
- Return structured actions separately from prose and render them as action cards.
- Never expose raw action JSON to the user.

## Accuracy and safety

- Do not diagnose.
- Sharp pain, neurological symptoms, severe swelling, trauma, chest pain, fainting, or worsening symptoms require stopping the provoking activity and appropriate professional care.
- Never fabricate video analysis. Remove the current legacy hard-coded video score/timestamps or replace them with an honest unsupported state until genuine analysis exists.
- Never fabricate workout history, progress, ratings, readiness, or records.
- Require repeatable quality across separate sessions for progression readiness.

## Persistence

Local storage is acceptable for the first release. For signed-in cross-device sync, add Supabase tables for athlete profiles, goals, path progress, active workouts, workout sessions, workout sets, and AI action audit. Use row-level security so users access only their own records.

## UI direction

- Premium, restrained, workout-focused.
- Solid surfaces, no neon, no decorative glow.
- Avoid gradients as primary hierarchy.
- Space Grotesk headings and Inter body.
- Tabular numerals.
- Minimum 44 px touch targets.
- Visible focus rings and reduced-motion support.
- Safe-area-aware bottom navigation.
- Use dynamic viewport units, not `h-screen`.
- TLC AI should feel like a premium training concierge, not customer support.

## Acceptance criteria

- New-user assessment finishes in roughly two minutes.
- Assessment creates a real workout and learning route.
- TLC AI is available from every primary screen.
- TLC AI uses the signed-in access token and assessment context.
- Every action is allowlisted and validated.
- Training-plan changes require confirmation.
- No fabricated personal data or video analysis remains.
- Run and pass:

```bash
npm install
npm run build
npm run lint
npm test
```

Fix errors rather than suppressing them.

## Implementation order

1. Build the current branch and fix compile errors.
2. Verify assessment and persistent TLC AI guide.
3. Complete TLC AI naming sweep.
4. Remove fake video analysis.
5. Add typed action dispatcher and confirmation UI.
6. Connect chat action cards.
7. Add current app context to AI requests.
8. Add the Home recommendation card.
9. Add Supabase persistence and RLS.
10. Add tests for recommendation rules and action validation.
11. Run mobile, accessibility, and safe-area QA.
12. Update Draft PR #1 with validation results.

**Final rule:** TLC AI must reduce confusion. Every recommendation ends in a clear in-app action, every advanced path respects foundations, and every personal claim comes from real user input or real logged data.
