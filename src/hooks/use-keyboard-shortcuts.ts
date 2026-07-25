import { useEffect } from 'react';

const sections = ['home', 'train', 'skills', 'library', 'progress'] as const;
type Section = typeof sections[number];

interface UseKeyboardShortcutsOptions {
  onNavigate: (section: string) => void;
  activeSection: string;
  onOpenSearch: () => void;
}

export function useKeyboardShortcuts({ onNavigate, activeSection, onOpenSearch }: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (event.key >= '1' && event.key <= '5' && !event.metaKey && !event.ctrlKey) {
        const section = sections[Number(event.key) - 1];
        if (section) {
          event.preventDefault();
          onNavigate(section);
        }
        return;
      }

      if ((event.key === 'k' && (event.metaKey || event.ctrlKey)) || (event.key === '/' && !event.metaKey && !event.ctrlKey)) {
        event.preventDefault();
        onOpenSearch();
        return;
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        const currentIndex = sections.indexOf(activeSection as Section);
        if (currentIndex < 0) return;
        const nextIndex = event.key === 'ArrowLeft' ? Math.max(0, currentIndex - 1) : Math.min(sections.length - 1, currentIndex + 1);
        if (nextIndex !== currentIndex) {
          event.preventDefault();
          onNavigate(sections[nextIndex]);
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeSection, onNavigate, onOpenSearch]);
}
