import { motion } from 'framer-motion';

export function HeroSection() {
  const stats = [
    { label: 'SKILLS', value: '14' },
    { label: 'SESSIONS/WK', value: '12' },
    { label: 'MEMBERS', value: '680' },
    { label: 'STREAK', value: '7 DAYS' },
  ];

  return (
    <section className="px-4 py-8 lg:px-8 lg:py-12 notebook-ruled notebook-margin">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-2 text-label text-xs text-muted-foreground text-center text-journal-sm">TLC CALISTHEtICs est 2026</div>
        <h1 className="text-editorial text-foreground text-6xl font-serif text-center text-embossed">
          MASTER<br />
          <span className="text-primary">YOUR BODY.</span>
        </h1>
        <p className="mt-4 max-w-lg text-base text-card-foreground my-[21px] border-primary border-solid text-right text-journal">
          Build super human strength with a hydbrid approach.
        </p>
      </motion.div>

      {/* Stat bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8 flex border-y-2 border-foreground"
      >
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`flex-1 py-4 text-center skeuo-card skeuo-grain ${i > 0 ? 'border-l border-foreground/15' : ''}`}
          >
            <div className="font-chalk text-xl sm:text-2xl text-foreground text-journal-lg">{stat.value}</div>
            <div className="text-label text-[10px] text-muted-foreground text-journal-sm">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-6"
      >
        <button className="bg-primary px-8 py-3 font-chalk text-sm text-primary-foreground transition-opacity hover:opacity-90 btn-raised active:skeuo-pressed text-journal"
          style={{ background: 'hsl(var(--primary))' }}>
          GET STARTED →
        </button>
      </motion.div>
    </section>
  );
}
