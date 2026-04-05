import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Map, Tv, Search, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExerciseLibrary } from './ExerciseLibrary';
import { ProgressionMap } from './ProgressionMap';
import { AppBreadcrumb } from '@/components/shared/Breadcrumb';
import { exercises } from '@/lib/exercises';
import type { Exercise } from '@/lib/types';

type Tab = 'browse' | 'map' | 'tv';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'browse', label: 'BROWSE', icon: BookOpen },
  { id: 'map', label: 'MAP', icon: Map },
  { id: 'tv', label: 'TLC TV', icon: Tv },
];

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

function InlineTVBrowser() {
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
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full surface-inset py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none text-journal"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "shrink-0 border px-3 py-1 text-label text-[10px] tracking-widest transition-colors text-journal-sm",
                activeCategory === cat
                  ? "skeuo-pressed border-foreground bg-foreground text-card"
                  : "border-foreground/15 bg-card text-muted-foreground hover:bg-surface-0 skeuo-card"
              )}
            >
              {cat.toUpperCase()}
              <span className="ml-1 opacity-60">
                {cat === 'all' ? exercises.length : exercises.filter(e => e.category === cat).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {Object.entries(grouped).map(([category, exs]) => (
        <div key={category}>
          {activeCategory === 'all' && (
            <div className="mb-2 pt-2 skeuo-stitch">
              <h3 className="text-label text-[10px] tracking-widest text-muted-foreground/60 text-journal-sm">{category.toUpperCase()}</h3>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10">
            {exs.map(ex => {
              const thumb = getThumb(ex);
              return (
                <button
                  key={ex.id}
                  onClick={() => navigate(`/video/${ex.id}`)}
                  className="group flex flex-col bg-card hover:bg-surface-0 transition-all text-left skeuo-card skeuo-grain"
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
                        <div className="flex h-8 w-8 items-center justify-center bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity btn-raised">
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
                      <div className="absolute right-1 bottom-1 px-1.5 py-0.5 skeuo-metal text-label text-[7px] tracking-wider">SOON</div>
                    )}
                  </div>
                  <div className="border-t border-foreground/5 p-2">
                    <p className="font-chalk text-xs truncate text-journal">{ex.name}</p>
                    <p className="text-[10px] text-muted-foreground/50 truncate text-journal-sm opacity-0 group-hover:opacity-100 transition-opacity">{ex.shortPurpose || ex.category}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <p className="text-center text-[10px] text-muted-foreground/50 pb-4 text-journal-sm">
        {filtered.length} EXERCISES • {filtered.filter(hasVideo).length} WITH VIDEO
      </p>
    </div>
  );
}

interface UnifiedLibraryProps {
  defaultCategory?: string;
  onCategoryReset?: () => void;
}

export function UnifiedLibrary({ defaultCategory, onCategoryReset }: UnifiedLibraryProps) {
  const [activeTab, setActiveTab] = useState<Tab>('browse');

  // When a defaultCategory is set, switch to browse tab
  useEffect(() => {
    if (defaultCategory) {
      setActiveTab('browse');
    }
  }, [defaultCategory]);

  const breadcrumbItems = [
    { label: 'HOME' },
    { label: 'LIBRARY' },
    { label: tabs.find(t => t.id === activeTab)!.label },
  ];

  return (
    <section className="relative px-4 pt-2 pb-6 lg:px-8">
      <AppBreadcrumb items={breadcrumbItems} />

      {/* Tab bar — leather strip */}
      <div className="mb-4 flex items-center gap-0 skeuo-leather">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-label text-[10px] tracking-widest transition-colors border-r last:border-r-0 border-primary-foreground/10",
                activeTab === tab.id
                  ? "skeuo-pressed bg-primary-foreground/15 text-primary-foreground"
                  : "text-primary-foreground/60 hover:text-primary-foreground/80"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'browse' && <ExerciseLibrary embedded />}
      {activeTab === 'map' && <ProgressionMap embedded />}
      {activeTab === 'tv' && <InlineTVBrowser />}
    </section>
  );
}
