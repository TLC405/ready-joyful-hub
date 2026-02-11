import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/layout/Navigation';
import { AppShell } from '@/components/layout/AppShell';
import { HeroSection } from '@/components/sections/HeroSection';
import { ExerciseLibrary } from '@/components/sections/ExerciseLibrary';
import { TrackLadder } from '@/components/sections/TrackLadder';
import { ProgressDashboard } from '@/components/sections/ProgressDashboard';
import { AdminPanel } from '@/components/sections/AdminPanel';

type Section = 'home' | 'library' | 'tracks' | 'progress' | 'admin';

const Index = () => {
  const [activeSection, setActiveSection] = useState<Section>('home');

  const handleNavigate = (section: string) => {
    setActiveSection(section as Section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartTraining = () => {
    setActiveSection('library');
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
                <HeroSection onStartTraining={handleStartTraining} />
                <ExerciseLibrary />
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
