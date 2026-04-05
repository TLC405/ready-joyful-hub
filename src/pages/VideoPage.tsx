import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, ChevronDown, Search, Play, LayoutGrid, AlertTriangle, Wrench } from 'lucide-react';
import { getExerciseById, exercises } from '@/lib/exercises';
import { TLCNotebookPlayer } from '@/components/shared/TLCNotebookPlayer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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
  const match = ex.videoUrl?.match(/v=([a-zA-Z0-9_-]+)/);
  if (match) return `https://i.ytimg.com/vi/${match[1]}/hqdefault.jpg`;
  const ytSrc = ex.videoSources?.find(s => s.platform === 'youtube');
  if (ytSrc) {
    const m2 = ytSrc.url.match(/v=([a-zA-Z0-9_-]+)/);
    if (m2) return `https://i.ytimg.com/vi/${m2[1]}/hqdefault.jpg`;
  }
  return null;
}

const hasVideo = (e: Exercise) => e.videoUrl || e.videoSources?.length || e.instagramUrl;

/* ═══════ EXERCISE BROWSER (fitted) ═══════ */
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
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Top bar */}
      <div className="shrink-0 border-b-2 border-foreground bg-background px-4 py-2.5 skeuo-leather">
        <div className="mx-auto max-w-5xl flex items-center gap-3">
          <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-label text-[10px] tracking-widest">HOME</span>
          </button>
          <div className="h-4 w-px bg-primary-foreground/20" />
          <div className="flex items-center gap-2">
            <div className="skeuo-led" />
            <span className="text-label text-[10px] tracking-[0.2em] text-primary-foreground/90">TLC TV</span>
          </div>
        </div>
      </div>

      {/* Search + filters */}
      <div className="shrink-0 mx-auto w-full max-w-5xl px-4 pt-3 pb-2 space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border-2 border-foreground/15 bg-card py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none skeuo-pressed"
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
                  : "border-foreground/15 bg-card text-muted-foreground hover:bg-surface-0 skeuo-card"
              )}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable grid area */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="mx-auto max-w-5xl space-y-4">
          {Object.entries(grouped).map(([category, exs]) => (
            <div key={category}>
              {activeCategory === 'all' && (
                <div className="editorial-divider-thick mb-2 pt-2">
                  <h3 className="text-label text-xs tracking-widest text-foreground text-embossed">{category.toUpperCase()}</h3>
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10">
                {exs.map(ex => {
                  const thumb = getThumb(ex);
                  return (
                    <button
                      key={ex.id}
                      onClick={() => navigate(`/video/${ex.id}`)}
                      className="group flex flex-col bg-card hover:bg-surface-0 transition-all text-left skeuo-card"
                    >
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
                        {hasVideo(ex) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 group-hover:bg-foreground/30 transition-colors">
                            <div className="flex h-8 w-8 items-center justify-center bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ boxShadow: '2px 2px 6px rgba(0,0,0,0.3)' }}>
                              <Play className="h-3 w-3 ml-0.5" fill="currentColor" />
                            </div>
                          </div>
                        )}
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
          <p className="text-center text-[10px] text-muted-foreground/50 pb-4">
            {filtered.length} EXERCISES • {filtered.filter(hasVideo).length} WITH VIDEO
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════ ACCORDION PANEL ═══════ */
function AccordionPanel({ title, icon, children, defaultOpen = false }: { title: string; icon?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between px-4 py-2.5 skeuo-stitch hover:bg-surface-0 transition-colors">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-label text-[10px] tracking-widest text-foreground text-embossed">{title}</span>
        </div>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-3 pt-1">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ═══════ VIDEO PLAYER PAGE (fitted) ═══════ */
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
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Top bar — leather strip */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 skeuo-leather z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-primary-foreground/60 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-label text-[10px] tracking-widest">BACK</span>
          </button>
          <div className="h-4 w-px bg-primary-foreground/20" />
          <div className="flex items-center gap-2">
            <div className="skeuo-led" />
            <span className="text-label text-[10px] tracking-[0.2em] text-primary-foreground/90">TLC TV</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/video')}
          className="flex items-center gap-1.5 skeuo-metal px-3 py-1.5 text-label text-[9px] tracking-widest hover:opacity-80 transition-opacity"
        >
          <LayoutGrid className="h-3 w-3" />
          BROWSE ALL
        </button>
      </div>

      {/* Exercise title strip */}
      <div className="shrink-0 border-b border-foreground/10 bg-card px-4 py-2 skeuo-grain">
        <div className="mx-auto max-w-5xl flex items-center gap-3">
          <span className={cn("border px-2 py-0.5 text-label text-[9px]", difficultyBadge[exercise.difficulty])}>
            {exercise.difficulty.toUpperCase()}
          </span>
          <h1 className="font-chalk text-lg text-foreground truncate text-embossed">{exercise.name}</h1>
        </div>
      </div>

      {/* Main content — video + accordion */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl">
          {/* Video Player */}
          <div className="p-3">
            {sources.length > 0 ? (
              <TLCNotebookPlayer
                sources={sources}
                title={exercise.name}
                cues={exercise.cueStack}
                failSigns={exercise.failSigns}
              />
            ) : (
              <div className="skeuo-bezel rounded-sm p-[6px]">
                <div className="bg-card p-8 text-center notebook-ruled">
                  <span className="font-chalk text-2xl text-muted-foreground/30">VIDEO COMING SOON</span>
                  <p className="mt-2 text-xs text-muted-foreground">We're filming this exercise — check back soon</p>
                </div>
              </div>
            )}
          </div>

          {/* Accordion panels */}
          <div className="bg-card border-t border-foreground/10">
            {/* Prescription */}
            <AccordionPanel title="PRESCRIPTION" defaultOpen={true}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="border border-foreground/10 bg-surface-0 p-3 text-center skeuo-pressed">
                  <p className="text-label text-[9px] text-muted-foreground">SETS</p>
                  <p className="font-chalk text-lg text-foreground">{exercise.doThis.setsRange}</p>
                </div>
                {exercise.doThis.repsRange && (
                  <div className="border border-foreground/10 bg-surface-0 p-3 text-center skeuo-pressed">
                    <p className="text-label text-[9px] text-muted-foreground">REPS</p>
                    <p className="font-chalk text-lg text-foreground">{exercise.doThis.repsRange}</p>
                  </div>
                )}
                {exercise.doThis.timeSecRange && (
                  <div className="border border-foreground/10 bg-surface-0 p-3 text-center skeuo-pressed">
                    <p className="text-label text-[9px] text-muted-foreground">HOLD</p>
                    <p className="font-chalk text-lg text-foreground">{exercise.doThis.timeSecRange}</p>
                  </div>
                )}
                <div className="border border-foreground/10 bg-surface-0 p-3 text-center skeuo-pressed">
                  <p className="text-label text-[9px] text-muted-foreground">REST</p>
                  <p className="font-chalk text-lg text-foreground">{exercise.doThis.restSecRange}</p>
                </div>
              </div>
            </AccordionPanel>

            {/* Mistakes & Fixes */}
            {exercise.coachNotes && (
              <AccordionPanel title="MISTAKES & FIXES" icon={<AlertTriangle className="h-3.5 w-3.5 text-primary" />}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="border border-foreground/10 bg-surface-0 p-3 skeuo-card">
                    <h4 className="text-label text-[9px] text-foreground mb-1.5">COMMON MISTAKES</h4>
                    <p className="text-sm text-muted-foreground">{exercise.coachNotes.watchOut}</p>
                  </div>
                  <div className="border border-foreground/10 bg-surface-0 p-3 skeuo-card">
                    <h4 className="flex items-center gap-1.5 text-label text-[9px] text-primary mb-1.5">
                      <Wrench className="h-3 w-3" /> MECHANIC
                    </h4>
                    <p className="text-sm text-muted-foreground">{exercise.coachNotes.mechanic}</p>
                  </div>
                </div>
              </AccordionPanel>
            )}

            {/* Muscles */}
            <AccordionPanel title="MUSCLES TARGETED">
              <div className="flex flex-wrap gap-1.5">
                {exercise.muscles.map(m => (
                  <span key={m} className="border border-foreground/10 bg-card px-2.5 py-1 text-label text-[10px] skeuo-card">{m}</span>
                ))}
              </div>
            </AccordionPanel>

            {/* Progression Path */}
            {(progressExercises.length > 0 || regressExercises.length > 0) && (
              <AccordionPanel title="PROGRESSION PATH">
                <div className="space-y-3">
                  {regressExercises.length > 0 && (
                    <div>
                      <p className="text-label text-[9px] text-muted-foreground mb-1.5">← EASIER</p>
                      <div className="flex flex-wrap gap-2">
                        {regressExercises.map(ex => ex && (
                          <button
                            key={ex.id}
                            onClick={() => navigate(`/video/${ex.id}`)}
                            className="flex items-center gap-2 border border-foreground/15 bg-surface-0 px-3 py-2 text-xs hover:bg-primary hover:text-primary-foreground transition-colors skeuo-card"
                          >
                            {ex.name} <ChevronRight className="h-3 w-3" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {progressExercises.length > 0 && (
                    <div>
                      <p className="text-label text-[9px] text-muted-foreground mb-1.5">HARDER →</p>
                      <div className="flex flex-wrap gap-2">
                        {progressExercises.map(ex => ex && (
                          <button
                            key={ex.id}
                            onClick={() => navigate(`/video/${ex.id}`)}
                            className="flex items-center gap-2 border border-foreground/15 bg-surface-0 px-3 py-2 text-xs hover:bg-primary hover:text-primary-foreground transition-colors skeuo-card"
                          >
                            {ex.name} <ChevronRight className="h-3 w-3" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionPanel>
            )}

            {/* Description */}
            <AccordionPanel title="ABOUT">
              <p className="text-sm text-muted-foreground">{exercise.description}</p>
              {exercise.creator && (
                <p className="mt-2 text-xs text-muted-foreground border-t border-foreground/10 pt-2">
                  Made famous by <span className="font-medium text-foreground">{exercise.creator}</span>
                </p>
              )}
            </AccordionPanel>
          </div>
        </div>
      </div>
    </div>
  );
}
