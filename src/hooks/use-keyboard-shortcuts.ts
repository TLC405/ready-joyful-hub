import { useEffect } from 'react';

type Section = 'home' | 'library' | 'coach' | 'progress' | 'settings';

const sections: Section[] = ['home', 'library', 'coach', 'progress', 'settings'];

interface UseKeyboardShortcutsOptions {
  onNavigate: (section: string) => void;
  activeSection: string;
  onOpenSearch: () => void;
}

export function useKeyboardShortcuts({ onNavigate, activeSection, onOpenSearch }: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't intercept when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      // Number keys 1-5 jump to sections
      if (e.key >= '1' && e.key <= '5' && !e.metaKey && !e.ctrlKey) {
        const idx = parseInt(e.key) - 1;
        if (sections[idx]) {
          e.preventDefault();
          onNavigate(sections[idx]);
        }
        return;
      }

      // Cmd+K or Ctrl+K or / opens search
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !e.metaKey && !e.ctrlKey)) {
        e.preventDefault();
        onOpenSearch();
        return;
      }

      // Arrow left/right navigate sections
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const currentIdx = sections.indexOf(activeSection as Section);
        if (currentIdx === -1) return;
        const nextIdx = e.key === 'ArrowLeft' 
          ? Math.max(0, currentIdx - 1) 
          : Math.min(sections.length - 1, currentIdx + 1);
        if (nextIdx !== currentIdx) {
          e.preventDefault();
          onNavigate(sections[nextIdx]);
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onNavigate, activeSection, onOpenSearch]);
}
