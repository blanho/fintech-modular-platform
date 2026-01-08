import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import CountUp from 'react-countup';

const stats = [
  {
    value: 2.5,
    suffix: 'B+',
    prefix: '$',
    label: 'Transaction Volume',
    description: 'Processed monthly across all platforms',
  },
  {
    value: 150,
    suffix: '+',
    label: 'Countries',
    description: 'Global coverage and compliance',
  },
  {
    value: 99.99,
    suffix: '%',
    decimals: 2,
    label: 'Uptime',
    description: 'Enterprise-grade reliability',
  },
  {
    value: 50,
    suffix: 'ms',
    prefix: '<',
    label: 'Latency',
    description: 'Average API response time',
  },
];

function StatCard({
  stat,
  index,
  inView,
}: {
  stat: (typeof stats)[0];
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      className="text-center p-6 lg:p-8 bg-white rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300"
    >
      {}
      <div className="mb-3">
        <span className="text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
          {stat.prefix}
          {inView && (
            <CountUp
              end={stat.value}
              duration={2}
              decimals={stat.decimals || 0}
              delay={0.2 + index * 0.1}
            />
          )}
          {stat.suffix}
        </span>
      </div>

      {}
      <h3 className="text-base font-medium text-slate-900 mb-1">
        {stat.label}
      </h3>

      {}
      <p className="text-sm text-slate-500">
        {stat.description}
      </p>
    </motion.div>
  );
}

export function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} inView={inView} />
          ))}
        </div>

        {}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-20 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"
        />

        {}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-12 text-center text-sm text-slate-500"
        >
          Trusted by financial institutions, startups, and enterprises worldwide
        </motion.p>
      </div>
    </section>
  );
}