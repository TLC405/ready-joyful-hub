import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/layout/Navigation';
import { AppShell } from '@/components/layout/AppShell';
import { HeroSection } from '@/components/sections/HeroSection';
import { ExerciseLibrary } from '@/components/sections/ExerciseLibrary';
import { TrackLadder } from '@/components/sections/TrackLadder';
import { ProgressDashboard } from '@/components/sections/ProgressDashboard';
import { AdminPanel } from '@/components/sections/AdminPanel';
import { exercises } from '@/lib/exercises';
import { cn } from '@/lib/utils';

type Section = 'home' | 'library' | 'tracks' | 'progress' | 'admin';

const difficultyBadge: Record<string, string> = {
  easy: 'difficulty-easy',
  beginner: 'difficulty-beginner',
  intermediate: 'difficulty-intermediate',
  advanced: 'difficulty-advanced',
  master: 'difficulty-master',
};

// Featured exercises for home preview
const featured = exercises.filter(e => e.image).slice(0, 8);

const Index = () => {
  const [activeSection, setActiveSection] = useState<Section>('home');

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
              <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <HeroSection />
                {/* Featured preview row */}
                <section className="px-4 pb-8 lg:px-8">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-chalk text-lg text-muted-foreground">FEATURED SKILLS</h3>
                    <button onClick={() => handleNavigate('library')} className="text-label text-xs text-primary hover:underline">VIEW ALL →</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
                    {featured.map((ex) => (
                      <div key={ex.id} onClick={() => handleNavigate('library')} className="group cursor-pointer overflow-hidden rounded-lg surface-elevated transition-all hover:border-primary/50">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <img src={ex.image} alt={ex.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                          <div className="absolute left-2 top-2">
                            <span className={cn("rounded-full px-1.5 py-0.5 text-label text-[9px] backdrop-blur-sm", difficultyBadge[ex.difficulty])}>
                              {ex.difficulty.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="p-2">
                          <h4 className="font-chalk text-sm truncate">{ex.name}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {activeSection === 'library' && (
              <motion.div key="library" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <ExerciseLibrary />
              </motion.div>
            )}

            {activeSection === 'tracks' && (
              <motion.div key="tracks" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <TrackLadder />
              </motion.div>
            )}

            {activeSection === 'progress' && (
              <motion.div key="progress" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <ProgressDashboard />
              </motion.div>
            )}

            {activeSection === 'admin' && (
              <motion.div key="admin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                <AdminPanel />
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
