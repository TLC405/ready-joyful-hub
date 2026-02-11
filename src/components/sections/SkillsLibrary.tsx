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
  beginner: {
    badge: 'difficulty-beginner',
    label: 'BEGINNER',
  },
  intermediate: {
    badge: 'difficulty-intermediate', 
    label: 'INTERMEDIATE',
  },
  advanced: {
    badge: 'difficulty-advanced',
    label: 'ADVANCED',
  },
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
    <section className="relative min-h-screen px-4 py-20 lg:px-8">
      <div className="mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-label text-sm text-primary">14 ELITE SKILLS</span>
            </div>
            <h2 className="text-heading text-5xl sm:text-6xl lg:text-7xl">
              <span className="text-primary">SKILL</span> LIBRARY
            </h2>
            <p className="mt-3 max-w-lg text-muted-foreground">
              Master gravity-defying feats from foundational moves to elite calisthenics mastery
            </p>
          </div>
          
          <div className="surface-glass flex flex-wrap items-center gap-2 rounded-xl p-1.5">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-lg px-4 py-2 text-label text-sm transition-all duration-300",
                  filter === f.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Skills Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -6 }}
              onClick={() => setSelectedSkill(skill)}
              className="accent-line group cursor-pointer overflow-hidden rounded-2xl surface-elevated transition-all duration-500 hover:border-primary/50 hover:shadow-steel-glow"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={skill.image}
                  alt={skill.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="image-overlay absolute inset-0" />
                
                <div className="absolute left-4 top-4">
                  <div className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm",
                    difficultyStyles[skill.difficulty].badge
                  )}>
                    <span className="text-label">{difficultyStyles[skill.difficulty].label}</span>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100">
                  <ChevronRight className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>

              <div className="p-5">
                <h3 className="mb-2 font-chalk text-2xl tracking-wide">{skill.name}</h3>
                <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {skill.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {skill.muscleGroups.slice(0, 3).map((muscle) => (
                    <span
                      key={muscle}
                      className="rounded-md border border-border bg-surface-1 px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>
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
