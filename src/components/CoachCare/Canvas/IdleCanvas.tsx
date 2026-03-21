import { motion } from 'framer-motion';
import { Video, FileText, ClipboardList, Dumbbell, BarChart3, Globe } from 'lucide-react';

interface IdleCanvasProps {
  onAction: (action: string) => void;
}

const actions = [
  { id: 'video', icon: Video, label: 'Analyze Video', desc: 'Paste a YouTube or IG link' },
  { id: 'document', icon: FileText, label: 'Build Program', desc: 'Generate a training plan' },
  { id: 'template', icon: ClipboardList, label: 'Create Template', desc: 'Drag-and-drop workout' },
  { id: 'exercise', icon: Dumbbell, label: 'Explore Exercise', desc: 'Full detail + cues' },
  { id: 'analytics', icon: BarChart3, label: 'View Stats', desc: 'Training analytics' },
  { id: 'social', icon: Globe, label: 'Social Media', desc: 'Analyze posts & reels' },
];

export function IdleCanvas({ onAction }: IdleCanvasProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h3 className="text-editorial-sm text-foreground">
          WHAT SHOULD WE WORK ON?
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick an action or type in chat to get started
        </p>
      </motion.div>

      <div className="grid w-full max-w-lg grid-cols-2 gap-px bg-foreground/10 border border-foreground/10">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 24 }}
              whileHover={{ borderColor: 'hsl(0, 65%, 42%)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onAction(action.id)}
              className="flex flex-col items-center gap-2 bg-card p-5 text-center transition-colors hover:bg-surface-0"
            >
              <div className="flex h-12 w-12 items-center justify-center border border-foreground/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-label text-sm">{action.label}</span>
              <span className="text-[11px] text-muted-foreground">{action.desc}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
