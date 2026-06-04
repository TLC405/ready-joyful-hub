import { useState, useEffect } from 'react';
import { Play, Youtube, Instagram, Twitter, Facebook, ChevronDown, ChevronUp, Loader2, ExternalLink, Maximize2, Minimize2 } from 'lucide-react';
import DOMPurify from 'isomorphic-dompurify';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import type { VideoSource } from '@/lib/types';

// Allow only Instagram iframe embeds — strip everything else
function sanitizeEmbed(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['iframe', 'blockquote', 'a', 'div', 'p', 'span'],
    ALLOWED_ATTR: ['src', 'width', 'height', 'frameborder', 'scrolling', 'allowtransparency', 'allow', 'allowfullscreen', 'class', 'style', 'href', 'target', 'rel', 'data-instgrm-captioned', 'data-instgrm-permalink', 'data-instgrm-version'],
    ALLOWED_URI_REGEXP: /^https:\/\/(www\.)?instagram\.com\//i,
    ADD_ATTR: ['target'],
  });
}

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
  const [igError, setIgError] = useState<string | null>(null);
  const [theater, setTheater] = useState(false);
  const alternates = sources.filter(s => s !== activeSource);
  const embedUrl = activeSource.platform === 'instagram' ? null : getEmbedUrl(activeSource);

  useEffect(() => {
    if (activeSource.platform === 'instagram' && playing) {
      setIgLoading(true);
      setIgEmbed(null);
      setIgError(null);
      const fallback = () => {
        const match = activeSource.url.match(/instagram\.com\/(p|reel|reels)\/([a-zA-Z0-9_-]+)/);
        if (match) {
          setIgEmbed(`<iframe src="https://www.instagram.com/${match[1]}/${match[2]}/embed/captioned" width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true" allowfullscreen></iframe>`);
        } else {
          setIgError('Could not load this reel. Open it on Instagram instead.');
        }
      };
      supabase.functions.invoke('proxy-instagram', {
        body: { url: activeSource.url },
      }).then(({ data, error }) => {
        if (error) fallback();
        else if (data?.html) setIgEmbed(data.html);
        else fallback();
        setIgLoading(false);
      }).catch(() => {
        fallback();
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
          <div className={cn(
            "relative bg-foreground/95 overflow-hidden group/frame",
            isIg && playing ? "mx-auto" : "",
            isIg && playing && !theater ? "max-w-md" : "",
          )}>
            {!playing ? (
              <button
                onClick={() => setPlaying(true)}
                className={cn("group relative w-full", isIg ? "aspect-[9/16] max-h-[70vh] mx-auto max-w-md" : "aspect-video")}
              >
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-foreground/90 to-foreground/70">
                  <span className="font-chalk text-3xl text-card/20">{title}</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center transition-colors">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-thunder-orange/90 shadow-2xl transition-all group-hover:scale-110 group-hover:bg-thunder-orange">
                    <Play className="h-6 w-6 text-white ml-0.5" fill="currentColor" />
                  </div>
                </div>
                {isIg && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-[10px] text-foreground">
                    <Instagram className="h-3 w-3" /> REEL
                  </div>
                )}
              </button>
            ) : isIg ? (
              <div className={cn("relative w-full bg-black", theater ? "aspect-video" : "aspect-[9/16] max-h-[80vh]")}>
                {igLoading ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <Loader2 className="h-8 w-8 text-thunder-orange animate-spin" />
                  </div>
                ) : igError ? (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4 text-center">
                    <Instagram className="h-8 w-8 text-thunder-orange" />
                    <p className="text-xs text-card/70">{igError}</p>
                  </div>
                ) : igEmbed ? (
                  <div className="h-full w-full [&_iframe]:h-full [&_iframe]:w-full" dangerouslySetInnerHTML={{ __html: sanitizeEmbed(igEmbed) }} />
                ) : null}
                {/* Controls overlay */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/frame:opacity-100 transition-opacity">
                  <button
                    onClick={() => setTheater(t => !t)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-foreground hover:bg-thunder-orange hover:text-white transition-colors"
                    aria-label={theater ? 'Portrait' : 'Theater mode'}
                  >
                    {theater ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                  </button>
                  <a
                    href={activeSource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-card/90 text-foreground hover:bg-thunder-orange hover:text-white transition-colors"
                    aria-label="Open on Instagram"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
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
