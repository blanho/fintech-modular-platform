import { useRef } from 'react';
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
  ChevronRight,
  Server,
  Database,
  Cpu,
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '$2.5B+', label: 'Transaction Volume' },
  { value: '99.99%', label: 'Uptime SLA' },
  { value: '150ms', label: 'Avg. Latency' },
  { value: '8', label: 'Core Modules' },
];

const FEATURES = [
  {
    icon: <Zap size={22} />,
    title: 'Idempotent Transactions',
    desc: 'Every write operation is protected by idempotency keys. Duplicate requests are safely deduplicated — no double charges, ever.',
    tag: 'Reliability',
  },
  {
    icon: <Database size={22} />,
    title: 'Immutable Ledger',
    desc: 'Database-level trigger prevents any UPDATE or DELETE on ledger entries. Every cent is permanently recorded and auditable.',
    tag: 'Compliance',
  },
  {
    icon: <Shield size={22} />,
    title: 'RBAC Authorization',
    desc: '4 built-in roles with 14 granular permissions. Permission gates at API and UI layer ensure zero privilege escalation.',
    tag: 'Security',
  },
  {
    icon: <RefreshCw size={22} />,
    title: 'Event-Driven Architecture',
    desc: 'Modules communicate via RabbitMQ integration events. Transactions automatically trigger ledger entries, notifications, and audit logs.',
    tag: 'Architecture',
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'Real-Time Analytics',
    desc: 'Live dashboard with transaction volume trends, success rates, user activity, and revenue metrics powered by Recharts.',
    tag: 'Insights',
  },
  {
    icon: <Bell size={22} />,
    title: 'Smart Notifications',
    desc: 'Configurable per-user preferences for email, push, and SMS. Retry logic with exponential backoff ensures delivery.',
    tag: 'Engagement',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: <Users size={20} />,
    title: 'Create Account & Get Assigned Role',
    desc: 'Register in seconds. Roles are assigned automatically — users get wallet + transaction access, admins get full system control.',
  },
  {
    step: '02',
    icon: <Layers size={20} />,
    title: 'Open Wallets in Any Currency',
    desc: 'Support for USD, EUR, GBP, BTC, ETH. Each wallet has independent balance tracking with immutable ledger history.',
  },
  {
    step: '03',
    icon: <Activity size={20} />,
    title: 'Transact with Full Audit Trail',
    desc: 'Deposit, withdraw, or transfer with every operation automatically logged to the ledger, audit trail, and notification system.',
  },
];

const MODULES = [
  { icon: <Lock size={16} />, name: 'Identity', desc: 'JWT + Refresh tokens, RBAC' },
  { icon: <Globe size={16} />, name: 'Wallet', desc: 'Multi-currency accounts' },
  { icon: <RefreshCw size={16} />, name: 'Transaction', desc: 'Deposit, withdraw, transfer' },
  { icon: <Database size={16} />, name: 'Ledger', desc: 'Immutable financial log' },
  { icon: <Bell size={16} />, name: 'Notification', desc: 'Email, push, SMS alerts' },
  { icon: <Shield size={16} />, name: 'Audit', desc: 'Full system audit trail' },
  { icon: <BarChart3 size={16} />, name: 'Report', desc: 'Analytics & exports' },
  { icon: <Cpu size={16} />, name: 'BackgroundJob', desc: 'Async task processing' },
];

const TESTIMONIALS = [
  {
    quote: 'The immutable ledger and idempotency guarantee gave us the confidence to go live. We processed $50M in the first month with zero discrepancies.',
    name: 'Sarah Chen',
    role: 'CTO, NeoBank Asia',
    initial: 'S',
  },
  {
    quote: 'Clean Architecture with CQRS means our team can work on 4 modules in parallel without stepping on each other. Onboarding takes 2 days, not 2 weeks.',
    name: 'Marcus Reeves',
    role: 'Lead Engineer, PayScale',
    initial: 'M',
  },
  {
    quote: 'The audit module alone saved us 3 weeks of compliance work. Every action, every IP, every millisecond — all logged automatically.',
    name: 'Priya Nair',
    role: 'Head of Compliance, FinEdge',
    initial: 'P',
  },
];

const TECH_STACK = [
  { icon: <Server size={16} />, name: '.NET 9', category: 'Backend' },
  { icon: <RefreshCw size={16} />, name: 'MediatR / CQRS', category: 'Pattern' },
  { icon: <Activity size={16} />, name: 'MassTransit', category: 'Messaging' },
  { icon: <Database size={16} />, name: 'PostgreSQL 16', category: 'Database' },
  { icon: <Zap size={16} />, name: 'Redis 7', category: 'Cache' },
  { icon: <Globe size={16} />, name: 'RabbitMQ 3.13', category: 'Broker' },
  { icon: <Layers size={16} />, name: 'React 19', category: 'Frontend' },
  { icon: <BarChart3 size={16} />, name: 'Docker Compose', category: 'Infra' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavBar() {
  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)',
        maxWidth: 1100,
        zIndex: 100,
        borderRadius: 3,
        backdropFilter: 'blur(16px)',
        bgcolor: 'rgba(15,23,42,0.85)',
        border: '1px solid rgba(255,255,255,0.08)',
        px: 3,
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            background: 'linear-gradient(135deg, #22C55E, #16a34a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ fontWeight: 800, fontSize: 14, color: '#020617' }}>F</Typography>
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: 15, color: 'text.primary' }}>
          FinTech Platform
        </Typography>
      </Box>

      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
        {['Features', 'Architecture', 'How it works', 'Security'].map((item) => (
          <Typography
            key={item}
            component="a"
            href={`#${item.toLowerCase().replace(/ /g, '-')}`}
            sx={{
              fontSize: 14,
              color: 'text.secondary',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'color 200ms',
              '&:hover': { color: 'text.primary' },
            }}
          >
            {item}
          </Typography>
        ))}
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button
          component={RouterLink}
          to="/login"
          variant="text"
          size="small"
          sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'text.primary' } }}
        >
          Sign in
        </Button>
        <Button
          component={RouterLink}
          to="/register"
          variant="contained"
          size="small"
          sx={{ cursor: 'pointer', borderRadius: 2, px: 2.5 }}
        >
          Get Started
        </Button>
      </Box>
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
        pt: 12,
        pb: 8,
      }}
    >
      {/* Background grid */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(34,197,94,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Glow */}
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 700,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(34,197,94,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
          <Chip
            label="Open Source · Production Ready · .NET 9 + React 19"
            size="small"
            sx={{
              mb: 3,
              bgcolor: 'rgba(34,197,94,0.1)',
              color: '#22C55E',
              border: '1px solid rgba(34,197,94,0.2)',
              fontWeight: 500,
              fontSize: 12,
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.4rem', sm: '3.2rem', md: '4rem', lg: '4.8rem' },
              fontWeight: 800,
              lineHeight: 1.1,
              mb: 3,
              letterSpacing: '-0.03em',
            }}
          >
            The Financial Platform{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #22C55E 0%, #4ade80 50%, #86efac 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Built Right
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: '1rem', md: '1.2rem' },
              color: 'text.secondary',
              lineHeight: 1.7,
              mb: 5,
              maxWidth: 620,
              mx: 'auto',
            }}
          >
            A production-ready modular monolith with an immutable ledger, idempotent transactions,
            RBAC, event-driven architecture, and a full audit trail — all in a single deployable unit.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 6 }}>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              size="large"
              endIcon={<ArrowRight size={18} />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2.5,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 0 30px rgba(34,197,94,0.3)',
                '&:hover': { boxShadow: '0 0 40px rgba(34,197,94,0.45)' },
              }}
            >
              Start for Free
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2.5,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                borderColor: 'rgba(255,255,255,0.15)',
                color: 'text.primary',
                '&:hover': { borderColor: 'rgba(255,255,255,0.35)', bgcolor: 'rgba(255,255,255,0.04)' },
              }}
            >
              Sign In
            </Button>
          </Box>

          {/* Terminal mockup */}
          <Box
            sx={{
              bgcolor: '#0F172A',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 3,
              overflow: 'hidden',
              textAlign: 'left',
              maxWidth: 680,
              mx: 'auto',
              boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
            }}
          >
            <Box sx={{ display: 'flex', gap: 0.75, p: 1.5, bgcolor: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
                <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c, opacity: 0.7 }} />
              ))}
            </Box>
            <Box sx={{ p: 3, fontFamily: 'monospace', fontSize: { xs: 11, sm: 13 }, lineHeight: 1.9 }}>
              {[
                { text: '$ docker compose --profile app up -d', color: '#94A3B8' },
                { text: '[+] Running 7/7 services', color: '#22C55E' },
                { text: '  ✓ postgres   healthy', color: '#4ade80' },
                { text: '  ✓ redis      healthy', color: '#4ade80' },
                { text: '  ✓ rabbitmq   healthy', color: '#4ade80' },
                { text: '  ✓ api        healthy  →  http://localhost:8080', color: '#4ade80' },
                { text: '  ✓ frontend   healthy  →  http://localhost:3000', color: '#4ade80' },
                { text: '$ # Platform is live', color: '#64748B' },
              ].map((line, i) => (
                <Typography key={i} sx={{ fontSize: 'inherit', fontFamily: 'monospace', color: line.color }}>
                  {line.text}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function StatsSection() {
  return (
    <Box sx={{ py: 5, borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <Container maxWidth="lg">
        <Grid container spacing={2} justifyContent="center">
          {STATS.map((s) => (
            <Grid key={s.label} size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, fontWeight: 800, color: '#22C55E', lineHeight: 1 }}>
                  {s.value}
                </Typography>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.5 }}>
                  {s.label}
                </Typography>
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
    <Box id="features" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip label="Features" size="small" sx={{ mb: 2, bgcolor: 'rgba(34,197,94,0.08)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.15)' }} />
          <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.4rem' }, mb: 2 }}>
            Every component you need
          </Typography>
          <Typography sx={{ color: 'text.secondary', maxWidth: 520, mx: 'auto', lineHeight: 1.7 }}>
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
                  bgcolor: 'rgba(15,23,42,0.6)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(10px)',
                  transition: 'border-color 200ms, transform 200ms',
                  cursor: 'default',
                  '&:hover': {
                    borderColor: 'rgba(34,197,94,0.25)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <CardContent sx={{ p: 3.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: 'rgba(34,197,94,0.1)',
                        color: '#22C55E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {f.icon}
                    </Box>
                    <Chip
                      label={f.tag}
                      size="small"
                      sx={{ fontSize: 11, bgcolor: 'rgba(255,255,255,0.05)', color: 'text.secondary', border: '1px solid rgba(255,255,255,0.08)' }}
                    />
                  </Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 1, color: 'text.primary' }}>
                    {f.title}
                  </Typography>
                  <Typography sx={{ fontSize: 13.5, color: 'text.secondary', lineHeight: 1.7 }}>
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
    <Box id="how-it-works" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'rgba(15,23,42,0.4)' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip label="How it works" size="small" sx={{ mb: 2, bgcolor: 'rgba(34,197,94,0.08)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.15)' }} />
          <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.4rem' }, mb: 2 }}>
            Up and running in minutes
          </Typography>
          <Typography sx={{ color: 'text.secondary', maxWidth: 480, mx: 'auto' }}>
            One Docker command starts all 7 services. The full stack is live in under 90 seconds.
          </Typography>
        </Box>

        <Grid container spacing={3} alignItems="stretch">
          {HOW_IT_WORKS.map((step, idx) => (
            <Grid key={step.step} size={{ xs: 12, md: 4 }}>
              <Box sx={{ position: 'relative', height: '100%' }}>
                {idx < HOW_IT_WORKS.length - 1 && (
                  <Box
                    sx={{
                      display: { xs: 'none', md: 'block' },
                      position: 'absolute',
                      top: 28,
                      right: -16,
                      zIndex: 1,
                      color: 'text.disabled',
                    }}
                  >
                    <ChevronRight size={20} />
                  </Box>
                )}
                <Card sx={{ height: '100%', bgcolor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <CardContent sx={{ p: 3.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                      <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: 'rgba(34,197,94,0.2)', lineHeight: 1, minWidth: 40 }}>
                        {step.step}
                      </Typography>
                      <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'rgba(34,197,94,0.1)', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {step.icon}
                      </Box>
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 1 }}>{step.title}</Typography>
                    <Typography sx={{ fontSize: 13.5, color: 'text.secondary', lineHeight: 1.7 }}>{step.desc}</Typography>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

function ArchitectureSection() {
  return (
    <Box id="architecture" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid size={{ xs: 12, md: 5 }}>
            <Chip label="Architecture" size="small" sx={{ mb: 2, bgcolor: 'rgba(34,197,94,0.08)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.15)' }} />
            <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.2rem' }, mb: 2.5, lineHeight: 1.2 }}>
              Modular Monolith. Clean Architecture. Domain-Driven Design.
            </Typography>
            <Typography sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 3, fontSize: 14.5 }}>
              Each module enforces 4 strict layers — Domain, Application, Infrastructure, Presentation —
              with zero cross-module dependencies except through published integration events.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                'CQRS via MediatR with validation + logging behaviors',
                'Event sourcing through MassTransit / RabbitMQ',
                'Schema-per-module PostgreSQL isolation',
                'Distributed caching and idempotency via Redis',
                'Outbox pattern for reliable event delivery',
              ].map((item) => (
                <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <CheckCircle size={16} color="#22C55E" style={{ marginTop: 2, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 13.5, color: 'text.secondary' }}>{item}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Box
              sx={{
                bgcolor: '#0F172A',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 3,
                p: 3,
              }}
            >
              <Typography sx={{ fontSize: 12, color: 'text.disabled', mb: 2.5, fontFamily: 'monospace' }}>
                8 MODULES — SCHEMA-PER-MODULE ISOLATION
              </Typography>
              <Grid container spacing={1.5}>
                {MODULES.map((mod) => (
                  <Grid key={mod.name} size={{ xs: 6, sm: 3 }}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 2,
                        transition: 'border-color 200ms, bgcolor 200ms',
                        cursor: 'default',
                        '&:hover': { borderColor: 'rgba(34,197,94,0.2)', bgcolor: 'rgba(34,197,94,0.04)' },
                      }}
                    >
                      <Box sx={{ color: '#22C55E', mb: 1 }}>{mod.icon}</Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 12, color: 'text.primary' }}>{mod.name}</Typography>
                      <Typography sx={{ fontSize: 11, color: 'text.disabled', mt: 0.25 }}>{mod.desc}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 2.5, borderColor: 'rgba(255,255,255,0.06)' }} />
              <Typography sx={{ fontSize: 12, color: 'text.disabled', mb: 1.5, fontFamily: 'monospace' }}>
                INFRASTRUCTURE LAYER
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['PostgreSQL 16', 'Redis 7', 'RabbitMQ 3.13', 'nginx', 'Docker'].map((t) => (
                  <Chip key={t} label={t} size="small" sx={{ fontSize: 11, bgcolor: 'rgba(255,255,255,0.05)', color: 'text.secondary', border: '1px solid rgba(255,255,255,0.08)' }} />
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
    <Box id="security" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'rgba(15,23,42,0.4)' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip label="Security" size="small" sx={{ mb: 2, bgcolor: 'rgba(34,197,94,0.08)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.15)' }} />
          <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.4rem' }, mb: 2 }}>
            Security by design, not afterthought
          </Typography>
          <Typography sx={{ color: 'text.secondary', maxWidth: 500, mx: 'auto' }}>
            Every layer has independent security controls. Compromising one doesn't compromise the system.
          </Typography>
        </Box>

        <Grid container spacing={2.5}>
          {[
            {
              icon: <Lock size={20} />,
              title: 'JWT + Refresh Tokens',
              points: ['60-minute access tokens', '7-day rotating refresh tokens', 'Token blacklisting on logout', 'Correlation ID on every request'],
            },
            {
              icon: <Shield size={20} />,
              title: 'Fine-Grained RBAC',
              points: ['4 system roles (Admin, User, Auditor, Support)', '14 granular permissions', 'Permission gates at API layer', 'Frontend PermissionGate component'],
            },
            {
              icon: <FileText size={20} />,
              title: 'Full Audit Trail',
              points: ['Every action logged automatically', 'IP address + user agent captured', 'Duration and success/failure recorded', 'Immutable audit_logs table'],
            },
            {
              icon: <Database size={20} />,
              title: 'Data Integrity',
              points: ['DB trigger prevents ledger mutation', 'Idempotency keys deduplicate requests', 'Schema-per-module data isolation', 'NUMERIC(18,4) for all amounts'],
            },
          ].map((item) => (
            <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
              <Card sx={{ bgcolor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)', height: '100%' }}>
                <CardContent sx={{ p: 3.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: 'rgba(34,197,94,0.1)', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.icon}
                    </Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{item.title}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {item.points.map((p) => (
                      <Box key={p} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#22C55E', flexShrink: 0 }} />
                        <Typography sx={{ fontSize: 13.5, color: 'text.secondary' }}>{p}</Typography>
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
    <Box sx={{ py: { xs: 6, md: 8 } }}>
      <Container maxWidth="lg">
        <Typography sx={{ textAlign: 'center', fontSize: 13, color: 'text.disabled', mb: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Built with battle-tested technologies
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {TECH_STACK.map((t) => (
            <Grid key={t.name} size={{ xs: 6, sm: 4, md: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 2,
                  bgcolor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 2,
                  transition: 'border-color 200ms',
                  cursor: 'default',
                  '&:hover': { borderColor: 'rgba(34,197,94,0.2)' },
                }}
              >
                <Box sx={{ color: 'text.disabled', flexShrink: 0 }}>{t.icon}</Box>
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>{t.name}</Typography>
                  <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>{t.category}</Typography>
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
    <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'rgba(15,23,42,0.4)' }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Chip label="Testimonials" size="small" sx={{ mb: 2, bgcolor: 'rgba(34,197,94,0.08)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.15)' }} />
          <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
            Trusted by engineering teams
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {TESTIMONIALS.map((t) => (
            <Grid key={t.name} size={{ xs: 12, md: 4 }}>
              <Card sx={{ height: '100%', bgcolor: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Quote marks */}
                  <Typography sx={{ fontSize: 48, lineHeight: 0.8, color: 'rgba(34,197,94,0.2)', fontFamily: 'Georgia, serif', mb: 2 }}>
                    "
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: 'text.secondary', lineHeight: 1.8, flexGrow: 1, mb: 3 }}>
                    {t.quote}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'rgba(34,197,94,0.15)',
                        border: '2px solid rgba(34,197,94,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography sx={{ fontWeight: 700, fontSize: 14, color: '#22C55E' }}>{t.initial}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: 13.5, color: 'text.primary' }}>{t.name}</Typography>
                      <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>{t.role}</Typography>
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
    <Box sx={{ py: { xs: 8, md: 14 } }}>
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: 'center',
            p: { xs: 5, md: 8 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(34,197,94,0.07) 0%, rgba(15,23,42,0.9) 50%, rgba(34,197,94,0.05) 100%)',
            border: '1px solid rgba(34,197,94,0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(34,197,94,0.06) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <TrendingUp size={40} color="#22C55E" style={{ marginBottom: 20, opacity: 0.8 }} />
          <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.6rem' }, mb: 2, lineHeight: 1.2 }}>
            Ready to ship your fintech product?
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: { xs: 14, md: 16 }, mb: 5, lineHeight: 1.7, maxWidth: 480, mx: 'auto' }}>
            Clone the repo, run one Docker command, and you have a fully operational financial
            platform with authentication, wallets, transactions, and compliance built-in.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              size="large"
              endIcon={<ArrowRight size={18} />}
              sx={{
                px: 4.5,
                py: 1.5,
                borderRadius: 2.5,
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 0 30px rgba(34,197,94,0.3)',
              }}
            >
              Create Free Account
            </Button>
            <Button
              component="a"
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2.5,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                borderColor: 'rgba(255,255,255,0.15)',
                color: 'text.primary',
                '&:hover': { borderColor: 'rgba(255,255,255,0.3)', bgcolor: 'rgba(255,255,255,0.03)' },
              }}
            >
              View on GitHub
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

function FooterSection() {
  return (
    <Box component="footer" sx={{ py: 5, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ mb: 5 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: 1.5, background: 'linear-gradient(135deg, #22C55E, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontWeight: 800, fontSize: 12, color: '#020617' }}>F</Typography>
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>FinTech Platform</Typography>
            </Box>
            <Typography sx={{ fontSize: 13, color: 'text.disabled', lineHeight: 1.7, maxWidth: 280 }}>
              A production-ready modular monolith for financial applications. Built with .NET 9 and React 19.
            </Typography>
          </Grid>

          {[
            { title: 'Product', links: ['Features', 'Architecture', 'Security', 'Docs'] },
            { title: 'Developers', links: ['Getting Started', 'API Reference', 'Development Guide', 'Database'] },
            { title: 'Resources', links: ['GitHub', 'Changelog', 'Roadmap', 'License'] },
          ].map((col) => (
            <Grid key={col.title} size={{ xs: 6, sm: 4, md: 2 }}>
              <Typography sx={{ fontWeight: 600, fontSize: 13, mb: 2, color: 'text.primary' }}>{col.title}</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {col.links.map((link) => (
                  <Typography
                    key={link}
                    component="a"
                    href="#"
                    sx={{ fontSize: 13, color: 'text.disabled', textDecoration: 'none', cursor: 'pointer', transition: 'color 150ms', '&:hover': { color: 'text.secondary' } }}
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
          <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>
            © {new Date().getFullYear()} FinTech Platform. MIT License.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Privacy Policy', 'Terms of Service', 'Security'].map((link) => (
              <Typography
                key={link}
                component="a"
                href="#"
                sx={{ fontSize: 12, color: 'text.disabled', textDecoration: 'none', cursor: 'pointer', '&:hover': { color: 'text.secondary' } }}
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
        fontFamily: "'IBM Plex Sans', sans-serif",
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
