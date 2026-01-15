import { motion } from 'framer-motion';
import { 
  Check, 
  Crown, 
  Zap, 
  Star,
  Lock,
  Unlock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  locked: string[];
  popular?: boolean;
  icon: React.ElementType;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'FREE',
    price: '$0',
    period: 'forever',
    description: 'Get started with the basics',
    features: [
      '3 beginner skills',
      'Basic progress tracking',
      'Daily streak counter',
      'Community access',
    ],
    locked: [
      'Full skill library (14 skills)',
      'Advanced progressions',
      'Profile customization',
      'Structured programs',
      'Priority support',
    ],
    icon: Zap,
  },
  {
    id: 'basic',
    name: 'BASIC',
    price: '$4.99',
    period: '/month',
    description: 'Unlock intermediate skills',
    features: [
      '9 skills (beginner + intermediate)',
      'Full progress analytics',
      'Achievement badges',
      'Leaderboard ranking',
      'Profile customization',
      'Email support',
    ],
    locked: [
      'Advanced skills (5 skills)',
      'Structured programs',
      'Priority support',
    ],
    icon: Star,
  },
  {
    id: 'pro',
    name: 'PRO',
    price: '$9.99',
    period: '/month',
    description: 'The complete calisthenics experience',
    features: [
      'All 14 skills unlocked',
      'Multi-week structured programs',
      'Advanced progressions & tips',
      'Full profile features',
      'Body metrics tracking',
      'Goal setting & tracking',
      'Priority support',
      'Early access to new features',
    ],
    locked: [],
    popular: true,
    icon: Crown,
  },
];

export function SubscriptionPlans() {
  return (
    <section className="relative min-h-screen px-4 py-20 lg:px-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <h2 className="font-chalk text-5xl sm:text-6xl lg:text-7xl">
          CHOOSE YOUR <span className="text-gradient">PATH</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Unlock your full potential with premium features. Cancel anytime.
        </p>
      </motion.div>

      {/* Plans Grid */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan, idx) => {
          const Icon = plan.icon;
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "relative flex flex-col rounded-2xl border-2 p-6 transition-all",
                plan.popular 
                  ? "border-primary bg-primary/5 shadow-[0_0_40px_rgba(245,197,24,0.15)]" 
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-4 py-1 font-chalk text-sm text-primary-foreground">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6 text-center">
                <div className={cn(
                  "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl",
                  plan.popular 
                    ? "bg-primary" 
                    : "bg-secondary"
                )}>
                  <Icon className={cn(
                    "h-8 w-8",
                    plan.popular ? "text-primary-foreground" : "text-primary"
                  )} />
                </div>
                <h3 className="font-chalk text-3xl">{plan.name}</h3>
                <div className="mt-2 flex items-baseline justify-center gap-1">
                  <span className="font-chalk text-5xl">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="flex-1">
                <div className="mb-4">
                  <span className="font-chalk text-xs text-muted-foreground">INCLUDED</span>
                </div>
                <ul className="mb-6 space-y-3">
                  {plan.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                {/* Locked Features */}
                {plan.locked.length > 0 && (
                  <>
                    <div className="mb-4">
                      <span className="font-chalk text-xs text-muted-foreground">NOT INCLUDED</span>
                    </div>
                    <ul className="mb-6 space-y-3">
                      {plan.locked.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 opacity-50">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary">
                            <Lock className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {/* CTA Button */}
              <Button
                className={cn(
                  "w-full py-6 font-chalk text-lg",
                  plan.popular 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                )}
              >
                {plan.id === 'free' ? 'CURRENT PLAN' : `GET ${plan.name}`}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Money Back Guarantee */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mx-auto mt-12 max-w-xl text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-green-400">
          <Check className="h-4 w-4" />
          <span className="font-chalk text-sm">30-DAY MONEY BACK GUARANTEE</span>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Not satisfied? Get a full refund within 30 days. No questions asked.
        </p>
      </motion.div>
    </section>
  );
}
