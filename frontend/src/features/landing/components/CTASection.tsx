import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function CTASection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-12 lg:p-16 border border-slate-200/60 shadow-lg"
        >
          <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4 tracking-tight">
            Ready to build financial infrastructure that scales?
          </h2>

          <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed">
            Join thousands of developers building secure, compliant financial applications.
          </p>

          {}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-12 text-base font-medium shadow-md hover:shadow-lg transition-shadow"
            >
              <Link to="/register">
                Start Building Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 px-8 h-12 text-base font-medium"
            >
              Schedule a Demo
            </Button>
          </div>

          {}
          <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              Free tier available
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              SOC 2 certified
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}