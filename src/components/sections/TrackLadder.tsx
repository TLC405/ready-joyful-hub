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
  locked: { icon: Lock, label: 'Locked', className: 'border-border bg-surface-0 opacity-50' },
  preview: { icon: Eye, label: 'Preview', className: 'border-muted-foreground/30 bg-surface-1' },
  try_mode: { icon: FlaskConical, label: 'Try Mode', className: 'border-primary/40 bg-primary/5' },
  unlocked: { icon: CheckCircle, label: 'Unlocked', className: 'border-primary bg-primary/10' },
  coach_override: { icon: CheckCircle, label: 'Coach Override', className: 'border-accent bg-accent/10' },
};

const nodeVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.04, type: 'spring' as const, stiffness: 350, damping: 22 }
  })
};

export function TrackLadder() {
  const [activeTrack, setActiveTrack] = useState<string>('planche');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const currentTrack = tracks.find(t => t.id === activeTrack)!;
  const { getState } = useProgression();

  return (
    <section className="relative px-4 py-8 lg:px-8">
      <motion.h2 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-4 font-chalk text-2xl text-embossed sm:text-3xl"
      >
        <span className="text-primary">TRACK</span> LADDER
      </motion.h2>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Left: track menu */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="w-full shrink-0 space-y-1 lg:w-60"
        >
          {tracks.map((track) => {
            const Icon = trackIcons[track.icon] || Zap;
            const isActive = activeTrack === track.id;
            return (
              <motion.button
                key={track.id}
                whileHover={{ x: 4, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTrack(track.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all",
                  isActive
                    ? "surface-inset text-primary"
                    : "btn-raised text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="flex-1 font-chalk">{track.name}</span>
                <span className="rounded bg-surface-1 px-1.5 py-0.5 text-label text-[10px] text-muted-foreground">
                  {track.nodes.length}
                </span>
              </motion.button>
            );
          })}
          <motion.div 
            layout
            className="surface-inset mt-3 rounded-lg p-3"
          >
            <p className="text-xs text-muted-foreground">{currentTrack.description}</p>
          </motion.div>
        </motion.div>

        {/* Right: ladder nodes */}
        <div className="relative min-w-0 flex-1">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-2">
            {currentTrack.nodes.map((node, idx) => {
              const exercise = getExerciseById(node.exerciseId);
              if (!exercise) return null;

              const state = getState(node.exerciseId);
              const config = stateConfig[state];
              const StateIcon = config.icon;

              return (
                <motion.div
                  key={node.exerciseId}
                  custom={idx}
                  variants={nodeVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={state !== 'locked' ? { x: 4, transition: { duration: 0.15 } } : {}}
                  onClick={() => state !== 'locked' && setSelectedExercise(exercise)}
                  className={cn(
                    "relative ml-2 flex items-center gap-3 rounded-lg border p-3 transition-all",
                    config.className,
                    state !== 'locked' && "cursor-pointer surface-raised active:scale-[0.98]"
                  )}
                >
                  <div className={cn(
                    "absolute -left-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                    state === 'unlocked' ? "badge-coin border-primary bg-primary text-primary-foreground" :
                    state === 'try_mode' ? "border-primary bg-surface-1 text-primary" :
                    state === 'preview' ? "border-muted-foreground bg-surface-1 text-muted-foreground" :
                    "border-border bg-surface-0 text-muted-foreground"
                  )}>
                    <StateIcon className="h-3 w-3" />
                  </div>

                  {exercise.image && (
                    <div className="hidden h-10 w-10 shrink-0 overflow-hidden rounded sm:block" style={{ boxShadow: 'var(--shadow-card)' }}>
                      <img src={exercise.image} alt={exercise.name} className="h-full w-full object-cover" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-chalk text-sm truncate">{exercise.name}</h4>
                      <span className={cn(
                        "shrink-0 rounded-full px-1.5 py-0.5 text-label text-[9px]",
                        state === 'unlocked' ? "bg-primary/20 text-primary" :
                        state === 'try_mode' ? "bg-primary/10 text-primary" :
                        "bg-surface-1 text-muted-foreground"
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
                    <span className="text-[9px] text-muted-foreground/50 shrink-0 hidden sm:block">TAP</span>
                  )}
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </motion.div>
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
