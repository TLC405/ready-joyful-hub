import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import { AppShell } from '@/components/layout/AppShell';
import { HeroSection } from '@/components/sections/HeroSection';
import { UnifiedLibrary } from '@/components/sections/UnifiedLibrary';
import { ProgressDashboard } from '@/components/sections/ProgressDashboard';
import { SettingsPanel } from '@/components/sections/SettingsPanel';
import { CoachCareStudio } from '@/components/CoachCare/CoachCareStudio';
import { GuideSection } from '@/components/sections/GuideSection';
import { CommandSearch } from '@/components/shared/CommandSearch';
import { Protected } from '@/components/auth/Protected';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { WorkoutCalendar } from '@/components/workout/WorkoutCalendar';
const sections = ['home', 'library', 'coach', 'progress', 'settings', 'guide'] as const;
type Section = typeof sections[number];
const Index = () => {
  const [params, setParams] = useSearchParams();
  const rawSection = params.get('section');
  const activeSection: Section = sections.find(s => s === rawSection) ?? 'home';
  const [searchOpen, setSearchOpen] = useState(false);
  const [libraryCategory, setLibraryCategory] = useState<string>();
  const handleNavigate = useCallback((section: string) => {
    if (!sections.some(s => s === section)) return;
    setParams(section === 'home' ? {} : { section });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [setParams]);
  const handleCategoryClick = useCallback((category: string) => { setLibraryCategory(category); handleNavigate('library'); }, [handleNavigate]);
  const handleOpenSearch = useCallback(() => setSearchOpen(true), []);
  useKeyboardShortcuts({ onNavigate: handleNavigate, activeSection, onOpenSearch: handleOpenSearch });
  return <AppShell><Navigation activeSection={activeSection} onNavigate={handleNavigate} onOpenSearch={handleOpenSearch} /><main id="main-content" className="app-content min-w-0 lg:ml-20">
    {activeSection === 'home' && <HeroSection onCategoryClick={handleCategoryClick} onNavigate={handleNavigate} />}
    {activeSection === 'library' && <UnifiedLibrary defaultCategory={libraryCategory} onCategoryReset={() => setLibraryCategory(undefined)} />}
    {activeSection === 'coach' && <Protected><CoachCareStudio /></Protected>}
    {activeSection === 'progress' && <Protected><div className="mx-auto max-w-6xl px-4 pt-6 lg:px-8"><WorkoutCalendar /></div><ProgressDashboard /></Protected>}
    {activeSection === 'settings' && <Protected><SettingsPanel /></Protected>}
    {activeSection === 'guide' && <GuideSection />}
  </main><CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} /></AppShell>;
};
export default Index;
