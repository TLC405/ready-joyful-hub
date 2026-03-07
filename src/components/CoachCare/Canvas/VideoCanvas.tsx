import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { VideoCanvasData } from '../types';

interface VideoCanvasProps {
  data: VideoCanvasData;
}

export function VideoCanvas({ data }: VideoCanvasProps) {
  return (
    <div className="flex h-full flex-col p-4">
      {/* Video embed */}
      <div className="surface-inset aspect-video w-full overflow-hidden rounded-xl">
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
          <div className="surface-raised rounded-xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-chalk text-sm text-embossed">FORM ANALYSIS</h4>
              <div className="badge-coin rounded-full px-3 py-1">
                <span className="font-chalk text-sm text-primary">{data.analysis.overallScore}/10</span>
              </div>
            </div>
            <div className="space-y-2">
              {data.analysis.corrections.map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-difficulty-intermediate" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-raised rounded-xl p-4">
            <h4 className="mb-2 font-chalk text-sm text-embossed">TIMESTAMPS</h4>
            <div className="space-y-1.5">
              {data.analysis.timestamps.map((t, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span className="surface-inset rounded px-2 py-0.5 font-mono text-xs text-primary">{t.time}</span>
                  <span className={t.type === 'error' ? 'text-destructive' : t.type === 'cue' ? 'text-primary' : 'text-foreground'}>
                    {t.note}
                  </span>
                  {t.type === 'form' && <CheckCircle className="h-3 w-3 text-success" />}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
