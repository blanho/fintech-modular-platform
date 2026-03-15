import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Wallet, ArrowLeftRight, TrendingUp, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '@/shared/components';
import { useDashboardStats } from '../hooks/useDashboard';
import { BalanceChart } from '../components/BalanceChart';
import { RecentTransactions } from '../components/RecentTransactions';

const mockStats = {
  totalBalance: 125_430.50,
  totalWallets: 4,
  pendingTransactions: 3,
  monthlyVolume: 45_280.00,
  recentTransactions: [
    { id: '1', walletId: 'w1', type: 'Deposit' as const, amount: 5000, currency: 'USD', status: 'Completed' as const, description: 'Wire transfer', referenceId: 'ref-1', createdAt: '2026-03-14T10:30:00Z' },
    { id: '2', walletId: 'w1', type: 'Transfer' as const, amount: 1200, currency: 'USD', status: 'Completed' as const, description: 'To savings', referenceId: 'ref-2', createdAt: '2026-03-13T14:20:00Z' },
    { id: '3', walletId: 'w2', type: 'Withdrawal' as const, amount: 800, currency: 'USD', status: 'Pending' as const, description: 'ATM withdrawal', referenceId: 'ref-3', createdAt: '2026-03-13T09:15:00Z' },
    { id: '4', walletId: 'w1', type: 'Deposit' as const, amount: 15000, currency: 'USD', status: 'Completed' as const, description: 'Salary', referenceId: 'ref-4', createdAt: '2026-03-12T08:00:00Z' },
    { id: '5', walletId: 'w3', type: 'Transfer' as const, amount: 3500, currency: 'EUR', status: 'Failed' as const, description: 'International', referenceId: 'ref-5', createdAt: '2026-03-11T16:45:00Z' },
  ],
  balanceHistory: [
    { date: 'Jan', balance: 85000 },
    { date: 'Feb', balance: 92000 },
    { date: 'Mar', balance: 88000 },
    { date: 'Apr', balance: 95000 },
    { date: 'May', balance: 102000 },
    { date: 'Jun', balance: 98000 },
    { date: 'Jul', balance: 105000 },
    { date: 'Aug', balance: 110000 },
    { date: 'Sep', balance: 108000 },
    { date: 'Oct', balance: 115000 },
    { date: 'Nov', balance: 120000 },
    { date: 'Dec', balance: 125430 },
  ],
};

export function DashboardPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useDashboardStats();
  const stats = data ?? mockStats;

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
            title="Total Balance"
            value={`$${stats.totalBalance.toLocaleString()}`}
            icon={<TrendingUp size={22} />}
            trend={{ value: 12.5, label: 'from last month' }}
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Active Wallets"
            value={String(stats.totalWallets)}
            icon={<Wallet size={22} />}
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Pending"
            value={String(stats.pendingTransactions)}
            subtitle="transactions awaiting"
            icon={<Activity size={22} />}
            loading={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Monthly Volume"
            value={`$${stats.monthlyVolume.toLocaleString()}`}
            icon={<ArrowLeftRight size={22} />}
            trend={{ value: -3.2, label: 'from last month' }}
            loading={isLoading}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <BalanceChart data={stats.balanceHistory} />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <RecentTransactions transactions={stats.recentTransactions.slice(0, 5)} />
        </Grid>
      </Grid>
    </Box>
  );
}
