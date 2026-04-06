import { ReactNode } from 'react';
import tlcWatermark from '@/assets/tlc-thunder-watermark.png';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background notebook-ruled">
      {/* Large faded TLC Thunder watermark */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <img 
          src={tlcWatermark} 
          alt="" 
          className="w-[70vmin] max-w-[600px] opacity-[0.04] dark:opacity-[0.03] select-none"
          draggable={false}
        />
      </div>
      {/* Paper grain overlay - below content */}
      <div className="pointer-events-none fixed inset-0 z-[1] opacity-30 mix-blend-multiply" aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
      {/* TLC footer bar */}
      <div className="relative z-10 py-3 text-center border-t border-foreground/5">
        <span className="text-[9px] text-muted-foreground/30 tracking-[0.2em]">CREATED WITH TLC · AI-POWERED TRAINING</span>
      </div>
    </div>
  );
}