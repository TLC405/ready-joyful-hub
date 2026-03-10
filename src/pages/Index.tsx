import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/layout/Navigation';
import { AppShell } from '@/components/layout/AppShell';
import { HeroSection } from '@/components/sections/HeroSection';
import { ExerciseLibrary } from '@/components/sections/ExerciseLibrary';
import { TrackLadder } from '@/components/sections/TrackLadder';
import { ProgressDashboard } from '@/components/sections/ProgressDashboard';
import { SettingsPanel } from '@/components/sections/SettingsPanel';
import { CoachCareStudio } from '@/components/CoachCare/CoachCareStudio';
import { ExerciseDetailModal } from '@/components/shared/ExerciseDetailModal';
import { exercises } from '@/lib/exercises';
import type { Exercise } from '@/lib/types';
import { cn } from '@/lib/utils';

type Section = 'home' | 'library' | 'tracks' | 'coach' | 'progress' | 'settings';

const difficultyBadge: Record<string, string> = {
  easy: 'difficulty-easy',
  beginner: 'difficulty-beginner',
  intermediate: 'difficulty-intermediate',
  advanced: 'difficulty-advanced',
  master: 'difficulty-master',
};

const featured = exercises.filter(e => e.image).slice(0, 8);

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { type: 'spring' as const, stiffness: 300, damping: 28 }
};

const Index = () => {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

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
                <section className="px-4 pb-8 lg:px-8">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-chalk text-lg text-embossed text-muted-foreground">FEATURED SKILLS</h3>
                    <motion.button 
                      onClick={() => handleNavigate('library')} 
                      className="text-label text-xs text-primary hover:underline"
                      whileHover={{ x: 3 }}
                    >
                      VIEW ALL →
                    </motion.button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                    {featured.map((ex, i) => (
                      <motion.div 
                        key={ex.id} 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.05, type: 'spring', stiffness: 300, damping: 24 }}
                        whileHover={{ y: -4, transition: { duration: 0.15 } }}
                        onClick={() => handleNavigate('library')} 
                        className="group cursor-pointer overflow-hidden rounded-lg surface-raised transition-all"
                      >
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img src={ex.image} alt={ex.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="image-overlay absolute inset-0" />
                          <div className="absolute left-2 top-2">
                            <span className={cn("rounded-full px-1.5 py-0.5 text-label text-[9px] backdrop-blur-sm", difficultyBadge[ex.difficulty])}>
                              {ex.difficulty.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="p-2">
                          <h4 className="font-chalk text-sm truncate">{ex.name}</h4>
                        </div>
                      </motion.div>
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
                <TrackLadder />
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

          <div className="h-24 lg:hidden" />
        </main>
      </div>
    </AppShell>
  );
};

export default Index;
