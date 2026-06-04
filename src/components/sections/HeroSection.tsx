import { exercises } from '@/lib/exercises';
import { useMemo } from 'react';
import { Play, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WorkoutCalendar } from '@/components/workout/WorkoutCalendar';

interface HeroSectionProps {
  onCategoryClick?: (category: string) => void;
  onNavigate?: (section: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const navigate = useNavigate();
  const featured = useMemo(() => exercises.filter(e => e.image).slice(0, 8), []);
  const [hero, ...rest] = featured;

  return (
    <div className="px-4 py-4 lg:px-8 lg:py-6 space-y-10 max-w-6xl mx-auto">
      {/* Editorial hero */}
      <section className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-gradient-to-br from-foreground/[0.02] to-thunder-orange/5">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="p-6 md:p-10 flex flex-col justify-center space-y-4">
            <div className="text-[10px] text-muted-foreground/60 tracking-[0.25em] uppercase">TLC Calisthenics · Est 2026</div>
            <h1 className="font-chalk text-4xl md:text-6xl lg:text-7xl leading-[0.95] text-foreground">
              MASTER<br />
              <span className="bg-gradient-to-r from-thunder-orange to-thunder-blue bg-clip-text text-transparent">YOUR BODY.</span>
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-md">
              Hybrid strength training — calisthenics, yoga, ballet, and beyond. Log every session. Master every skill.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={() => onNavigate?.('library')}
                className="inline-flex items-center gap-2 rounded-full bg-thunder-orange px-5 py-2.5 text-sm font-medium text-white hover:bg-thunder-orange/90 transition-colors"
              >
                <Sparkles className="h-4 w-4" /> Browse skills
              </button>
              <button
                onClick={() => onNavigate?.('progress')}
                className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 text-sm font-medium text-foreground hover:border-thunder-blue hover:text-thunder-blue transition-colors"
              >
                <TrendingUp className="h-4 w-4" /> Your progress
              </button>
            </div>
          </div>
          {hero && (
            <button
              onClick={() => navigate(`/video/${hero.id}`)}
              className="group relative aspect-[4/3] md:aspect-auto md:min-h-[320px] overflow-hidden"
              aria-label={`Open ${hero.name}`}
            >
              <img
                src={hero.image}
                alt={hero.name}
                loading="eager"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                <div className="text-[10px] tracking-[0.2em] text-card/70 uppercase mb-1">Skill of the day</div>
                <div className="font-chalk text-2xl md:text-3xl text-card">{hero.name}</div>
                <div className="text-xs text-card/60 capitalize mt-1">{hero.difficulty}</div>
              </div>
              <div className="absolute top-4 right-4 h-12 w-12 rounded-full bg-thunder-orange/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Play className="h-5 w-5 text-white ml-0.5" fill="currentColor" aria-hidden="true" />
              </div>
            </button>
          )}
        </div>
      </section>

      {/* Live training log + calendar */}
      <section aria-label="Training log">
        <WorkoutCalendar />
      </section>

      {/* Featured skills — bento grid */}
      <section aria-label="Featured skills">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-editorial-sm text-foreground font-chalk tracking-wider">FEATURED SKILLS</h2>
          <button onClick={() => onNavigate?.('library')} className="text-xs text-primary hover:underline">
            VIEW ALL →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[140px] md:auto-rows-[180px]">
          {rest.map((ex, idx) => {
            const big = idx === 0 || idx === 3;
            return (
              <button
                key={ex.id}
                onClick={() => navigate(`/video/${ex.id}`)}
                className={`group relative text-left rounded-xl overflow-hidden border border-foreground/10 bg-card hover:border-thunder-orange/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-thunder-orange ${big ? 'row-span-2 col-span-2 md:col-span-2' : ''}`}
                aria-label={`Open ${ex.name}`}
              >
                <img
                  src={ex.image}
                  alt={ex.name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />
                {(ex.videoUrl || ex.videoSources?.length || ex.instagramUrl) && (
                  <div className="absolute top-2 right-2 h-8 w-8 rounded-full bg-thunder-orange/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-3.5 w-3.5 text-white ml-0.5" fill="currentColor" aria-hidden="true" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className={`font-chalk truncate text-card ${big ? 'text-lg md:text-xl' : 'text-sm'}`}>{ex.name}</div>
                  <span className="text-[10px] text-card/60 capitalize">{ex.difficulty}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
