import { motion } from 'framer-motion';
import { Target, Dumbbell, Trophy, Crosshair, Zap } from 'lucide-react';

const statVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: 0.15 + i * 0.08, type: 'spring' as const, stiffness: 400, damping: 22 }
  })
};

export function HeroSection() {
  const stats = [
    { label: 'SKILLS', value: '14', total: '14', icon: Dumbbell, color: 'text-primary' },
    { label: 'SESSIONS', value: '34', icon: Target, color: 'text-accent' },
    { label: 'STREAK', value: '7d', icon: Zap, color: 'text-primary' },
    { label: 'RANK', value: '#142', icon: Trophy, color: 'text-accent' },
  ];

  return (
    <section className="px-4 py-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="flex items-center gap-4"
        >
          <motion.div 
            className="surface-raised flex items-center gap-2 rounded-full px-3 py-1"
            whileHover={{ scale: 1.05 }}
          >
            <Crosshair className="h-3 w-3 text-primary" />
            <span className="text-label text-[10px] text-primary">BODYWEIGHT SKILL SYSTEM</span>
          </motion.div>
          <h1 className="font-chalk text-2xl text-embossed sm:text-3xl tracking-tight">
            <span className="text-primary">MASTER</span> YOUR STACK
          </h1>
        </motion.div>

        <div className="flex gap-3">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                custom={i}
                variants={statVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -3, transition: { duration: 0.15 } }}
                className="surface-raised flex items-center gap-3 rounded-lg px-4 py-3"
              >
                <div className="surface-inset flex h-8 w-8 items-center justify-center rounded-md">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="font-chalk text-xl text-foreground">{stat.value}</span>
                    {stat.total && (
                      <span className="font-chalk text-sm text-muted-foreground">/{stat.total}</span>
                    )}
                  </div>
                  <span className="text-label text-[10px] text-muted-foreground">{stat.label}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
