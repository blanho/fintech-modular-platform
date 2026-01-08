import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronRight, ChevronDown, Wallet, ArrowRightLeft,
  BookOpen, Shield, Zap, Globe, CreditCard, Building2, Code2,
  FileText, HelpCircle, Users, Newspaper, Phone
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';

const productLinks = [
  {
    icon: Wallet,
    label: 'Multi-Currency Wallets',
    description: 'Create wallets in 8+ currencies',
    href: '#features',
  },
  {
    icon: ArrowRightLeft,
    label: 'Instant Transfers',
    description: 'Move money in milliseconds',
    href: '#features',
  },
  {
    icon: BookOpen,
    label: 'Immutable Ledger',
    description: 'Append-only transaction history',
    href: '#features',
  },
  {
    icon: Shield,
    label: 'Security & Compliance',
    description: 'SOC 2, PCI DSS certified',
    href: '#security',
  },
];

const solutionLinks = [
  { icon: Building2, label: 'Enterprise', description: 'For large organizations', href: '#' },
  { icon: Code2, label: 'Developers', description: 'API-first platform', href: '#' },
  { icon: CreditCard, label: 'Payments', description: 'Accept & send payments', href: '#' },
  { icon: Globe, label: 'Global', description: 'Multi-region support', href: '#' },
];

const resourceLinks = [
  { icon: FileText, label: 'Documentation', href: '#' },
  { icon: Code2, label: 'API Reference', href: '#' },
  { icon: HelpCircle, label: 'Help Center', href: '#' },
  { icon: Newspaper, label: 'Blog', href: '#' },
  { icon: Users, label: 'Community', href: '#' },
  { icon: Phone, label: 'Contact Sales', href: '#' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeDropdown]);

  return (
    <>
      {}
      <div className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-x-3 py-2.5 text-sm">
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">New:</span>
              <span>Instant global transfers now available in 150+ countries</span>
            </span>
            <a href="#" className="inline-flex items-center gap-1 font-medium hover:underline">
              Learn more
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-200/50'
            : 'bg-white'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">F</span>
              </div>
              <span className="text-lg font-semibold text-slate-900">FinTech</span>
            </Link>

            {}
            <nav className="hidden lg:flex items-center gap-1">
              {}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === 'products' ? null : 'products');
                  }}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    activeDropdown === 'products'
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  Products
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    activeDropdown === 'products' && "rotate-180"
                  )} />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'products' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-[380px] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-2">
                        {productLinks.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <link.icon className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                              <span className="font-medium text-slate-900 block">
                                {link.label}
                              </span>
                              <p className="text-sm text-slate-500 mt-0.5">{link.description}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                      <div className="bg-slate-50 p-3 border-t border-slate-100">
                        <a href="#features" className="flex items-center justify-between text-sm font-medium text-indigo-600 hover:text-indigo-700">
                          View all features
                          <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === 'solutions' ? null : 'solutions');
                  }}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    activeDropdown === 'solutions'
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  Solutions
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    activeDropdown === 'solutions' && "rotate-180"
                  )} />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'solutions' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-[300px] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-2">
                        {solutionLinks.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                              <link.icon className="w-4 h-4 text-slate-600" />
                            </div>
                            <div>
                              <span className="font-medium text-slate-900 block">
                                {link.label}
                              </span>
                              <span className="text-xs text-slate-500">{link.description}</span>
                            </div>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {}
              <a
                href="#pricing"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Pricing
              </a>

              {}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === 'resources' ? null : 'resources');
                  }}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    activeDropdown === 'resources'
                      ? "text-indigo-600 bg-indigo-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  Resources
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    activeDropdown === 'resources' && "rotate-180"
                  )} />
                </button>

                <AnimatePresence>
                  {activeDropdown === 'resources' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-[400px] bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="grid grid-cols-2 gap-1 p-2">
                        {resourceLinks.map((link) => (
                          <a
                            key={link.label}
                            href={link.href}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <link.icon className="w-4 h-4 text-slate-400" />
                            <span className="font-medium text-slate-700">
                              {link.label}
                            </span>
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>

            {}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2"
              >
                Sign In
              </Link>
              <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Link to="/register">
                  Get Started
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>

            {}
            <button
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden overflow-hidden border-t border-slate-100"
              >
                <nav className="py-4 space-y-1">
                  {}
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Products</p>
                    {productLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        className="flex items-center gap-3 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <link.icon className="w-4 h-4 text-slate-400" />
                        {link.label}
                      </a>
                    ))}
                  </div>

                  {}
                  <div className="px-4 py-2 border-t border-slate-100">
                    <a href="#pricing" className="block py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900">
                      Pricing
                    </a>
                    <a href="#" className="block py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900">
                      Documentation
                    </a>
                    <a href="#" className="block py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900">
                      Contact
                    </a>
                  </div>

                  {}
                  <div className="pt-4 mt-2 border-t border-slate-100 px-4 space-y-2">
                    <Link
                      to="/login"
                      className="block w-full text-center py-2.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full text-center text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 py-2.5 rounded-lg"
                    >
                      Get Started Free
                    </Link>
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}