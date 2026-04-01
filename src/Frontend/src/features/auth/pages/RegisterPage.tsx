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
import { Eye, EyeOff, UserPlus, TrendingUp } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import type { AxiosError } from 'axios';
import type { ApiError } from '@/shared/types';

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name is required'),
    lastName: z.string().min(2, 'Last name is required'),
    email: z.email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: signup, isPending, error } = useRegister();
  const apiError = (error as AxiosError<ApiError>)?.response?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = ({ confirmPassword: _c, ...payload }: RegisterForm) => {
    signup(payload);
  };

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
        <Box
          sx={{
            position: 'absolute', top: '8%', right: '-15%',
            width: 420, height: 420, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)',
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

        <Typography
          sx={{ fontSize: '2.125rem', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.2, mb: 2 }}
        >
          Join thousands of
          <br />
          <Box component="span" sx={{ color: '#22C55E' }}>finance teams</Box>
        </Typography>
        <Typography sx={{ fontSize: '0.9375rem', color: '#64748B', mb: 4, lineHeight: 1.75 }}>
          Create your account and start managing wallets, processing transactions, and tracking every cent.
        </Typography>

        <Box
          sx={{
            p: 2.5,
            borderRadius: '12px',
            border: '1px solid rgba(34,197,94,0.12)',
            backgroundColor: 'rgba(34,197,94,0.04)',
          }}
        >
          <Typography sx={{ fontSize: '0.8125rem', color: '#94A3B8', lineHeight: 1.7 }}>
            <Box component="span" sx={{ color: '#22C55E', fontWeight: 600 }}>Free to start</Box>
            {' '}— No credit card required. Full access to all features during your trial.
          </Typography>
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
        <Box sx={{ width: '100%', maxWidth: 420 }}>
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
            Create your account
          </Typography>
          <Typography sx={{ fontSize: '0.9375rem', color: '#475569', mb: 4 }}>
            Get started with FinTech Platform today.
          </Typography>

          {apiError && (
            <Alert severity="error" role="alert" sx={{ mb: 3, borderRadius: '10px' }}>
              {apiError.message}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
              <TextField
                {...register('firstName')}
                label="First Name"
                fullWidth
                error={Boolean(errors.firstName)}
                helperText={errors.firstName?.message}
              />
              <TextField
                {...register('lastName')}
                label="Last Name"
                fullWidth
                error={Boolean(errors.lastName)}
                helperText={errors.lastName?.message}
              />
            </Box>

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
              sx={{ mb: 2.5 }}
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

            <TextField
              {...register('confirmPassword')}
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword?.message}
              sx={{ mb: 3.5 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isPending}
              startIcon={<UserPlus size={18} />}
              sx={{ cursor: 'pointer', mb: 3 }}
            >
              {isPending ? 'Creating account...' : 'Create Account'}
            </Button>

            <Typography sx={{ textAlign: 'center', fontSize: '0.875rem', color: '#475569' }}>
              Already have an account?{' '}
              <Link
                component={RouterLink}
                to="/login"
                sx={{ cursor: 'pointer', color: '#22C55E', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}


