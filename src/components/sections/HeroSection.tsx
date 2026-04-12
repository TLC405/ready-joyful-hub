import { exercises } from '@/lib/exercises';
import { useMemo } from 'react';
import { BookOpen, Dumbbell, MessageSquare, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  onCategoryClick?: (category: string) => void;
  onNavigate?: (section: string) => void;
}

function getYtThumb(videoUrl?: string): string | null {
  const match = videoUrl?.match(/v=([a-zA-Z0-9_-]+)/);
  return match ? `https://i.ytimg.com/vi/${match[1]}/hqdefault.jpg` : null;
}

const pathCards = [
  {
    key: 'library',
    title: 'EXPLORE',
    desc: 'Browse 80+ exercises across calisthenics, yoga, ballet & mobility',
    icon: Dumbbell,
  },
  {
    key: 'guide',
    title: 'LEARN',
    desc: 'Read the encyclopedia — technique breakdowns, nutrition, recovery',
    icon: BookOpen,
  },
  {
    key: 'coach',
    title: 'TRAIN',
    desc: 'Ask the AI coach to build your workout or find a video',
    icon: MessageSquare,
  },
];

const disciplines = [
  { key: 'all', label: 'Calisthenics' },
  { key: 'yoga', label: 'Yoga' },
  { key: 'ballet', label: 'Ballet' },
  { key: 'mobility', label: 'Mobility' },
];

export function HeroSection({ onCategoryClick, onNavigate }: HeroSectionProps) {
  const navigate = useNavigate();

  const featured = useMemo(() => exercises.filter(e => e.image).slice(0, 6), []);

  const disciplineCounts = useMemo(() => {
    return disciplines.map(d => {
      const count = d.key === 'all'
        ? exercises.filter(e => ['push', 'pull', 'core', 'legs', 'skills'].includes(e.category)).length
        : exercises.filter(e => e.category === d.key).length;
      return { ...d, count };
    });
  }, []);

  const pathThumbs = useMemo(() => {
    const thumbs: Record<string, string | null> = {};
    thumbs.library = exercises.find(e => e.image)?.image ?? null;
    thumbs.guide = exercises.find(e => e.category === 'yoga' && e.image)?.image ?? null;
    thumbs.coach = exercises.find(e => e.category === 'skills' && e.image)?.image ?? null;
    return thumbs;
  }, []);

  return (
    <div className="px-4 py-4 lg:px-8 lg:py-6 space-y-8 max-w-6xl mx-auto">
      {/* Section 1: Compact Hero */}
      <section className="text-center space-y-3 pt-2">
        <div className="text-[10px] text-muted-foreground/60 tracking-[0.2em] uppercase">TLC CALISTHENICS · EST 2026</div>
        <h1 className="font-chalk text-3xl md:text-5xl lg:text-6xl text-foreground leading-tight">
          MASTER<br />
          <span className="bg-gradient-to-r from-thunder-orange to-thunder-blue bg-clip-text text-transparent">YOUR BODY.</span>
        </h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          Build superhuman strength with a hybrid approach — calisthenics, yoga, ballet, and beyond.
        </p>
        <button
          onClick={() => onNavigate?.('coach')}
          className="mt-2 inline-flex items-center gap-2 btn-thunder font-chalk text-sm px-6 py-2.5 rounded-md"
        >
          START TRAINING →
        </button>
      </section>

      {/* Section 2: Your Path — 3 Action Cards */}
      <section className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
        {pathCards.map(card => {
          const Icon = card.icon;
          const thumb = pathThumbs[card.key];
          return (
            <button
              key={card.key}
              onClick={() => onNavigate?.(card.key)}
              className="relative overflow-hidden rounded-lg border border-foreground/10 bg-card p-5 text-left hover:border-thunder-orange/40 transition-all group"
            >
              {thumb && (
                <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity">
                  <img src={thumb} alt="" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="relative z-10 space-y-2">
                <Icon className="h-5 w-5 text-thunder-orange" />
                <h3 className="font-chalk text-lg text-foreground">{card.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            </button>
          );
        })}
      </section>

      {/* Section 3: Featured Skills */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h3 className="text-editorial-sm text-foreground font-chalk tracking-wider">FEATURED SKILLS</h3>
          <button onClick={() => onNavigate?.('library')} className="text-xs text-primary hover:underline">
            VIEW ALL →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {featured.map(ex => (
            <div
              key={ex.id}
              onClick={() => navigate(`/video/${ex.id}`)}
              className="group cursor-pointer rounded-lg overflow-hidden border border-foreground/10 bg-card hover:border-thunder-orange/30 transition-all"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={ex.image} alt={ex.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {(ex.videoUrl || ex.videoSources?.length || ex.instagramUrl) && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-10 w-10 rounded-full bg-thunder-orange/90 flex items-center justify-center">
                      <Play className="h-4 w-4 text-white ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3">
                <h4 className="font-chalk text-sm truncate text-foreground">{ex.name}</h4>
                <span className="text-[10px] text-muted-foreground capitalize">{ex.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Quick Start — Discipline Pills */}
      <section className="flex flex-wrap justify-center gap-2">
        {disciplineCounts.map(d => (
          <button
            key={d.key}
            onClick={() => onCategoryClick?.(d.key)}
            className="px-4 py-1.5 rounded-full border border-foreground/15 text-xs text-foreground hover:border-thunder-orange/50 hover:bg-thunder-orange/5 transition-all"
          >
            {d.label} <span className="text-muted-foreground ml-1">({d.count})</span>
          </button>
        ))}
      </section>

      {/* Section 5: Footer CTA */}
      <div className="text-center pb-4">
        <button onClick={() => onNavigate?.('coach')} className="text-xs text-muted-foreground hover:text-thunder-orange transition-colors">
          Need help? Ask the TLC Coach →
        </button>
      </div>
    </div>
  );
}
