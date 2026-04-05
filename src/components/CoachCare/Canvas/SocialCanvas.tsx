import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Youtube, Instagram, Play, ExternalLink, Loader2 } from 'lucide-react';
import { SocialCanvasData, SocialSearchResult } from '../types';
import { exercises } from '@/lib/exercises';
import { cn } from '@/lib/utils';

interface SocialCanvasProps {
  data: SocialCanvasData;
  onWatchVideo?: (result: SocialSearchResult) => void;
}

const suggestedSearches = [
  'planche tutorial', 'handstand progression', 'front lever tips',
  'muscle up form', 'L-sit tutorial', 'ring dips technique',
  'pistol squat guide', 'human flag tutorial',
];

function getYouTubeThumbnail(videoId: string) {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}

function generateMockResults(query: string, platform: 'all' | 'youtube' | 'instagram'): SocialSearchResult[] {
  const matchingExercises = exercises.filter(e =>
    e.name.toLowerCase().includes(query.toLowerCase()) ||
    query.toLowerCase().includes(e.name.toLowerCase().split(' ')[0])
  ).slice(0, 6);

  const results: SocialSearchResult[] = [];

  if (platform !== 'instagram') {
    matchingExercises.forEach(e => {
      const ytMatch = e.videoUrl?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
      if (ytMatch) {
        results.push({
          id: `yt-${e.id}`,
          title: `${e.name} — Full Tutorial & Progression`,
          thumbnail: getYouTubeThumbnail(ytMatch[1]),
          platform: 'youtube',
          url: e.videoUrl!,
          embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
          channel: e.creator || 'Calisthenics Coach',
        });
      }
    });

    // Add some generic results
    const genericIds = ['dDVHhWZOYXo', 'L-Lm3D969us', 'Oj84GNy5zAU'];
    genericIds.forEach((vid, i) => {
      results.push({
        id: `yt-gen-${i}`,
        title: `${query} — Pro Tips & Common Mistakes (Part ${i + 1})`,
        thumbnail: getYouTubeThumbnail(vid),
        platform: 'youtube',
        url: `https://youtube.com/watch?v=${vid}`,
        embedUrl: `https://www.youtube.com/embed/${vid}`,
        channel: 'TLC Calisthenics',
      });
    });
  }

  if (platform !== 'youtube') {
    matchingExercises.slice(0, 3).forEach(e => {
      const igSource = e.videoSources?.find(s => s.platform === 'instagram');
      if (igSource) {
        results.push({
          id: `ig-${e.id}`,
          title: `${e.name} reel — quick demo`,
          thumbnail: '/placeholder.svg',
          platform: 'instagram',
          url: igSource.url,
          embedUrl: igSource.url,
          channel: e.creator || '@calisthenics',
        });
      }
    });
  }

  return results.slice(0, 9);
}

export function SocialCanvas({ data, onWatchVideo }: SocialCanvasProps) {
  const [query, setQuery] = useState(data.query || '');
  const [platform, setPlatform] = useState<'all' | 'youtube' | 'instagram'>(data.platform || 'all');
  const [results, setResults] = useState<SocialSearchResult[]>(data.results || []);
  const [searching, setSearching] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SocialSearchResult | null>(null);

  const handleSearch = (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;
    setSearching(true);
    setQuery(q);
    setTimeout(() => {
      setResults(generateMockResults(q, platform));
      setSearching(false);
    }, 800);
  };

  if (selectedResult) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 px-4 py-3 skeuo-leather">
          <button onClick={() => setSelectedResult(null)} className="text-primary-foreground/70 hover:text-thunder-orange text-label text-xs">
            ← BACK
          </button>
          <span className="text-primary-foreground text-sm font-chalk truncate">{selectedResult.title}</span>
        </div>
        <div className="flex-1 p-4">
          <div className="skeuo-bezel rounded-sm p-[6px]">
            <div className="aspect-video w-full overflow-hidden">
              <iframe
                src={selectedResult.embedUrl}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <div className="mt-3 border border-foreground/10 bg-card p-4 skeuo-thunder-card skeuo-grain">
            <h4 className="font-chalk text-sm text-foreground text-journal">{selectedResult.title}</h4>
            {selectedResult.channel && (
              <p className="text-[11px] text-muted-foreground mt-1 text-journal-sm">{selectedResult.channel}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col notebook-ruled">
      {/* Header */}
      <div className="px-4 py-3 skeuo-leather">
        <h3 className="text-label text-sm text-primary-foreground text-journal">
          SOCIAL <span className="text-thunder-orange">SEARCH</span>
        </h3>
      </div>

      {/* Search bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 thunder-inset px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search calisthenics videos..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none text-journal"
          />
          <button onClick={() => handleSearch()} disabled={searching}
            className="btn-thunder px-3 py-1 text-label text-[10px]">
            {searching ? <Loader2 className="h-3 w-3 animate-spin" /> : 'GO'}
          </button>
        </div>

        {/* Platform filters */}
        <div className="mt-2 flex gap-1">
          {([
            { id: 'all' as const, label: 'ALL', icon: Search },
            { id: 'youtube' as const, label: 'YOUTUBE', icon: Youtube },
            { id: 'instagram' as const, label: 'INSTAGRAM', icon: Instagram },
          ]).map(p => (
            <button key={p.id} onClick={() => setPlatform(p.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 text-[10px] text-label transition-colors border",
                platform === p.id
                  ? "border-thunder-orange bg-thunder-orange/10 text-thunder-orange skeuo-pressed"
                  : "border-foreground/10 text-muted-foreground hover:border-thunder-blue/40 skeuo-card"
              )}>
              <p.icon className="h-3 w-3" />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results / suggestions */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pb-4">
        {results.length === 0 && !searching ? (
          <div className="mt-4">
            <p className="text-[11px] text-muted-foreground mb-3 text-label text-journal-sm">SUGGESTED SEARCHES</p>
            <div className="flex flex-wrap gap-2">
              {suggestedSearches.map(s => (
                <button key={s} onClick={() => { setQuery(s); handleSearch(s); }}
                  className="px-3 py-1.5 text-[11px] border border-foreground/10 text-foreground bg-card hover:border-thunder-orange/40 hover:text-thunder-orange transition-colors skeuo-card text-journal-sm">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
            {results.map((r, i) => (
              <motion.button
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedResult(r)}
                className="group text-left border border-foreground/10 bg-card overflow-hidden hover:border-thunder-orange/40 transition-all skeuo-card"
              >
                <div className="relative aspect-video bg-surface-0">
                  <img src={r.thumbnail} alt={r.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 group-hover:bg-foreground/20 transition-colors">
                    <Play className="h-8 w-8 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                  </div>
                  <span className={cn(
                    "absolute top-1 right-1 px-1.5 py-0.5 text-[8px] text-label",
                    r.platform === 'youtube' ? 'bg-red-600 text-white' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  )}>
                    {r.platform === 'youtube' ? 'YT' : 'IG'}
                  </span>
                </div>
                <div className="p-2">
                  <p className="text-[11px] font-chalk text-foreground line-clamp-2 text-journal-sm">{r.title}</p>
                  {r.channel && (
                    <p className="text-[9px] text-muted-foreground mt-0.5">{r.channel}</p>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {searching && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-thunder-orange" />
            <span className="ml-2 text-sm text-muted-foreground text-journal">Searching {platform}...</span>
          </div>
        )}
      </div>
    </div>
  );
}
