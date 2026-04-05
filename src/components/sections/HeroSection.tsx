import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative px-4 py-16 lg:px-8 lg:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-4 text-label text-[10px] text-muted-foreground/60 tracking-[0.2em] text-journal-sm">TLC CALISTHENICS · EST 2026</div>
        <h1 className="text-editorial text-foreground text-embossed">
          MASTER<br />
          <span className="thunder-text">YOUR BODY.</span>
        </h1>
        <p className="mt-6 mx-auto max-w-md text-sm text-muted-foreground/70 text-journal">
          Build superhuman strength with a hybrid approach — calisthenics, yoga, ballet, and beyond.
        </p>
        {/* Thunder gradient accent line */}
        <div className="mx-auto mt-4 w-24 thunder-divider" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-10 text-center"
      >
        <button className="px-10 py-3.5 font-chalk text-sm transition-all btn-thunder text-journal">
          GET STARTED →
        </button>
      </motion.div>
    </section>
  );
}
