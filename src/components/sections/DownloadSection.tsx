import { motion } from 'framer-motion';
import { Download, Github, Smartphone, Code, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DownloadSection() {
  const handleDownload = () => {
    // In a real app, this would trigger a ZIP download
    alert('Download feature would be enabled after connecting to a backend. The full source code would be packaged and downloaded as a ZIP file.');
  };

  return (
    <section className="relative px-4 py-20 lg:px-8">
      {/* Background Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[100px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-4xl"
      >
        {/* Main Card */}
        <div className="rounded-2xl border-2 border-border bg-card p-8 text-center lg:p-12">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary"
          >
            <Code className="h-10 w-10 text-primary-foreground" />
          </motion.div>

          {/* Title */}
          <h2 className="mb-4 font-chalk text-4xl sm:text-5xl">
            GET THE <span className="text-gradient">FULL CODE</span>
          </h2>

          <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
            Download the complete TLC Calisthenics app source code. Build for web, iOS, and Android using Capacitor.
          </p>

          {/* Download Buttons */}
          <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              onClick={handleDownload}
              size="lg"
              className="group relative overflow-hidden bg-primary px-8 py-6 font-chalk text-xl text-primary-foreground hover:bg-primary/90"
            >
              <Download className="mr-2 h-5 w-5" />
              DOWNLOAD ZIP
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-2 border-border px-8 py-6 font-chalk text-xl hover:border-primary hover:text-primary"
            >
              <Github className="mr-2 h-5 w-5" />
              VIEW ON GITHUB
            </Button>
          </div>

          {/* What's Included */}
          <div className="rounded-xl border border-border bg-secondary/30 p-6">
            <h3 className="mb-4 font-chalk text-xl">WHAT'S INCLUDED</h3>
            <div className="grid grid-cols-1 gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: '⚛️', label: 'React + TypeScript' },
                { icon: '🎨', label: 'Tailwind CSS + Animations' },
                { icon: '📱', label: 'Capacitor Mobile Config' },
                { icon: '🔐', label: 'Auth Ready (Supabase)' },
                { icon: '💳', label: 'Stripe Integration' },
                { icon: '🔔', label: 'Push Notifications' },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-chalk text-sm">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile Apps Note */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="flex items-center gap-2 rounded-full border border-border bg-secondary/30 px-4 py-2">
              <Smartphone className="h-4 w-4 text-primary" />
              <span className="font-chalk text-sm text-muted-foreground">CAPACITOR READY</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Build for</span>
              <span className="font-chalk text-foreground">iOS</span>
              <span className="text-muted-foreground">•</span>
              <span className="font-chalk text-foreground">Android</span>
              <span className="text-muted-foreground">•</span>
              <span className="font-chalk text-foreground">Web</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-muted-foreground"
        >
          Built with ❤️ using Lovable • React • Tailwind CSS • Framer Motion
        </motion.p>
      </motion.div>
    </section>
  );
}
