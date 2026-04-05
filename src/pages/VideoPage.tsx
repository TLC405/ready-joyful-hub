import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Search, Play, LayoutGrid, AlertTriangle, Wrench } from 'lucide-react';
import { getExerciseById, exercises } from '@/lib/exercises';
import { TLCNotebookPlayer } from '@/components/shared/TLCNotebookPlayer';
import { cn } from '@/lib/utils';
import type { VideoSource, Exercise } from '@/lib/types';

const difficultyBadge: Record<string, string> = {
  easy: 'difficulty-easy',
  beginner: 'difficulty-beginner',
  intermediate: 'difficulty-intermediate',
  advanced: 'difficulty-advanced',
  master: 'difficulty-master',
};

const difficultyOrder = ['easy', 'beginner', 'intermediate', 'advanced', 'master'];

function getThumb(ex: Exercise): string | null {
  if (ex.thumbnailUrl) return ex.thumbnailUrl;
  // Extract from videoUrl
  const match = ex.videoUrl?.match(/v=([a-zA-Z0-9_-]+)/);
  if (match) return `https://i.ytimg.com/vi/${match[1]}/hqdefault.jpg`;
  // From videoSources
  const ytSrc = ex.videoSources?.find(s => s.platform === 'youtube');
  if (ytSrc) {
    const m2 = ytSrc.url.match(/v=([a-zA-Z0-9_-]+)/);
    if (m2) return `https://i.ytimg.com/vi/${m2[1]}/hqdefault.jpg`;
  }
  return null;
}

const hasVideo = (e: Exercise) => e.videoUrl || e.videoSources?.length || e.instagramUrl;

function ExerciseBrowser() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(exercises.map(e => e.category)));
    return ['all', ...cats.sort()];
  }, []);

  const filtered = useMemo(() => {
    return exercises.filter(e => {
      const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'all' || e.category === activeCategory;
      return matchSearch && matchCat;
    }).sort((a, b) => difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty));
  }, [search, activeCategory]);

  // Group by category
  const grouped = useMemo(() => {
    if (activeCategory !== 'all') return { [activeCategory]: filtered };
    const groups: Record<string, Exercise[]> = {};
    filtered.forEach(ex => {
      if (!groups[ex.category]) groups[ex.category] = [];
      groups[ex.category].push(ex);
    });
    return groups;
  }, [filtered, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-30 border-b-2 border-foreground bg-background px-4 py-3">
        <div className="mx-auto max-w-5xl flex items-center gap-3">
          <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-label text-[10px] tracking-widest">HOME</span>
          </button>
          <div className="h-4 w-px bg-foreground/15" />
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-primary" />
            <span className="text-label text-[10px] tracking-[0.2em] text-foreground">TLC TV</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl p-4 space-y-4">
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

        {/* Grouped exercise list */}
        {Object.entries(grouped).map(([category, exs]) => (
          <div key={category}>
            {activeCategory === 'all' && (
              <div className="editorial-divider-thick mb-2 pt-2">
                <h3 className="text-label text-xs tracking-widest text-foreground">{category.toUpperCase()}</h3>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-foreground/10 border border-foreground/10">
              {exs.map(ex => {
                const thumb = getThumb(ex);
                return (
                  <button
                    key={ex.id}
                    onClick={() => navigate(`/video/${ex.id}`)}
                    className="group flex flex-col bg-card hover:bg-surface-0 transition-colors text-left"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-surface-0">
                      {thumb ? (
                        <img src={thumb} alt={ex.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      ) : ex.image ? (
                        <img src={ex.image} alt={ex.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="font-chalk text-xl text-muted-foreground/20">{ex.name[0]}</span>
                        </div>
                      )}
                      {/* Play overlay */}
                      {hasVideo(ex) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 group-hover:bg-foreground/30 transition-colors">
                          <div className="flex h-10 w-10 items-center justify-center border border-card/50 bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
                          </div>
                        </div>
                      )}
                      {/* Difficulty badge */}
                      <div className="absolute left-0 top-0">
                        <span className={cn("border px-1.5 py-0 text-label text-[8px] bg-card/90", difficultyBadge[ex.difficulty])}>
                          {ex.difficulty.toUpperCase()}
                        </span>
                      </div>
                      {!hasVideo(ex) && (
                        <div className="absolute right-1 bottom-1 px-1.5 py-0.5 bg-foreground/60 text-card text-label text-[7px] tracking-wider">SOON</div>
                      )}
                    </div>
                    <div className="border-t border-foreground/5 p-2">
                      <p className="font-chalk text-xs truncate">{ex.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{ex.shortPurpose || ex.category}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

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

  const sources: VideoSource[] = [];
  if (exercise.videoSources?.length) {
    sources.push(...exercise.videoSources);
  } else if (exercise.videoUrl) {
    sources.push({ platform: 'youtube', url: exercise.videoUrl, label: 'Tutorial', primary: true });
  }
  if (exercise.instagramUrl && !sources.find(s => s.url === exercise.instagramUrl)) {
    sources.push({ platform: 'instagram', url: exercise.instagramUrl, label: 'IG Demo' });
  }

  const progressExercises = exercise.progressTo.map(id => getExerciseById(id)).filter(Boolean);
  const regressExercises = exercise.regressTo.map(id => getExerciseById(id)).filter(Boolean);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b-2 border-foreground bg-background px-4 py-3">
        <div className="flex items-center gap-3">
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
        {/* Browse All button */}
        <button
          onClick={() => navigate('/video')}
          className="flex items-center gap-1.5 border border-foreground/15 bg-card px-3 py-1.5 text-label text-[9px] tracking-widest text-muted-foreground hover:bg-foreground hover:text-card transition-colors"
        >
          <LayoutGrid className="h-3 w-3" />
          BROWSE ALL
        </button>
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

        {/* Prescription */}
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

        {/* Mistakes & Fixes Panel */}
        {exercise.coachNotes && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border-2 border-foreground/10 bg-card p-4">
              <h3 className="flex items-center gap-2 text-label text-xs tracking-widest text-foreground mb-3">
                <AlertTriangle className="h-3.5 w-3.5" /> COMMON MISTAKES
              </h3>
              <p className="text-sm text-muted-foreground">{exercise.coachNotes.watchOut}</p>
            </div>
            <div className="border-2 border-foreground/10 bg-card p-4">
              <h3 className="flex items-center gap-2 text-label text-xs tracking-widest text-primary mb-3">
                <Wrench className="h-3.5 w-3.5" /> MECHANIC
              </h3>
              <p className="text-sm text-muted-foreground">{exercise.coachNotes.mechanic}</p>
            </div>
          </div>
        )}

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
