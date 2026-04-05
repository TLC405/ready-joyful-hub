import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Search, Play } from 'lucide-react';
import { getExerciseById, exercises } from '@/lib/exercises';
import { TLCNotebookPlayer } from '@/components/shared/TLCNotebookPlayer';
import { cn } from '@/lib/utils';
import type { VideoSource } from '@/lib/types';

const difficultyBadge: Record<string, string> = {
  easy: 'difficulty-easy',
  beginner: 'difficulty-beginner',
  intermediate: 'difficulty-intermediate',
  advanced: 'difficulty-advanced',
  master: 'difficulty-master',
};

const difficultyOrder = ['easy', 'beginner', 'intermediate', 'advanced', 'master'];

function ExerciseBrowser() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(exercises.map(e => e.category)))];

  const filtered = exercises.filter(e => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || e.category === activeCategory;
    return matchSearch && matchCat;
  }).sort((a, b) => difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty));

  const hasVideo = (e: typeof exercises[0]) => e.videoUrl || e.videoSources?.length || e.instagramUrl;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b-2 border-foreground bg-background px-4 py-3">
        <div className="mx-auto max-w-5xl flex items-center gap-3">
          <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-label text-[10px] tracking-widest">HOME</span>
          </button>
          <div className="h-4 w-px bg-foreground/15" />
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-primary" />
            <span className="text-label text-[10px] tracking-[0.2em] text-foreground">TLC TV — EXERCISE LIBRARY</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border-2 border-foreground/15 bg-card py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        {/* Category pills */}
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "shrink-0 border px-3 py-1 text-label text-[10px] tracking-widest transition-colors",
                activeCategory === cat
                  ? "border-foreground bg-foreground text-card"
                  : "border-foreground/15 bg-card text-muted-foreground hover:bg-surface-0"
              )}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Exercise list */}
        <div className="space-y-px border border-foreground/10">
          {filtered.map(ex => (
            <button
              key={ex.id}
              onClick={() => navigate(`/video/${ex.id}`)}
              className="flex w-full items-center gap-3 bg-card p-3 text-left hover:bg-surface-0 transition-colors border-b border-foreground/5 last:border-b-0"
            >
              {/* Play icon or placeholder */}
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center border",
                hasVideo(ex) ? "border-primary bg-primary/10 text-primary" : "border-foreground/10 bg-surface-0 text-muted-foreground/30"
              )}>
                <Play className="h-3 w-3 ml-0.5" fill={hasVideo(ex) ? "currentColor" : "none"} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-chalk text-sm truncate">{ex.name}</span>
                  <span className={cn("shrink-0 border px-1.5 py-0 text-label text-[8px]", difficultyBadge[ex.difficulty])}>
                    {ex.difficulty.toUpperCase()}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">{ex.shortPurpose || ex.category}</p>
              </div>

              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">No exercises found</div>
          )}
        </div>

        <p className="text-center text-[10px] text-muted-foreground/50 pb-8">
          {filtered.length} EXERCISES • {filtered.filter(hasVideo).length} WITH VIDEO
        </p>
      </div>
    </div>
  );
}

export default function VideoPage() {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const exercise = exerciseId ? getExerciseById(exerciseId) : null;

  if (!exercise) {
    return <ExerciseBrowser />;
  }

  // Build video sources — combine legacy videoUrl with new videoSources
  const sources: VideoSource[] = [];
  if (exercise.videoSources?.length) {
    sources.push(...exercise.videoSources);
  } else if (exercise.videoUrl) {
    sources.push({ platform: 'youtube', url: exercise.videoUrl, label: 'Tutorial', primary: true });
  }
  if (exercise.instagramUrl && !sources.find(s => s.url === exercise.instagramUrl)) {
    sources.push({ platform: 'instagram', url: exercise.instagramUrl, label: 'IG Demo' });
  }

  // Get related exercises
  const progressExercises = exercise.progressTo.map(id => getExerciseById(id)).filter(Boolean);
  const regressExercises = exercise.regressTo.map(id => getExerciseById(id)).filter(Boolean);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b-2 border-foreground bg-background px-4 py-3">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-label text-[10px] tracking-widest">BACK</span>
        </button>
        <div className="h-4 w-px bg-foreground/15" />
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-primary" />
          <span className="text-label text-[10px] tracking-[0.2em] text-foreground">TLC TV</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-5xl p-4 space-y-6"
      >
        {/* Exercise header */}
        <div className="space-y-1">
          <span className={cn("inline-block border px-2.5 py-0.5 text-label text-[10px]", difficultyBadge[exercise.difficulty])}>
            {exercise.difficulty.toUpperCase()}
          </span>
          <h1 className="text-editorial text-foreground">{exercise.name}</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">{exercise.description}</p>
        </div>

        {/* Video Player */}
        {sources.length > 0 ? (
          <TLCNotebookPlayer
            sources={sources}
            title={exercise.name}
            cues={exercise.cueStack}
            failSigns={exercise.failSigns}
          />
        ) : (
          <div className="border-2 border-foreground/20 bg-card p-8 text-center"
            style={{ background: `repeating-linear-gradient(transparent, transparent 27px, hsl(var(--muted)) 27px, hsl(var(--muted)) 28px)` }}
          >
            <span className="font-chalk text-2xl text-muted-foreground/30">VIDEO COMING SOON</span>
            <p className="mt-2 text-xs text-muted-foreground">We're filming this exercise — check back soon</p>
          </div>
        )}

        {/* Do This */}
        <div className="border-2 border-foreground/10 bg-card p-4">
          <h3 className="text-label text-xs tracking-widest text-primary mb-3">PRESCRIPTION</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="border border-foreground/10 bg-surface-0 p-3 text-center">
              <p className="text-label text-[9px] text-muted-foreground">SETS</p>
              <p className="font-chalk text-lg text-foreground">{exercise.doThis.setsRange}</p>
            </div>
            {exercise.doThis.repsRange && (
              <div className="border border-foreground/10 bg-surface-0 p-3 text-center">
                <p className="text-label text-[9px] text-muted-foreground">REPS</p>
                <p className="font-chalk text-lg text-foreground">{exercise.doThis.repsRange}</p>
              </div>
            )}
            {exercise.doThis.timeSecRange && (
              <div className="border border-foreground/10 bg-surface-0 p-3 text-center">
                <p className="text-label text-[9px] text-muted-foreground">HOLD</p>
                <p className="font-chalk text-lg text-foreground">{exercise.doThis.timeSecRange}</p>
              </div>
            )}
            <div className="border border-foreground/10 bg-surface-0 p-3 text-center">
              <p className="text-label text-[9px] text-muted-foreground">REST</p>
              <p className="font-chalk text-lg text-foreground">{exercise.doThis.restSecRange}</p>
            </div>
          </div>
        </div>

        {/* Muscles */}
        <div className="flex flex-wrap gap-1.5">
          {exercise.muscles.map(m => (
            <span key={m} className="border border-foreground/10 bg-card px-2.5 py-1 text-label text-[10px]">{m}</span>
          ))}
        </div>

        {/* Progressions */}
        {(progressExercises.length > 0 || regressExercises.length > 0) && (
          <div className="border-2 border-foreground/10 bg-card p-4 space-y-4">
            <h3 className="text-label text-xs tracking-widest text-foreground">PROGRESSION PATH</h3>
            
            {regressExercises.length > 0 && (
              <div>
                <p className="text-label text-[9px] text-muted-foreground mb-2">← EASIER</p>
                <div className="flex flex-wrap gap-2">
                  {regressExercises.map(ex => ex && (
                    <button
                      key={ex.id}
                      onClick={() => navigate(`/video/${ex.id}`)}
                      className="flex items-center gap-2 border border-foreground/15 bg-surface-0 px-3 py-2 text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {ex.name}
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {progressExercises.length > 0 && (
              <div>
                <p className="text-label text-[9px] text-muted-foreground mb-2">HARDER →</p>
                <div className="flex flex-wrap gap-2">
                  {progressExercises.map(ex => ex && (
                    <button
                      key={ex.id}
                      onClick={() => navigate(`/video/${ex.id}`)}
                      className="flex items-center gap-2 border border-foreground/15 bg-surface-0 px-3 py-2 text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {ex.name}
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Creator credit */}
        {exercise.creator && (
          <div className="border border-foreground/10 bg-surface-0 p-3">
            <p className="text-xs text-muted-foreground">
              Made famous by <span className="font-medium text-foreground">{exercise.creator}</span>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
