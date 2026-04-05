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
    <div className={cn("relative w-full overflow-hidden skeuo-bezel rounded-sm p-[4px]", className)}>
      {/* TLC Brand Bar — leather strip */}
      <div className="flex items-center gap-2 skeuo-leather px-3 py-1.5">
        <div className="skeuo-led" />
        <span className="text-label text-[9px] text-primary-foreground/90 tracking-widest">TLC PLAYER</span>
      </div>

      {/* Screen */}
      <div className="relative bg-foreground" style={{
        boxShadow: 'inset 0 0 12px rgba(0,0,0,0.5)',
      }}>
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
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/30 transition-colors group-hover:bg-foreground/50">
              <div className="flex h-16 w-16 items-center justify-center bg-primary transition-transform group-hover:scale-110"
                style={{ boxShadow: '3px 3px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)' }}
              >
                <Play className="h-6 w-6 text-primary-foreground ml-1" fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 skeuo-leather px-3 py-2">
              <p className="truncate text-left font-chalk text-xs text-primary-foreground/90">{title}</p>
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
