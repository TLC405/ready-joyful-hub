import { motion } from 'framer-motion';
import type { Exercise } from '@/lib/types';
import { cn } from '@/lib/utils';

const difficultyBadge: Record<string, string> = {
  easy: 'difficulty-easy',
  beginner: 'difficulty-beginner',
  intermediate: 'difficulty-intermediate',
  advanced: 'difficulty-advanced',
  master: 'difficulty-master',
};

interface ExerciseDetailModalProps {
  exercise: Exercise;
  onClose: () => void;
}

export function ExerciseDetailModal({ exercise, onClose }: ExerciseDetailModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 backdrop-blur-xl"
      style={{ background: 'hsla(var(--surface-0), 0.98)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 40 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 40 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        onClick={e => e.stopPropagation()}
        className="glass-premium relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 lg:p-8"
        style={{ boxShadow: 'var(--shadow-deep)' }}
      >
        {/* Drag indicator on mobile */}
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-muted-foreground/30 sm:hidden" />

        <button onClick={onClose} className="btn-raised absolute right-3 top-3 rounded-lg p-2 text-muted-foreground hover:text-foreground z-10">
          ✕
        </button>

        <div className="grid gap-5 lg:grid-cols-2">
          {exercise.image && (
            <div className="overflow-hidden rounded-xl aspect-[4/3] sm:aspect-auto" style={{ boxShadow: 'var(--shadow-brutal)' }}>
              <img src={exercise.image} alt={exercise.name} className="h-full w-full object-cover" />
            </div>
          )}
          <div className="min-w-0">
            <span className={cn("mb-2 inline-block rounded-full border px-3 py-0.5 text-label text-xs", difficultyBadge[exercise.difficulty])}>
              {exercise.difficulty.toUpperCase()}
            </span>
            <h2 className="font-chalk text-xl sm:text-2xl text-embossed">{exercise.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{exercise.description}</p>

            <div className="surface-inset mt-4 rounded-lg p-3 sm:p-4">
              <h4 className="mb-2 text-label text-sm text-primary">DO THIS</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Sets:</span> {exercise.doThis.setsRange}</p>
                {exercise.doThis.repsRange && <p><span className="text-muted-foreground">Reps:</span> {exercise.doThis.repsRange}</p>}
                {exercise.doThis.timeSecRange && <p><span className="text-muted-foreground">Hold:</span> {exercise.doThis.timeSecRange}</p>}
                <p><span className="text-muted-foreground">Rest:</span> {exercise.doThis.restSecRange}</p>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 text-label text-sm text-primary">CUES</h4>
              <ul className="space-y-1">
                {exercise.cueStack.map((cue, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{cue}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 text-label text-sm text-destructive">FAIL SIGNS</h4>
              <ul className="space-y-1">
                {exercise.failSigns.map((fs, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />{fs}</li>
                ))}
              </ul>
            </div>

            {exercise.creator && (
              <div className="mt-3 surface-inset rounded-lg p-3">
                <p className="text-xs text-muted-foreground">
                  Credit: <span className="text-foreground font-medium">{exercise.creator}</span>
                </p>
                {exercise.instagramUrl && (
                  <a
                    href={exercise.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    📸 Watch on Instagram →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {exercise.coachNotes && (
          <div className="mt-5 grid gap-3 grid-cols-1 sm:grid-cols-2">
            <div className="surface-inset rounded-lg p-3 sm:p-4">
              <h4 className="mb-1 text-label text-xs text-primary">MECHANIC</h4>
              <p className="text-sm text-foreground">{exercise.coachNotes.mechanic}</p>
            </div>
            <div className="surface-raised rounded-lg border border-primary/20 p-3 sm:p-4">
              <h4 className="mb-1 text-label text-xs text-primary">BRUTALITY</h4>
              <p className="text-sm text-foreground">{exercise.coachNotes.brutality}</p>
            </div>
            <div className="surface-raised rounded-lg border border-destructive/20 p-3 sm:p-4">
              <h4 className="mb-1 text-label text-xs text-destructive">WATCH OUT</h4>
              <p className="text-sm text-foreground">{exercise.coachNotes.watchOut}</p>
            </div>
            <div className="surface-inset rounded-lg p-3 sm:p-4">
              <h4 className="mb-1 text-label text-xs text-primary">RECOVERY</h4>
              <p className="text-sm text-foreground">{exercise.coachNotes.recoveryVector}</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
