import { useState } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TLCVideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title: string;
  className?: string;
}

function getEmbedUrl(url: string): string | null {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`;
  return null;
}

export function TLCVideoPlayer({ videoUrl, thumbnailUrl, title, className }: TLCVideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = getEmbedUrl(videoUrl);

  if (!embedUrl) return null;

  return (
    <div className={cn("relative w-full overflow-hidden border border-foreground/10 bg-card", className)}>
      {/* TLC header bar */}
      <div className="flex items-center gap-2 bg-foreground/95 px-3 py-1.5">
        <div className="h-1.5 w-1.5 rounded-full bg-thunder-orange animate-pulse" />
        <span className="text-label text-[9px] text-card/90 tracking-widest">TLC PLAYER</span>
      </div>

      {/* Screen */}
      <div className="relative">
        {!playing ? (
          <button
            onClick={() => setPlaying(true)}
            className="group relative aspect-video w-full"
          >
            {thumbnailUrl ? (
              <img src={thumbnailUrl} alt={title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface-0">
                <span className="font-chalk text-2xl text-muted-foreground/30">{title[0]}</span>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center transition-colors">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-thunder-orange/90 shadow-lg transition-all group-hover:scale-110 group-hover:bg-thunder-orange">
                <Play className="h-5 w-5 text-white ml-0.5" fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-foreground/80 px-3 py-2">
              <p className="truncate text-left font-chalk text-xs text-card/90">{title}</p>
            </div>
          </button>
        ) : (
          <div className="relative aspect-video w-full">
            <iframe
              src={embedUrl}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </div>
  );
}
