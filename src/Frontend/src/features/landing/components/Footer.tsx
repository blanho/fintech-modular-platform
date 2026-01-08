import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

const links = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Security', href: '#security' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Documentation', href: '#', external: true },
    { label: 'API Reference', href: '#', external: true },
    { label: 'Status', href: '#', external: true },
  ],
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#', badge: 'Hiring' },
    { label: 'Blog', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Partners', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  resources: [
    { label: 'Help Center', href: '#' },
    { label: 'Guides', href: '#' },
    { label: 'Webinars', href: '#' },
    { label: 'Case Studies', href: '#' },
    { label: 'Community', href: '#', external: true },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Security', href: '#' },
    { label: 'Compliance', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
};

const socialLinks = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Stay up to date
              </h3>
              <p className="text-slate-400">
                Get the latest updates on new features and security updates.
              </p>
            </div>
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">F</span>
              </div>
              <span className="text-lg font-semibold text-white">FinTech</span>
            </Link>
            <p className="text-slate-400 mb-6 max-w-xs leading-relaxed text-sm">
              Secure financial infrastructure for modern applications. Built for developers,
              trusted by enterprises.
            </p>

            {}
            <div className="space-y-2.5 mb-6">
              <a href="mailto:hello@fintech.com" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                hello@fintech.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                +1 (234) 567-890
              </a>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4" />
                San Francisco, CA
              </div>
            </div>

            {}
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-9 h-9 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {title}
              </h3>
              <ul className="space-y-2.5">
                {items.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                    >
                      {link.label}
                      {'external' in link && link.external && (
                        <ArrowUpRight className="w-3 h-3 opacity-50" />
                      )}
                      {'badge' in link && link.badge && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded">
                          {link.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} FinTech. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              All systems operational
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}