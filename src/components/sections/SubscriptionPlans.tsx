import { motion } from 'framer-motion';
import { 
  Check, 
  Crown, 
  Zap, 
  Star,
  Lock,
} from 'lucide-react';
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
    <section className="relative px-4 py-8 lg:px-8">
      {/* Section Header */}
      <div className="editorial-divider-thick mb-6 pt-2">
        <h2 className="text-editorial-sm text-foreground">
          CHOOSE YOUR <span className="text-primary">PATH</span>
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Unlock your full potential with premium features. Cancel anytime.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-px bg-foreground/10 border border-foreground/10 md:grid-cols-3">
        {plans.map((plan, idx) => {
          const Icon = plan.icon;
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "relative flex flex-col bg-card p-6",
                plan.popular && "border-l-2 border-l-primary"
              )}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-px left-0 right-0">
                  <span className="inline-block bg-primary px-4 py-1 text-label text-[10px] text-primary-foreground">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className={cn("mb-6", plan.popular && "mt-4")}>
                <div className={cn(
                  "mb-4 flex h-12 w-12 items-center justify-center border",
                  plan.popular 
                    ? "border-primary bg-primary text-primary-foreground" 
                    : "border-foreground/10 bg-surface-0 text-primary"
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-chalk text-2xl">{plan.name}</h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-chalk text-4xl">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
              </div>

              {/* Features */}
              <div className="flex-1">
                <div className="mb-3">
                  <span className="text-label text-[10px] text-muted-foreground">INCLUDED</span>
                </div>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center bg-primary/10">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Locked Features */}
                {plan.locked.length > 0 && (
                  <>
                    <div className="mb-3">
                      <span className="text-label text-[10px] text-muted-foreground">NOT INCLUDED</span>
                    </div>
                    <ul className="mb-6 space-y-2">
                      {plan.locked.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 opacity-40">
                          <div className="flex h-4 w-4 shrink-0 items-center justify-center bg-surface-0">
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
              <button
                className={cn(
                  "w-full py-3 font-chalk text-sm transition-colors",
                  plan.popular 
                    ? "bg-primary text-primary-foreground hover:opacity-90" 
                    : "border border-foreground/10 text-foreground hover:bg-foreground hover:text-card"
                )}
              >
                {plan.id === 'free' ? 'CURRENT PLAN' : `GET ${plan.name}`}
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Money Back Guarantee */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 border border-success/30 bg-success/5 px-4 py-2">
          <Check className="h-4 w-4 text-success" />
          <span className="text-label text-xs text-success">30-DAY MONEY BACK GUARANTEE</span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Not satisfied? Get a full refund within 30 days. No questions asked.
        </p>
      </div>
    </section>
  );
}
