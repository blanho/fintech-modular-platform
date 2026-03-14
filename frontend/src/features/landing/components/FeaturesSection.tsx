import { motion } from 'framer-motion';
import { Wallet, ArrowRightLeft, BookOpen, Eye } from 'lucide-react';

const features = [
  {
    icon: Wallet,
    title: 'Multi-Currency Wallets',
    description: 'Create and manage wallets in USD, EUR, GBP, and more. Real-time balance tracking with instant settlement.',
  },
  {
    icon: ArrowRightLeft,
    title: 'Instant Transactions',
    description: 'Transfer funds between wallets in milliseconds. Every transaction is idempotent and fully traceable.',
  },
  {
    icon: BookOpen,
    title: 'Immutable Ledger',
    description: 'Append-only financial ledger ensures every entry is permanent, timestamped, and cryptographically secure.',
  },
  {
    icon: Eye,
    title: 'Complete Audit Trail',
    description: 'Full transparency for every operation. Export reports, track changes, and prove compliance instantly.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4 tracking-tight">
            Everything you need to manage finances
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Built on principles of security, transparency, and exceptional developer experience.
          </p>
        </motion.div>

        {}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="group h-full bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300">
                {}
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-slate-50 rounded-xl flex items-center justify-center mb-6 ring-1 ring-indigo-100 group-hover:ring-indigo-200 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-indigo-600" />
                </div>

                {}
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}