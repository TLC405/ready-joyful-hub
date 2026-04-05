import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import { Navigation } from '@/components/layout/Navigation';
import { AppShell } from '@/components/layout/AppShell';
import { HeroSection } from '@/components/sections/HeroSection';
import { UnifiedLibrary } from '@/components/sections/UnifiedLibrary';
import { ProgressDashboard } from '@/components/sections/ProgressDashboard';
import { SettingsPanel } from '@/components/sections/SettingsPanel';
import { CoachCareStudio } from '@/components/CoachCare/CoachCareStudio';
import { ExerciseDetailModal } from '@/components/shared/ExerciseDetailModal';
import { CommandSearch } from '@/components/shared/CommandSearch';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { exercises } from '@/lib/exercises';
import type { Exercise } from '@/lib/types';
import { cn } from '@/lib/utils';

type Section = 'home' | 'library' | 'coach' | 'progress' | 'settings';

const sectionOrder: Section[] = ['home', 'library', 'coach', 'progress', 'settings'];

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
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // Swipe gesture refs
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const handleNavigate = useCallback((section: string) => {
    setActiveSection(section as Section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleOpenSearch = useCallback(() => setSearchOpen(true), []);

  useKeyboardShortcuts({
    onNavigate: handleNavigate,
    activeSection,
    onOpenSearch: handleOpenSearch,
  });

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return;
    const idx = sectionOrder.indexOf(activeSection);
    if (dx < 0 && idx < sectionOrder.length - 1) {
      handleNavigate(sectionOrder[idx + 1]);
    } else if (dx > 0 && idx > 0) {
      handleNavigate(sectionOrder[idx - 1]);
    }
  };

  return (
    <AppShell>
      <div className="min-h-screen text-foreground">
        <Navigation activeSection={activeSection} onNavigate={handleNavigate} onOpenSearch={handleOpenSearch} />
        
        <main
          className="lg:pl-20 pt-2"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            {activeSection === 'home' && (
              <motion.div key="home" {...pageTransition}>
                <HeroSection />

                {/* Featured Skills */}
                <section className="px-4 pb-8 lg:px-8">
                  <div className="editorial-divider-thick mb-4 pt-4">
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-editorial-sm text-foreground">​tlcs  favorite skills</h3>
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
                          {(ex.videoUrl || ex.videoSources?.length || ex.instagramUrl) && (
                            <button
                              onClick={(e) => { e.stopPropagation(); navigate(`/video/${ex.id}`); }}
                              className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center border border-card/50 bg-foreground/70 text-card hover:bg-primary transition-colors"
                            >
                              <Play className="h-3.5 w-3.5 ml-0.5" fill="currentColor" />
                            </button>
                          )}
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
                <UnifiedLibrary />
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

          {/* Mobile swipe indicator */}
          <div className="h-24 lg:hidden">
            <div className="flex items-center justify-center gap-1.5 pt-2">
              {sectionOrder.map(s => (
                <div key={s} className={cn("h-1 w-1 rounded-full transition-colors", s === activeSection ? "bg-primary" : "bg-foreground/15")} />
              ))}
            </div>
          </div>
        </main>

        <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </AppShell>
  );
};

export default Index;
