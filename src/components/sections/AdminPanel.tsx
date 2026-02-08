import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Users, 
  DollarSign, 
  Send, 
  Crown,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Megaphone,
  Flame,
  Heart,
  Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type NotificationType = 'announcement' | 'streak' | 'motivation' | 'promotion';
type TargetGroup = 'all' | 'free' | 'premium' | 'inactive';

const notificationTypes: { id: NotificationType; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'announcement', label: 'ANNOUNCEMENT', icon: Megaphone, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'streak', label: 'STREAK', icon: Flame, color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'motivation', label: 'MOTIVATION', icon: Heart, color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { id: 'promotion', label: 'PROMOTION', icon: Gift, color: 'bg-green-500/20 text-green-400 border-green-500/30' },
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
    // In real app, this would call an API
    alert(`Notification sent to ${targetGroups.find(g => g.id === selectedTarget)?.count} users!`);
    setNotificationTitle('');
    setNotificationMessage('');
  };

  return (
    <section className="relative min-h-screen px-4 py-20 lg:px-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
          <Crown className="h-4 w-4 text-primary" />
          <span className="font-chalk text-sm text-primary">ADMIN ACCESS</span>
        </div>
        <h2 className="font-chalk text-5xl sm:text-6xl lg:text-7xl">
          <span className="text-primary">COMMAND</span> CENTER
        </h2>
        <p className="mt-2 max-w-lg text-muted-foreground">
          Send notifications, track metrics, and manage your community
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="rounded-xl border-2 border-border bg-card p-6">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <span className="font-chalk text-sm text-muted-foreground">TOTAL USERS</span>
          </div>
          <span className="font-chalk text-4xl">12,847</span>
          <div className="mt-1 flex items-center gap-1 text-green-500">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">+234 this week</span>
          </div>
        </div>

        <div className="rounded-xl border-2 border-border bg-card p-6">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <Crown className="h-5 w-5 text-primary" />
            </div>
            <span className="font-chalk text-sm text-muted-foreground">ACTIVE SUBS</span>
          </div>
          <span className="font-chalk text-4xl">3,613</span>
          <div className="mt-1 flex items-center gap-1 text-green-500">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">+89 this week</span>
          </div>
        </div>

        <div className="rounded-xl border-2 border-border bg-card p-6">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
              <DollarSign className="h-5 w-5 text-green-400" />
            </div>
            <span className="font-chalk text-sm text-muted-foreground">DAILY VOLUME</span>
          </div>
          <span className="font-chalk text-4xl">$2,847</span>
          <div className="mt-1 flex items-center gap-1 text-green-500">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">+12% from yesterday</span>
          </div>
        </div>

        <div className="rounded-xl border-2 border-border bg-card p-6">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
              <Bell className="h-5 w-5 text-orange-400" />
            </div>
            <span className="font-chalk text-sm text-muted-foreground">NOTIFICATIONS</span>
          </div>
          <span className="font-chalk text-4xl">156</span>
          <div className="mt-1 text-muted-foreground">
            <span className="text-sm">Sent this month</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Notification Sender */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border-2 border-border bg-card p-6"
        >
          <h3 className="mb-6 flex items-center gap-2 font-chalk text-2xl">
            <Send className="h-6 w-6 text-primary" />
            PUSH NOTIFICATION SENDER
          </h3>

          {/* Target Group */}
          <div className="mb-6">
            <label className="mb-3 block font-chalk text-sm text-muted-foreground">TARGET GROUP</label>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value as TargetGroup)}
              className="w-full rounded-lg border-2 border-border bg-secondary px-4 py-3 font-chalk text-foreground focus:border-primary focus:outline-none"
            >
              {targetGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.label} ({group.count.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          {/* Notification Type */}
          <div className="mb-6">
            <label className="mb-3 block font-chalk text-sm text-muted-foreground">NOTIFICATION TYPE</label>
            <div className="flex flex-wrap gap-2">
              {notificationTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border-2 px-4 py-2 font-chalk text-sm transition-all",
                      selectedType === type.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-secondary text-muted-foreground hover:border-primary/50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="mb-2 block font-chalk text-sm text-muted-foreground">TITLE</label>
            <Input
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              placeholder="🔥 Your streak is on fire!"
              className="border-2 border-border bg-secondary font-chalk focus:border-primary"
            />
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="mb-2 block font-chalk text-sm text-muted-foreground">MESSAGE</label>
            <Textarea
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              placeholder="Don't let your 7-day streak end! Complete a workout today and keep the momentum going."
              rows={4}
              className="border-2 border-border bg-secondary font-chalk focus:border-primary"
            />
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSendNotification}
            disabled={!notificationTitle || !notificationMessage}
            className="w-full bg-primary py-6 font-chalk text-xl text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
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
          className="rounded-xl border-2 border-border bg-card p-6"
        >
          <h3 className="mb-6 flex items-center gap-2 font-chalk text-2xl">
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
                  className="rounded-lg border-2 border-border bg-secondary/30 p-4"
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
                    <CheckCircle className="h-5 w-5 text-green-500" />
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
