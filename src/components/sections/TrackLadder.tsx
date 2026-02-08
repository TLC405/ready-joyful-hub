import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, FlaskConical, CheckCircle, ChevronRight, Zap, ArrowUp, Circle, Minimize2, ArrowDown, Footprints } from 'lucide-react';
import { tracks } from '@/lib/tracks';
import { getExerciseById } from '@/lib/exercises';
import type { Track, UnlockState } from '@/lib/types';
import { cn } from '@/lib/utils';

const trackIcons: Record<string, React.ElementType> = {
  Zap, ArrowUp, Circle, Minimize2, ArrowDown, Footprints,
};

// Mock unlock states (will come from DB later)
function getMockUnlockState(nodeIndex: number): UnlockState {
  if (nodeIndex === 0) return 'unlocked';
  if (nodeIndex === 1) return 'unlocked';
  if (nodeIndex === 2) return 'preview';
  if (nodeIndex === 3) return 'try_mode';
  return 'locked';
}

const stateConfig: Record<UnlockState, { icon: React.ElementType; label: string; className: string }> = {
  locked: { icon: Lock, label: 'Locked', className: 'border-border bg-secondary/30 opacity-50' },
  preview: { icon: Eye, label: 'Preview', className: 'border-muted-foreground/30 bg-secondary/50' },
  try_mode: { icon: FlaskConical, label: 'Try Mode', className: 'border-primary/40 bg-primary/5' },
  unlocked: { icon: CheckCircle, label: 'Unlocked', className: 'border-primary bg-primary/10' },
  coach_override: { icon: CheckCircle, label: 'Coach Override', className: 'border-accent bg-accent/10' },
};

export function TrackLadder() {
  const [activeTrack, setActiveTrack] = useState<string>('planche');
  const currentTrack = tracks.find(t => t.id === activeTrack)!;

  return (
    <section className="relative min-h-screen px-4 py-20 lg:px-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h2 className="font-chalk text-5xl sm:text-6xl lg:text-7xl">
          <span className="text-primary">TRACK</span> LADDER
        </h2>
        <p className="mt-2 max-w-lg text-muted-foreground">
          Follow structured progressions. Unlock skills by meeting objective tests.
        </p>
      </motion.div>

      {/* Track Selector */}
      <div className="mb-10 flex flex-wrap gap-2">
        {tracks.map((track) => {
          const Icon = trackIcons[track.icon] || Zap;
          return (
            <button
              key={track.id}
              onClick={() => setActiveTrack(track.id)}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-3 font-chalk text-sm transition-all",
                activeTrack === track.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {track.name.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Track Info */}
      <motion.div
        key={currentTrack.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 rounded-xl border border-border bg-card p-6"
      >
        <h3 className="font-chalk text-2xl text-primary">{currentTrack.name.toUpperCase()}</h3>
        <p className="mt-1 text-muted-foreground">{currentTrack.description}</p>
      </motion.div>

      {/* Ladder Nodes */}
      <div className="relative mx-auto max-w-2xl">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-4">
          {currentTrack.nodes.map((node, idx) => {
            const exercise = getExerciseById(node.exerciseId);
            if (!exercise) return null;

            const state = getMockUnlockState(idx);
            const config = stateConfig[state];
            const StateIcon = config.icon;

            return (
              <motion.div
                key={node.exerciseId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={cn(
                  "relative ml-4 flex items-center gap-4 rounded-xl border p-4 transition-all",
                  config.className,
                  state !== 'locked' && "cursor-pointer hover:border-primary"
                )}
              >
                {/* Node dot on the line */}
                <div className={cn(
                  "absolute -left-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                  state === 'unlocked' ? "border-primary bg-primary text-primary-foreground" :
                  state === 'try_mode' ? "border-primary bg-card text-primary" :
                  state === 'preview' ? "border-muted-foreground bg-card text-muted-foreground" :
                  "border-border bg-secondary text-muted-foreground"
                )}>
                  <StateIcon className="h-4 w-4" />
                </div>

                {/* Exercise image */}
                {exercise.image && (
                  <div className="hidden h-14 w-14 shrink-0 overflow-hidden rounded-lg sm:block">
                    <img src={exercise.image} alt={exercise.name} className="h-full w-full object-cover" />
                  </div>
                )}

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-chalk text-lg truncate">{exercise.name}</h4>
                    <span className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 font-chalk text-[10px]",
                      state === 'unlocked' ? "bg-primary/20 text-primary" :
                      state === 'try_mode' ? "bg-primary/10 text-primary" :
                      "bg-secondary text-muted-foreground"
                    )}>
                      {config.label.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{exercise.shortPurpose}</p>
                  {node.unlockTest && state !== 'unlocked' && state !== 'locked' && (
                    <p className="mt-1 font-chalk text-xs text-primary/70">
                      Unlock: {node.unlockTest.value} {node.unlockTest.unit}
                    </p>
                  )}
                </div>

                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
