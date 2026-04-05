import { 
  Target, Calendar, TrendingUp
} from 'lucide-react';

export function ProgressDashboard() {
  return (
    <section className="relative px-4 py-8 lg:px-8">
      <div className="thunder-divider mb-4" />
      <div className="mb-6 pt-2">
        <h2 className="text-editorial-sm text-foreground text-embossed">YOUR <span className="thunder-text">PROGRESS</span></h2>
      </div>

      <div className="border border-foreground/10 bg-card p-8 text-center skeuo-thunder-card skeuo-grain notebook-ruled">
        <TrendingUp className="mx-auto mb-4 h-10 w-10 text-thunder-orange/30" />
        <h3 className="font-chalk text-lg text-foreground mb-2 text-embossed text-journal-lg">START LOGGING WORKOUTS</h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto text-journal">
          Your training data will appear here once you begin logging sessions. Track streaks, skill progression, and training volume — all powered by your real data.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-px bg-foreground/10 border border-foreground/10 max-w-sm mx-auto">
          {[
            { icon: Calendar, label: 'ACTIVITY', color: 'text-thunder-orange/40' },
            { icon: Target, label: 'GOALS', color: 'text-thunder-blue/40' },
            { icon: TrendingUp, label: 'TRENDS', color: 'text-thunder-orange/40' },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="bg-card p-4 text-center thunder-inset">
              <Icon className={`mx-auto mb-2 h-5 w-5 ${color}`} />
              <span className="text-label text-[10px] text-muted-foreground text-journal-sm">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
