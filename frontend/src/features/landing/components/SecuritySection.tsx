import { motion } from 'framer-motion';
import { Shield, Database, Clock, Search, Check } from 'lucide-react';

const features = [
  {
    icon: Database,
    title: 'Immutable Ledger',
    description: 'Every transaction creates a permanent, append-only record that cannot be altered.',
  },
  {
    icon: Clock,
    title: 'Real-Time Auditability',
    description: 'Full transaction history with timestamps and cryptographic verification.',
  },
  {
    icon: Search,
    title: 'Complete Traceability',
    description: 'Track every dollar from origin to destination with exportable reports.',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'AES-256 encryption with continuous security monitoring.',
  },
];

const certifications = ['SOC 2 Type II', 'PCI DSS', 'GDPR'];

export function SecuritySection() {
  return (
    <section id="security" className="py-24 lg:py-32 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4 tracking-tight">
              Built for trust, designed for compliance
            </h2>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Financial data requires the highest standards. Our architecture ensures your transactions are secure, auditable, and compliant from day one.
            </p>

            {}
            <div className="space-y-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="flex gap-4 group"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-50 to-white rounded-lg flex items-center justify-center ring-1 ring-indigo-100 group-hover:ring-indigo-200 transition-all duration-300">
                    <feature.icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900 mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {}
            <div className="mt-10 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-500 mb-4">Certified & Compliant</p>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <div
                    key={cert}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-sm text-slate-700 border border-slate-200 shadow-sm hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors duration-200"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    {cert}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="bg-slate-900 rounded-2xl p-6 shadow-xl">
              {}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <span className="ml-3 text-xs text-slate-500 font-mono">ledger.types.ts</span>
              </div>

              <div className="font-mono text-sm leading-relaxed">
                <p className="mt-2">
                  <span className="text-indigo-400">interface</span>{' '}
                  <span className="text-emerald-400">LedgerEntry</span>{' '}
                  <span className="text-slate-400">{'{'}</span>
                </p>
                <p className="pl-4 text-slate-300">
                  <span className="text-slate-500">readonly</span> id: <span className="text-amber-400">UUID</span>;
                </p>
                <p className="pl-4 text-slate-300">
                  <span className="text-slate-500">readonly</span> walletId: <span className="text-amber-400">UUID</span>;
                </p>
                <p className="pl-4 text-slate-300">
                  <span className="text-slate-500">readonly</span> amount: <span className="text-amber-400">Decimal</span>;
                </p>
                <p className="pl-4 text-slate-300">
                  <span className="text-slate-500">readonly</span> currency: <span className="text-amber-400">ISO4217</span>;
                </p>
                <p className="pl-4 text-slate-300">
                  <span className="text-slate-500">readonly</span> timestamp: <span className="text-amber-400">DateTime</span>;
                </p>
                <p className="pl-4 text-slate-300">
                  <span className="text-slate-500">readonly</span> hash: <span className="text-amber-400">SHA256</span>;
                </p>
                <p className="text-slate-400">{'}'}</p>
              </div>

              {}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  Cryptographically verified
                </div>
                <span className="text-xs text-slate-500">SHA-256</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}