import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Eye, EyeOff, LogIn, TrendingUp, Shield, Zap, BarChart3 } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import type { AxiosError } from 'axios';
import type { ApiError } from '@/shared/types';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

const features = [
  { icon: <Shield size={17} />, label: 'Bank-grade security', desc: 'AES-256 encryption, full audit trail' },
  { icon: <Zap size={17} />, label: 'Real-time processing', desc: 'Sub-100ms transaction latency' },
  { icon: <BarChart3 size={17} />, label: 'Advanced analytics', desc: 'Live dashboards and custom reports' },
];

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error } = useLogin();
  const apiError = (error as AxiosError<ApiError>)?.response?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: LoginForm) => login(data);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', backgroundColor: '#020617' }}>
      {/* Left branding panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: '0 0 44%',
          flexDirection: 'column',
          justifyContent: 'center',
          px: 7,
          py: 6,
          background: 'linear-gradient(160deg, #0A1628 0%, #0F172A 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* BG glow */}
        <Box
          sx={{
            position: 'absolute', top: '8%', right: '-15%',
            width: 420, height: 420, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute', bottom: '5%', left: '-8%',
            width: 280, height: 280, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 9 }}>
          <Box
            sx={{
              width: 38, height: 38, borderRadius: '11px',
              background: 'linear-gradient(135deg, #22C55E, #16A34A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 18px rgba(34,197,94,0.3)',
            }}
          >
            <TrendingUp size={20} color="#020617" strokeWidth={2.5} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: '1.0625rem', color: '#F8FAFC' }}>
            FinTech Platform
          </Typography>
        </Box>

        {/* Hero */}
        <Typography
          sx={{ fontSize: '2.125rem', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.2, mb: 2 }}
        >
          Financial infrastructure
          <br />
          <Box component="span" sx={{ color: '#22C55E' }}>built for scale</Box>
        </Typography>
        <Typography sx={{ fontSize: '0.9375rem', color: '#64748B', mb: 6, lineHeight: 1.75 }}>
          Manage wallets, process transactions, and gain real-time insights with a powerful modular platform.
        </Typography>

        {/* Feature list */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {features.map((f) => (
            <Box key={f.label} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box
                sx={{
                  p: 1, borderRadius: '8px',
                  backgroundColor: 'rgba(34,197,94,0.1)',
                  color: '#22C55E',
                  border: '1px solid rgba(34,197,94,0.15)',
                  display: 'flex', flexShrink: 0,
                }}
              >
                {f.icon}
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#E2E8F0', lineHeight: 1.3 }}>
                  {f.label}
                </Typography>
                <Typography sx={{ fontSize: '0.8125rem', color: '#475569', lineHeight: 1.4, mt: 0.25 }}>
                  {f.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right form panel */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, sm: 5 },
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          {/* Mobile logo */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center', gap: 1.5, mb: 4, justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                width: 34, height: 34, borderRadius: '10px',
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <TrendingUp size={18} color="#020617" strokeWidth={2.5} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.0625rem', color: '#F8FAFC' }}>
              FinTech Platform
            </Typography>
          </Box>

          <Typography sx={{ fontSize: '1.625rem', fontWeight: 700, color: '#F8FAFC', mb: 0.75 }}>
            Welcome back
          </Typography>
          <Typography sx={{ fontSize: '0.9375rem', color: '#475569', mb: 4 }}>
            Sign in to your account to continue.
          </Typography>

          {apiError && (
            <Alert severity="error" role="alert" sx={{ mb: 3, borderRadius: '10px' }}>
              {apiError.message}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              {...register('email')}
              label="Email address"
              fullWidth
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
              sx={{ mb: 2.5 }}
              autoComplete="email"
            />

            <TextField
              {...register('password')}
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
              sx={{ mb: 3.5 }}
              autoComplete="current-password"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        sx={{ cursor: 'pointer' }}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isPending}
              startIcon={<LogIn size={18} />}
              sx={{ cursor: 'pointer', mb: 3 }}
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </Button>

            <Typography sx={{ textAlign: 'center', fontSize: '0.875rem', color: '#475569' }}>
              Don&apos;t have an account?{' '}
              <Link
                component={RouterLink}
                to="/register"
                sx={{ cursor: 'pointer', color: '#22C55E', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
              >
                Create one
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}