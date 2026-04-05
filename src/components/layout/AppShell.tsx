import { ReactNode } from 'react';
import tlcWatermark from '@/assets/tlc-thunder-watermark.png';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background skeuo-grain notebook-ruled">
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
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}