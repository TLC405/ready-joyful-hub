import { useCallback, useState } from 'react';
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
import { TLCAIGuide } from '@/components/shared/TLCAIGuide';
import { TLCAIAssessmentFlow } from '@/components/onboarding/TLCAIAssessmentFlow';
import { Protected } from '@/components/auth/Protected';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { loadAthleteProfile } from '@/lib/athlete-profile';

type Section = 'home' | 'train' | 'skills' | 'library' | 'progress' | 'coach' | 'learn' | 'settings';

const ASSESSMENT_DISMISSED_KEY = 'tlc-assessment-dismissed-v1';

const Index = () => {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [searchOpen, setSearchOpen] = useState(false);
  const [libraryCategory, setLibraryCategory] = useState<string | undefined>();
  const [assessmentOpen, setAssessmentOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !loadAthleteProfile() && localStorage.getItem(ASSESSMENT_DISMISSED_KEY) !== 'true';
  });

  const handleCategoryClick = useCallback((category: string) => {
    setLibraryCategory(category);
    setActiveSection('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigate = useCallback((section: string) => {
    setActiveSection(section as Section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const closeAssessment = useCallback(() => {
    setAssessmentOpen(false);
    localStorage.setItem(ASSESSMENT_DISMISSED_KEY, 'true');
  }, []);

  const openAssessment = useCallback(() => {
    localStorage.removeItem(ASSESSMENT_DISMISSED_KEY);
    setAssessmentOpen(true);
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
          {activeSection === 'home' && <HeroSection onCategoryClick={handleCategoryClick} onNavigate={handleNavigate} onOpenAssessment={openAssessment} />}
          {activeSection === 'train' && <TrainingHub />}
          {activeSection === 'skills' && <BeginnerSkillHub />}
          {activeSection === 'library' && <UnifiedLibrary defaultCategory={libraryCategory} onCategoryReset={() => setLibraryCategory(undefined)} />}
          {activeSection === 'progress' && <Protected><ProgressDashboard /></Protected>}
          {activeSection === 'coach' && <Protected><CoachCareStudio /></Protected>}
          {activeSection === 'learn' && <GuideSection />}
          {activeSection === 'settings' && <Protected><SettingsPanel /></Protected>}
        </main>
        <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
        <TLCAIGuide activeSection={activeSection} onNavigate={handleNavigate} onOpenAssessment={openAssessment} />
        <TLCAIAssessmentFlow open={assessmentOpen} onClose={closeAssessment} onNavigate={handleNavigate} />
      </div>
    </AppShell>
  );
};

export default Index;
