import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative px-4 py-10 lg:px-8 lg:py-16">
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
        {[
          { label: 'CALISTHENICS', emoji: '💪', count: 45 },
          { label: 'YOGA', emoji: '🧘', count: 12 },
          { label: 'BALLET', emoji: '🩰', count: 12 },
          { label: 'MOBILITY', emoji: '🔄', count: 8 },
        ].map(cat => (
          <div key={cat.label} className="skeuo-card skeuo-grain p-3 text-center cursor-pointer hover:bg-surface-0 transition-colors">
            <div className="text-2xl mb-1">{cat.emoji}</div>
            <div className="text-label text-[9px] tracking-widest text-journal-sm">{cat.label}</div>
            <div className="text-[10px] text-muted-foreground/50 mt-0.5">{cat.count} exercises</div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
