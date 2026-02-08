import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronRight, Sparkles } from 'lucide-react';
import { exercises } from '@/lib/exercises';
import type { Exercise, Category, Difficulty, TrackId } from '@/lib/types';
import { cn } from '@/lib/utils';

const categories: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'ALL' },
  { id: 'push', label: 'PUSH' },
  { id: 'pull', label: 'PULL' },
  { id: 'legs', label: 'LEGS' },
  { id: 'core', label: 'CORE' },
  { id: 'mobility', label: 'MOBILITY' },
  { id: 'skills', label: 'SKILLS' },
];

const difficulties: { id: Difficulty | 'all'; label: string }[] = [
  { id: 'all', label: 'ALL LEVELS' },
  { id: 'easy', label: 'EASY' },
  { id: 'beginner', label: 'BEGINNER' },
  { id: 'intermediate', label: 'INTERMEDIATE' },
  { id: 'advanced', label: 'ADVANCED' },
  { id: 'master', label: 'MASTER' },
];

const trackFilters: { id: TrackId | 'all'; label: string }[] = [
  { id: 'all', label: 'ALL TRACKS' },
  { id: 'planche', label: 'PLANCHE' },
  { id: 'handstand', label: 'HANDSTAND' },
  { id: 'rings', label: 'RINGS' },
  { id: 'compression', label: 'COMPRESSION' },
  { id: 'pull-strength', label: 'PULL' },
  { id: 'legs', label: 'LEGS' },
  { id: 'forearm-stand', label: 'FOREARM STAND' },
  { id: 'elbow-stand', label: 'ELBOW STAND' },
  { id: 'grip', label: 'GRIP' },
];

const difficultyBadge: Record<string, string> = {
  easy: 'bg-muted/30 text-muted-foreground border-muted-foreground/20',
  beginner: 'difficulty-beginner',
  intermediate: 'difficulty-intermediate',
  advanced: 'difficulty-advanced',
  master: 'bg-primary/20 text-primary border-primary/40',
};

export function ExerciseLibrary() {
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const [trackFilter, setTrackFilter] = useState<TrackId | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const filtered = exercises.filter(e => {
    if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
    if (difficultyFilter !== 'all' && e.difficulty !== difficultyFilter) return false;
    if (trackFilter !== 'all' && !e.tracks.includes(trackFilter)) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <section className="relative min-h-screen px-4 py-20 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="font-chalk text-sm text-primary">{exercises.length} EXERCISES</span>
          </div>
          <h2 className="font-chalk text-5xl sm:text-6xl lg:text-7xl">
            <span className="text-primary">EXERCISE</span> LIBRARY
          </h2>
        </motion.div>
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
        <Search className="h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises..."
          className="flex-1 bg-transparent font-chalk text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <span className="font-chalk text-xs text-muted-foreground">{filtered.length} results</span>
      </div>

      {/* Filters */}
      <div className="mb-4 space-y-3">
        {/* Category */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map(c => (
            <button key={c.id} onClick={() => setCategoryFilter(c.id)}
              className={cn("rounded-lg px-3 py-1.5 font-chalk text-xs transition-all",
                categoryFilter === c.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              )}>{c.label}</button>
          ))}
        </div>
        {/* Difficulty */}
        <div className="flex flex-wrap gap-1.5">
          {difficulties.map(d => (
            <button key={d.id} onClick={() => setDifficultyFilter(d.id)}
              className={cn("rounded-lg px-3 py-1.5 font-chalk text-xs transition-all",
                difficultyFilter === d.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              )}>{d.label}</button>
          ))}
        </div>
        {/* Track */}
        <div className="flex flex-wrap gap-1.5">
          {trackFilters.map(t => (
            <button key={t.id} onClick={() => setTrackFilter(t.id)}
              className={cn("rounded-lg px-3 py-1.5 font-chalk text-xs transition-all",
                trackFilter === t.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              )}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedExercise(exercise)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50"
            >
              {/* Image or placeholder */}
              {exercise.image ? (
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={exercise.image} alt={exercise.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="image-overlay absolute inset-0" />
                  <div className="absolute left-3 top-3">
                    <span className={cn("rounded-full border px-2.5 py-0.5 font-chalk text-[10px] backdrop-blur-sm", difficultyBadge[exercise.difficulty])}>
                      {exercise.difficulty.toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative flex aspect-[4/3] items-center justify-center bg-secondary/30">
                  <span className="font-chalk text-4xl text-muted-foreground/20">{exercise.name[0]}</span>
                  <div className="absolute left-3 top-3">
                    <span className={cn("rounded-full border px-2.5 py-0.5 font-chalk text-[10px]", difficultyBadge[exercise.difficulty])}>
                      {exercise.difficulty.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-4">
                <h3 className="mb-1 font-chalk text-lg truncate">{exercise.name}</h3>
                <p className="mb-3 text-xs text-muted-foreground line-clamp-1">{exercise.shortPurpose}</p>
                <div className="flex flex-wrap gap-1">
                  {exercise.tracks.slice(0, 2).map(t => (
                    <span key={t} className="rounded-md bg-secondary px-2 py-0.5 font-chalk text-[10px] text-muted-foreground">{t}</span>
                  ))}
                  <span className="rounded-md bg-secondary px-2 py-0.5 font-chalk text-[10px] text-muted-foreground">{exercise.category}</span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Exercise Detail Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

// Inline detail modal
function ExerciseDetailModal({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/98 p-4 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-card p-6 lg:p-8"
      >
        <button onClick={onClose} className="absolute right-4 top-4 rounded-lg bg-secondary p-2 hover:bg-muted">
          ✕
        </button>

        <div className="grid gap-6 lg:grid-cols-2">
          {exercise.image && (
            <div className="overflow-hidden rounded-xl">
              <img src={exercise.image} alt={exercise.name} className="h-full w-full object-cover" />
            </div>
          )}
          <div>
            <span className={cn("mb-2 inline-block rounded-full border px-3 py-0.5 font-chalk text-xs", difficultyBadge[exercise.difficulty])}>
              {exercise.difficulty.toUpperCase()}
            </span>
            <h2 className="font-chalk text-3xl">{exercise.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{exercise.description}</p>

            {/* Do This */}
            <div className="mt-4 rounded-lg bg-secondary/30 p-4">
              <h4 className="mb-2 font-chalk text-sm text-primary">DO THIS</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Sets:</span> {exercise.doThis.setsRange}</p>
                {exercise.doThis.repsRange && <p><span className="text-muted-foreground">Reps:</span> {exercise.doThis.repsRange}</p>}
                {exercise.doThis.timeSecRange && <p><span className="text-muted-foreground">Hold:</span> {exercise.doThis.timeSecRange}</p>}
                <p><span className="text-muted-foreground">Rest:</span> {exercise.doThis.restSecRange}</p>
              </div>
            </div>

            {/* Cues */}
            <div className="mt-4">
              <h4 className="mb-2 font-chalk text-sm text-primary">CUES</h4>
              <ul className="space-y-1">
                {exercise.cueStack.map((cue, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{cue}</li>
                ))}
              </ul>
            </div>

            {/* Fail Signs */}
            <div className="mt-4">
              <h4 className="mb-2 font-chalk text-sm text-destructive">FAIL SIGNS</h4>
              <ul className="space-y-1">
                {exercise.failSigns.map((fs, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />{fs}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Coach Notes */}
        {exercise.coachNotes && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-secondary/30 p-4">
              <h4 className="mb-1 font-chalk text-xs text-primary">MECHANIC</h4>
              <p className="text-sm text-foreground">{exercise.coachNotes.mechanic}</p>
            </div>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <h4 className="mb-1 font-chalk text-xs text-primary">BRUTALITY</h4>
              <p className="text-sm text-foreground">{exercise.coachNotes.brutality}</p>
            </div>
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <h4 className="mb-1 font-chalk text-xs text-destructive">WATCH OUT</h4>
              <p className="text-sm text-foreground">{exercise.coachNotes.watchOut}</p>
            </div>
            <div className="rounded-lg bg-secondary/30 p-4">
              <h4 className="mb-1 font-chalk text-xs text-primary">RECOVERY</h4>
              <p className="text-sm text-foreground">{exercise.coachNotes.recoveryVector}</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
