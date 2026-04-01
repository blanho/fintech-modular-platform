import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Wallet, ArrowLeftRight, TrendingUp, Activity, Users, CheckCircle, Plus } from 'lucide-react';
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
    date: new Date(p.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    balance: p.value,
  }));

  const recentTransactions = txData?.items ?? [];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography
            sx={{ fontSize: '1.375rem', fontWeight: 700, color: '#F8FAFC', lineHeight: 1.2 }}
          >
            Good morning 👋
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: '#475569', mt: 0.5 }}>
            Here&apos;s what&apos;s happening with your platform today.
          </Typography>
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
            startIcon={<Plus size={16} />}
            sx={{ cursor: 'pointer' }}
          >
            New Transaction
          </Button>
        </Box>
      </Box>

      {/* KPI grid — 6 cards in 2 rows of 3 */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Total Volume"
            value={`$${(stats?.totalVolume ?? 0).toLocaleString()}`}
            icon={<TrendingUp size={20} />}
            trend={{ value: 12.5, label: 'vs last month' }}
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Active Wallets"
            value={String(stats?.activeWallets ?? 0)}
            icon={<Wallet size={20} />}
            trend={{ value: 3.2, label: 'this week' }}
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Total Transactions"
            value={String(stats?.totalTransactions ?? 0)}
            subtitle={`${stats?.failedTransactions ?? 0} failed`}
            icon={<Activity size={20} />}
            trend={{ value: -1.4, label: 'vs yesterday' }}
            loading={isLoading}
            color="#3B82F6"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Success Rate"
            value={`${((stats?.successRate ?? 0) * 100).toFixed(1)}%`}
            icon={<CheckCircle size={20} />}
            trend={{ value: 0.8, label: 'vs last week' }}
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Active Users"
            value={String(stats?.activeUsers ?? 0)}
            subtitle={`${stats?.newUsersToday ?? 0} new today`}
            icon={<Users size={20} />}
            trend={{ value: 5.1, label: 'this month' }}
            loading={isLoading}
            color="#8B5CF6"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <StatCard
            title="Avg Transaction"
            value={`$${(stats?.averageTransactionValue ?? 0).toLocaleString()}`}
            icon={<ArrowLeftRight size={20} />}
            trend={{ value: 2.3, label: 'vs last week' }}
            loading={isLoading}
            color="#F59E0B"
          />
        </Grid>
      </Grid>

      {/* Chart + Recent */}
      <Grid container spacing={2.5}>
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
