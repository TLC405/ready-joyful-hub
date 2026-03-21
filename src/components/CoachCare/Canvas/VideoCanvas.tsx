import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { VideoCanvasData } from '../types';

interface VideoCanvasProps {
  data: VideoCanvasData;
}

export function VideoCanvas({ data }: VideoCanvasProps) {
  return (
    <div className="flex h-full flex-col p-4">
      {/* Video embed */}
      <div className="aspect-video w-full overflow-hidden border border-foreground/10">
        <iframe
          src={data.embedUrl}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Analysis overlay */}
      {data.analysis && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 space-y-3"
        >
          <div className="border border-foreground/10 bg-card p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-label text-sm text-foreground">FORM ANALYSIS</h4>
              <div className="border border-primary px-3 py-1">
                <span className="text-label text-sm text-primary">{data.analysis.overallScore}/10</span>
              </div>
            </div>
            <div className="space-y-2">
              {data.analysis.corrections.map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-foreground/10 bg-card p-4">
            <h4 className="mb-2 text-label text-sm text-foreground">TIMESTAMPS</h4>
            <div className="space-y-1.5">
              {data.analysis.timestamps.map((t, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="border border-foreground/10 bg-surface-0 px-2 py-0.5 font-mono text-xs text-primary">{t.time}</span>
                  <span className={t.type === 'error' ? 'text-primary' : t.type === 'cue' ? 'text-foreground' : 'text-foreground'}>
                    {t.note}
                  </span>
                  {t.type === 'form' && <CheckCircle className="h-3 w-3 text-muted-foreground" />}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
