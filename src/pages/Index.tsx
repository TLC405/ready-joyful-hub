import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/layout/Navigation';
import { HeroSection } from '@/components/sections/HeroSection';
import { SkillsLibrary } from '@/components/sections/SkillsLibrary';
import { ProgressDashboard } from '@/components/sections/ProgressDashboard';
import { Leaderboard } from '@/components/sections/Leaderboard';
import { AdminPanel } from '@/components/sections/AdminPanel';
import { SubscriptionPlans } from '@/components/sections/SubscriptionPlans';
import { DownloadSection } from '@/components/sections/DownloadSection';

type Section = 'home' | 'skills' | 'progress' | 'leaderboard' | 'profile' | 'admin';

const Index = () => {
  const [activeSection, setActiveSection] = useState<Section>('home');

  const handleNavigate = (section: string) => {
    setActiveSection(section as Section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartTraining = () => {
    setActiveSection('skills');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation activeSection={activeSection} onNavigate={handleNavigate} />
      
      <main className="lg:pl-20">
        <AnimatePresence mode="wait">
          {activeSection === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HeroSection onStartTraining={handleStartTraining} />
              <SkillsLibrary />
              <ProgressDashboard />
              <SubscriptionPlans />
              <DownloadSection />
            </motion.div>
          )}

          {activeSection === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SkillsLibrary />
            </motion.div>
          )}

          {activeSection === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProgressDashboard />
            </motion.div>
          )}

          {activeSection === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Leaderboard />
            </motion.div>
          )}

          {activeSection === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SubscriptionPlans />
            </motion.div>
          )}

          {activeSection === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <AdminPanel />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Padding for Mobile Nav */}
        <div className="h-24 lg:hidden" />
      </main>
    </div>
  );
};

export default Index;
