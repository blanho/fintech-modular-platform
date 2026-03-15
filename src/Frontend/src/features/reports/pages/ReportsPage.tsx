import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Plus, Download, Activity, TrendingUp, Users, Wallet } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { StatCard } from '@/shared/components';
import { useReports, useGenerateReport, useDownloadReport, useDashboardStats } from '../hooks/useReports';
import type { ReportType, ReportStatus, GenerateReportRequest } from '@/shared/types';

const reportStatusColors: Record<ReportStatus, 'default' | 'info' | 'success' | 'error' | 'warning'> = {
  Pending: 'default',
  Generating: 'info',
  Completed: 'success',
  Failed: 'error',
  Expired: 'warning',
};

export function ReportsPage() {
  const muiTheme = useTheme();
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [generateOpen, setGenerateOpen] = useState(false);

  const { data: dashboardStats } = useDashboardStats();
  const { data: reportsData, isLoading: reportsLoading } = useReports(page + 1, rowsPerPage);
  const generateReport = useGenerateReport();
  const downloadReport = useDownloadReport();

  const reports = reportsData?.items ?? [];
  const totalReports = reportsData?.totalCount ?? 0;

  const form = useForm<GenerateReportRequest>({
    defaultValues: { title: '', type: 'TransactionSummary', periodStart: '', periodEnd: '' },
  });

  const handleGenerate = (data: GenerateReportRequest) => {
    generateReport.mutate(data, {
      onSuccess: () => {
        form.reset();
        setGenerateOpen(false);
      },
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Reports</Typography>
          <Typography variant="body2">Financial analytics and report generation</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={16} />}
          onClick={() => setGenerateOpen(true)}
          sx={{ cursor: 'pointer' }}
        >
          Generate Report
        </Button>
      </Box>

      <Tabs value={tab} onChange={(_, v: number) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Dashboard" sx={{ cursor: 'pointer' }} />
        <Tab label="Reports" sx={{ cursor: 'pointer' }} />
      </Tabs>

      {tab === 0 && (
        <Box>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Total Transactions"
                value={String(dashboardStats?.totalTransactions ?? 0)}
                icon={<Activity size={22} />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Total Volume"
                value={`$${(dashboardStats?.totalVolume ?? 0).toLocaleString()}`}
                icon={<TrendingUp size={22} />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Active Users"
                value={String(dashboardStats?.activeUsers ?? 0)}
                icon={<Users size={22} />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Active Wallets"
                value={String(dashboardStats?.activeWallets ?? 0)}
                icon={<Wallet size={22} />}
              />
            </Grid>
          </Grid>

          {dashboardStats?.transactionTrend && dashboardStats.transactionTrend.length > 0 && (
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  Transaction Trend
                </Typography>
                <ResponsiveContainer width="100%" height={340}>
                  <BarChart data={dashboardStats.transactionTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke={muiTheme.palette.divider} vertical={false} />
                    <XAxis
                      dataKey="timestamp"
                      stroke={muiTheme.palette.text.secondary}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: string) => new Date(v).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    />
                    <YAxis stroke={muiTheme.palette.text.secondary} fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: muiTheme.palette.background.paper,
                        border: `1px solid ${muiTheme.palette.divider}`,
                        borderRadius: 8,
                      }}
                    />
                    <Legend />
                    <Bar dataKey="value" name="Transactions" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </Box>
      )}

      {tab === 1 && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Period</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!reportsLoading && reports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">No reports generated yet</Typography>
                    </TableCell>
                  </TableRow>
                )}
                {reports.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{r.title}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={r.type} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {new Date(r.periodStart).toLocaleDateString()} - {new Date(r.periodEnd).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={r.status}
                        color={reportStatusColors[r.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      {r.status === 'Completed' && (
                        <Button
                          size="small"
                          startIcon={<Download size={14} />}
                          onClick={() => downloadReport.mutate(r.id)}
                          disabled={downloadReport.isPending}
                          sx={{ cursor: 'pointer' }}
                        >
                          Download
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={totalReports}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Card>
      )}

      <Dialog open={generateOpen} onClose={() => setGenerateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate Report</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 1 }}>
            <TextField
              {...form.register('title', { required: 'Title is required' })}
              label="Report Title"
              fullWidth
              error={Boolean(form.formState.errors.title)}
              helperText={form.formState.errors.title?.message}
              sx={{ mb: 2.5 }}
            />
            <Controller
              name="type"
              control={form.control}
              rules={{ required: 'Select report type' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  label="Report Type"
                  fullWidth
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  sx={{ mb: 2.5 }}
                >
                  {(['TransactionSummary', 'WalletBalance', 'UserActivity', 'RevenueAnalysis', 'DailyReconciliation', 'MonthlyStatement'] as ReportType[]).map((t) => (
                    <MenuItem key={t} value={t}>{t.replace(/([A-Z])/g, ' $1').trim()}</MenuItem>
                  ))}
                </TextField>
              )}
            />
            <TextField
              {...form.register('periodStart', { required: 'Start date is required' })}
              label="Period Start"
              type="date"
              fullWidth
              error={Boolean(form.formState.errors.periodStart)}
              helperText={form.formState.errors.periodStart?.message}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ mb: 2.5 }}
            />
            <TextField
              {...form.register('periodEnd', { required: 'End date is required' })}
              label="Period End"
              type="date"
              fullWidth
              error={Boolean(form.formState.errors.periodEnd)}
              helperText={form.formState.errors.periodEnd?.message}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setGenerateOpen(false)} sx={{ cursor: 'pointer' }}>Cancel</Button>
          <Button
            variant="contained"
            disabled={generateReport.isPending}
            onClick={() => void form.handleSubmit(handleGenerate)()}
            sx={{ cursor: 'pointer' }}
          >
            {generateReport.isPending ? 'Generating...' : 'Generate'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
