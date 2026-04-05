import { motion } from 'framer-motion';
import { Video, FileText, ClipboardList, Dumbbell, BarChart3, Globe, Zap } from 'lucide-react';

interface IdleCanvasProps {
  onAction: (action: string) => void;
}

const actions = [
  { id: 'video', icon: Video, label: 'Analyze Video', desc: 'YouTube or IG form check' },
  { id: 'document', icon: FileText, label: 'Build Program', desc: 'Generate training plan' },
  { id: 'template', icon: ClipboardList, label: 'Create Template', desc: 'Drag-and-drop workout' },
  { id: 'exercise', icon: Dumbbell, label: 'Explore Exercise', desc: 'Full detail + cues' },
  { id: 'analytics', icon: BarChart3, label: 'View Stats', desc: 'Training analytics' },
  { id: 'social', icon: Globe, label: 'Search Social', desc: 'Find videos in-app' },
];

export function IdleCanvas({ onAction }: IdleCanvasProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 notebook-ruled skeuo-grain">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        {/* Animated Thunder bolt */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center thunder-inset"
          style={{
            boxShadow: '0 0 20px hsl(var(--thunder-orange) / 0.2), inset 0 0 10px hsl(var(--thunder-orange) / 0.1)',
          }}
        >
          <Zap className="h-8 w-8 text-thunder-orange" />
        </motion.div>

        <h3 className="text-editorial-sm text-foreground text-embossed">
          WHAT SHOULD WE <span className="thunder-text">WORK ON</span>?
        </h3>
        <p className="mt-2 text-sm text-muted-foreground text-journal">
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
              whileHover={{ y: -2, boxShadow: '0 4px 12px hsl(var(--thunder-orange) / 0.15)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onAction(action.id)}
              className="flex flex-col items-center gap-2 bg-card p-5 text-center transition-colors hover:bg-surface-0 skeuo-thunder-card skeuo-grain"
            >
              <motion.div
                className="flex h-12 w-12 items-center justify-center surface-inset"
                whileHover={{ borderColor: 'hsl(var(--thunder-orange))' }}
              >
                <Icon className="h-6 w-6 text-thunder-orange" />
              </motion.div>
              <span className="text-label text-sm text-journal">{action.label}</span>
              <span className="text-[11px] text-muted-foreground text-journal-sm">{action.desc}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
