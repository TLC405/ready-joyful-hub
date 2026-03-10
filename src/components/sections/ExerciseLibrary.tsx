import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutGrid, LayoutList, ChevronLeft, ChevronRight } from 'lucide-react';
import { exercises } from '@/lib/exercises';
import type { Exercise, Category, Difficulty, TrackId } from '@/lib/types';
import { cn } from '@/lib/utils';

const categories: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'push', label: 'Push' },
  { id: 'pull', label: 'Pull' },
  { id: 'legs', label: 'Legs' },
  { id: 'core', label: 'Core' },
  { id: 'mobility', label: 'Mobility' },
  { id: 'skills', label: 'Skills' },
  { id: 'yoga', label: 'Yoga' },
];

const difficulties: { id: Difficulty | 'all'; label: string }[] = [
  { id: 'all', label: 'All Levels' },
  { id: 'easy', label: 'Easy' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'master', label: 'Master' },
];

const trackFilters: { id: TrackId | 'all'; label: string }[] = [
  { id: 'all', label: 'All Tracks' },
  { id: 'planche', label: 'Planche' },
  { id: 'handstand', label: 'Handstand' },
  { id: 'rings', label: 'Rings' },
  { id: 'compression', label: 'Compression' },
  { id: 'pull-strength', label: 'Pull' },
  { id: 'legs', label: 'Legs' },
  { id: 'forearm-stand', label: 'Forearm Stand' },
  { id: 'elbow-stand', label: 'Elbow Stand' },
  { id: 'grip', label: 'Grip' },
];

const difficultyBadge: Record<string, string> = {
  easy: 'difficulty-easy',
  beginner: 'difficulty-beginner',
  intermediate: 'difficulty-intermediate',
  advanced: 'difficulty-advanced',
  master: 'difficulty-master',
};

const ITEMS_PER_PAGE = 20;

export function ExerciseLibrary() {
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | 'all'>('all');
  const [trackFilter, setTrackFilter] = useState<TrackId | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return exercises.filter(e => {
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
      if (difficultyFilter !== 'all' && e.difficulty !== difficultyFilter) return false;
      if (trackFilter !== 'all' && !e.tracks.includes(trackFilter)) return false;
      if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [categoryFilter, difficultyFilter, trackFilter, search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const updateFilter = <T,>(setter: React.Dispatch<React.SetStateAction<T>>, value: T) => {
    setter(value);
    setPage(1);
  };

  return (
    <section className="relative px-4 py-8 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-chalk text-2xl text-embossed sm:text-3xl">
          <span className="text-primary">EXERCISE</span> LIBRARY
          <span className="ml-3 text-sm text-muted-foreground font-normal">{filtered.length} exercises</span>
        </h2>
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode('list')}
            className={cn("btn-raised rounded-md p-2 transition-colors", viewMode === 'list' ? "surface-inset text-primary" : "text-muted-foreground hover:text-foreground")}
          >
            <LayoutList className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={cn("btn-raised rounded-md p-2 transition-colors", viewMode === 'grid' ? "surface-inset text-primary" : "text-muted-foreground hover:text-foreground")}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Search + Filter Bar — inset wells */}
      <div className="sticky top-0 z-20 -mx-4 mb-4 flex flex-wrap items-center gap-2 bg-background/95 px-4 py-3 backdrop-blur-sm lg:-mx-8 lg:px-8">
        <div className="surface-inset flex flex-1 items-center gap-2 rounded-lg px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => updateFilter(setCategoryFilter, e.target.value as Category | 'all')}
          className="surface-inset rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none"
        >
          {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select
          value={difficultyFilter}
          onChange={(e) => updateFilter(setDifficultyFilter, e.target.value as Difficulty | 'all')}
          className="surface-inset rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none"
        >
          {difficulties.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
        </select>
        <select
          value={trackFilter}
          onChange={(e) => updateFilter(setTrackFilter, e.target.value as TrackId | 'all')}
          className="surface-inset rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none"
        >
          {trackFilters.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </div>

      {/* List View */}
      {viewMode === 'list' ? (
        <div className="surface-raised overflow-hidden rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left" style={{ background: 'linear-gradient(180deg, hsl(var(--surface-2)) 0%, hsl(var(--surface-1)) 100%)' }}>
                <th className="px-4 py-2.5 text-label text-xs text-muted-foreground">EXERCISE</th>
                <th className="hidden px-4 py-2.5 text-label text-xs text-muted-foreground sm:table-cell">DIFFICULTY</th>
                <th className="hidden px-4 py-2.5 text-label text-xs text-muted-foreground md:table-cell">CATEGORY</th>
                <th className="hidden px-4 py-2.5 text-label text-xs text-muted-foreground lg:table-cell">TRACKS</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((exercise) => (
                <tr
                  key={exercise.id}
                  onClick={() => setSelectedExercise(exercise)}
                  className="cursor-pointer border-b border-border/30 transition-colors hover:bg-surface-2/50"
                >
                  <td className="px-4 py-2.5">
                    <div className="font-chalk">{exercise.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1 sm:hidden">{exercise.difficulty} · {exercise.category}</div>
                  </td>
                  <td className="hidden px-4 py-2.5 sm:table-cell">
                    <span className={cn("rounded-full border px-2 py-0.5 text-label text-[10px]", difficultyBadge[exercise.difficulty])}>
                      {exercise.difficulty.toUpperCase()}
                    </span>
                  </td>
                  <td className="hidden px-4 py-2.5 text-muted-foreground md:table-cell">{exercise.category}</td>
                  <td className="hidden px-4 py-2.5 lg:table-cell">
                    <div className="flex gap-1">
                      {exercise.tracks.slice(0, 2).map(t => (
                        <span key={t} className="rounded bg-surface-1 px-1.5 py-0.5 text-label text-[10px] text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {paginated.map((exercise) => (
              <motion.div
                key={exercise.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                onClick={() => setSelectedExercise(exercise)}
                className="accent-line group cursor-pointer overflow-hidden rounded-xl surface-raised transition-all"
              >
                {exercise.image ? (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img src={exercise.image} alt={exercise.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="image-overlay absolute inset-0" />
                    <div className="absolute left-2 top-2">
                      <span className={cn("rounded-full border px-2 py-0.5 text-label text-[10px] backdrop-blur-sm", difficultyBadge[exercise.difficulty])}>
                        {exercise.difficulty.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative flex aspect-[16/9] items-center justify-center bg-surface-1">
                    <span className="font-chalk text-3xl text-muted-foreground/20">{exercise.name[0]}</span>
                    <div className="absolute left-2 top-2">
                      <span className={cn("rounded-full border px-2 py-0.5 text-label text-[10px]", difficultyBadge[exercise.difficulty])}>
                        {exercise.difficulty.toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}
                <div className="p-3">
                  <h3 className="mb-0.5 font-chalk text-base truncate">{exercise.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{exercise.shortPurpose}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-raised flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted-foreground disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <span className="text-label text-xs text-muted-foreground">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-raised flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-muted-foreground disabled:opacity-30"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Exercise Detail Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}

function ExerciseDetailModal({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl"
      style={{ background: 'hsla(var(--surface-0), 0.98)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="glass-premium relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl p-6 lg:p-8"
        style={{ boxShadow: 'var(--shadow-deep)' }}
      >
        <button onClick={onClose} className="btn-raised absolute right-4 top-4 rounded-lg p-2">
          ✕
        </button>

        <div className="grid gap-6 lg:grid-cols-2">
          {exercise.image && (
            <div className="overflow-hidden rounded-xl" style={{ boxShadow: 'var(--shadow-brutal)' }}>
              <img src={exercise.image} alt={exercise.name} className="h-full w-full object-cover" />
            </div>
          )}
          <div>
            <span className={cn("mb-2 inline-block rounded-full border px-3 py-0.5 text-label text-xs", difficultyBadge[exercise.difficulty])}>
              {exercise.difficulty.toUpperCase()}
            </span>
            <h2 className="font-chalk text-2xl text-embossed">{exercise.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{exercise.description}</p>

            <div className="surface-inset mt-4 rounded-lg p-4">
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
          </div>
        </div>

        {exercise.coachNotes && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="surface-inset rounded-lg p-4">
              <h4 className="mb-1 text-label text-xs text-primary">MECHANIC</h4>
              <p className="text-sm text-foreground">{exercise.coachNotes.mechanic}</p>
            </div>
            <div className="surface-raised rounded-lg border border-primary/20 p-4">
              <h4 className="mb-1 text-label text-xs text-primary">BRUTALITY</h4>
              <p className="text-sm text-foreground">{exercise.coachNotes.brutality}</p>
            </div>
            <div className="surface-raised rounded-lg border border-destructive/20 p-4">
              <h4 className="mb-1 text-label text-xs text-destructive">WATCH OUT</h4>
              <p className="text-sm text-foreground">{exercise.coachNotes.watchOut}</p>
            </div>
            <div className="surface-inset rounded-lg p-4">
              <h4 className="mb-1 text-label text-xs text-primary">RECOVERY</h4>
              <p className="text-sm text-foreground">{exercise.coachNotes.recoveryVector}</p>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
