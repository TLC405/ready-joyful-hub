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
        <div className="editorial-divider-thick pt-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border border-foreground/10 px-3 py-1">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-label text-[10px] text-primary">{skills.length} SKILLS</span>
            </div>
            <h2 className="text-editorial-sm text-foreground">
              <span className="text-primary">SKILL</span> LIBRARY
            </h2>
          </div>
          <p className="mt-1 max-w-lg text-sm text-muted-foreground">
            Master gravity-defying feats from foundational moves to elite calisthenics mastery
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-px border border-foreground/10">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "relative px-3 py-2 text-label text-[10px] transition-all",
                filter === f.id
                  ? "bg-foreground text-card"
                  : "bg-card text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-px bg-foreground/10 border border-foreground/10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill) => (
            <motion.div
              key={skill.id}
              variants={cardVariants}
              exit="exit"
              layout
              onClick={() => setSelectedSkill(skill)}
              className="group cursor-pointer bg-card transition-colors hover:bg-surface-0"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <motion.img
                  src={skill.image}
                  alt={skill.name}
                  className="h-full w-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="image-overlay absolute inset-0" />
                
                <div className="absolute left-0 top-0">
                  <div className={cn(
                    "border px-2.5 py-0.5 text-[10px] font-medium bg-card/90",
                    difficultyStyles[skill.difficulty].badge
                  )}>
                    <span className="text-label">{difficultyStyles[skill.difficulty].label}</span>
                  </div>
                </div>

                <div className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center bg-primary opacity-0 transition-all duration-300 group-hover:opacity-100">
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
                      className="border border-foreground/10 px-2 py-0.5 text-[10px] text-muted-foreground transition-colors group-hover:text-foreground"
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
