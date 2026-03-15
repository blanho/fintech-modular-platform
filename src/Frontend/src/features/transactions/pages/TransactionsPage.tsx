import { useState } from 'react';
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
import type { Transaction, TransactionType, TransactionStatus } from '@/shared/types';

const typeColors: Record<string, 'success' | 'error' | 'info'> = {
  Deposit: 'success',
  Withdrawal: 'error',
  Transfer: 'info',
};

const mockTransactions: Transaction[] = [
  { id: '1', walletId: 'w1', type: 'Deposit', amount: 5000, currency: 'USD', status: 'Completed', description: 'Wire transfer', referenceId: 'ref-1', createdAt: '2026-03-14T10:30:00Z' },
  { id: '2', walletId: 'w1', type: 'Transfer', amount: 1200, currency: 'USD', status: 'Completed', description: 'To savings', referenceId: 'ref-2', createdAt: '2026-03-13T14:20:00Z' },
  { id: '3', walletId: 'w2', type: 'Withdrawal', amount: 800, currency: 'USD', status: 'Pending', description: 'ATM withdrawal', referenceId: 'ref-3', createdAt: '2026-03-13T09:15:00Z' },
  { id: '4', walletId: 'w1', type: 'Deposit', amount: 15000, currency: 'USD', status: 'Completed', description: 'Salary', referenceId: 'ref-4', createdAt: '2026-03-12T08:00:00Z' },
  { id: '5', walletId: 'w3', type: 'Transfer', amount: 3500, currency: 'EUR', status: 'Failed', description: 'International', referenceId: 'ref-5', createdAt: '2026-03-11T16:45:00Z' },
  { id: '6', walletId: 'w1', type: 'Deposit', amount: 2000, currency: 'USD', status: 'Completed', description: 'Freelance payment', referenceId: 'ref-6', createdAt: '2026-03-10T11:30:00Z' },
  { id: '7', walletId: 'w2', type: 'Withdrawal', amount: 450, currency: 'USD', status: 'Completed', description: 'Bill payment', referenceId: 'ref-7', createdAt: '2026-03-09T15:00:00Z' },
  { id: '8', walletId: 'w1', type: 'Transfer', amount: 10000, currency: 'USD', status: 'Completed', description: 'Investment', referenceId: 'ref-8', createdAt: '2026-03-08T09:00:00Z' },
];

export function TransactionsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [typeFilter, setTypeFilter] = useState<TransactionType | ''>('');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | ''>('');

  const { data } = useTransactions({
    page: page + 1,
    pageSize: rowsPerPage,
    type: typeFilter || undefined,
    status: statusFilter || undefined,
  });

  const transactions = data?.items ?? mockTransactions;
  const totalCount = data?.totalCount ?? mockTransactions.length;

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
        <CardContent sx={{ display: 'flex', gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
          <TextField
            select
            label="Type"
            size="small"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TransactionType | '')}
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
            onChange={(e) => setStatusFilter(e.target.value as TransactionStatus | '')}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Failed">Failed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </TextField>
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
                <TableCell>Reference</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} hover>
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
                  <TableCell>{tx.description}</TableCell>
                  <TableCell align="right">
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: 'monospace',
                        color: tx.type === 'Withdrawal' ? 'error.main' : 'success.main',
                      }}
                    >
                      {tx.type === 'Withdrawal' ? '-' : '+'}${tx.amount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <StatusChip status={tx.status} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {tx.referenceId}
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
