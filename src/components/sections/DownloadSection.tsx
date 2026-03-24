import { motion } from 'framer-motion';
import { Download, Github, Smartphone, Code } from 'lucide-react';

export function DownloadSection() {
  const handleDownload = () => {
    alert('Download feature would be enabled after connecting to a backend. The full source code would be packaged and downloaded as a ZIP file.');
  };

  return (
    <section className="relative px-4 py-8 lg:px-8">
      <div className="editorial-divider-thick mb-6 pt-2">
        <h2 className="text-editorial-sm text-foreground">
          GET THE <span className="text-primary">FULL CODE</span>
        </h2>
      </div>

      <div className="border border-foreground/10 bg-card p-8 text-center lg:p-12">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center border-2 border-primary bg-primary">
          <Code className="h-8 w-8 text-primary-foreground" />
        </div>

        <p className="mx-auto mb-8 max-w-xl text-sm text-muted-foreground">
          Download the complete TLC Calisthenics app source code. Build for web, iOS, and Android using Capacitor.
        </p>

        {/* Download Buttons */}
        <div className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-primary px-8 py-3 font-chalk text-sm text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Download className="h-5 w-5" />
            DOWNLOAD ZIP
          </button>

          <button className="flex items-center gap-2 border-2 border-foreground px-8 py-3 font-chalk text-sm text-foreground transition-colors hover:bg-foreground hover:text-card">
            <Github className="h-5 w-5" />
            VIEW ON GITHUB
          </button>
        </div>

        {/* What's Included */}
        <div className="border border-foreground/10 p-6">
          <h3 className="mb-4 font-chalk text-sm">WHAT'S INCLUDED</h3>
          <div className="grid grid-cols-1 gap-px bg-foreground/5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: '⚛️', label: 'React + TypeScript' },
              { icon: '🎨', label: 'Tailwind CSS + Animations' },
              { icon: '📱', label: 'Capacitor Mobile Config' },
              { icon: '🔐', label: 'Auth Ready' },
              { icon: '💳', label: 'Stripe Integration' },
              { icon: '🔔', label: 'Push Notifications' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3 bg-card p-3">
                <span className="text-base">{item.icon}</span>
                <span className="text-label text-[10px]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Apps Note */}
        <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div className="flex items-center gap-2 border border-foreground/10 px-4 py-2">
            <Smartphone className="h-4 w-4 text-primary" />
            <span className="text-label text-[10px] text-muted-foreground">CAPACITOR READY</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Build for</span>
            <span className="font-chalk text-foreground">iOS</span>
            <span className="text-muted-foreground">·</span>
            <span className="font-chalk text-foreground">Android</span>
            <span className="text-muted-foreground">·</span>
            <span className="font-chalk text-foreground">Web</span>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Built with conviction by TLC — React · Tailwind CSS · Framer Motion
      </p>
    </section>
  );
}
