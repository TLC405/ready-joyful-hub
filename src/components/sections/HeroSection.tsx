import { exercises } from '@/lib/exercises';
import { useMemo } from 'react';

interface HeroSectionProps {
  onCategoryClick?: (category: string) => void;
}

function getYtThumb(videoUrl?: string): string | null {
  const match = videoUrl?.match(/v=([a-zA-Z0-9_-]+)/);
  return match ? `https://i.ytimg.com/vi/${match[1]}/hqdefault.jpg` : null;
}

export function HeroSection({ onCategoryClick }: HeroSectionProps) {
  const categories = useMemo(() => {
    const cats = [
      { key: 'all', label: 'CALISTHENICS', emoji: '💪' },
      { key: 'yoga', label: 'YOGA', emoji: '🧘' },
      { key: 'ballet', label: 'BALLET', emoji: '🩰' },
      { key: 'mobility', label: 'MOBILITY', emoji: '🔄' },
    ];
    return cats.map(c => {
      const catExercises = c.key === 'all'
        ? exercises.filter(e => ['push', 'pull', 'core', 'legs', 'skills'].includes(e.category))
        : exercises.filter(e => e.category === c.key);
      const thumb = catExercises.find(e => e.videoUrl)?.videoUrl;
      return { ...c, count: catExercises.length, thumb: getYtThumb(thumb) };
    });
  }, []);

  return (
    <section className="relative px-4 py-6 lg:px-8 lg:py-10">
      <div className="text-center">
        <div className="mb-3 text-[10px] text-muted-foreground/60 tracking-[0.2em] uppercase">TLC CALISTHENICS · EST 2026</div>
        <h1 className="font-chalk text-4xl md:text-6xl lg:text-7xl text-foreground leading-tight">
          MASTER<br />
          <span className="bg-gradient-to-r from-thunder-orange to-thunder-blue bg-clip-text text-transparent">YOUR BODY.</span>
        </h1>
        <p className="mt-4 mx-auto max-w-md text-sm text-muted-foreground">
          Build superhuman strength with a hybrid approach — calisthenics, yoga, ballet, and beyond.
        </p>
        <div className="mx-auto mt-3 w-24 h-0.5 bg-gradient-to-r from-thunder-orange to-thunder-blue rounded" />
      </div>

      {/* Quick category cards */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl mx-auto">
        {categories.map(cat => (
          <button
            key={cat.label}
            onClick={() => onCategoryClick?.(cat.key)}
            className="relative bg-card border border-foreground/10 rounded p-3 text-center cursor-pointer hover:border-thunder-orange/40 transition-all overflow-hidden group shadow-sm"
          >
            {cat.thumb && (
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                <img src={cat.thumb} alt="" className="h-full w-full object-cover blur-sm" />
              </div>
            )}
            <div className="relative z-10">
              <div className="text-2xl mb-1">{cat.emoji}</div>
              <div className="text-[9px] font-bold tracking-widest text-foreground">{cat.label}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{cat.count} exercises</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}