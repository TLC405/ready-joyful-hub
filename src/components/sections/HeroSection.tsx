import { motion } from 'framer-motion';
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-3 text-label text-[10px] text-muted-foreground/60 tracking-[0.2em] text-journal-sm">TLC CALISTHENICS · EST 2026</div>
        <h1 className="text-editorial text-foreground text-embossed">
          MASTER<br />
          <span className="thunder-text">YOUR BODY.</span>
        </h1>
        <p className="mt-4 mx-auto max-w-md text-sm text-muted-foreground/70 text-journal">
          Build superhuman strength with a hybrid approach — calisthenics, yoga, ballet, and beyond.
        </p>
        <div className="mx-auto mt-3 w-24 thunder-divider" />
      </motion.div>

      {/* Quick category cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-2xl mx-auto"
      >
        {categories.map(cat => (
          <button
            key={cat.label}
            onClick={() => onCategoryClick?.(cat.key)}
            className="relative skeuo-card skeuo-grain p-3 text-center cursor-pointer hover:border-thunder-orange/40 transition-all overflow-hidden group"
          >
            {cat.thumb && (
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                <img src={cat.thumb} alt="" className="h-full w-full object-cover blur-sm" />
              </div>
            )}
            <div className="relative z-10">
              <div className="text-2xl mb-1">{cat.emoji}</div>
              <div className="text-label text-[9px] tracking-widest text-journal-sm">{cat.label}</div>
              <div className="text-[10px] text-muted-foreground/50 mt-0.5">{cat.count} exercises</div>
            </div>
          </button>
        ))}
      </motion.div>
    </section>
  );
}
