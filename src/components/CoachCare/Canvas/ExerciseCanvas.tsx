import { motion } from 'framer-motion';
import { Dumbbell, Target, AlertTriangle } from 'lucide-react';
import { ExerciseCanvasData } from '../types';
import { getExerciseById } from '@/lib/exercises';
import { cn } from '@/lib/utils';

const difficultyBadge: Record<string, string> = {
  easy: 'difficulty-easy',
  beginner: 'difficulty-beginner',
  intermediate: 'difficulty-intermediate',
  advanced: 'difficulty-advanced',
  master: 'difficulty-master',
};

interface ExerciseCanvasProps {
  data: ExerciseCanvasData;
}

export function ExerciseCanvas({ data }: ExerciseCanvasProps) {
  const exercise = getExerciseById(data.exerciseId);
  if (!exercise) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Exercise not found</p>
      </div>
    );
  }

  return (
    <div className="hide-scrollbar h-full overflow-y-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Image */}
        {exercise.image && (
          <div className="surface-inset overflow-hidden rounded-xl">
            <img src={exercise.image} alt={exercise.name} className="h-48 w-full object-cover" />
          </div>
        )}

        {/* Header */}
        <div className="surface-raised rounded-xl p-4">
          <span className={cn("mb-2 inline-block rounded-full border px-2.5 py-0.5 text-label text-[10px]", difficultyBadge[exercise.difficulty])}>
            {exercise.difficulty.toUpperCase()}
          </span>
          <h3 className="font-chalk text-2xl text-embossed">{exercise.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{exercise.description}</p>
        </div>

        {/* Do This */}
        <div className="surface-inset rounded-xl p-4">
          <h4 className="mb-2 flex items-center gap-2 text-label text-xs text-primary">
            <Target className="h-4 w-4" /> DO THIS
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-muted-foreground">Sets:</span> {exercise.doThis.setsRange}</div>
            {exercise.doThis.repsRange && <div><span className="text-muted-foreground">Reps:</span> {exercise.doThis.repsRange}</div>}
            {exercise.doThis.timeSecRange && <div><span className="text-muted-foreground">Hold:</span> {exercise.doThis.timeSecRange}</div>}
            <div><span className="text-muted-foreground">Rest:</span> {exercise.doThis.restSecRange}</div>
          </div>
        </div>

        {/* Cues */}
        <div className="surface-raised rounded-xl p-4">
          <h4 className="mb-2 text-label text-xs text-primary">CUES</h4>
          <ul className="space-y-1.5">
            {exercise.cueStack.map((cue, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {cue}
              </li>
            ))}
          </ul>
        </div>

        {/* Fail Signs */}
        <div className="surface-raised rounded-xl border border-destructive/20 p-4">
          <h4 className="mb-2 flex items-center gap-2 text-label text-xs text-destructive">
            <AlertTriangle className="h-4 w-4" /> FAIL SIGNS
          </h4>
          <ul className="space-y-1.5">
            {exercise.failSigns.map((fs, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                {fs}
              </li>
            ))}
          </ul>
        </div>

        {/* Muscles */}
        <div className="flex flex-wrap gap-1.5">
          {exercise.muscles.map((m) => (
            <span key={m} className="surface-raised rounded-md px-2 py-1 text-label text-[10px]">{m}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
