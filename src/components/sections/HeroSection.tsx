import { useEffect, useMemo, useState } from 'react';
import { Bot, CalendarDays, ChevronRight, Dumbbell, Play, Search, Sparkles, Target, TrendingUp } from 'lucide-react';
import { WorkoutCalendar } from '@/components/workout/WorkoutCalendar';
import { useWorkoutLogs } from '@/hooks/use-workout-logs';
import { useLearningProgress } from '@/hooks/use-learning-progress';
import { learningPaths } from '@/lib/learning-paths';
import { getExerciseById } from '@/lib/exercises';
import { getTLCRecommendation, loadAthleteProfile, type AthleteProfile } from '@/lib/athlete-profile';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  onCategoryClick?: (category: string) => void;
  onNavigate?: (section: string) => void;
  onOpenAssessment?: () => void;
}

const quickFilters = [
  ['Push', 'push'], ['Pull', 'pull'], ['Legs', 'legs'], ['Core', 'core'],
  ['Skills', 'skills'], ['Mobility', 'mobility'], ['Yoga', 'yoga'], ['Rings', 'rings'],
] as const;

export function HeroSection({ onCategoryClick, onNavigate, onOpenAssessment }: HeroSectionProps) {
  const navigate = useNavigate();
  const { logs, streak } = useWorkoutLogs();
  const { state, pathProgress } = useLearningProgress();
  const [profile, setProfile] = useState<AthleteProfile | null>(() => loadAthleteProfile());
  const activePaths = learningPaths.filter(path => state.selectedPathIds.includes(path.id)).slice(0, 3);
  const activeWorkoutId = typeof window !== 'undefined' ? localStorage.getItem('tlc-active-workout-v2') : null;
  const recommendation = profile ? getTLCRecommendation(profile) : null;

  useEffect(() => {
    const refresh = () => setProfile(loadAthleteProfile());
    window.addEventListener('tlc-profile-updated', refresh as EventListener);
    return () => window.removeEventListener('tlc-profile-updated', refresh as EventListener);
  }, []);

  const recent = useMemo(() => logs.slice(0, 3), [logs]);
  const todayLabel = new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date());

  return (
    <div className="mx-auto max-w-6xl space-y-5 px-4 py-5 lg:px-8 lg:py-7">
      <header className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">CONTROL TLC</div>
          <h1 className="mt-1 font-chalk text-2xl text-foreground md:text-3xl">Ready to train?</h1>
          <p className="mt-1 text-sm text-muted-foreground">{todayLabel}</p>
        </div>
        {streak > 0 && <button onClick={() => onNavigate?.('progress')} className="rounded-full border border-border bg-card px-3 py-2 font-mono text-xs tabular-nums shadow-sm">{streak} day streak</button>}
      </header>

      <section className="rounded-2xl border border-primary/25 bg-primary/5 p-4 shadow-sm" aria-label="TLC AI recommendation">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-primary"><Sparkles className="h-3.5 w-3.5" /> TLC AI recommends</div>
              <h2 className="mt-1 font-chalk text-lg text-foreground">{recommendation ? recommendation.headline : 'Let me find your real starting point'}</h2>
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">{recommendation ? recommendation.firstAction : 'Answer a short capability assessment. TLC AI will configure a workout and learning route from your goals, equipment, schedule, and current capacity.'}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            {recommendation ? <button onClick={() => onNavigate?.('train')} className="min-h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm">Do this now</button> : <button onClick={onOpenAssessment} className="min-h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm">Start assessment</button>}
            <button onClick={onOpenAssessment} className="min-h-11 rounded-xl border border-border bg-card px-4 text-xs font-semibold text-foreground hover:bg-muted">{recommendation ? 'Update answers' : 'How it works'}</button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-md" aria-label="Today's workout">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-primary"><Dumbbell className="h-4 w-4" /> Today's workout</div>
            <h2 className="mt-2 font-chalk text-2xl text-foreground">{activeWorkoutId ? 'Continue your selected workout' : 'Start with a simple workout'}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Choose a beginner foundation, push, pull, legs, or skill session. Every movement opens to instructions, regressions, and progressions.</p>
          </div>
          <button onClick={() => onNavigate?.('train')} className="flex min-h-12 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm transition-transform active:scale-[0.97]">
            <Play className="h-4 w-4" /> {activeWorkoutId ? 'Resume workout' : 'Choose workout'}
          </button>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm" aria-label="Training calendar">
          <div className="mb-3 flex items-center justify-between">
            <div><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-primary"><CalendarDays className="h-4 w-4" /> Calendar</div><h2 className="mt-1 font-chalk text-lg">See your training week</h2></div>
            <button onClick={() => onNavigate?.('progress')} className="text-xs font-semibold text-primary">Full history</button>
          </div>
          <WorkoutCalendar compact />
        </section>

        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm" aria-label="Active progressions">
          <div className="mb-3 flex items-center justify-between">
            <div><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-primary"><Target className="h-4 w-4" /> Your progressions</div><h2 className="mt-1 font-chalk text-lg">Know exactly where you are</h2></div>
            <button onClick={() => onNavigate?.('skills')} className="text-xs font-semibold text-primary">All paths</button>
          </div>
          <div className="space-y-2">
            {activePaths.map(path => {
              const progress = pathProgress(path.id);
              const current = path.steps[progress.currentIndex];
              return (
                <button key={path.id} onClick={() => onNavigate?.('skills')} className="group flex w-full items-center gap-3 rounded-xl border border-border bg-background p-3 text-left hover:border-primary/40">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-xs font-bold text-primary">{progress.percent}%</div>
                  <div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-foreground">{path.shortName}</div><div className="truncate text-xs text-muted-foreground">Next: {current?.title}</div></div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </button>
              );
            })}
            {activePaths.length === 0 && <button onClick={() => onNavigate?.('skills')} className="w-full rounded-xl border border-dashed border-border p-4 text-left text-sm text-muted-foreground">Choose a progression goal to begin.</button>}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm" aria-label="Find an exercise">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-primary"><Search className="h-4 w-4" /> Find an exercise</div><h2 className="mt-1 font-chalk text-lg">Search by movement or goal</h2></div>
          <button onClick={() => onNavigate?.('library')} className="min-h-11 rounded-lg border border-border px-4 text-xs font-semibold hover:bg-muted">Open Library</button>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {quickFilters.map(([label, category]) => <button key={label} onClick={() => onCategoryClick?.(category)} className="shrink-0 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold hover:border-primary/50 hover:bg-muted">{label}</button>)}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4 shadow-sm" aria-label="Recent progress">
        <div className="mb-3 flex items-center justify-between"><div><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-primary"><TrendingUp className="h-4 w-4" /> Recent progress</div><h2 className="mt-1 font-chalk text-lg">Your latest work</h2></div><button onClick={() => onNavigate?.('progress')} className="text-xs font-semibold text-primary">View progress</button></div>
        {recent.length > 0 ? <div className="divide-y divide-border">{recent.map(item => <button key={item.id} onClick={() => { const ex = getExerciseById(item.exercise_id); if (ex) navigate(`/video/${ex.id}`); }} className="flex min-h-14 w-full items-center justify-between gap-3 text-left"><div className="min-w-0"><div className="truncate text-sm font-semibold text-foreground">{item.exercise_name}</div><div className="text-xs text-muted-foreground">{[item.sets && `${item.sets} sets`, item.reps && `${item.reps} reps`, item.duration_seconds && `${item.duration_seconds}s`].filter(Boolean).join(' · ') || 'Workout logged'}</div></div><time className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">{new Date(item.logged_at).toLocaleDateString()}</time></button>)}</div> : <div className="rounded-xl border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">Your completed exercises will appear here. No fake progress is shown.</div>}
      </section>
    </div>
  );
}
