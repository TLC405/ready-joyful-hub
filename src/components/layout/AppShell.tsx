import type { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-background">
      <div className="relative z-10 min-h-dvh">{children}</div>
      <footer className="relative z-10 border-t border-border py-3 text-center">
        <span className="text-[9px] tracking-[0.14em] text-muted-foreground">CREATED WITH TLC · TRAIN WITH PURPOSE</span>
      </footer>
    </div>
  );
}
