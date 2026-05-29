import { exercises } from '@/lib/exercises';
import { useMemo } from 'react';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { WorkoutCalendar } from '@/components/workout/WorkoutCalendar';

interface HeroSectionProps {
  onCategoryClick?: (category: string) => void;
  onNavigate?: (section: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const navigate = useNavigate();
  const featured = useMemo(() => exercises.filter(e => e.image).slice(0, 6), []);

  return (
    <div className="px-4 py-4 lg:px-8 lg:py-6 space-y-8 max-w-6xl mx-auto">
      {/* Compact hero */}
      <section className="text-center space-y-3 pt-2">
        <div className="text-[10px] text-muted-foreground/60 tracking-[0.2em] uppercase">TLC CALISTHENICS · EST 2026</div>
        <h1 className="font-chalk text-3xl md:text-5xl lg:text-6xl text-foreground leading-tight">
          MASTER<br />
          <span className="bg-gradient-to-r from-thunder-orange to-thunder-blue bg-clip-text text-transparent">YOUR BODY.</span>
        </h1>
        <p className="mx-auto max-w-md text-sm text-muted-foreground">
          Build superhuman strength with a hybrid approach — calisthenics, yoga, ballet, and beyond.
        </p>
      </section>

      {/* Live training log + calendar */}
      <section aria-label="Training log">
        <WorkoutCalendar />
      </section>

      {/* Featured skills */}
      <section aria-label="Featured skills">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-editorial-sm text-foreground font-chalk tracking-wider">FEATURED SKILLS</h2>
          <button onClick={() => onNavigate?.('library')} className="text-xs text-primary hover:underline">
            VIEW ALL →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {featured.map(ex => (
            <button
              key={ex.id}
              onClick={() => navigate(`/video/${ex.id}`)}
              className="group text-left rounded-lg overflow-hidden border border-foreground/10 bg-card hover:border-thunder-orange/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-thunder-orange"
              aria-label={`Open ${ex.name}`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={ex.image}
                  alt={ex.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {(ex.videoUrl || ex.videoSources?.length || ex.instagramUrl) && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-10 w-10 rounded-full bg-thunder-orange/90 flex items-center justify-center">
                      <Play className="h-4 w-4 text-white ml-0.5" fill="currentColor" aria-hidden="true" />
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="font-chalk text-sm truncate text-foreground">{ex.name}</div>
                <span className="text-[10px] text-muted-foreground capitalize">{ex.difficulty}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <div className="text-center pb-4">
        <button onClick={() => onNavigate?.('coach')} className="text-xs text-muted-foreground hover:text-thunder-orange transition-colors">
          Need help? Ask the TLC Coach →
        </button>
      </div>
    </div>
  );
}
