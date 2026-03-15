import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { Plus } from 'lucide-react';
import { StatusChip } from '@/shared/components';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionDialog } from '../components/TransactionDialog';
import type { TransactionType, TransactionStatus } from '@/shared/types';

const typeColors: Record<string, 'success' | 'error' | 'info'> = {
  Deposit: 'success',
  Withdrawal: 'error',
  Transfer: 'info',
};

export function TransactionsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialWalletId = searchParams.get('walletId') ?? '';
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [typeFilter, setTypeFilter] = useState<TransactionType | ''>('');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | ''>('');
  const [walletIdFilter, setWalletIdFilter] = useState(initialWalletId);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data, isLoading } = useTransactions({
    page: page + 1,
    pageSize: rowsPerPage,
    type: typeFilter || undefined,
    status: statusFilter || undefined,
    walletId: walletIdFilter || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const transactions = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Transactions</Typography>
          <Typography variant="body2">View and manage all transactions</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={16} />}
          onClick={() => setDialogOpen(true)}
          sx={{ cursor: 'pointer' }}
        >
          New Transaction
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 2, p: 2, '&:last-child': { pb: 2 }, flexWrap: 'wrap' }}>
          <TextField
            select
            label="Type"
            size="small"
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value as TransactionType | ''); setPage(0); }}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="Deposit">Deposit</MenuItem>
            <MenuItem value="Withdrawal">Withdrawal</MenuItem>
            <MenuItem value="Transfer">Transfer</MenuItem>
          </TextField>
          <TextField
            select
            label="Status"
            size="small"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as TransactionStatus | ''); setPage(0); }}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Failed">Failed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </TextField>
          <TextField
            label="Wallet ID"
            size="small"
            value={walletIdFilter}
            onChange={(e) => { setWalletIdFilter(e.target.value); setPage(0); }}
            placeholder="Filter by wallet"
            sx={{ minWidth: 200 }}
          />
          <TextField
            label="Start Date"
            size="small"
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minWidth: 160 }}
          />
          <TextField
            label="End Date"
            size="small"
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ minWidth: 160 }}
          />
        </CardContent>
      </Card>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Idempotency Key</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading && transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No transactions found</Typography>
                  </TableCell>
                </TableRow>
              )}
              {transactions.map((tx) => (
                <TableRow
                  key={tx.id}
                  hover
                  onClick={() => navigate(`/transactions/${tx.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(tx.createdAt).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={tx.type}
                      color={typeColors[tx.type] ?? 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{tx.description ?? '-'}</TableCell>
                  <TableCell align="right">
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: 'monospace',
                        color: tx.type === 'Withdrawal' ? 'error.main' : 'success.main',
                      }}
                    >
                      {tx.type === 'Withdrawal' ? '-' : '+'}{tx.amount.toLocaleString()} {tx.currency}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <StatusChip status={tx.status} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {tx.idempotencyKey ? tx.idempotencyKey.slice(0, 8) + '...' : '-'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalCount}
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

      <TransactionDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Box>
  );
}
