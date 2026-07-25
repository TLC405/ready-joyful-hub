import { useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Circle, Dumbbell, GraduationCap, LockKeyhole, Route, Sparkles, Target } from 'lucide-react';
import { learningPaths, type LearningPathGroup } from '@/lib/learning-paths';
import { useLearningProgress } from '@/hooks/use-learning-progress';
import { getExerciseById } from '@/lib/exercises';
import { ExerciseDetailModal } from '@/components/shared/ExerciseDetailModal';
import type { Exercise } from '@/lib/types';
import { cn } from '@/lib/utils';

const groups: { id: LearningPathGroup; label: string; icon: React.ElementType }[] = [
  { id: 'start', label: 'Start Here', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Sparkles },
  { id: 'strength', label: 'Strength', icon: Dumbbell },
  { id: 'mobility', label: 'Mobility', icon: Route },
];

export function BeginnerSkillHub({ embedded = false }: { embedded?: boolean }) {
  const { state, togglePath, setLastPath, toggleCheck, markStepComplete, pathProgress } = useLearningProgress();
  const [group, setGroup] = useState<LearningPathGroup>('start');
  const [pathId, setPathId] = useState('');
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const paths = useMemo(() => learningPaths.filter(path => path.group === group), [group]);
  const path = learningPaths.find(item => item.id === pathId);

  if (path) {
    const progress = pathProgress(path.id);
    return (
      <section className={cn('mx-auto max-w-4xl', embedded ? 'py-2' : 'px-4 py-6 lg:px-8')}>
        <button onClick={() => setPathId('')} className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-3 text-sm font-semibold shadow-sm hover:bg-muted"><ChevronLeft className="h-4 w-4" /> All paths</button>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl"><div className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">{path.level} · {path.frequency}</div><h2 className="font-chalk text-2xl md:text-3xl">{path.name}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{path.description}</p><p className="mt-2 text-xs text-muted-foreground">Equipment: {path.equipment.join(' · ')}</p></div>
            <button onClick={() => togglePath(path.id)} className={cn('min-h-11 rounded-lg border px-4 text-sm font-semibold', state.selectedPathIds.includes(path.id) ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background')}>{state.selectedPathIds.includes(path.id) ? 'Following' : 'Follow path'}</button>
          </div>
          <div className="mt-5 flex items-center gap-3"><div className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${progress.percent}%` }} /></div><span className="font-mono text-xs tabular-nums text-muted-foreground">{progress.complete}/{progress.total}</span></div>
        </div>

        <div className="mt-4 space-y-3">
          {path.steps.map((step, index) => {
            const complete = state.completedStepIds.includes(step.id);
            const current = index === progress.currentIndex && !complete;
            const linkedExercise = step.exerciseId ? getExerciseById(step.exerciseId) : undefined;
            return (
              <article key={step.id} className={cn('rounded-2xl border bg-card p-4 shadow-sm transition-[box-shadow,border-color] duration-150', complete && 'border-success/40', current && 'border-primary shadow-md')}>
                <div className="flex gap-3">
                  <button onClick={() => markStepComplete(step.id, !complete)} className={cn('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border', complete ? 'border-success bg-success text-success-foreground' : current ? 'border-primary text-primary' : 'border-border text-muted-foreground')} aria-label={complete ? `Mark ${step.title} incomplete` : `Mark ${step.title} complete`}>{complete ? <Check className="h-4 w-4" /> : <span className="font-mono text-xs">{index + 1}</span>}</button>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><h3 className="font-chalk text-base">{step.title}</h3>{current && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">You are here</span>}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{step.purpose}</p>
                    <div className="mt-3 rounded-xl bg-muted/60 p-3"><div className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Practice</div><div className="mt-1 font-mono text-sm tabular-nums">{step.prescription}</div>{step.cues.length > 0 && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Focus: {step.cues.join(' · ')}</p>}</div>
                    {step.alternatives && <p className="mt-2 text-xs text-muted-foreground"><strong className="text-foreground">Choose the cleanest route:</strong> {step.alternatives.join(' · ')}</p>}
                    <div className="mt-3 space-y-2">{step.checks.map(check => { const checked = state.completedCheckIds.includes(check.id); return <button key={check.id} onClick={() => toggleCheck(check.id)} className="flex w-full items-start gap-2 rounded-lg border border-border bg-background p-3 text-left text-sm hover:border-primary/50"><span className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border', checked ? 'border-success bg-success text-success-foreground' : 'border-border')}>{checked && <Check className="h-3 w-3" />}</span><span>{check.label}</span></button>; })}</div>
                    {linkedExercise && <button onClick={() => setExercise(linkedExercise)} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg border border-border px-3 text-xs font-semibold hover:bg-muted">Learn {linkedExercise.name}<ChevronRight className="h-3.5 w-3.5" /></button>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {exercise && <ExerciseDetailModal exercise={exercise} onClose={() => setExercise(null)} />}
      </section>
    );
  }

  return (
    <section className={cn('mx-auto max-w-6xl', embedded ? 'py-2' : 'px-4 py-6 lg:px-8')}>
      <div className="mb-5"><div className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">Learn from zero</div><h2 className="mt-1 font-chalk text-2xl md:text-3xl">Choose one clear path</h2><p className="mt-2 max-w-2xl text-sm text-muted-foreground">No giant maze. Start with foundations, then follow the goal you care about. Every path explains what to practice and what demonstrates readiness.</p></div>
      <div className="mb-5 grid grid-cols-4 gap-1 rounded-xl border border-border bg-muted p-1">{groups.map(item => { const Icon = item.icon; return <button key={item.id} onClick={() => setGroup(item.id)} className={cn('flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg px-2 text-[10px] font-bold sm:flex-row sm:text-xs', group === item.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}><Icon className="h-4 w-4" />{item.label}</button>; })}</div>
      <div className="grid gap-3 md:grid-cols-2">{paths.map(item => { const progress = pathProgress(item.id); const current = item.steps[progress.currentIndex]; return <button key={item.id} onClick={() => { setPathId(item.id); setLastPath(item.id); }} className="group rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"><div className="flex items-start justify-between gap-3"><div><span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">{item.level}</span><h3 className="mt-1 font-chalk text-lg">{item.name}</h3></div>{state.selectedPathIds.includes(item.id) ? <Target className="h-5 w-5 text-primary" /> : progress.complete > 0 ? <Circle className="h-5 w-5 text-muted-foreground" /> : <LockKeyhole className="h-5 w-5 text-muted-foreground/60" />}</div><p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.description}</p><div className="mt-4 rounded-xl bg-muted/60 p-3"><div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{progress.complete > 0 ? 'Current step' : 'First step'}</div><div className="mt-1 text-sm font-semibold">{current?.title}</div></div><div className="mt-4 flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${progress.percent}%` }} /></div><span className="font-mono text-[11px] tabular-nums text-muted-foreground">{progress.percent}%</span><ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" /></div></button>; })}</div>
    </section>
  );
}
