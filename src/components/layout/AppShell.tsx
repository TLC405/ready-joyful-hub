import { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
      {/* TLC footer bar */}
      <div className="relative z-10 py-3 text-center border-t border-foreground/5">
        <span className="text-[9px] text-muted-foreground/30 tracking-[0.2em]">CREATED WITH TLC · AI-POWERED TRAINING</span>
      </div>
    </div>
  );
}
