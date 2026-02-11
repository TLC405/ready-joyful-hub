import { motion } from 'framer-motion';
import { Target, Dumbbell, Trophy, Crosshair } from 'lucide-react';

export function HeroSection() {
  const stats = [
    { label: 'SKILLS', value: '3', total: '14', icon: Dumbbell },
    { label: 'SESSIONS', value: '34', icon: Target },
    { label: 'RANK', value: '#142', icon: Trophy },
  ];

  return (
    <section className="px-4 py-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1">
            <Crosshair className="h-3 w-3 text-primary" />
            <span className="text-label text-[10px] text-primary">BODYWEIGHT SKILL SYSTEM</span>
          </div>
          <h1 className="font-chalk text-2xl sm:text-3xl tracking-tight">
            <span className="text-primary">MASTER</span> YOUR STACK
          </h1>
        </motion.div>

        {/* Right: compact stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="surface-elevated flex items-center gap-3 rounded-lg px-4 py-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-2">
                  <Icon className="h-4 w-4 text-primary" />
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
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
