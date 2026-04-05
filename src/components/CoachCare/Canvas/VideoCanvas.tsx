import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Bookmark, BookmarkCheck, Gauge } from 'lucide-react';
import { VideoCanvasData } from '../types';
import { cn } from '@/lib/utils';

interface VideoCanvasProps {
  data: VideoCanvasData;
}

const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function VideoCanvas({ data }: VideoCanvasProps) {
  const [bookmarkedTimestamps, setBookmarkedTimestamps] = useState<Set<number>>(new Set());

  const toggleBookmark = (index: number) => {
    setBookmarkedTimestamps(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className="flex h-full flex-col p-4 notebook-ruled">
      {/* Video embed — skeuo bezel with LED */}
      <div className="relative skeuo-bezel rounded-sm p-[6px]">
        <div className="aspect-video w-full overflow-hidden">
          <iframe
            src={data.embedUrl}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {/* LED indicator */}
        <div className="absolute top-2 right-3 flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_hsl(var(--thunder-orange))] animate-pulse" />
          <span className="text-[8px] text-primary-foreground/60 font-mono">LIVE</span>
        </div>
      </div>

      {/* Analysis overlay */}
      {data.analysis && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex-1 overflow-y-auto hide-scrollbar space-y-3">

          {/* Score card */}
          <div className="border border-foreground/10 bg-card p-4 skeuo-thunder-card skeuo-grain">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-label text-sm text-foreground text-embossed text-journal">FORM ANALYSIS</h4>
              <div className="skeuo-metal px-4 py-1.5 flex items-center gap-2">
                <Gauge className="h-4 w-4 text-thunder-orange" />
                <span className="text-label text-lg font-chalk">{data.analysis.overallScore}<span className="text-xs text-muted-foreground">/10</span></span>
              </div>
            </div>
            <div className="space-y-2">
              {data.analysis.corrections.map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground text-journal">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-thunder-orange" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timestamps with bookmarks */}
          <div className="border border-foreground/10 bg-card p-4 skeuo-card skeuo-grain">
            <h4 className="mb-2 text-label text-sm text-foreground text-embossed text-journal">TIMESTAMPS</h4>
            <div className="space-y-1.5">
              {data.analysis.timestamps.map((t, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-journal group">
                  <button onClick={() => toggleBookmark(i)}
                    className="shrink-0 text-muted-foreground/30 hover:text-thunder-orange transition-colors">
                    {bookmarkedTimestamps.has(i)
                      ? <BookmarkCheck className="h-3.5 w-3.5 text-thunder-orange" />
                      : <Bookmark className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    }
                  </button>
                  <span className="surface-inset px-2 py-0.5 font-mono text-xs text-thunder-orange">{t.time}</span>
                  <span className={cn(
                    t.type === 'error' ? 'text-primary' : t.type === 'cue' ? 'text-thunder-blue' : 'text-foreground'
                  )}>
                    {t.note}
                  </span>
                  {t.type === 'form' && <CheckCircle className="h-3 w-3 text-emerald-500 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
