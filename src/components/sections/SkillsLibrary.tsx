import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Sparkles
} from 'lucide-react';
import { skills, Skill } from '@/lib/skills-data';
import { cn } from '@/lib/utils';
import { SkillDetailModal } from './skills/SkillDetailModal';

type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

const difficultyStyles = {
  beginner: { badge: 'difficulty-beginner', label: 'BEGINNER' },
  intermediate: { badge: 'difficulty-intermediate', label: 'INTERMEDIATE' },
  advanced: { badge: 'difficulty-advanced', label: 'ADVANCED' },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { 
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 }
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
};

export function SkillsLibrary() {
  const [filter, setFilter] = useState<DifficultyFilter>('all');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const filteredSkills = filter === 'all' 
    ? skills 
    : skills.filter(s => s.difficulty === filter);

  const filters: { id: DifficultyFilter; label: string }[] = [
    { id: 'all', label: 'ALL SKILLS' },
    { id: 'beginner', label: 'BEGINNER' },
    { id: 'intermediate', label: 'INTERMEDIATE' },
    { id: 'advanced', label: 'ADVANCED' },
  ];

  return (
    <section className="relative px-4 py-8 lg:px-8">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div className="flex items-center gap-3">
            <div className="badge-coin flex items-center gap-2 rounded-full px-3 py-1">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-label text-[10px] text-primary">{skills.length} SKILLS</span>
            </div>
            <h2 className="font-chalk text-2xl text-embossed sm:text-3xl">
              <span className="text-primary">SKILL</span> LIBRARY
            </h2>
          </div>
          <p className="mt-1 max-w-lg text-sm text-muted-foreground">
            Master gravity-defying feats from foundational moves to elite calisthenics mastery
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.1 }}
          className="surface-raised flex flex-wrap items-center gap-1 rounded-lg p-1"
        >
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "relative rounded-md px-3 py-1.5 text-label text-xs transition-all duration-300",
                filter === f.id
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {filter === f.id && (
                <motion.div
                  layoutId="skillFilterActive"
                  className="absolute inset-0 rounded-md bg-primary"
                  style={{ boxShadow: 'inset 0 1px 0 0 hsla(0,0%,100%,0.2), 0 2px 4px hsla(0,0%,0%,0.3)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{f.label}</span>
            </button>
          ))}
        </motion.div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.id}
              variants={cardVariants}
              exit="exit"
              layout
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => setSelectedSkill(skill)}
              className="group cursor-pointer overflow-hidden rounded-xl surface-raised transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <motion.img
                  src={skill.image}
                  alt={skill.name}
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
                <div className="image-overlay absolute inset-0" />
                
                <div className="absolute left-3 top-3">
                  <div className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[10px] font-medium backdrop-blur-md",
                    difficultyStyles[skill.difficulty].badge
                  )}>
                    <span className="text-label">{difficultyStyles[skill.difficulty].label}</span>
                  </div>
                </div>

                <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 scale-75" style={{ boxShadow: 'var(--shadow-brutal)' }}>
                  <ChevronRight className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>

              <div className="p-4">
                <h3 className="mb-1.5 font-chalk text-lg tracking-wide">{skill.name}</h3>
                <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {skill.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {skill.muscleGroups.slice(0, 3).map((muscle) => (
                    <span
                      key={muscle}
                      className="rounded-md border border-border bg-surface-1 px-2 py-0.5 text-[10px] text-muted-foreground transition-colors group-hover:border-primary/20 group-hover:text-foreground"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>

              <div className="h-0.5 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selectedSkill && (
          <SkillDetailModal 
            skill={selectedSkill} 
            onClose={() => setSelectedSkill(null)} 
          />
        )}
      </AnimatePresence>
    </section>
  );
}
