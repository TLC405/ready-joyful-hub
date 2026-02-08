import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Target,
  Lightbulb,
  Play,
  X,
  AlertTriangle,
  Zap,
  RotateCcw,
  TrendingUp,
  Shield
} from 'lucide-react';
import { Skill } from '@/lib/skills-data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SkillDetailModalProps {
  skill: Skill;
  onClose: () => void;
}

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

export function SkillDetailModal({ skill, onClose }: SkillDetailModalProps) {
  const hasMovements = skill.movements && skill.movements.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/98 p-4 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl lg:p-10"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-colors hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image */}
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={skill.image}
              alt={skill.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          </div>

          {/* Content */}
          <div>
            {/* Header */}
            <div className="mb-6">
              {skill.protocol_name && (
                <div className="mb-2 font-chalk text-xs tracking-widest text-primary/80">
                  {skill.protocol_name}
                </div>
              )}
              <div className={cn(
                "mb-3 inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
                difficultyStyles[skill.difficulty].badge
              )}>
                <span className="font-chalk">{difficultyStyles[skill.difficulty].label}</span>
              </div>
              <h2 className="font-chalk text-3xl lg:text-4xl">{skill.name}</h2>
              {skill.objective && (
                <p className="mt-2 font-chalk text-sm text-primary">{skill.objective}</p>
              )}
              <p className="mt-3 leading-relaxed text-muted-foreground">{skill.description}</p>
            </div>

            {/* Progression Targets */}
            <div className="mb-6">
              <h3 className="mb-3 flex items-center gap-2 font-chalk text-lg text-primary">
                <Target className="h-5 w-5" />
                PROGRESSION TARGETS
              </h3>
              <div className="flex flex-wrap gap-2">
                {skill.progressionTargets.map((target, idx) => (
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

            {/* Intensity Markers */}
            {skill.intensity_markers && skill.intensity_markers.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 flex items-center gap-2 font-chalk text-lg text-primary">
                  <Shield className="h-5 w-5" />
                  INTENSITY MARKERS
                </h3>
                <div className="space-y-2">
                  {skill.intensity_markers.map((marker, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Zap className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{marker}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Movement Briefings (Premium Protocol Content) */}
        {hasMovements ? (
          <div className="mt-10">
            <h3 className="mb-6 flex items-center gap-2 font-chalk text-2xl text-primary">
              <Play className="h-6 w-6" />
              MOVEMENT BRIEFINGS
            </h3>
            <div className="space-y-6">
              {skill.movements!.map((movement, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="overflow-hidden rounded-2xl border border-border bg-secondary/20"
                >
                  {/* Movement Header */}
                  <div className="flex items-center gap-4 border-b border-border bg-secondary/40 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-chalk text-lg text-primary-foreground">
                      {idx + 1}
                    </span>
                    <h4 className="font-chalk text-xl">{movement.name}</h4>
                  </div>

                  <div className="p-5">
                    <Tabs defaultValue="mechanic" className="w-full">
                      <TabsList className="mb-4 grid w-full grid-cols-3 lg:grid-cols-6">
                        <TabsTrigger value="mechanic" className="font-chalk text-xs">MECHANIC</TabsTrigger>
                        <TabsTrigger value="brutality" className="font-chalk text-xs">BRUTALITY</TabsTrigger>
                        <TabsTrigger value="progression" className="font-chalk text-xs">PROGRESSION</TabsTrigger>
                        <TabsTrigger value="volume" className="font-chalk text-xs">VOLUME</TabsTrigger>
                        <TabsTrigger value="watchout" className="font-chalk text-xs">WATCH OUT</TabsTrigger>
                        <TabsTrigger value="recovery" className="font-chalk text-xs">RECOVERY</TabsTrigger>
                      </TabsList>

                      <TabsContent value="mechanic" className="mt-0">
                        <div className="rounded-xl bg-secondary/30 p-4">
                          <p className="leading-relaxed text-foreground">{movement.mechanic}</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="brutality" className="mt-0">
                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                          <div className="flex items-start gap-3">
                            <Zap className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                            <p className="leading-relaxed text-foreground">{movement.brutality}</p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="progression" className="mt-0">
                        <div className="rounded-xl bg-secondary/30 p-4">
                          <div className="flex items-start gap-3">
                            <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                            <p className="leading-relaxed text-foreground">{movement.progression}</p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="volume" className="mt-0">
                        <div className="rounded-xl bg-secondary/30 p-4">
                          <p className="font-chalk text-lg text-foreground">{movement.volume}</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="watchout" className="mt-0">
                        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                            <p className="leading-relaxed text-foreground">{movement.watch_out}</p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="recovery" className="mt-0">
                        <div className="rounded-xl bg-secondary/30 p-4">
                          <div className="flex items-start gap-3">
                            <RotateCcw className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                            <p className="leading-relaxed text-foreground">{movement.movement_recovery}</p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          /* Legacy Instructions */
          <div className="mt-8">
            <h3 className="mb-4 flex items-center gap-2 font-chalk text-xl text-primary">
              <Play className="h-5 w-5" />
              STEP-BY-STEP INSTRUCTIONS
            </h3>
            <ol className="grid gap-3 sm:grid-cols-2">
              {skill.instructions.map((instruction, idx) => (
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
        )}

        {/* Recovery Vector */}
        {skill.recovery_vector && skill.recovery_vector.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 flex items-center gap-2 font-chalk text-xl text-primary">
              <RotateCcw className="h-5 w-5" />
              RECOVERY VECTOR
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {skill.recovery_vector.map((tip, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-primary/20 bg-primary/5 p-4"
                >
                  <span className="text-sm text-muted-foreground">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips (for legacy skills without recovery_vector) */}
        {!skill.recovery_vector && skill.tips && skill.tips.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-4 flex items-center gap-2 font-chalk text-xl text-primary">
              <Lightbulb className="h-5 w-5" />
              PRO TIPS
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              {skill.tips.map((tip, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-primary/20 bg-primary/5 p-4"
                >
                  <span className="text-sm text-muted-foreground">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-10">
          <Button className="w-full bg-primary py-7 font-chalk text-xl text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-steel-glow">
            START PRACTICING
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}