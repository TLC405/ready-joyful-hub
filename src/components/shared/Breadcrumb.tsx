import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  section?: string;
  onClick?: () => void;
}

interface AppBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function AppBreadcrumb({ items, className }: AppBreadcrumbProps) {
  return (
    <nav className={cn("mb-3 flex items-center gap-1.5 text-label text-[10px] tracking-widest text-journal-sm", className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3 text-thunder-orange/40" />}
            {isLast ? (
              <span className="thunder-text text-embossed font-bold">{item.label}</span>
            ) : (
              <button
                onClick={item.onClick}
                className="text-muted-foreground hover:text-thunder-blue transition-colors"
              >
                {item.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
