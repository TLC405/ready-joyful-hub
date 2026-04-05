import { useState } from 'react';
import { Play, Youtube, Instagram, Twitter, Facebook, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VideoSource } from '@/lib/types';

function getPlatformIcon(platform: string) {
  switch (platform) {
    case 'youtube': return <Youtube className="h-4 w-4" />;
    case 'instagram': return <Instagram className="h-4 w-4" />;
    case 'x': return <Twitter className="h-4 w-4" />;
    case 'facebook': return <Facebook className="h-4 w-4" />;
    default: return null;
  }
}

function getPlatformLabel(platform: string) {
  switch (platform) {
    case 'youtube': return 'YOUTUBE';
    case 'instagram': return 'INSTAGRAM';
    case 'x': return 'X (TWITTER)';
    case 'facebook': return 'FACEBOOK';
    default: return platform.toUpperCase();
  }
}

function getEmbedUrl(source: VideoSource): string | null {
  const { platform, url } = source;
  if (platform === 'youtube') {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0&modestbranding=1`;
  }
  if (platform === 'instagram') {
    const match = url.match(/instagram\.com\/(p|reel)\/([a-zA-Z0-9_-]+)/);
    if (match) return `https://www.instagram.com/${match[1]}/${match[2]}/embed`;
  }
  return null;
}

interface TLCNotebookPlayerProps {
  sources: VideoSource[];
  title: string;
  cues?: string[];
  failSigns?: string[];
  className?: string;
}

export function TLCNotebookPlayer({ sources, title, cues = [], failSigns = [], className }: TLCNotebookPlayerProps) {
  const primary = sources.find(s => s.primary) || sources[0];
  const [activeSource, setActiveSource] = useState<VideoSource>(primary);
  const [playing, setPlaying] = useState(false);
  const [showAngles, setShowAngles] = useState(false);
  const alternates = sources.filter(s => s !== activeSource);
  const embedUrl = getEmbedUrl(activeSource);

  return (
    <div className={cn("border-2 border-foreground bg-card", className)}>
      {/* TLC TV Header */}
      <div className="flex items-center justify-between border-b-2 border-foreground bg-foreground px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 bg-primary" />
          <span className="text-label text-[10px] tracking-[0.2em] text-card">TLC TV</span>
        </div>
        <div className="flex items-center gap-2 text-card/60">
          {getPlatformIcon(activeSource.platform)}
          <span className="text-label text-[9px] tracking-widest">{getPlatformLabel(activeSource.platform)}</span>
        </div>
      </div>

      {/* Notebook ruled area with video */}
      <div className="relative" style={{
        background: `repeating-linear-gradient(transparent, transparent 27px, hsl(var(--muted)) 27px, hsl(var(--muted)) 28px)`,
      }}>
        {/* Red margin line */}
        <div className="absolute left-12 top-0 bottom-0 w-px bg-primary/30 z-10 hidden md:block" />

        <div className="flex flex-col md:flex-row">
          {/* Video area */}
          <div className="flex-1 p-3 md:pl-16">
            {/* Title in chalk */}
            <h2 className="font-chalk text-lg text-foreground mb-2 border-b border-foreground/10 pb-1">{title}</h2>
            
            {/* Video frame — "taped in" effect */}
            <div className="relative border-2 border-foreground/20 bg-foreground">
              {!playing && embedUrl ? (
                <button
                  onClick={() => setPlaying(true)}
                  className="group relative aspect-video w-full"
                >
                  <div className="flex h-full w-full items-center justify-center bg-foreground/90">
                    <span className="font-chalk text-3xl text-card/30">{title}</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-foreground/30 transition-colors group-hover:bg-foreground/50">
                    <div className="flex h-16 w-16 items-center justify-center border-2 border-card bg-primary transition-transform group-hover:scale-110">
                      <Play className="h-6 w-6 text-primary-foreground ml-1" fill="currentColor" />
                    </div>
                  </div>
                </button>
              ) : playing && embedUrl ? (
                <div className="aspect-video w-full">
                  <iframe
                    src={embedUrl}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-surface-0">
                  <div className="text-center">
                    <span className="font-chalk text-xl text-muted-foreground/40">VIDEO COMING SOON</span>
                    <p className="mt-1 text-xs text-muted-foreground/30">We're filming this one next</p>
                  </div>
                </div>
              )}

              {/* Tape corners */}
              <div className="absolute -top-1 -left-1 h-4 w-8 rotate-[-5deg] bg-muted/60 border border-foreground/10" />
              <div className="absolute -top-1 -right-1 h-4 w-8 rotate-[5deg] bg-muted/60 border border-foreground/10" />
            </div>

            {/* Source label */}
            {activeSource.label && (
              <p className="mt-2 font-chalk text-xs text-muted-foreground italic">↑ {activeSource.label}</p>
            )}
          </div>

          {/* Margin notes — coaching cues */}
          {(cues.length > 0 || failSigns.length > 0) && (
            <div className="w-full md:w-56 border-t md:border-t-0 md:border-l border-foreground/10 p-3 space-y-3">
              {cues.length > 0 && (
                <div>
                  <h4 className="text-label text-[9px] tracking-widest text-primary mb-1.5">COACHING CUES</h4>
                  {cues.map((cue, i) => (
                    <p key={i} className="font-chalk text-xs text-foreground/70 mb-1 pl-2 border-l-2 border-primary/30">
                      {cue}
                    </p>
                  ))}
                </div>
              )}
              {failSigns.length > 0 && (
                <div>
                  <h4 className="text-label text-[9px] tracking-widest text-foreground mb-1.5">⚠ WATCH FOR</h4>
                  {failSigns.map((fs, i) => (
                    <p key={i} className="font-chalk text-xs text-foreground/50 mb-1 pl-2 border-l-2 border-foreground/20">
                      {fs}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* More Angles */}
      {alternates.length > 0 && (
        <div className="border-t-2 border-foreground/10">
          <button
            onClick={() => setShowAngles(!showAngles)}
            className="flex w-full items-center justify-between px-4 py-2 text-label text-[10px] tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>MORE ANGLES ({alternates.length})</span>
            {showAngles ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          {showAngles && (
            <div className="flex gap-2 overflow-x-auto px-4 pb-3 hide-scrollbar">
              {alternates.map((src, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveSource(src); setPlaying(false); }}
                  className="flex shrink-0 items-center gap-2 border border-foreground/15 bg-surface-0 px-3 py-2 text-xs hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {getPlatformIcon(src.platform)}
                  <span className="text-label text-[10px]">{src.label || getPlatformLabel(src.platform)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
