import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for side projects',
    price: 0,
    period: 'forever',
    featured: false,
    features: [
      '1 Wallet per currency',
      '100 transactions/month',
      'Basic API access',
      'Email support',
      '7-day history',
    ],
    cta: 'Start Free',
  },
  {
    name: 'Pro',
    description: 'For growing businesses',
    price: 49,
    period: 'per month',
    featured: true,
    features: [
      'Unlimited wallets',
      '10,000 transactions/month',
      'Full API access',
      'Priority support',
      'Team collaboration (5 seats)',
      '1-year history',
      'Webhooks & events',
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    description: 'For large operations',
    price: null,
    period: 'custom',
    featured: false,
    features: [
      'Unlimited everything',
      'Dedicated infrastructure',
      '24/7 support',
      'Unlimited team members',
      'Unlimited history',
      'Custom integrations',
      'SLA guarantee (99.99%)',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4 tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-slate-600">
            Start free and scale as you grow. No hidden fees.
          </p>
        </motion.div>

        {}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={cn(
                'relative bg-white rounded-2xl p-8 transition-all duration-300',
                plan.featured
                  ? 'shadow-xl ring-2 ring-indigo-600 scale-[1.02]'
                  : 'border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-slate-300'
              )}
            >
              {}
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
              )}

              {}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-500">{plan.description}</p>
              </div>

              {}
              <div className="mb-8">
                {plan.price !== null ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-semibold text-slate-900">
                      ${plan.price}
                    </span>
                    <span className="text-slate-500">/{plan.period}</span>
                  </div>
                ) : (
                  <span className="text-4xl font-semibold text-slate-900">Custom</span>
                )}
              </div>

              {}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {}
              <Button
                asChild
                variant={plan.featured ? 'default' : 'outline'}
                className={cn(
                  'w-full h-11',
                  plan.featured
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                )}
              >
                <Link to={plan.price === null ? '#' : '/register'}>
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center text-sm text-slate-500"
        >
          Have questions?{' '}
          <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Check our FAQ
          </a>
        </motion.p>
      </div>
    </section>
  );
}