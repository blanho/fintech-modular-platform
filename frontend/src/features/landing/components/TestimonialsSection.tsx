import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';

const testimonials = [
  {
    content:
      'FinTech transformed how we handle payments. The immutable ledger gives our compliance team peace of mind, and the API integration took just hours.',
    author: 'Sarah Chen',
    role: 'CTO',
    company: 'TechFlow Inc.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  },
  {
    content:
      'We process over $10M monthly through FinTech. The reliability is unmatched—99.99% uptime is not marketing speak, it\'s reality.',
    author: 'Marcus Johnson',
    role: 'Head of Engineering',
    company: 'PayScale Pro',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  {
    content:
      'The developer experience is exceptional. Clean APIs, comprehensive docs, and their support team actually understands technical problems.',
    author: 'Emily Rodriguez',
    role: 'Lead Developer',
    company: 'StartupXYZ',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 lg:py-32 bg-slate-50">
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
            Trusted by developers and finance teams
          </h2>
          <p className="text-lg text-slate-600">
            Join thousands of companies building on FinTech.
          </p>
        </motion.div>

        {}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300"
            >
              {}
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-6 ring-1 ring-indigo-100">
                <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {}
              <p className="text-slate-600 leading-relaxed mb-8">
                "{testimonial.content}"
              </p>

              {}
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                  <AvatarFallback className="bg-slate-100 text-slate-600 text-sm font-medium">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-slate-900 text-sm">{testimonial.author}</p>
                  <p className="text-sm text-slate-500">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}