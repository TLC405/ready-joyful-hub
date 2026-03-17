import { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      {children}
    </div>
  );
}
