import { useState, useEffect } from 'react';
import { Play, Youtube, Instagram, Twitter, Facebook, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
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
  const [igEmbed, setIgEmbed] = useState<string | null>(null);
  const [igLoading, setIgLoading] = useState(false);
  const alternates = sources.filter(s => s !== activeSource);
  const embedUrl = activeSource.platform === 'instagram' ? null : getEmbedUrl(activeSource);

  useEffect(() => {
    if (activeSource.platform === 'instagram' && playing) {
      setIgLoading(true);
      setIgEmbed(null);
      supabase.functions.invoke('proxy-instagram', {
        body: { url: activeSource.url },
      }).then(({ data }) => {
        if (data?.html) {
          setIgEmbed(data.html);
        } else {
          const match = activeSource.url.match(/instagram\.com\/(p|reel|reels)\/([a-zA-Z0-9_-]+)/);
          if (match) {
            setIgEmbed(`<iframe src="https://www.instagram.com/${match[1]}/${match[2]}/embed/captioned" width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`);
          }
        }
        setIgLoading(false);
      }).catch(() => {
        const match = activeSource.url.match(/instagram\.com\/(p|reel|reels)\/([a-zA-Z0-9_-]+)/);
        if (match) {
          setIgEmbed(`<iframe src="https://www.instagram.com/${match[1]}/${match[2]}/embed/captioned" width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`);
        }
        setIgLoading(false);
      });
    }
  }, [activeSource, playing]);

  const isIg = activeSource.platform === 'instagram';

  return (
    <div className={cn("border border-foreground/10 bg-card overflow-hidden", className)}>
      {/* TLC TV Header — clean bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-foreground/95">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-thunder-orange animate-pulse" />
          <span className="text-label text-[10px] tracking-[0.2em] text-card/90">TLC TV</span>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-0.5 bg-card/10 text-[9px] text-card/80">
          {getPlatformIcon(activeSource.platform)}
          <span className="text-label tracking-widest">{getPlatformLabel(activeSource.platform)}</span>
        </div>
      </div>

      {/* Screen area */}
      <div className="flex flex-col md:flex-row">
        {/* Video area */}
        <div className="flex-1">
          <h2 className="font-chalk text-lg text-foreground px-4 py-2 border-b border-foreground/8">{title}</h2>
          
          {/* Video frame */}
          <div className="relative bg-foreground/95 overflow-hidden">
            {!playing ? (
              <button
                onClick={() => setPlaying(true)}
                className="group relative aspect-video w-full"
              >
                <div className="flex h-full w-full items-center justify-center bg-foreground/90">
                  <span className="font-chalk text-3xl text-card/20">{title}</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center transition-colors">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-thunder-orange/90 shadow-lg transition-all group-hover:scale-110 group-hover:bg-thunder-orange">
                    <Play className="h-5 w-5 text-white ml-0.5" fill="currentColor" />
                  </div>
                </div>
              </button>
            ) : isIg ? (
              igLoading ? (
                <div className="flex aspect-video w-full items-center justify-center bg-foreground">
                  <Loader2 className="h-8 w-8 text-thunder-orange animate-spin" />
                </div>
              ) : igEmbed ? (
                <div className="aspect-video w-full" dangerouslySetInnerHTML={{ __html: igEmbed }} />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-surface-0">
                  <span className="font-chalk text-xl text-muted-foreground/40">LOADING REEL...</span>
                </div>
              )
            ) : embedUrl ? (
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
          </div>

          {activeSource.label && (
            <p className="px-4 py-1.5 font-chalk text-xs text-muted-foreground italic">↑ {activeSource.label}</p>
          )}
        </div>

        {/* Coaching cues sidebar */}
        {(cues.length > 0 || failSigns.length > 0) && (
          <div className="w-full md:w-56 border-t md:border-t-0 md:border-l border-foreground/8 p-3 space-y-3 bg-surface-0/50">
            {cues.length > 0 && (
              <div>
                <h4 className="text-label text-[9px] tracking-widest text-thunder-orange mb-1.5">COACHING CUES</h4>
                {cues.map((cue, i) => (
                  <p key={i} className="font-chalk text-xs text-foreground/70 mb-1 pl-2 border-l-2 border-thunder-orange/30">
                    {cue}
                  </p>
                ))}
              </div>
            )}
            {failSigns.length > 0 && (
              <div>
                <h4 className="text-label text-[9px] tracking-widest text-thunder-blue mb-1.5">⚠ WATCH FOR</h4>
                {failSigns.map((fs, i) => (
                  <p key={i} className="font-chalk text-xs text-foreground/50 mb-1 pl-2 border-l-2 border-thunder-blue/30">
                    {fs}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* More Angles */}
      {alternates.length > 0 && (
        <div className="border-t border-foreground/8">
          <button
            onClick={() => setShowAngles(!showAngles)}
            className="flex w-full items-center justify-between px-4 py-2 text-label text-[10px] tracking-widest text-muted-foreground hover:text-thunder-orange transition-colors bg-surface-0/50"
          >
            <span>MORE ANGLES ({alternates.length})</span>
            {showAngles ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
          {showAngles && (
            <div className="flex gap-2 overflow-x-auto px-4 pb-3 pt-1 hide-scrollbar">
              {alternates.map((src, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveSource(src); setPlaying(false); setIgEmbed(null); }}
                  className="flex shrink-0 items-center gap-2 border border-foreground/10 bg-card px-3 py-2 text-xs hover:text-thunder-orange transition-colors"
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
