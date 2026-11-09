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
      <div className="relative z-10 hidden border-t border-border/10 py-4 text-center lg:ml-20 lg:block">
        <span className="text-xs text-muted-foreground">© 2026 TLC · Superhuman</span>
      </div>
    </div>
  );
}
