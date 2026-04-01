import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  readonly title: string;
  readonly value: string;
  readonly subtitle?: string;
  readonly icon: React.ReactNode;
  readonly trend?: { value: number; label: string };
  readonly loading?: boolean;
  readonly color?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, loading, color = '#22C55E' }: StatCardProps) {
  if (loading) {
    return (
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
            <Skeleton variant="text" width="55%" height={16} />
            <Skeleton variant="rounded" width={38} height={38} sx={{ borderRadius: '10px' }} />
          </Box>
          <Skeleton variant="text" width="65%" height={36} />
          <Skeleton variant="text" width="45%" height={16} sx={{ mt: 0.75 }} />
        </CardContent>
      </Card>
    );
  }

  const trendPositive = (trend?.value ?? 0) >= 0;
  let TrendIcon = null;
  if (trend !== undefined) {
    TrendIcon = trendPositive ? TrendingUp : TrendingDown;
  }

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, ${color}55, transparent 60%)`,
          opacity: 0,
          transition: 'opacity 200ms ease',
        },
        '&:hover::after': { opacity: 1 },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2.5 }}>
          <Typography
            sx={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              p: 1,
              borderRadius: '10px',
              backgroundColor: `${color}18`,
              color: color,
              display: 'flex',
              border: `1px solid ${color}28`,
              boxShadow: `0 0 10px ${color}15`,
            }}
          >
            {icon}
          </Box>
        </Box>

        <Typography
          sx={{
            fontSize: '1.875rem',
            fontWeight: 700,
            color: '#F8FAFC',
            lineHeight: 1,
            letterSpacing: '-0.025em',
            fontVariantNumeric: 'tabular-nums',
            mb: 1,
          }}
        >
          {value}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          {subtitle && (
            <Typography sx={{ fontSize: '0.75rem', color: '#475569' }}>
              {subtitle}
            </Typography>
          )}
          {trend && TrendIcon && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.375, ml: subtitle ? 'auto' : 0 }}>
              <TrendIcon size={12} color={trendPositive ? '#22C55E' : '#EF4444'} />
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: trendPositive ? '#22C55E' : '#EF4444',
                }}
              >
                {trendPositive ? '+' : ''}{trend.value}%
              </Typography>
              <Typography sx={{ fontSize: '0.6875rem', color: '#334155' }}>
                {trend.label}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
