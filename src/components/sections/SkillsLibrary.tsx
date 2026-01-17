import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  ChevronRight, 
  Target,
  Lightbulb,
  Play,
  X,
  Sparkles
} from 'lucide-react';
import { skills, Skill } from '@/lib/skills-data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';

const difficultyStyles = {
  beginner: {
    badge: 'difficulty-beginner',
    label: 'BEGINNER',
    accent: 'hsl(40, 5%, 75%)'
  },
  intermediate: {
    badge: 'difficulty-intermediate', 
    label: 'INTERMEDIATE',
    accent: 'hsl(33, 60%, 55%)'
  },
  advanced: {
    badge: 'difficulty-advanced',
    label: 'ADVANCED',
    accent: 'hsl(42, 87%, 55%)'
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
      {/* Section Header */}
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
              <span className="font-chalk text-sm text-primary">14 ELITE SKILLS</span>
            </div>
            <h2 className="font-chalk text-5xl sm:text-6xl lg:text-7xl">
              <span className="text-gradient">SKILL</span> LIBRARY
            </h2>
            <p className="mt-3 max-w-lg text-muted-foreground">
              Master gravity-defying feats from foundational moves to elite calisthenics mastery
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card/50 p-1.5 backdrop-blur-sm">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-lg px-4 py-2 font-chalk text-sm transition-all duration-300",
                  filter === f.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
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
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-all duration-500 hover:border-primary/50 hover:shadow-[0_20px_60px_-10px_hsla(42,87%,55%,0.15)]"
            >
              {/* Skill Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={skill.image}
                  alt={skill.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="image-overlay absolute inset-0" />
                
                {/* Difficulty Badge */}
                <div className="absolute left-4 top-4">
                  <div className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm",
                    difficultyStyles[skill.difficulty].badge
                  )}>
                    <span className="font-chalk">{difficultyStyles[skill.difficulty].label}</span>
                  </div>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100">
                  <ChevronRight className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>

              {/* Skill Info */}
              <div className="p-5">
                <h3 className="mb-2 font-chalk text-2xl tracking-wide">{skill.name}</h3>
                <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {skill.description}
                </p>

                {/* Muscle Groups */}
                <div className="flex flex-wrap gap-1.5">
                  {skill.muscleGroups.slice(0, 3).map((muscle) => (
                    <span
                      key={muscle}
                      className="rounded-md border border-border bg-secondary/50 px-2.5 py-1 text-xs text-muted-foreground"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>

              {/* Premium Gold Accent Line */}
              <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-primary via-accent to-primary transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/98 p-4 backdrop-blur-xl"
            onClick={() => setSelectedSkill(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl lg:p-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedSkill(null)}
                className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-colors hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid gap-8 lg:grid-cols-2">
                {/* Image */}
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={selectedSkill.image}
                    alt={selectedSkill.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                </div>

                {/* Content */}
                <div>
                  {/* Header */}
                  <div className="mb-6">
                    <div className={cn(
                      "mb-3 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
                      difficultyStyles[selectedSkill.difficulty].badge
                    )}>
                      <span className="font-chalk">{difficultyStyles[selectedSkill.difficulty].label}</span>
                    </div>
                    <h2 className="font-chalk text-4xl lg:text-5xl">{selectedSkill.name}</h2>
                    <p className="mt-3 leading-relaxed text-muted-foreground">{selectedSkill.description}</p>
                  </div>

                  {/* Progression Targets */}
                  <div className="mb-6">
                    <h3 className="mb-3 flex items-center gap-2 font-chalk text-lg text-primary">
                      <Target className="h-5 w-5" />
                      PROGRESSION TARGETS
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkill.progressionTargets.map((target, idx) => (
                        <div
                          key={idx}
                          className={cn(
                            "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm",
                            idx === 0 
                              ? "border-primary bg-primary/10 text-primary" 
                              : "border-border bg-secondary/50"
                          )}
                        >
                          {idx === 0 && <CheckCircle className="h-4 w-4" />}
                          <span className="font-chalk">{target}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-8">
                <h3 className="mb-4 flex items-center gap-2 font-chalk text-xl text-primary">
                  <Play className="h-5 w-5" />
                  STEP-BY-STEP INSTRUCTIONS
                </h3>
                <ol className="grid gap-3 sm:grid-cols-2">
                  {selectedSkill.instructions.map((instruction, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4 rounded-xl bg-secondary/30 p-4"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-chalk text-sm text-primary-foreground">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-foreground">{instruction}</span>
                    </motion.li>
                  ))}
                </ol>
              </div>

              {/* Tips */}
              <div className="mt-8">
                <h3 className="mb-4 flex items-center gap-2 font-chalk text-xl text-primary">
                  <Lightbulb className="h-5 w-5" />
                  PRO TIPS
                </h3>
                <div className="grid gap-3 sm:grid-cols-3">
                  {selectedSkill.tips.map((tip, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-primary/20 bg-primary/5 p-4"
                    >
                      <span className="text-sm text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-10">
                <Button className="w-full bg-primary py-7 font-chalk text-xl text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-[0_0_40px_hsla(42,87%,55%,0.3)]">
                  START PRACTICING
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
