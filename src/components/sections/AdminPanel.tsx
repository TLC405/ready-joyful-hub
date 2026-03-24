import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, Users, DollarSign, Send, Crown, TrendingUp, Clock, CheckCircle, Megaphone, Flame, Heart, Gift
} from 'lucide-react';
import { cn } from '@/lib/utils';

type NotificationType = 'announcement' | 'streak' | 'motivation' | 'promotion';
type TargetGroup = 'all' | 'free' | 'premium' | 'inactive';

const notificationTypes: { id: NotificationType; label: string; icon: React.ElementType }[] = [
  { id: 'announcement', label: 'ANNOUNCEMENT', icon: Megaphone },
  { id: 'streak', label: 'STREAK', icon: Flame },
  { id: 'motivation', label: 'MOTIVATION', icon: Heart },
  { id: 'promotion', label: 'PROMOTION', icon: Gift },
];

const targetGroups: { id: TargetGroup; label: string; count: number }[] = [
  { id: 'all', label: 'All Users', count: 12847 },
  { id: 'free', label: 'Free Users', count: 9234 },
  { id: 'premium', label: 'Premium Users', count: 3613 },
  { id: 'inactive', label: 'Inactive (7+ days)', count: 2156 },
];

const recentNotifications = [
  { id: 1, title: 'Keep your streak alive!', type: 'streak' as const, sent: '2 hours ago', recipients: 'Inactive Users', delivered: 1892 },
  { id: 2, title: 'New Year, New Skills!', type: 'promotion' as const, sent: '1 day ago', recipients: 'All Users', delivered: 12340 },
  { id: 3, title: 'You crushed it this week!', type: 'motivation' as const, sent: '3 days ago', recipients: 'Premium Users', delivered: 3521 },
  { id: 4, title: 'New skill added: Dragon Flag', type: 'announcement' as const, sent: '1 week ago', recipients: 'All Users', delivered: 11987 },
];

const cardDelay = (i: number) => ({ delay: i * 0.06, type: 'spring' as const, stiffness: 300, damping: 24 });

export function AdminPanel() {
  const [selectedType, setSelectedType] = useState<NotificationType>('announcement');
  const [selectedTarget, setSelectedTarget] = useState<TargetGroup>('all');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleSendNotification = () => {
    alert(`Notification sent to ${targetGroups.find(g => g.id === selectedTarget)?.count} users!`);
    setNotificationTitle('');
    setNotificationMessage('');
  };

  return (
    <section className="relative px-4 py-8 lg:px-8">
      <div className="editorial-divider-thick mb-6 pt-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 border border-primary/30 px-3 py-1">
            <Crown className="h-3 w-3 text-primary" />
            <span className="text-label text-[10px] text-primary">ADMIN</span>
          </div>
          <h2 className="text-editorial-sm text-foreground">
            <span className="text-primary">COMMAND</span> CENTER
          </h2>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-6 grid grid-cols-1 gap-px bg-foreground/10 border border-foreground/10 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Users, label: 'TOTAL USERS', value: '12,847', sub: '+234 this week', isGood: true },
          { icon: Crown, label: 'ACTIVE SUBS', value: '3,613', sub: '+89 this week', isGood: true },
          { icon: DollarSign, label: 'DAILY VOLUME', value: '$2,847', sub: '+12% from yesterday', isGood: true },
          { icon: Bell, label: 'NOTIFICATIONS', value: '156', sub: 'Sent this month', isGood: false },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={cardDelay(0)} className="bg-card p-5">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center border border-foreground/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-label text-[10px] text-muted-foreground">{stat.label}</span>
              </div>
              <span className="font-chalk text-3xl">{stat.value}</span>
              <div className={cn("mt-1 flex items-center gap-1 text-xs", stat.isGood ? "text-success" : "text-muted-foreground")}>
                {stat.isGood && <TrendingUp className="h-3 w-3" />}
                <span>{stat.sub}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-px bg-foreground/10 border border-foreground/10 lg:grid-cols-2">
        {/* Notification Sender */}
        <div className="bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 font-chalk text-sm">
            <Send className="h-4 w-4 text-primary" /> PUSH NOTIFICATION SENDER
          </h3>

          <div className="mb-4">
            <label className="mb-1 block text-label text-xs text-muted-foreground">TARGET GROUP</label>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value as TargetGroup)}
              className="w-full border border-foreground/10 bg-surface-0 px-3 py-2 font-chalk text-sm text-foreground focus:outline-none"
            >
              {targetGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.label} ({group.count.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-label text-xs text-muted-foreground">NOTIFICATION TYPE</label>
            <div className="flex flex-wrap gap-1">
              {notificationTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "flex items-center gap-2 border px-3 py-2 text-label text-[10px] transition-colors",
                      selectedType === type.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-foreground/10 text-muted-foreground hover:bg-foreground hover:text-card"
                    )}
                  >
                    <Icon className="h-3 w-3" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-label text-xs text-muted-foreground">TITLE</label>
            <input
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              placeholder="Your streak is on fire!"
              className="w-full border border-foreground/10 bg-surface-0 px-3 py-2 font-chalk text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-label text-xs text-muted-foreground">MESSAGE</label>
            <textarea
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              placeholder="Don't let your 7-day streak end!"
              rows={3}
              className="w-full resize-none border border-foreground/10 bg-surface-0 px-3 py-2 font-chalk text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <button
            onClick={handleSendNotification}
            disabled={!notificationTitle || !notificationMessage}
            className="flex w-full items-center justify-center gap-2 bg-primary py-3 font-chalk text-sm text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
            DEPLOY NOTIFICATION
          </button>
        </div>

        {/* Notification History */}
        <div className="bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 font-chalk text-sm">
            <Clock className="h-4 w-4 text-primary" /> NOTIFICATION HISTORY
          </h3>

          <div className="space-y-0">
            {recentNotifications.map((notification, idx) => {
              const typeConfig = notificationTypes.find(t => t.id === notification.type);
              const Icon = typeConfig?.icon || Bell;

              return (
                <div
                  key={notification.id}
                  className="notebook-entry"
                >
                  <div className="mb-1 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center border border-foreground/10">
                        <Icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="font-chalk text-sm">{notification.title}</span>
                    </div>
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <div className="ml-9 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{notification.recipients}</span>
                    <span>{notification.delivered.toLocaleString()} delivered</span>
                  </div>
                  <div className="ml-9 mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {notification.sent}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
