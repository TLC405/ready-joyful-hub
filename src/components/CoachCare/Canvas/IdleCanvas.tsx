import { motion } from 'framer-motion';
import { Video, FileText, ClipboardList, Dumbbell, BarChart3, Globe } from 'lucide-react';

interface IdleCanvasProps {
  onAction: (action: string) => void;
}

const actions = [
  { id: 'video', icon: Video, label: 'Analyze Video', desc: 'Paste a YouTube or IG link', color: 'text-primary' },
  { id: 'document', icon: FileText, label: 'Build Program', desc: 'Generate a training plan', color: 'text-accent' },
  { id: 'template', icon: ClipboardList, label: 'Create Template', desc: 'Drag-and-drop workout', color: 'text-primary' },
  { id: 'exercise', icon: Dumbbell, label: 'Explore Exercise', desc: 'Full detail + cues', color: 'text-accent' },
  { id: 'analytics', icon: BarChart3, label: 'View Stats', desc: 'Training analytics', color: 'text-primary' },
  { id: 'social', icon: Globe, label: 'Social Media', desc: 'Analyze posts & reels', color: 'text-accent' },
];

export function IdleCanvas({ onAction }: IdleCanvasProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h3 className="font-chalk text-2xl text-embossed">
          🧠 What should we work on?
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Pick an action or type in chat to get started
        </p>
      </motion.div>

      <div className="grid w-full max-w-lg grid-cols-2 gap-3">
        {actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 24 }}
              whileHover={{ y: -3, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onAction(action.id)}
              className="surface-raised flex flex-col items-center gap-2 rounded-xl p-5 text-center transition-all"
            >
              <div className="surface-inset flex h-12 w-12 items-center justify-center rounded-xl">
                <Icon className={`h-6 w-6 ${action.color}`} />
              </div>
              <span className="font-chalk text-sm">{action.label}</span>
              <span className="text-[11px] text-muted-foreground">{action.desc}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
