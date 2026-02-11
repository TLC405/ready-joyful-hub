import { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen">
      {/* HUD Grid Background */}
      <div className="hud-grid scanline pointer-events-none fixed inset-0 z-0" />

      {/* Noise texture */}
      <svg className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.03]">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* Corner brackets */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Top-left */}
        <div className="absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-primary/20" />
        {/* Top-right */}
        <div className="absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-primary/20" />
        {/* Bottom-left */}
        <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-primary/20" />
        {/* Bottom-right */}
        <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-primary/20" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
