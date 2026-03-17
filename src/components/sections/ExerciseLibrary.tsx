import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutGrid, LayoutList, ChevronLeft, ChevronRight } from 'lucide-react';
import { exercises } from '@/lib/exercises';
import type { Exercise, Category, Difficulty, TrackId } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ExerciseDetailModal } from '@/components/shared/ExerciseDetailModal';

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
  { id: 'press', label: 'Press' },
  { id: 'pull-strength', label: 'Pull' },
  { id: 'legs', label: 'Legs' },
  { id: 'forearm-stand', label: 'Forearm Stand' },
  { id: 'elbow-stand', label: 'Elbow Stand' },
  { id: 'grip', label: 'Grip' },
  { id: 'yoga-flow', label: 'Yoga Flow' },
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
      <div className="editorial-divider-thick mb-4 pt-2">
        <div className="flex items-baseline justify-between">
          <h2 className="text-editorial-sm text-foreground">
            EXERCISE LIBRARY
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-label text-xs text-muted-foreground">{filtered.length} exercises</span>
            <div className="flex gap-px border border-foreground/10">
              <button
                onClick={() => setViewMode('list')}
                className={cn("p-2 transition-colors", viewMode === 'list' ? "bg-foreground text-card" : "text-muted-foreground hover:text-foreground")}
              >
                <LayoutList className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={cn("p-2 transition-colors", viewMode === 'grid' ? "bg-foreground text-card" : "text-muted-foreground hover:text-foreground")}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="sticky top-0 z-20 mb-4 flex flex-wrap items-center gap-2 border-b border-foreground/10 bg-background py-3">
        <div className="flex flex-1 items-center gap-2 border border-foreground/10 px-3 py-2">
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
          className="border border-foreground/10 bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
        >
          {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select
          value={difficultyFilter}
          onChange={(e) => updateFilter(setDifficultyFilter, e.target.value as Difficulty | 'all')}
          className="border border-foreground/10 bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
        >
          {difficulties.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
        </select>
        <select
          value={trackFilter}
          onChange={(e) => updateFilter(setTrackFilter, e.target.value as TrackId | 'all')}
          className="border border-foreground/10 bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
        >
          {trackFilters.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </div>

      {/* List View */}
      {viewMode === 'list' ? (
        <div className="border border-foreground/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-foreground text-left bg-card">
                <th className="px-4 py-2.5 text-label text-xs text-foreground">EXERCISE</th>
                <th className="hidden px-4 py-2.5 text-label text-xs text-foreground sm:table-cell">DIFFICULTY</th>
                <th className="hidden px-4 py-2.5 text-label text-xs text-foreground md:table-cell">CATEGORY</th>
                <th className="hidden px-4 py-2.5 text-label text-xs text-foreground lg:table-cell">TRACKS</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((exercise) => (
                <tr
                  key={exercise.id}
                  onClick={() => setSelectedExercise(exercise)}
                  className="cursor-pointer border-b border-foreground/8 bg-card transition-colors hover:bg-surface-0"
                >
                  <td className="px-4 py-2.5">
                    <div className="font-chalk">{exercise.name}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1 sm:hidden">{exercise.difficulty} · {exercise.category}</div>
                  </td>
                  <td className="hidden px-4 py-2.5 sm:table-cell">
                    <span className={cn("border px-2 py-0.5 text-label text-[10px]", difficultyBadge[exercise.difficulty])}>
                      {exercise.difficulty.toUpperCase()}
                    </span>
                  </td>
                  <td className="hidden px-4 py-2.5 text-muted-foreground md:table-cell">{exercise.category}</td>
                  <td className="hidden px-4 py-2.5 lg:table-cell">
                    <div className="flex gap-1">
                      {exercise.tracks.slice(0, 2).map(t => (
                        <span key={t} className="border border-foreground/10 px-1.5 py-0.5 text-label text-[10px] text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-px bg-foreground/10 border border-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((exercise) => (
            <div
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise)}
              className="group cursor-pointer bg-card transition-colors hover:bg-surface-0"
            >
              {exercise.image ? (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={exercise.image} alt={exercise.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute left-0 top-0">
                    <span className={cn("border px-2 py-0.5 text-label text-[10px] bg-card/90", difficultyBadge[exercise.difficulty])}>
                      {exercise.difficulty.toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative flex aspect-[16/9] items-center justify-center bg-surface-0">
                  <span className="font-chalk text-3xl text-muted-foreground/20">{exercise.name[0]}</span>
                  <div className="absolute left-0 top-0">
                    <span className={cn("border px-2 py-0.5 text-label text-[10px] bg-card/90", difficultyBadge[exercise.difficulty])}>
                      {exercise.difficulty.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
              <div className="border-t border-foreground/5 p-3">
                <h3 className="mb-0.5 font-chalk text-sm truncate">{exercise.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1">{exercise.shortPurpose}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 border border-foreground/10 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-foreground hover:text-card disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <span className="text-label text-xs text-muted-foreground">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-1 border border-foreground/10 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-foreground hover:text-card disabled:opacity-30"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <AnimatePresence>
        {selectedExercise && (
          <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
