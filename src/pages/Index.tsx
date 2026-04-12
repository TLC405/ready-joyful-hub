import { useState, useRef, useCallback } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { AppShell } from '@/components/layout/AppShell';
import { HeroSection } from '@/components/sections/HeroSection';
import { UnifiedLibrary } from '@/components/sections/UnifiedLibrary';
import { ProgressDashboard } from '@/components/sections/ProgressDashboard';
import { SettingsPanel } from '@/components/sections/SettingsPanel';
import { CoachCareStudio } from '@/components/CoachCare/CoachCareStudio';
import { GuideSection } from '@/components/sections/GuideSection';
import { ExerciseDetailModal } from '@/components/shared/ExerciseDetailModal';
import { CommandSearch } from '@/components/shared/CommandSearch';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import type { Exercise } from '@/lib/types';
import { cn } from '@/lib/utils';

type Section = 'home' | 'library' | 'coach' | 'progress' | 'settings' | 'guide';

const sectionOrder: Section[] = ['home', 'library', 'coach', 'progress', 'guide', 'settings'];

const Index = () => {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [libraryCategory, setLibraryCategory] = useState<string | undefined>();

  const handleCategoryClick = useCallback((category: string) => {
    setLibraryCategory(category);
    setActiveSection('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
          className="lg:ml-20 pt-0"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {activeSection === 'home' && (
            <HeroSection onCategoryClick={handleCategoryClick} onNavigate={handleNavigate} />
          )}

          {activeSection === 'library' && (
            <UnifiedLibrary defaultCategory={libraryCategory} onCategoryReset={() => setLibraryCategory(undefined)} />
          )}

          {activeSection === 'coach' && <CoachCareStudio />}

          {activeSection === 'progress' && <ProgressDashboard />}

          {activeSection === 'settings' && <SettingsPanel />}

          {activeSection === 'guide' && <GuideSection />}

          {selectedExercise && (
            <ExerciseDetailModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
          )}

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