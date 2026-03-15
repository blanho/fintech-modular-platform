import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DollarSign, TrendingUp, Activity, Wallet } from 'lucide-react';
import { StatCard } from '@/shared/components';
import { reportApi } from '../api/reportApi';

const mockSummary = {
  totalBalance: 125_430.50,
  totalTransactions: 284,
  monthlyVolume: 45_280,
  activeWallets: 4,
};

const mockMonthly = [
  { month: 'Sep', income: 18000, expense: 12000 },
  { month: 'Oct', income: 22000, expense: 15000 },
  { month: 'Nov', income: 19000, expense: 13000 },
  { month: 'Dec', income: 25000, expense: 18000 },
  { month: 'Jan', income: 21000, expense: 14000 },
  { month: 'Feb', income: 24000, expense: 16000 },
  { month: 'Mar', income: 28000, expense: 17000 },
];

const mockDistribution = [
  { name: 'Deposits', value: 45 },
  { name: 'Withdrawals', value: 30 },
  { name: 'Transfers', value: 25 },
];

const CHART_COLORS = ['#22C55E', '#EF4444', '#3B82F6'];

export function ReportsPage() {
  const muiTheme = useTheme();
  const { data: summary } = useQuery({
    queryKey: ['reports', 'summary'],
    queryFn: reportApi.getSummary,
  });
  const { data: monthly } = useQuery({
    queryKey: ['reports', 'monthly'],
    queryFn: reportApi.getMonthlyBreakdown,
  });

  const stats = summary ?? mockSummary;
  const monthlyData = monthly ?? mockMonthly;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Reports</Typography>
        <Typography variant="body2">Financial analytics and insights</Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Total Balance" value={`$${stats.totalBalance.toLocaleString()}`} icon={<DollarSign size={22} />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Total Transactions" value={String(stats.totalTransactions)} icon={<Activity size={22} />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Monthly Volume" value={`$${stats.monthlyVolume.toLocaleString()}`} icon={<TrendingUp size={22} />} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard title="Active Wallets" value={String(stats.activeWallets)} icon={<Wallet size={22} />} />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Income vs Expenses
              </Typography>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={muiTheme.palette.divider} vertical={false} />
                  <XAxis dataKey="month" stroke={muiTheme.palette.text.secondary} fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke={muiTheme.palette.text.secondary} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: muiTheme.palette.background.paper,
                      border: `1px solid ${muiTheme.palette.divider}`,
                      borderRadius: 8,
                    }}
                    formatter={(v) => [`$${Number(v).toLocaleString()}`]}
                  />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Transaction Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={mockDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {mockDistribution.map((_, idx) => (
                      <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: muiTheme.palette.background.paper,
                      border: `1px solid ${muiTheme.palette.divider}`,
                      borderRadius: 8,
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Volume Trend
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={muiTheme.palette.divider} vertical={false} />
              <XAxis dataKey="month" stroke={muiTheme.palette.text.secondary} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={muiTheme.palette.text.secondary} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: muiTheme.palette.background.paper,
                  border: `1px solid ${muiTheme.palette.divider}`,
                  borderRadius: 8,
                }}
                formatter={(v) => [`$${Number(v).toLocaleString()}`]}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ fill: '#22C55E', r: 4 }}
                activeDot={{ r: 6, fill: '#22C55E', stroke: alpha('#22C55E', 0.3), strokeWidth: 4 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ fill: '#EF4444', r: 4 }}
                activeDot={{ r: 6, fill: '#EF4444', stroke: alpha('#EF4444', 0.3), strokeWidth: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
