import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { UserPlus, Wallet, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Account',
    description: 'Sign up in 30 seconds with just your email. No credit card required to start.',
  },
  {
    number: '02',
    icon: Wallet,
    title: 'Set Up Wallets',
    description: 'Create wallets in any supported currency. Configure permissions and limits.',
  },
  {
    number: '03',
    icon: Zap,
    title: 'Start Transacting',
    description: 'Deposit, transfer, and withdraw funds. Every operation is logged and verified.',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32">
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
            Get started in minutes
          </h2>
          <p className="text-lg text-slate-600">
            Three simple steps to financial infrastructure that scales with your business.
          </p>
        </motion.div>

        {}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center lg:text-left"
            >
              {}
              <span className="text-6xl font-bold text-slate-100 mb-4 block">
                {step.number}
              </span>

              {}
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl flex items-center justify-center mb-4 mx-auto lg:mx-0 ring-1 ring-indigo-200">
                <step.icon className="w-7 h-7 text-indigo-600" />
              </div>

              {}
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-16"
        >
          <Button
            asChild
            size="lg"
            className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700"
          >
            <Link to="/register">
              Start Building Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <p className="mt-4 text-sm text-slate-500">
            No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  );
}