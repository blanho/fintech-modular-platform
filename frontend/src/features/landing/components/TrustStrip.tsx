import { motion } from 'framer-motion';
import { Shield, Lock, FileCheck, Server } from 'lucide-react';

const badges = [
  { icon: Shield, label: 'SOC 2 Type II', desc: 'Certified' },
  { icon: Lock, label: 'AES-256', desc: 'Encryption' },
  { icon: FileCheck, label: 'PCI DSS', desc: 'Compliant' },
  { icon: Server, label: '99.99%', desc: 'Uptime SLA' },
];

export function TrustStrip() {
  return (
    <section className="py-12 border-y border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                <badge.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{badge.label}</p>
                <p className="text-xs text-slate-500">{badge.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}