import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, FlaskConical, CheckCircle, ChevronRight, Zap, ArrowUp, Circle, Minimize2, ArrowDown, Footprints, Hand, Triangle, GripVertical, TrendingUp, Flower2 } from 'lucide-react';
import { tracks } from '@/lib/tracks';
import { getExerciseById } from '@/lib/exercises';
import type { Exercise, UnlockState } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useProgression } from '@/hooks/use-progression';
import { ExerciseDetailModal } from '@/components/shared/ExerciseDetailModal';

const trackIcons: Record<string, React.ElementType> = {
  Zap, ArrowUp, Circle, Minimize2, ArrowDown, Footprints, Hand, Triangle, Grip: GripVertical, TrendingUp, Flower2,
};

const stateConfig: Record<UnlockState, { icon: React.ElementType; label: string; className: string }> = {
  locked: { icon: Lock, label: 'Locked', className: 'border-foreground/5 bg-surface-0 opacity-50' },
  preview: { icon: Eye, label: 'Preview', className: 'border-foreground/10 bg-card' },
  try_mode: { icon: FlaskConical, label: 'Try Mode', className: 'border-primary/30 bg-card' },
  unlocked: { icon: CheckCircle, label: 'Unlocked', className: 'border-primary bg-card' },
  coach_override: { icon: CheckCircle, label: 'Coach Override', className: 'border-primary bg-card' },
};

export function TrackLadder() {
  const [activeTrack, setActiveTrack] = useState<string>('planche');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const currentTrack = tracks.find(t => t.id === activeTrack)!;
  const { getState } = useProgression();

  return (
    <section className="relative px-4 py-8 lg:px-8">
      <div className="editorial-divider-thick mb-6 pt-2">
        <h2 className="text-editorial-sm text-foreground">TRACK LADDER</h2>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Track menu */}
        <div className="w-full shrink-0 lg:w-56">
          <div className="border border-foreground/10">
            {tracks.map((track, i) => {
              const Icon = trackIcons[track.icon] || Zap;
              const isActive = activeTrack === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => setActiveTrack(track.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                    i > 0 && "border-t border-foreground/5",
                    isActive
                      ? "bg-foreground text-card"
                      : "bg-card text-foreground hover:bg-surface-0"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1 font-chalk text-xs">{track.name}</span>
                  <span className="text-label text-[10px] opacity-60">{track.nodes.length}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-3 border border-foreground/10 bg-card p-3">
            <p className="text-xs text-muted-foreground">{currentTrack.description}</p>
          </div>
        </div>

        {/* Ladder nodes */}
        <div className="relative min-w-0 flex-1">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-foreground/10" />
          <div className="space-y-0">
            {currentTrack.nodes.map((node, idx) => {
              const exercise = getExerciseById(node.exerciseId);
              if (!exercise) return null;

              const state = getState(node.exerciseId);
              const config = stateConfig[state];
              const StateIcon = config.icon;

              return (
                <div
                  key={node.exerciseId}
                  onClick={() => state !== 'locked' && setSelectedExercise(exercise)}
                  className={cn(
                    "relative ml-6 flex items-center gap-3 border-b border-foreground/5 py-3 px-3 transition-colors",
                    config.className,
                    state !== 'locked' && "cursor-pointer hover:bg-surface-0"
                  )}
                >
                  {/* Node indicator */}
                  <div className={cn(
                    "absolute -left-6 flex h-5 w-5 shrink-0 items-center justify-center border",
                    state === 'unlocked' ? "border-primary bg-primary text-primary-foreground" :
                    state === 'try_mode' ? "border-primary bg-card text-primary" :
                    state === 'preview' ? "border-foreground/20 bg-card text-muted-foreground" :
                    "border-foreground/10 bg-surface-0 text-muted-foreground"
                  )}>
                    <StateIcon className="h-2.5 w-2.5" />
                  </div>

                  {exercise.image && (
                    <div className="hidden h-10 w-10 shrink-0 overflow-hidden border border-foreground/10 sm:block">
                      <img src={exercise.image} alt={exercise.name} className="h-full w-full object-cover" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-chalk text-sm truncate">{exercise.name}</h4>
                      <span className={cn(
                        "shrink-0 border px-1.5 py-0.5 text-label text-[9px]",
                        state === 'unlocked' ? "border-primary/30 text-primary" :
                        state === 'try_mode' ? "border-primary/20 text-primary" :
                        "border-foreground/10 text-muted-foreground"
                      )}>
                        {config.label.toUpperCase()}
                      </span>
                    </div>
                    {node.unlockTest && state !== 'unlocked' && state !== 'locked' && (
                      <p className="text-label text-[10px] text-primary/70">
                        Unlock: {node.unlockTest.value} {node.unlockTest.unit}
                      </p>
                    )}
                    {state === 'locked' && node.prereqs.length > 0 && (
                      <p className="text-label text-[10px] text-muted-foreground/60">
                        Unlock prerequisite first
                      </p>
                    )}
                  </div>

                  {state !== 'locked' && (
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedExercise && (
          <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
