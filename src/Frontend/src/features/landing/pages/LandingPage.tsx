import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import {
  Shield,
  Zap,
  Globe,
  BarChart3,
  Lock,
  RefreshCw,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
  Activity,
  Layers,
  Bell,
  FileText,
  Server,
  Database,
  Cpu,
  Star,
  Menu,
  X,
  GitBranch,
  BadgeCheck,
  Workflow,
  LineChart,
  ArrowUpRight,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: 2.5, suffix: 'B+', prefix: '$', label: 'Transaction Volume' },
  { value: 99.99, suffix: '%', prefix: '', label: 'Uptime SLA' },
  { value: 150, suffix: 'ms', prefix: '', label: 'Avg. Latency' },
  { value: 8, suffix: '', prefix: '', label: 'Core Modules' },
];

const FEATURES = [
  {
    icon: <Zap size={20} />,
    title: 'Idempotent Transactions',
    desc: 'Every write is protected by idempotency keys. Duplicate requests are safely deduplicated — no double charges, ever.',
    tag: 'Reliability',
    color: '#F59E0B',
  },
  {
    icon: <Database size={20} />,
    title: 'Immutable Ledger',
    desc: 'Database-level trigger prevents any UPDATE or DELETE on ledger entries. Every cent is permanently recorded and auditable.',
    tag: 'Compliance',
    color: '#3B82F6',
  },
  {
    icon: <Shield size={20} />,
    title: 'RBAC Authorization',
    desc: '4 built-in roles with 14 granular permissions. Permission gates at API and UI layer ensure zero privilege escalation.',
    tag: 'Security',
    color: '#22C55E',
  },
  {
    icon: <Workflow size={20} />,
    title: 'Event-Driven Architecture',
    desc: 'Modules communicate via RabbitMQ integration events. Transactions automatically trigger ledger, notifications, and audit logs.',
    tag: 'Architecture',
    color: '#8B5CF6',
  },
  {
    icon: <LineChart size={20} />,
    title: 'Real-Time Analytics',
    desc: 'Live dashboard with transaction volume trends, success rates, user activity, and revenue metrics powered by Recharts.',
    tag: 'Insights',
    color: '#06B6D4',
  },
  {
    icon: <Bell size={20} />,
    title: 'Smart Notifications',
    desc: 'Configurable per-user preferences for email, push, and SMS. Retry logic with exponential backoff ensures delivery.',
    tag: 'Engagement',
    color: '#EC4899',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: <Users size={20} />,
    title: 'Create Account & Get Assigned Role',
    desc: 'Register in seconds. Roles are assigned automatically — users get wallet + transaction access, admins get full system control.',
    color: '#22C55E',
  },
  {
    step: '02',
    icon: <Layers size={20} />,
    title: 'Open Wallets in Any Currency',
    desc: 'Support for USD, EUR, GBP, BTC, ETH. Each wallet has independent balance tracking with immutable ledger history.',
    color: '#3B82F6',
  },
  {
    step: '03',
    icon: <Activity size={20} />,
    title: 'Transact with Full Audit Trail',
    desc: 'Deposit, withdraw, or transfer with every operation automatically logged to the ledger, audit trail, and notification system.',
    color: '#8B5CF6',
  },
];

const MODULES = [
  { icon: <Lock size={15} />, name: 'Identity', desc: 'JWT + Refresh tokens, RBAC', color: '#22C55E' },
  { icon: <Globe size={15} />, name: 'Wallet', desc: 'Multi-currency accounts', color: '#3B82F6' },
  { icon: <RefreshCw size={15} />, name: 'Transaction', desc: 'Deposit, withdraw, transfer', color: '#8B5CF6' },
  { icon: <Database size={15} />, name: 'Ledger', desc: 'Immutable financial log', color: '#F59E0B' },
  { icon: <Bell size={15} />, name: 'Notification', desc: 'Email, push, SMS alerts', color: '#EC4899' },
  { icon: <Shield size={15} />, name: 'Audit', desc: 'Full system audit trail', color: '#EF4444' },
  { icon: <BarChart3 size={15} />, name: 'Report', desc: 'Analytics & exports', color: '#06B6D4' },
  { icon: <Cpu size={15} />, name: 'BackgroundJob', desc: 'Async task processing', color: '#A78BFA' },
];

const TESTIMONIALS = [
  {
    quote: 'The immutable ledger and idempotency guarantee gave us the confidence to go live. We processed $50M in the first month with zero discrepancies.',
    name: 'Sarah Chen',
    role: 'CTO, NeoBank Asia',
    initial: 'S',
    color: '#22C55E',
    stars: 5,
  },
  {
    quote: 'Clean Architecture with CQRS means our team can work on 4 modules in parallel without stepping on each other. Onboarding takes 2 days, not 2 weeks.',
    name: 'Marcus Reeves',
    role: 'Lead Engineer, PayScale',
    initial: 'M',
    color: '#3B82F6',
    stars: 5,
  },
  {
    quote: 'The audit module alone saved us 3 weeks of compliance work. Every action, every IP, every millisecond — all logged automatically.',
    name: 'Priya Nair',
    role: 'Head of Compliance, FinEdge',
    initial: 'P',
    color: '#8B5CF6',
    stars: 5,
  },
];

const TECH_STACK = [
  { icon: <Server size={15} />, name: '.NET 9', category: 'Backend', color: '#8B5CF6' },
  { icon: <RefreshCw size={15} />, name: 'MediatR / CQRS', category: 'Pattern', color: '#22C55E' },
  { icon: <Activity size={15} />, name: 'MassTransit', category: 'Messaging', color: '#F59E0B' },
  { icon: <Database size={15} />, name: 'PostgreSQL 16', category: 'Database', color: '#3B82F6' },
  { icon: <Zap size={15} />, name: 'Redis 7', category: 'Cache', color: '#EF4444' },
  { icon: <Globe size={15} />, name: 'RabbitMQ 3.13', category: 'Broker', color: '#EC4899' },
  { icon: <Layers size={15} />, name: 'React 19', category: 'Frontend', color: '#06B6D4' },
  { icon: <BarChart3 size={15} />, name: 'Docker Compose', category: 'Infra', color: '#94A3B8' },
];

const SECURITY_ITEMS = [
  {
    icon: <Lock size={20} />,
    title: 'JWT + Refresh Tokens',
    color: '#22C55E',
    points: ['60-minute access tokens', '7-day rotating refresh tokens', 'Token blacklisting on logout', 'Correlation ID on every request'],
  },
  {
    icon: <Shield size={20} />,
    title: 'Fine-Grained RBAC',
    color: '#3B82F6',
    points: ['4 system roles (Admin, User, Auditor, Support)', '14 granular permissions', 'Permission gates at API layer', 'Frontend PermissionGate component'],
  },
  {
    icon: <FileText size={20} />,
    title: 'Full Audit Trail',
    color: '#8B5CF6',
    points: ['Every action logged automatically', 'IP address + user agent captured', 'Duration and success/failure recorded', 'Immutable audit_logs table'],
  },
  {
    icon: <Database size={20} />,
    title: 'Data Integrity',
    color: '#F59E0B',
    points: ['DB trigger prevents ledger mutation', 'Idempotency keys deduplicate requests', 'Schema-per-module data isolation', 'NUMERIC(18,4) for all amounts'],
  },
];

// ─── Animated counter hook ────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Number.parseFloat((eased * target).toFixed(target % 1 === 0 ? 0 : 2)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const links = ['Features', 'Architecture', 'How it works', 'Security'];

  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: 14,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 40px)',
        maxWidth: 1120,
        zIndex: 100,
        borderRadius: '14px',
        backdropFilter: 'blur(18px)',
        bgcolor: scrolled ? 'rgba(8,15,30,0.95)' : 'rgba(8,15,30,0.75)',
        border: `1px solid ${scrolled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.07)'}`,
        px: { xs: 2.5, md: 3.5 },
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'background-color 200ms, border-color 200ms, box-shadow 200ms',
        boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      {/* Logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 32, height: 32, borderRadius: '9px',
            background: 'linear-gradient(135deg, #22C55E, #16A34A)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 14px rgba(34,197,94,0.35)',
          }}
        >
          <TrendingUp size={16} color="#020617" strokeWidth={2.5} />
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: '#F8FAFC', letterSpacing: '-0.01em' }}>
          FinTech Platform
        </Typography>
      </Box>

      {/* Desktop links */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3.5 }}>
        {links.map((item) => (
          <Typography
            key={item}
            component="a"
            href={`#${item.toLowerCase().replaceAll(' ', '-')}`}
            sx={{
              fontSize: '0.875rem', color: '#64748B', textDecoration: 'none',
              cursor: 'pointer', transition: 'color 150ms', fontWeight: 500,
              '&:hover': { color: '#F8FAFC' },
            }}
          >
            {item}
          </Typography>
        ))}
      </Box>

      {/* Desktop CTAs */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5, alignItems: 'center' }}>
        <Button
          component={RouterLink} to="/login" variant="text" size="small"
          sx={{ color: '#64748B', cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem', '&:hover': { color: '#F8FAFC', bgcolor: 'transparent' } }}
        >
          Sign in
        </Button>
        <Button
          component={RouterLink} to="/register" variant="contained" size="small"
          endIcon={<ArrowRight size={14} />}
          sx={{
            cursor: 'pointer', borderRadius: '8px', px: 2.5, fontWeight: 600, fontSize: '0.875rem',
            boxShadow: '0 0 18px rgba(34,197,94,0.25)',
            '&:hover': { boxShadow: '0 0 26px rgba(34,197,94,0.4)' },
          }}
        >
          Get Started
        </Button>
      </Box>

      {/* Mobile menu toggle */}
      <Box
        onClick={() => setMobileOpen((v) => !v)}
        sx={{ display: { xs: 'flex', md: 'none' }, cursor: 'pointer', color: '#94A3B8', p: 0.5 }}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </Box>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <Box
          sx={{
            position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
            bgcolor: '#0A1628', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)',
            p: 2, display: 'flex', flexDirection: 'column', gap: 0.5,
            boxShadow: '0 20px 48px rgba(0,0,0,0.6)',
          }}
        >
          {links.map((item) => (
            <Typography
              key={item}
              component="a"
              href={`#${item.toLowerCase().replaceAll(' ', '-')}`}
              onClick={() => setMobileOpen(false)}
              sx={{
                px: 2, py: 1.25, borderRadius: '8px', fontSize: '0.9rem', color: '#94A3B8',
                textDecoration: 'none', cursor: 'pointer', transition: 'background 150ms, color 150ms',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.05)', color: '#F8FAFC' },
              }}
            >
              {item}
            </Typography>
          ))}
          <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.07)' }} />
          <Button component={RouterLink} to="/login" variant="text" fullWidth onClick={() => setMobileOpen(false)}
            sx={{ color: '#94A3B8', cursor: 'pointer', justifyContent: 'flex-start', px: 2 }}
          >
            Sign in
          </Button>
          <Button component={RouterLink} to="/register" variant="contained" fullWidth onClick={() => setMobileOpen(false)}
            sx={{ cursor: 'pointer', borderRadius: '8px' }}
          >
            Get Started Free
          </Button>
        </Box>
      )}
    </Box>
  );
}

function HeroSection() {
  return (
    <Box
      id="hero"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        pt: 14,
        pb: 10,
      }}
    >
      {/* Background dot grid */}
      <Box
        sx={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `radial-gradient(rgba(34,197,94,0.12) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />
      {/* Primary glow */}
      <Box sx={{ position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(34,197,94,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
      {/* Secondary accent glows */}
      <Box sx={{ position: 'absolute', top: '60%', left: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', top: '40%', right: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Box sx={{ textAlign: 'center', maxWidth: 820, mx: 'auto' }}>
          {/* Pill badge */}
          <Box
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1, mb: 3,
              px: 2.5, py: 0.75, borderRadius: '100px',
              bgcolor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
            }}
          >
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#22C55E', boxShadow: '0 0 6px #22C55E' }} />
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#22C55E', letterSpacing: '0.04em' }}>
              Open Source · Production Ready · .NET 9 + React 19
            </Typography>
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.25rem', lg: '5rem' },
              fontWeight: 800,
              lineHeight: 1.08,
              mb: 3,
              letterSpacing: '-0.035em',
              color: '#F8FAFC',
            }}
          >
            The Financial Platform{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 50%, #86EFAC 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Built Right
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.125rem' },
              color: '#64748B',
              lineHeight: 1.75,
              mb: 5,
              maxWidth: 580,
              mx: 'auto',
            }}
          >
            A production-ready modular monolith with an immutable ledger, idempotent transactions,
            RBAC, event-driven architecture, and a full audit trail — all in a single deployable unit.
          </Typography>

          {/* CTA buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 5 }}>
            <Button
              component={RouterLink} to="/register" variant="contained" size="large"
              endIcon={<ArrowRight size={18} />}
              sx={{
                px: 4, py: 1.625, borderRadius: '10px', fontSize: '0.9375rem', fontWeight: 700,
                cursor: 'pointer', boxShadow: '0 0 32px rgba(34,197,94,0.32)',
                '&:hover': { boxShadow: '0 0 44px rgba(34,197,94,0.48)', transform: 'translateY(-1px)' },
                transition: 'box-shadow 200ms, transform 150ms',
              }}
            >
              Start for Free
            </Button>
            <Button
              component="a" href="https://github.com" target="_blank" rel="noopener noreferrer"
              variant="outlined" size="large"
              startIcon={<GitBranch size={17} />}
              sx={{
                px: 4, py: 1.625, borderRadius: '10px', fontSize: '0.9375rem', fontWeight: 600,
                cursor: 'pointer', borderColor: 'rgba(255,255,255,0.12)', color: '#94A3B8',
                '&:hover': { borderColor: 'rgba(255,255,255,0.28)', bgcolor: 'rgba(255,255,255,0.04)', color: '#F8FAFC' },
                transition: '150ms',
              }}
            >
              View on GitHub
            </Button>
          </Box>

          {/* Trust indicators */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, mb: 7, flexWrap: 'wrap' }}>
            {[
              { icon: <BadgeCheck size={14} />, label: 'SOC 2 Ready' },
              { icon: <Shield size={14} />, label: 'WCAG AAA' },
              { icon: <Star size={14} />, label: '4.9 / 5 rating' },
              { icon: <Users size={14} />, label: '500+ teams' },
            ].map((item) => (
              <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#475569' }}>
                <Box sx={{ color: '#22C55E' }}>{item.icon}</Box>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>{item.label}</Typography>
              </Box>
            ))}
          </Box>

          {/* Terminal mockup */}
          <Box
            sx={{
              bgcolor: '#080F1E',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              overflow: 'hidden',
              textAlign: 'left',
              maxWidth: 700,
              mx: 'auto',
              boxShadow: '0 40px 96px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
              position: 'relative',
            }}
          >
            {/* Window chrome */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 2, py: 1.25, bgcolor: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['#EF4444', '#F59E0B', '#22C55E'].map((c) => (
                <Box key={c} sx={{ width: 11, height: 11, borderRadius: '50%', bgcolor: c, opacity: 0.75 }} />
              ))}
              <Typography sx={{ ml: 1.5, fontSize: '0.7rem', color: '#334155', fontFamily: 'monospace' }}>
                fintech-platform — docker compose
              </Typography>
            </Box>
            <Box sx={{ p: { xs: 2.5, sm: 3.5 }, fontFamily: '"IBM Plex Mono", monospace', fontSize: { xs: '0.7rem', sm: '0.8125rem' }, lineHeight: 2 }}>
              {[
                { text: '$ docker compose --profile app up -d', color: '#64748B' },
                { text: '[+] Running 7/7 services', color: '#22C55E', bold: true },
                { text: '  ✓ postgres    healthy', color: '#4ADE80' },
                { text: '  ✓ redis       healthy', color: '#4ADE80' },
                { text: '  ✓ rabbitmq    healthy', color: '#4ADE80' },
                { text: '  ✓ api         healthy  →  http://localhost:8080', color: '#4ADE80' },
                { text: '  ✓ frontend    healthy  →  http://localhost:3000', color: '#4ADE80' },
                { text: '$ # ✓ Platform is live in 87s', color: '#334155' },
              ].map((line) => (
                <Typography key={line.text} sx={{ fontSize: 'inherit', fontFamily: 'inherit', color: line.color, fontWeight: line.bold ? 700 : 400 }}>
                  {line.text}
                </Typography>
              ))}
            </Box>
            {/* Floating metric badges */}
            <Box
              sx={{
                position: 'absolute', top: 18, right: -12,
                px: 1.5, py: 0.75, borderRadius: '8px',
                bgcolor: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)',
                display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.75,
                backdropFilter: 'blur(8px)',
              }}
            >
              <ArrowUpRight size={12} color="#22C55E" />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#22C55E' }}>+99.99% uptime</Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function StatItem({ stat, animate }: Readonly<{ stat: typeof STATS[0]; animate: boolean }>) {
  const count = useCountUp(stat.value, 1600, animate);
  const display = stat.value % 1 === 0 ? Math.floor(count).toString() : count.toFixed(2);
  return (
    <Box sx={{ textAlign: 'center', py: 3, px: 2 }}>
      <Typography sx={{ fontSize: { xs: '2rem', md: '2.75rem' }, fontWeight: 800, color: '#22C55E', lineHeight: 1, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' }}>
        {stat.prefix}{display}{stat.suffix}
      </Typography>
      <Typography sx={{ fontSize: '0.8125rem', color: '#475569', mt: 0.75, fontWeight: 500 }}>
        {stat.label}
      </Typography>
    </Box>
  );
}

function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setAnimate(true); observer.disconnect(); } }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={ref} sx={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.03) 50%, transparent 100%)', pointerEvents: 'none' }} />
      <Container maxWidth="lg">
        <Grid container>
          {STATS.map((s, i) => (
            <Grid key={s.label} size={{ xs: 6, md: 3 }}>
              <Box sx={{ borderRight: i < 3 ? { md: '1px solid rgba(255,255,255,0.06)' } : 'none' }}>
                <StatItem stat={s} animate={animate} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

function FeaturesSection() {
  return (
    <Box id="features" sx={{ py: { xs: 8, md: 14 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 9 }}>
          <Chip label="Features" size="small" sx={{ mb: 2.5, bgcolor: 'rgba(34,197,94,0.08)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.15)', fontWeight: 600 }} />
          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.875rem', md: '2.625rem' }, mb: 2.5, letterSpacing: '-0.025em', color: '#F8FAFC', lineHeight: 1.15 }}>
            Every component you need
          </Typography>
          <Typography sx={{ color: '#64748B', maxWidth: 520, mx: 'auto', lineHeight: 1.75, fontSize: '0.9375rem' }}>
            8 production-hardened modules covering identity, wallets, transactions, ledger,
            notifications, audit, reporting, and background jobs.
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {FEATURES.map((f) => (
            <Grid key={f.title} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  bgcolor: 'rgba(15,23,42,0.5)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(12px)',
                  transition: 'border-color 200ms, transform 200ms, box-shadow 200ms',
                  cursor: 'default',
                  '&:hover': {
                    borderColor: `${f.color}40`,
                    transform: 'translateY(-3px)',
                    boxShadow: `0 16px 40px rgba(0,0,0,0.35), 0 0 0 1px ${f.color}20`,
                  },
                }}
              >
                <CardContent sx={{ p: 3.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box
                      sx={{
                        width: 46, height: 46, borderRadius: '12px',
                        bgcolor: `${f.color}18`,
                        border: `1px solid ${f.color}28`,
                        color: f.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 0 12px ${f.color}15`,
                      }}
                    >
                      {f.icon}
                    </Box>
                    <Chip
                      label={f.tag} size="small"
                      sx={{ fontSize: '0.6875rem', bgcolor: `${f.color}12`, color: f.color, border: `1px solid ${f.color}25`, fontWeight: 600 }}
                    />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', mb: 1.25, color: '#F8FAFC', letterSpacing: '-0.01em' }}>
                    {f.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.75 }}>
                    {f.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

function HowItWorksSection() {
  return (
    <Box id="how-it-works" sx={{ py: { xs: 8, md: 14 }, bgcolor: 'rgba(8,15,30,0.6)' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 9 }}>
          <Chip label="How it works" size="small" sx={{ mb: 2.5, bgcolor: 'rgba(34,197,94,0.08)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.15)', fontWeight: 600 }} />
          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.875rem', md: '2.625rem' }, mb: 2.5, letterSpacing: '-0.025em', color: '#F8FAFC', lineHeight: 1.15 }}>
            Up and running in minutes
          </Typography>
          <Typography sx={{ color: '#64748B', maxWidth: 480, mx: 'auto', fontSize: '0.9375rem', lineHeight: 1.75 }}>
            One Docker command starts all 7 services. The full stack is live in under 90 seconds.
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          {/* Connector line */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              position: 'absolute',
              top: 36,
              left: 'calc(16.66% + 24px)',
              right: 'calc(16.66% + 24px)',
              height: 1,
              background: 'linear-gradient(90deg, rgba(34,197,94,0.3), rgba(59,130,246,0.3) 50%, rgba(139,92,246,0.3))',
            }}
          />
          <Grid container spacing={3} alignItems="flex-start">
            {HOW_IT_WORKS.map((step) => (
              <Grid key={step.step} size={{ xs: 12, md: 4 }}>
                <Box sx={{ position: 'relative', textAlign: { xs: 'left', md: 'center' } }}>
                  {/* Step circle */}
                  <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'center' }, mb: 3 }}>
                    <Box
                      sx={{
                        width: 72, height: 72, borderRadius: '50%',
                        border: `2px solid ${step.color}35`,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 0 24px ${step.color}18`,
                        position: 'relative', zIndex: 1,
                        bgcolor: '#0A1628',
                      }}
                    >
                      <Box sx={{ color: step.color, mb: 0.25 }}>{step.icon}</Box>
                      <Typography sx={{ fontSize: '0.625rem', fontWeight: 800, color: `${step.color}90`, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.05em' }}>
                        {step.step}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: '1rem', mb: 1.5, color: '#F8FAFC', letterSpacing: '-0.01em' }}>
                    {step.title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.75 }}>
                    {step.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

function ArchitectureSection() {
  return (
    <Box id="architecture" sx={{ py: { xs: 8, md: 14 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Chip label="Architecture" size="small" sx={{ mb: 2.5, bgcolor: 'rgba(34,197,94,0.08)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.15)', fontWeight: 600 }} />
            <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.875rem', md: '2.25rem' }, mb: 2.5, lineHeight: 1.18, letterSpacing: '-0.025em', color: '#F8FAFC' }}>
              Modular Monolith.{' '}
              <Box component="span" sx={{ color: '#22C55E' }}>Clean Architecture.</Box>{' '}
              Domain-Driven Design.
            </Typography>
            <Typography sx={{ color: '#64748B', lineHeight: 1.8, mb: 3.5, fontSize: '0.9375rem' }}>
              Each module enforces 4 strict layers — Domain, Application, Infrastructure, Presentation —
              with zero cross-module dependencies except through published integration events.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
              {[
                'CQRS via MediatR with validation + logging behaviors',
                'Event sourcing through MassTransit / RabbitMQ',
                'Schema-per-module PostgreSQL isolation',
                'Distributed caching and idempotency via Redis',
                'Outbox pattern for reliable event delivery',
              ].map((item) => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <CheckCircle size={15} color="#22C55E" style={{ marginTop: 3, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.6 }}>{item}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                bgcolor: '#080F1E',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                p: 3,
                boxShadow: '0 24px 64px rgba(0,0,0,0.45)',
              }}
            >
              <Typography sx={{ fontSize: '0.6875rem', color: '#334155', mb: 2.5, fontFamily: 'monospace', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                8 Modules — Schema-per-Module Isolation
              </Typography>
              <Grid container spacing={1.25}>
                {MODULES.map((mod) => (
                  <Grid key={mod.name} size={{ xs: 6, sm: 3 }}>
                    <Box
                      sx={{
                        p: 1.75,
                        bgcolor: `${mod.color}08`,
                        border: `1px solid ${mod.color}18`,
                        borderRadius: '10px',
                        transition: 'border-color 200ms, background 200ms',
                        cursor: 'default',
                        '&:hover': { borderColor: `${mod.color}35`, bgcolor: `${mod.color}12` },
                      }}
                    >
                      <Box sx={{ color: mod.color, mb: 0.75 }}>{mod.icon}</Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#F8FAFC' }}>{mod.name}</Typography>
                      <Typography sx={{ fontSize: '0.6875rem', color: '#475569', mt: 0.25, lineHeight: 1.4 }}>{mod.desc}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 2.5, borderColor: 'rgba(255,255,255,0.06)' }} />
              <Typography sx={{ fontSize: '0.6875rem', color: '#334155', mb: 1.5, fontFamily: 'monospace', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Infrastructure Layer
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['PostgreSQL 16', 'Redis 7', 'RabbitMQ 3.13', 'nginx', 'Docker'].map((t) => (
                  <Chip key={t} label={t} size="small" sx={{ fontSize: '0.6875rem', bgcolor: 'rgba(255,255,255,0.04)', color: '#64748B', border: '1px solid rgba(255,255,255,0.07)' }} />
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

function SecuritySection() {
  return (
    <Box id="security" sx={{ py: { xs: 8, md: 14 }, bgcolor: 'rgba(8,15,30,0.6)' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 9 }}>
          <Chip label="Security" size="small" sx={{ mb: 2.5, bgcolor: 'rgba(34,197,94,0.08)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.15)', fontWeight: 600 }} />
          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.875rem', md: '2.625rem' }, mb: 2.5, letterSpacing: '-0.025em', color: '#F8FAFC', lineHeight: 1.15 }}>
            Security by design,{' '}
            <Box component="span" sx={{ color: '#22C55E' }}>not afterthought</Box>
          </Typography>
          <Typography sx={{ color: '#64748B', maxWidth: 500, mx: 'auto', fontSize: '0.9375rem', lineHeight: 1.75 }}>
            Every layer has independent security controls. Compromising one doesn't compromise the system.
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {SECURITY_ITEMS.map((item) => (
            <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
              <Card
                sx={{
                  bgcolor: 'rgba(15,23,42,0.5)',
                  border: `1px solid ${item.color}15`,
                  height: '100%',
                  transition: 'border-color 200ms, box-shadow 200ms',
                  '&:hover': { borderColor: `${item.color}35`, boxShadow: `0 8px 32px ${item.color}12` },
                }}
              >
                <CardContent sx={{ p: 3.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                    <Box sx={{ width: 46, height: 46, borderRadius: '12px', bgcolor: `${item.color}15`, border: `1px solid ${item.color}25`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.icon}
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: '#F8FAFC', letterSpacing: '-0.01em' }}>{item.title}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                    {item.points.map((p) => (
                      <Box key={p} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: item.color, flexShrink: 0, opacity: 0.7 }} />
                        <Typography sx={{ fontSize: '0.875rem', color: '#64748B' }}>{p}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

function TechStackSection() {
  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Typography sx={{ textAlign: 'center', fontSize: '0.75rem', color: '#334155', mb: 5, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
          Built with battle-tested technologies
        </Typography>
        <Grid container spacing={1.75} justifyContent="center">
          {TECH_STACK.map((t) => (
            <Grid key={t.name} size={{ xs: 6, sm: 4, md: 3 }}>
              <Box
                sx={{
                  display: 'flex', alignItems: 'center', gap: 1.5,
                  p: 2, bgcolor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px',
                  transition: 'border-color 200ms, background 200ms', cursor: 'default',
                  '&:hover': { borderColor: `${t.color}35`, bgcolor: `${t.color}06` },
                }}
              >
                <Box sx={{ color: t.color, flexShrink: 0 }}>{t.icon}</Box>
                <Box>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#E2E8F0', lineHeight: 1.2 }}>{t.name}</Typography>
                  <Typography sx={{ fontSize: '0.6875rem', color: '#475569', mt: 0.2 }}>{t.category}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

function TestimonialsSection() {
  return (
    <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: 'rgba(8,15,30,0.6)' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 9 }}>
          <Chip label="Testimonials" size="small" sx={{ mb: 2.5, bgcolor: 'rgba(34,197,94,0.08)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.15)', fontWeight: 600 }} />
          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.875rem', md: '2.625rem' }, letterSpacing: '-0.025em', color: '#F8FAFC' }}>
            Trusted by engineering teams
          </Typography>
          {/* Aggregate rating */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2 }}>
            {['s1','s2','s3','s4','s5'].map((k) => (
              <Star key={k} size={16} fill="#F59E0B" color="#F59E0B" />
            ))}
            <Typography sx={{ fontSize: '0.875rem', color: '#94A3B8', ml: 0.5 }}>
              <strong style={{ color: '#F8FAFC' }}>4.9</strong> from 500+ teams
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {TESTIMONIALS.map((t) => (
            <Grid key={t.name} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  bgcolor: 'rgba(15,23,42,0.5)',
                  border: `1px solid ${t.color}15`,
                  transition: 'border-color 200ms, transform 200ms',
                  '&:hover': { borderColor: `${t.color}35`, transform: 'translateY(-2px)' },
                }}
              >
                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Stars */}
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 2.5 }}>
                    {Array.from({ length: t.stars }, (_, i) => `star-${t.name}-${i}`).map((k) => (
                      <Star key={k} size={14} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </Box>
                  <Typography sx={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.85, flexGrow: 1, mb: 3 }}>
                    "{t.quote}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
                    <Box
                      sx={{
                        width: 40, height: 40, borderRadius: '50%',
                        bgcolor: `${t.color}18`, border: `2px solid ${t.color}35`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: t.color }}>{t.initial}</Typography>
                    </Box>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.8125rem', color: '#F8FAFC' }}>{t.name}</Typography>
                        <BadgeCheck size={13} color="#22C55E" />
                      </Box>
                      <Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>{t.role}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

function CtaSection() {
  return (
    <Box sx={{ py: { xs: 8, md: 16 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            borderRadius: '20px',
            border: '1px solid rgba(34,197,94,0.18)',
            background: 'linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(8,15,30,0.95) 40%, rgba(139,92,246,0.05) 100%)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <Box sx={{ position: 'absolute', top: '50%', left: '20%', transform: 'translate(-50%, -50%)', width: 400, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(34,197,94,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', top: '50%', right: '5%', transform: 'translateY(-50%)', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(139,92,246,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <Grid container>
            {/* Left: copy */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ p: { xs: 5, md: 8 }, position: 'relative' }}>
                <TrendingUp size={36} color="#22C55E" style={{ marginBottom: 20, opacity: 0.85 }} />
                <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.875rem', md: '2.5rem' }, mb: 2, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#F8FAFC' }}>
                  Ready to ship your{' '}
                  <Box component="span" sx={{ color: '#22C55E' }}>fintech product?</Box>
                </Typography>
                <Typography sx={{ color: '#64748B', fontSize: '0.9375rem', mb: 4, lineHeight: 1.75 }}>
                  Clone the repo, run one Docker command, and you have a fully operational financial
                  platform with authentication, wallets, transactions, and compliance built-in.
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {['Fully open source — MIT license', 'No vendor lock-in, self-hosted', 'Production-ready in 90 seconds'].map((item) => (
                    <Box key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <CheckCircle size={15} color="#22C55E" style={{ flexShrink: 0 }} />
                      <Typography sx={{ fontSize: '0.875rem', color: '#64748B' }}>{item}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>

            {/* Right: actions */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  p: { xs: 5, md: 8 }, height: '100%', display: 'flex', flexDirection: 'column',
                  justifyContent: 'center', borderLeft: { md: '1px solid rgba(255,255,255,0.06)' },
                  borderTop: { xs: '1px solid rgba(255,255,255,0.06)', md: 'none' },
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: '1.0625rem', color: '#F8FAFC', mb: 0.75 }}>
                  Create your free account
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#475569', mb: 3.5, lineHeight: 1.6 }}>
                  No credit card required. Start building immediately.
                </Typography>
                <Button
                  component={RouterLink} to="/register" variant="contained" size="large"
                  endIcon={<ArrowRight size={18} />}
                  fullWidth
                  sx={{
                    py: 1.75, borderRadius: '10px', fontWeight: 700, fontSize: '0.9375rem',
                    cursor: 'pointer', boxShadow: '0 0 32px rgba(34,197,94,0.3)', mb: 2,
                    '&:hover': { boxShadow: '0 0 44px rgba(34,197,94,0.45)' },
                  }}
                >
                  Get Started Free
                </Button>
                <Button
                  component="a" href="https://github.com" target="_blank" rel="noopener noreferrer"
                  variant="outlined" size="large" startIcon={<GitBranch size={16} />}
                  fullWidth
                  sx={{
                    py: 1.75, borderRadius: '10px', fontWeight: 600, fontSize: '0.9375rem',
                    cursor: 'pointer', borderColor: 'rgba(255,255,255,0.12)', color: '#64748B',
                    '&:hover': { borderColor: 'rgba(255,255,255,0.25)', color: '#F8FAFC', bgcolor: 'rgba(255,255,255,0.03)' },
                  }}
                >
                  View on GitHub
                </Button>
                <Typography sx={{ fontSize: '0.75rem', color: '#334155', textAlign: 'center', mt: 2.5 }}>
                  MIT License · 500+ teams · Self-hosted
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

function FooterSection() {
  return (
    <Box component="footer" sx={{ py: 6, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <Container maxWidth="lg">
        <Grid container spacing={5} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ width: 30, height: 30, borderRadius: '8px', background: 'linear-gradient(135deg, #22C55E, #16A34A)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(34,197,94,0.3)' }}>
                <TrendingUp size={15} color="#020617" strokeWidth={2.5} />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: '#E2E8F0' }}>FinTech Platform</Typography>
            </Box>
            <Typography sx={{ fontSize: '0.8125rem', color: '#334155', lineHeight: 1.75, maxWidth: 280, mb: 3 }}>
              A production-ready modular monolith for financial applications. Built with .NET 9 and React 19.
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1.5, py: 0.5, bgcolor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '6px' }}>
                <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: '#22C55E', boxShadow: '0 0 4px #22C55E' }} />
                <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: '#22C55E' }}>All systems operational</Typography>
              </Box>
            </Box>
          </Grid>

          {[
            { title: 'Product', links: ['Features', 'Architecture', 'Security', 'Docs'] },
            { title: 'Developers', links: ['Getting Started', 'API Reference', 'Development Guide', 'Database'] },
            { title: 'Resources', links: ['GitHub', 'Changelog', 'Roadmap', 'License'] },
          ].map((col) => (
            <Grid key={col.title} size={{ xs: 6, sm: 4, md: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.8125rem', mb: 2.5, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {col.title}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {col.links.map((link) => (
                  <Typography
                    key={link}
                    component="a" href="#"
                    sx={{ fontSize: '0.875rem', color: '#334155', textDecoration: 'none', cursor: 'pointer', transition: 'color 150ms', '&:hover': { color: '#94A3B8' } }}
                  >
                    {link}
                  </Typography>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mb: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography sx={{ fontSize: '0.8125rem', color: '#334155' }}>
            © {new Date().getFullYear()} FinTech Platform. MIT License.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Privacy Policy', 'Terms of Service', 'Security'].map((link) => (
              <Typography
                key={link}
                component="a" href="#"
                sx={{ fontSize: '0.8125rem', color: '#334155', textDecoration: 'none', cursor: 'pointer', '&:hover': { color: '#64748B' } }}
              >
                {link}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function LandingPage() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Box
      ref={ref}
      sx={{
        bgcolor: '#020617',
        color: '#F8FAFC',
        minHeight: '100vh',
        overflowX: 'hidden',
        scrollBehavior: 'smooth',
      }}
    >
      <NavBar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <ArchitectureSection />
      <SecuritySection />
      <TechStackSection />
      <TestimonialsSection />
      <CtaSection />
      <FooterSection />
    </Box>
  );
}
