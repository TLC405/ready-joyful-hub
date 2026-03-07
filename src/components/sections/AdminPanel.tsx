import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, Users, DollarSign, Send, Crown, TrendingUp, Clock, CheckCircle, Megaphone, Flame, Heart, Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type NotificationType = 'announcement' | 'streak' | 'motivation' | 'promotion';
type TargetGroup = 'all' | 'free' | 'premium' | 'inactive';

const notificationTypes: { id: NotificationType; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'announcement', label: 'ANNOUNCEMENT', icon: Megaphone, color: 'bg-primary/20 text-primary border-primary/30' },
  { id: 'streak', label: 'STREAK', icon: Flame, color: 'bg-accent/20 text-accent border-accent/30' },
  { id: 'motivation', label: 'MOTIVATION', icon: Heart, color: 'bg-destructive/20 text-destructive border-destructive/30' },
  { id: 'promotion', label: 'PROMOTION', icon: Gift, color: 'bg-success/20 text-success border-success/30' },
];

const targetGroups: { id: TargetGroup; label: string; count: number }[] = [
  { id: 'all', label: 'All Users', count: 12847 },
  { id: 'free', label: 'Free Users', count: 9234 },
  { id: 'premium', label: 'Premium Users', count: 3613 },
  { id: 'inactive', label: 'Inactive (7+ days)', count: 2156 },
];

const recentNotifications = [
  { id: 1, title: '🔥 Keep your streak alive!', type: 'streak' as const, sent: '2 hours ago', recipients: 'Inactive Users', delivered: 1892 },
  { id: 2, title: '🎉 New Year, New Skills!', type: 'promotion' as const, sent: '1 day ago', recipients: 'All Users', delivered: 12340 },
  { id: 3, title: '💪 You crushed it this week!', type: 'motivation' as const, sent: '3 days ago', recipients: 'Premium Users', delivered: 3521 },
  { id: 4, title: '📢 New skill added: Dragon Flag', type: 'announcement' as const, sent: '1 week ago', recipients: 'All Users', delivered: 11987 },
];

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
      <div className="mb-4 flex items-center gap-3">
        <div className="badge-coin inline-flex items-center gap-1.5 rounded-full px-3 py-1">
          <Crown className="h-3 w-3 text-primary" />
          <span className="text-label text-[10px] text-primary">ADMIN</span>
        </div>
        <h2 className="font-chalk text-2xl text-embossed sm:text-3xl">
          <span className="text-primary">COMMAND</span> CENTER
        </h2>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {[
          { icon: Users, label: 'TOTAL USERS', value: '12,847', sub: '+234 this week', subColor: 'text-success', bgColor: 'bg-primary/20' },
          { icon: Crown, label: 'ACTIVE SUBS', value: '3,613', sub: '+89 this week', subColor: 'text-success', bgColor: 'bg-primary/20' },
          { icon: DollarSign, label: 'DAILY VOLUME', value: '$2,847', sub: '+12% from yesterday', subColor: 'text-success', bgColor: 'bg-success/20' },
          { icon: Bell, label: 'NOTIFICATIONS', value: '156', sub: 'Sent this month', subColor: 'text-muted-foreground', bgColor: 'bg-accent/20' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="surface-raised rounded-xl p-6">
              <div className="mb-2 flex items-center gap-2">
                <div className={cn("surface-inset flex h-10 w-10 items-center justify-center rounded-lg", stat.bgColor)}>
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-label text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <span className="font-chalk text-4xl">{stat.value}</span>
              <div className={cn("mt-1 flex items-center gap-1", stat.subColor)}>
                {stat.subColor === 'text-success' && <TrendingUp className="h-4 w-4" />}
                <span className="text-sm">{stat.sub}</span>
              </div>
            </div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Notification Sender */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="surface-raised rounded-xl p-6"
        >
          <h3 className="mb-6 flex items-center gap-2 font-chalk text-2xl text-embossed">
            <Send className="h-6 w-6 text-primary" />
            PUSH NOTIFICATION SENDER
          </h3>

          <div className="mb-6">
            <label className="mb-3 block text-label text-sm text-muted-foreground">TARGET GROUP</label>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value as TargetGroup)}
              className="surface-inset w-full rounded-lg px-4 py-3 font-chalk text-foreground focus:outline-none"
            >
              {targetGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.label} ({group.count.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="mb-3 block text-label text-sm text-muted-foreground">NOTIFICATION TYPE</label>
            <div className="flex flex-wrap gap-2">
              {notificationTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-4 py-2 text-label text-sm transition-all",
                      selectedType === type.id
                        ? "surface-inset text-primary"
                        : "btn-raised text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-label text-sm text-muted-foreground">TITLE</label>
            <Input
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              placeholder="🔥 Your streak is on fire!"
              className="surface-inset border-0 font-chalk focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-label text-sm text-muted-foreground">MESSAGE</label>
            <Textarea
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              placeholder="Don't let your 7-day streak end!"
              rows={4}
              className="surface-inset border-0 font-chalk focus:ring-1 focus:ring-primary"
            />
          </div>

          <Button
            onClick={handleSendNotification}
            disabled={!notificationTitle || !notificationMessage}
            className="btn-raised w-full bg-primary py-6 font-chalk text-xl text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Send className="mr-2 h-5 w-5" />
            DEPLOY NOTIFICATION
          </Button>
        </motion.div>

        {/* Notification History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="surface-raised rounded-xl p-6"
        >
          <h3 className="mb-6 flex items-center gap-2 font-chalk text-2xl text-embossed">
            <Clock className="h-6 w-6 text-primary" />
            NOTIFICATION HISTORY
          </h3>

          <div className="space-y-4">
            {recentNotifications.map((notification, idx) => {
              const typeConfig = notificationTypes.find(t => t.id === notification.type);
              const Icon = typeConfig?.icon || Bell;

              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="surface-inset rounded-lg p-4"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        typeConfig?.color.split(' ')[0]
                      )}>
                        <Icon className={cn("h-4 w-4", typeConfig?.color.split(' ')[1])} />
                      </div>
                      <span className="font-chalk">{notification.title}</span>
                    </div>
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{notification.recipients}</span>
                    <span>{notification.delivered.toLocaleString()} delivered</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {notification.sent}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
