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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-foreground/60"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 40 }} animate={{ y: 0 }} exit={{ y: 40 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={e => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto bg-card border border-foreground/15 sm:border-2 p-5 sm:p-6 lg:p-8"
      >
        {/* Drag indicator on mobile */}
        <div className="mx-auto mb-3 h-0.5 w-10 bg-muted-foreground/30 sm:hidden" />

        <button onClick={onClose} className="absolute right-3 top-3 border border-foreground/10 p-2 text-muted-foreground hover:bg-foreground hover:text-card transition-colors z-10">
          ✕
        </button>

        <div className="grid gap-5 lg:grid-cols-2">
          {exercise.image && (
            <div className="overflow-hidden aspect-[4/3] sm:aspect-auto border border-foreground/10">
              <img src={exercise.image} alt={exercise.name} className="h-full w-full object-cover" />
            </div>
          )}
          <div className="min-w-0">
            <span className={cn("mb-2 inline-block border px-3 py-0.5 text-label text-xs", difficultyBadge[exercise.difficulty])}>
              {exercise.difficulty.toUpperCase()}
            </span>
            <h2 className="font-chalk text-xl sm:text-2xl">{exercise.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{exercise.description}</p>

            <div className="mt-4 border border-foreground/10 p-3 sm:p-4">
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
                  <li key={i} className="flex items-start gap-2 text-sm"><span className="mt-1.5 h-1 w-1 shrink-0 bg-primary" />{cue}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h4 className="mb-2 text-label text-sm text-primary">FAIL SIGNS</h4>
              <ul className="space-y-1">
                {exercise.failSigns.map((fs, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><span className="mt-1.5 h-1 w-1 shrink-0 bg-foreground" />{fs}</li>
                ))}
              </ul>
            </div>

            {exercise.creator && (
              <div className="mt-3 border-t border-foreground/10 pt-3">
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
                    Watch on Instagram →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {exercise.coachNotes && (
          <div className="mt-5 grid gap-px bg-foreground/10 grid-cols-1 sm:grid-cols-2">
            <div className="bg-card p-3 sm:p-4">
              <h4 className="mb-1 text-label text-xs text-primary">MECHANIC</h4>
              <p className="text-sm text-foreground">{exercise.coachNotes.mechanic}</p>
            </div>
            <div className="bg-card p-3 sm:p-4">
              <h4 className="mb-1 text-label text-xs text-primary">BRUTALITY</h4>
              <p className="text-sm text-foreground">{exercise.coachNotes.brutality}</p>
            </div>
            <div className="bg-card p-3 sm:p-4">
              <h4 className="mb-1 text-label text-xs text-primary">WATCH OUT</h4>
              <p className="text-sm text-foreground">{exercise.coachNotes.watchOut}</p>
            </div>
            <div className="bg-card p-3 sm:p-4">
              <h4 className="mb-1 text-label text-xs text-primary">RECOVERY</h4>
              <p className="text-sm text-foreground">{exercise.coachNotes.recoveryVector}</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
