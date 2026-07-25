import { useState, useCallback } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { AppShell } from '@/components/layout/AppShell';
import { HeroSection } from '@/components/sections/HeroSection';
import { TrainingHub } from '@/components/sections/TrainingHub';
import { BeginnerSkillHub } from '@/components/sections/BeginnerSkillHub';
import { UnifiedLibrary } from '@/components/sections/UnifiedLibrary';
import { ProgressDashboard } from '@/components/sections/ProgressDashboard';
import { SettingsPanel } from '@/components/sections/SettingsPanel';
import { CoachCareStudio } from '@/components/CoachCare/CoachCareStudio';
import { GuideSection } from '@/components/sections/GuideSection';
import { CommandSearch } from '@/components/shared/CommandSearch';
import { Protected } from '@/components/auth/Protected';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

type Section = 'home' | 'train' | 'skills' | 'library' | 'progress' | 'coach' | 'learn' | 'settings';

const Index = () => {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [libraryCategory, setLibraryCategory] = useState<string | undefined>();

  const handleCategoryClick = useCallback((category: string) => {
    setLibraryCategory(category);
    setActiveSection('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigate = useCallback((section: string) => {
    setActiveSection(section as Section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useKeyboardShortcuts({
    onNavigate: handleNavigate,
    activeSection,
    onOpenSearch: () => setSearchOpen(true),
  });

  return (
    <AppShell>
      <div className="min-h-dvh text-foreground">
        <Navigation activeSection={activeSection} onNavigate={handleNavigate} onOpenSearch={() => setSearchOpen(true)} />
        <main className="pb-24 lg:ml-20 lg:pb-0">
          {activeSection === 'home' && <HeroSection onCategoryClick={handleCategoryClick} onNavigate={handleNavigate} />}
          {activeSection === 'train' && <TrainingHub />}
          {activeSection === 'skills' && <BeginnerSkillHub />}
          {activeSection === 'library' && <UnifiedLibrary defaultCategory={libraryCategory} onCategoryReset={() => setLibraryCategory(undefined)} />}
          {activeSection === 'progress' && <Protected><ProgressDashboard /></Protected>}
          {activeSection === 'coach' && <Protected><CoachCareStudio /></Protected>}
          {activeSection === 'learn' && <GuideSection />}
          {activeSection === 'settings' && <Protected><SettingsPanel /></Protected>}
        </main>
        <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      </div>
    </AppShell>
  );
};

export default Index;
