import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Route, Tv, Search, Play, ScrollText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExerciseLibrary } from './ExerciseLibrary';
import { BeginnerSkillHub } from './BeginnerSkillHub';
import { WikiSection } from './WikiSection';
import { AppBreadcrumb } from '@/components/shared/Breadcrumb';
import { exercises } from '@/lib/exercises';
import type { Exercise } from '@/lib/types';

type Tab = 'browse' | 'progressions' | 'tv' | 'wiki';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'browse', label: 'EXERCISES', icon: BookOpen },
  { id: 'progressions', label: 'PATHS', icon: Route },
  { id: 'tv', label: 'VIDEOS', icon: Tv },
  { id: 'wiki', label: 'LEARN', icon: ScrollText },
];

const difficultyBadge: Record<string, string> = {
  easy: 'difficulty-easy', beginner: 'difficulty-beginner', intermediate: 'difficulty-intermediate', advanced: 'difficulty-advanced', master: 'difficulty-master',
};
const difficultyOrder = ['easy', 'beginner', 'intermediate', 'advanced', 'master'];

function getThumb(ex: Exercise): string | null {
  if (ex.thumbnailUrl) return ex.thumbnailUrl;
  const urls = [ex.videoUrl, ex.videoSources?.find(source => source.platform === 'youtube')?.url].filter(Boolean) as string[];
  for (const url of urls) {
    const match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (match) return `https://i.ytimg.com/vi/${match[1]}/hqdefault.jpg`;
  }
  return null;
}

const hasVideo = (exercise: Exercise) => Boolean(exercise.videoUrl || exercise.videoSources?.length || exercise.instagramUrl);

function InlineTVBrowser() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const categories = useMemo(() => ['all', ...Array.from(new Set(exercises.map(exercise => exercise.category))).sort()], []);
  const filtered = useMemo(() => exercises.filter(exercise => {
    const query = search.toLowerCase();
    const searchable = [exercise.name, exercise.shortPurpose, exercise.category, ...exercise.muscles, ...exercise.equipment].join(' ').toLowerCase();
    return (!query || searchable.includes(query)) && (activeCategory === 'all' || exercise.category === activeCategory);
  }).sort((a, b) => difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty)), [search, activeCategory]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search exercise videos, muscles, or equipment" className="min-h-12 w-full rounded-xl border border-border bg-background pl-10 pr-4 text-sm" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        {categories.map(category => <button key={category} onClick={() => setActiveCategory(category)} className={cn('shrink-0 rounded-full border px-3 py-2 text-[10px] font-bold uppercase tracking-wider', activeCategory === category ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card')}>{category}</button>)}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map(exercise => {
          const thumb = getThumb(exercise);
          return (
            <button key={exercise.id} onClick={() => navigate(`/video/${exercise.id}`)} className="group overflow-hidden rounded-xl border border-border bg-card text-left shadow-sm hover:border-primary/40 hover:shadow-md">
              <div className="relative aspect-video overflow-hidden bg-muted">
                {thumb || exercise.image ? <img src={thumb || exercise.image} alt={exercise.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" /> : <div className="flex h-full items-center justify-center font-chalk text-xl text-muted-foreground/30">{exercise.name[0]}</div>}
                {hasVideo(exercise) && <span className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-colors group-hover:bg-foreground/20"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100"><Play className="h-4 w-4" fill="currentColor" /></span></span>}
                <span className={cn('absolute left-2 top-2 rounded-full border bg-card/95 px-2 py-1 text-[8px] font-bold uppercase', difficultyBadge[exercise.difficulty])}>{exercise.difficulty}</span>
              </div>
              <div className="p-3"><div className="truncate font-chalk text-sm">{exercise.name}</div><div className="mt-1 truncate text-[10px] text-muted-foreground">{exercise.shortPurpose}</div></div>
            </button>
          );
        })}
      </div>
      <p className="text-center font-mono text-[10px] tabular-nums text-muted-foreground">{filtered.length} movements · {filtered.filter(hasVideo).length} with media</p>
    </div>
  );
}

interface UnifiedLibraryProps { defaultCategory?: string; onCategoryReset?: () => void }

export function UnifiedLibrary({ defaultCategory }: UnifiedLibraryProps) {
  const [activeTab, setActiveTab] = useState<Tab>('browse');
  useEffect(() => { if (defaultCategory) setActiveTab('browse'); }, [defaultCategory]);
  const breadcrumbItems = [{ label: 'HOME' }, { label: 'LIBRARY' }, { label: tabs.find(tab => tab.id === activeTab)!.label }];

  return (
    <section className="relative px-4 pb-6 pt-2 lg:px-8">
      <AppBreadcrumb items={breadcrumbItems} />
      <div className="mb-5 grid grid-cols-4 gap-1 rounded-xl border border-border bg-muted p-1">
        {tabs.map(tab => { const Icon = tab.icon; return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn('flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg px-2 text-[9px] font-bold sm:flex-row sm:text-[10px]', activeTab === tab.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}><Icon className="h-4 w-4" />{tab.label}</button>; })}
      </div>
      {activeTab === 'browse' && <ExerciseLibrary embedded defaultCategory={defaultCategory} />}
      {activeTab === 'progressions' && <BeginnerSkillHub embedded />}
      {activeTab === 'tv' && <InlineTVBrowser />}
      {activeTab === 'wiki' && <WikiSection />}
    </section>
  );
}
