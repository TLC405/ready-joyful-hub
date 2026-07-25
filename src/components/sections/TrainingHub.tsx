import { useMemo, useState } from 'react';
import { ChevronRight, Clock3, Dumbbell, Play, Plus, RotateCcw, Sparkles } from 'lucide-react';
import { getExerciseById } from '@/lib/exercises';
import { ExerciseDetailModal } from '@/components/shared/ExerciseDetailModal';
import type { Exercise } from '@/lib/types';
import { cn } from '@/lib/utils';

interface WorkoutTemplate {
  id: string;
  name: string;
  goal: string;
  duration: string;
  equipment: string;
  exerciseIds: string[];
}

const templates: WorkoutTemplate[] = [
  { id: 'foundation-a', name: 'Foundation A', goal: 'Push · Legs · Core', duration: '25–35 min', equipment: 'Floor + chair', exerciseIds: ['bodyweight-squat', 'push-up', 'bulgarian-split-squat', 'hollow-body-hold', 'calf-raise'] },
  { id: 'foundation-b', name: 'Foundation B', goal: 'Pull · Support · Mobility', duration: '25–35 min', equipment: 'Low bar or rings', exerciseIds: ['australian-row', 'plank', 'dead-hang', 'cossack-squat', 'worlds-greatest-stretch'] },
  { id: 'push', name: 'Push Strength', goal: 'Chest · Shoulders · Triceps', duration: '30–45 min', equipment: 'Floor or parallettes', exerciseIds: ['push-up', 'pike-push-up', 'parallel-bar-dip', 'pseudo-planche-push-up', 'hollow-body-hold'] },
  { id: 'pull', name: 'Pull Strength', goal: 'Back · Biceps · Grip', duration: '30–45 min', equipment: 'Bar or rings', exerciseIds: ['australian-row', 'dead-hang', 'chin-up', 'pull-up', 'hanging-leg-raise'] },
  { id: 'legs', name: 'Legs + Balance', goal: 'Strength · Feet · Hips', duration: '30–40 min', equipment: 'Floor + chair', exerciseIds: ['bodyweight-squat', 'bulgarian-split-squat', 'cossack-squat', 'calf-raise', 'tree-pose'] },
  { id: 'skill', name: 'Skill + Mobility', goal: 'Handstand · Compression · Recovery', duration: '20–35 min', equipment: 'Wall + floor', exerciseIds: ['hollow-body-hold', 'pike-push-up', 'chest-to-wall-handstand', 'seated-pike-lift', 'pancake-stretch'] },
];

const SESSION_KEY = 'tlc-active-workout-v2';

export function TrainingHub() {
  const [selectedId, setSelectedId] = useState(() => localStorage.getItem(SESSION_KEY) || 'foundation-a');
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const selected = templates.find(template => template.id === selectedId) || templates[0];

  const exercises = useMemo(() => selected.exerciseIds.map(getExerciseById).filter(Boolean) as Exercise[], [selected]);

  const chooseTemplate = (id: string) => {
    setSelectedId(id);
    setCompleted([]);
    localStorage.setItem(SESSION_KEY, id);
  };

  const toggleComplete = (id: string) => {
    setCompleted(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    navigator.vibrate?.(20);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-6 lg:px-8">
      <div className="mb-5">
        <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary">Train</div>
        <h2 className="mt-1 font-chalk text-2xl text-foreground md:text-3xl">Choose a workout and begin</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Simple templates from beginner foundations to focused strength and skill work. Open any movement to learn it before adding intensity.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 hide-scrollbar">
        {templates.map(template => (
          <button key={template.id} onClick={() => chooseTemplate(template.id)} className={cn('shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors', selected.id === template.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:bg-muted')}>
            {template.name}
          </button>
        ))}
      </div>

      <div className="mt-2 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-primary"><Sparkles className="h-3.5 w-3.5" /> Current workout</div>
            <h3 className="mt-2 font-chalk text-2xl text-foreground">{selected.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{selected.goal}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {selected.duration}</span>
              <span className="inline-flex items-center gap-1"><Dumbbell className="h-3.5 w-3.5" /> {selected.equipment}</span>
              <span className="font-mono tabular-nums">{exercises.length} movements</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCompleted([])} className="flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 text-xs font-semibold hover:bg-muted"><RotateCcw className="h-4 w-4" /> Reset</button>
            <button onClick={() => document.getElementById('workout-list')?.scrollIntoView({ behavior: 'smooth' })} className="flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-sm"><Play className="h-4 w-4" /> Start</button>
          </div>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${exercises.length ? (completed.length / exercises.length) * 100 : 0}%` }} />
        </div>
      </div>

      <div id="workout-list" className="mt-4 space-y-2">
        {exercises.map((item, index) => {
          const done = completed.includes(item.id);
          return (
            <article key={item.id} className={cn('flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm', done ? 'border-success/40 bg-success/5' : 'border-border')}>
              <button onClick={() => toggleComplete(item.id)} className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-mono text-xs', done ? 'border-success bg-success text-success-foreground' : 'border-border bg-background')} aria-label={done ? `Mark ${item.name} incomplete` : `Mark ${item.name} complete`}>
                {done ? '✓' : index + 1}
              </button>
              <button onClick={() => setExercise(item)} className="min-w-0 flex-1 text-left">
                <h4 className={cn('font-chalk text-sm text-foreground', done && 'line-through opacity-60')}>{item.name}</h4>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{item.doThis.setsRange} sets · {item.doThis.repsRange || item.doThis.timeSecRange || 'quality practice'} · rest {item.doThis.restSecRange}</p>
              </button>
              <button onClick={() => setExercise(item)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-muted" aria-label={`Learn ${item.name}`}><ChevronRight className="h-4 w-4" /></button>
            </article>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-dashed border-border bg-muted/40 p-5">
        <div className="flex items-start gap-3"><Plus className="mt-0.5 h-5 w-5 text-primary" /><div><h3 className="font-chalk text-base">Builder upgrade included</h3><p className="mt-1 text-sm text-muted-foreground">The next data phase can persist custom templates, reorder exercises, and send Coach TLC workouts directly into this screen. This version establishes the simplified workout loop without inventing history.</p></div></div>
      </div>

      {exercise && <ExerciseDetailModal exercise={exercise} onClose={() => setExercise(null)} />}
    </section>
  );
}
