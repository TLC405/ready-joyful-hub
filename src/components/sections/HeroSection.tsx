import { motion } from 'framer-motion';
import { Flame, Dumbbell, Trophy, ChevronDown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onStartTraining: () => void;
}

export function HeroSection({ onStartTraining }: HeroSectionProps) {
  const stats = [
    { label: 'SKILLS MASTERED', value: '3', total: '14', icon: Dumbbell },
    { label: 'DAY STREAK', value: '7', icon: Flame, highlight: true },
    { label: 'GLOBAL RANK', value: '#142', icon: Trophy },
  ];

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20 lg:px-8">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          className="absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[100px]"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -right-40 bottom-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[100px]"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2"
        >
          <Zap className="h-4 w-4 text-primary" />
          <span className="font-chalk text-sm tracking-wider text-primary">TRANSFORM YOUR BODY</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-2 font-chalk text-6xl leading-none tracking-tight sm:text-7xl md:text-8xl lg:text-9xl"
        >
          <span className="text-gradient">UNLEASH</span>
        </motion.h1>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 font-chalk text-6xl leading-none tracking-tight sm:text-7xl md:text-8xl lg:text-9xl"
        >
          YOUR POWER
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-10 max-w-xl text-lg text-muted-foreground sm:text-xl"
        >
          Master 14 calisthenics skills from beginner to advanced. Track your progress, compete globally, and transform your body.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16 flex flex-col gap-4 sm:flex-row"
        >
          <Button 
            size="lg"
            onClick={onStartTraining}
            className="group relative overflow-hidden bg-primary px-8 py-6 font-chalk text-xl text-primary-foreground transition-all hover:bg-primary/90"
          >
            <span className="relative z-10">START TRAINING</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            className="border-2 border-border px-8 py-6 font-chalk text-xl hover:border-primary hover:text-primary"
          >
            VIEW SKILLS
          </Button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`card-hover flex flex-col items-center gap-3 rounded-xl border-2 p-6 ${
                  stat.highlight 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border bg-card'
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                  stat.highlight 
                    ? 'bg-gradient-to-br from-orange-500 to-red-600' 
                    : 'bg-secondary'
                }`}>
                  <Icon className={`h-6 w-6 ${stat.highlight ? 'text-white' : 'text-primary'}`} />
                </div>
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-chalk text-4xl text-foreground">{stat.value}</span>
                    {stat.total && (
                      <span className="font-chalk text-xl text-muted-foreground">/{stat.total}</span>
                    )}
                  </div>
                  <span className="font-chalk text-xs tracking-wider text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="font-chalk text-xs tracking-widest">SCROLL TO EXPLORE</span>
          <ChevronDown className="h-5 w-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
