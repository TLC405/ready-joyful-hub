import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen">
      {/* HUD Grid Background */}
      <div className="hud-grid scanline pointer-events-none fixed inset-0 z-0" />

      {/* Radial gradient accent overlays for depth */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 10% 20%, hsla(var(--primary), 0.08) 0%, transparent 70%)',
        }}
      />
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse 50% 50% at 90% 80%, hsla(var(--accent), 0.06) 0%, transparent 70%)',
        }}
      />

      {/* Noise texture */}
      <svg className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.025]">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* Corner brackets with subtle animation */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-primary/15"
        />
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.6, duration: 1 }}
          className="absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-primary/15"
        />
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.7, duration: 1 }}
          className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-primary/15"
        />
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.8, duration: 1 }}
          className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-primary/15"
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
