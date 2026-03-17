import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/layout/Navigation';
import { AppShell } from '@/components/layout/AppShell';
import { HeroSection } from '@/components/sections/HeroSection';
import { ExerciseLibrary } from '@/components/sections/ExerciseLibrary';
import { TrackLadder } from '@/components/sections/TrackLadder';
import { ProgressionMap } from '@/components/sections/ProgressionMap';
import { ProgressDashboard } from '@/components/sections/ProgressDashboard';
import { SettingsPanel } from '@/components/sections/SettingsPanel';
import { CoachCareStudio } from '@/components/CoachCare/CoachCareStudio';
import { ExerciseDetailModal } from '@/components/shared/ExerciseDetailModal';
import { exercises } from '@/lib/exercises';
import type { Exercise } from '@/lib/types';
import { cn } from '@/lib/utils';

type Section = 'home' | 'library' | 'tracks' | 'coach' | 'progress' | 'settings';
type TrackView = 'ladder' | 'map';

const difficultyBadge: Record<string, string> = {
  easy: 'difficulty-easy',
  beginner: 'difficulty-beginner',
  intermediate: 'difficulty-intermediate',
  advanced: 'difficulty-advanced',
  master: 'difficulty-master',
};

const featured = exercises.filter(e => e.image).slice(0, 8);

const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.3, ease: 'easeOut' as const }
};

const Index = () => {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [trackView, setTrackView] = useState<TrackView>('ladder');

  const handleNavigate = (section: string) => {
    setActiveSection(section as Section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppShell>
      <div className="min-h-screen text-foreground">
        <Navigation activeSection={activeSection} onNavigate={handleNavigate} />
        
        <main className="lg:pl-20">
          <AnimatePresence mode="wait">
            {activeSection === 'home' && (
              <motion.div key="home" {...pageTransition}>
                <HeroSection />

                {/* Featured Skills — editorial grid */}
                <section className="px-4 pb-8 lg:px-8">
                  <div className="editorial-divider-thick mb-4 pt-4">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-editorial-sm text-foreground">FEATURED SKILLS</h3>
                      <button onClick={() => handleNavigate('library')} className="text-label text-xs text-primary hover:underline">
                        VIEW ALL →
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-foreground/10 border border-foreground/10 sm:grid-cols-3 md:grid-cols-4">
                    {featured.map((ex) => (
                      <div
                        key={ex.id}
                        onClick={() => setSelectedExercise(ex)}
                        className="group cursor-pointer bg-card transition-colors hover:bg-surface-0"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img src={ex.image} alt={ex.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute left-0 top-0">
                            <span className={cn("border px-2 py-0.5 text-label text-[9px] bg-card/90", difficultyBadge[ex.difficulty])}>
                              {ex.difficulty.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="border-t border-foreground/5 p-3">
                          <h4 className="font-chalk text-sm truncate">{ex.name}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {activeSection === 'library' && (
              <motion.div key="library" {...pageTransition}>
                <ExerciseLibrary />
              </motion.div>
            )}

            {activeSection === 'tracks' && (
              <motion.div key="tracks" {...pageTransition}>
                <div className="flex gap-px border-b border-foreground/10 px-4 lg:px-8 pt-4">
                  {(['ladder', 'map'] as const).map(v => (
                    <button key={v} onClick={() => setTrackView(v)}
                      className={cn("px-4 py-2 font-chalk text-xs transition-colors", trackView === v ? "bg-foreground text-card" : "text-muted-foreground hover:text-foreground")}>
                      {v.toUpperCase()}
                    </button>
                  ))}
                </div>
                {trackView === 'ladder' ? <TrackLadder /> : <ProgressionMap />}
              </motion.div>
            )}

            {activeSection === 'coach' && (
              <motion.div key="coach" {...pageTransition}>
                <CoachCareStudio />
              </motion.div>
            )}

            {activeSection === 'progress' && (
              <motion.div key="progress" {...pageTransition}>
                <ProgressDashboard />
              </motion.div>
            )}

            {activeSection === 'settings' && (
              <motion.div key="settings" {...pageTransition}>
                <SettingsPanel />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {selectedExercise && (
              <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
            )}
          </AnimatePresence>

          <div className="h-24 lg:hidden" />
        </main>
      </div>
    </AppShell>
  );
};

export default Index;
