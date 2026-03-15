import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Wallet, ArrowLeftRight, TrendingUp, Activity, Users, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '@/shared/components';
import { useDashboardStats } from '../hooks/useDashboard';
import { BalanceChart } from '../components/BalanceChart';
import { RecentTransactions } from '../components/RecentTransactions';
import { useTransactions } from '@/features/transactions/hooks/useTransactions';

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useDashboardStats();
  const { data: txData } = useTransactions({ page: 1, pageSize: 5 });

  const chartData = (stats?.volumeTrend ?? []).map((p) => ({
    date: new Date(p.timestamp).toLocaleDateString('en-US', { month: 'short' }),
    balance: p.value,
  }));

  const recentTransactions = txData?.items ?? [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Dashboard</Typography>
          <Typography variant="body2">Overview of your financial activity</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/wallets')}
            startIcon={<Wallet size={16} />}
            sx={{ cursor: 'pointer' }}
          >
            Wallets
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate('/transactions')}
            startIcon={<ArrowLeftRight size={16} />}
            sx={{ cursor: 'pointer' }}
          >
            New Transaction
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Volume"
            value={`$${(stats?.totalVolume ?? 0).toLocaleString()}`}
            icon={<TrendingUp size={22} />}
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Active Wallets"
            value={String(stats?.activeWallets ?? 0)}
            icon={<Wallet size={22} />}
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Transactions"
            value={String(stats?.totalTransactions ?? 0)}
            subtitle={`${stats?.failedTransactions ?? 0} failed`}
            icon={<Activity size={22} />}
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Success Rate"
            value={`${((stats?.successRate ?? 0) * 100).toFixed(1)}%`}
            icon={<CheckCircle size={22} />}
            loading={isLoading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard
            title="Active Users"
            value={String(stats?.activeUsers ?? 0)}
            subtitle={`${stats?.newUsersToday ?? 0} new today`}
            icon={<Users size={22} />}
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard
            title="Avg Transaction"
            value={`$${(stats?.averageTransactionValue ?? 0).toLocaleString()}`}
            icon={<ArrowLeftRight size={22} />}
            loading={isLoading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <BalanceChart data={chartData} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <RecentTransactions transactions={recentTransactions.slice(0, 5)} />
        </Grid>
      </Grid>
    </Box>
  );
}
