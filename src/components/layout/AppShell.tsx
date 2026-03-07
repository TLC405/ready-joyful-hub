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

      {/* Subtle vignette for depth */}
      <div 
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, hsla(0, 0%, 0%, 0.3) 100%)',
        }}
      />

      {/* Noise texture */}
      <svg className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.025]">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* Corner brackets */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {[
          'left-4 top-4 border-l-2 border-t-2',
          'right-4 top-4 border-r-2 border-t-2',
          'bottom-4 left-4 border-b-2 border-l-2',
          'bottom-4 right-4 border-b-2 border-r-2'
        ].map((cls, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
            className={`absolute h-8 w-8 border-primary/15 ${cls}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
