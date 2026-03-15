import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { api } from '@/shared/api';
import { useWallets } from '@/features/wallets/hooks/useWallets';
import type { LedgerEntry, PaginatedResponse } from '@/shared/types';

export function LedgerPage() {
  const [searchParams] = useSearchParams();
  const initialWalletId = searchParams.get('walletId') ?? '';
  const initialTransactionId = searchParams.get('transactionId') ?? '';

  const [walletId, setWalletId] = useState(initialWalletId);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const { data: walletData } = useWallets();
  const walletOptions = walletData?.items ?? [];

  const { data, isLoading } = useQuery({
    queryKey: ['ledger', walletId, initialTransactionId, page + 1, rowsPerPage],
    queryFn: () => {
      const params = new URLSearchParams();
      params.set('page', String(page + 1));
      params.set('pageSize', String(rowsPerPage));
      if (walletId) params.set('walletId', walletId);
      if (initialTransactionId) params.set('transactionId', initialTransactionId);
      return api
        .get<PaginatedResponse<LedgerEntry>>(`/ledger?${params.toString()}`)
        .then((r) => r.data);
    },
    enabled: Boolean(walletId),
  });

  const entries = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Ledger</Typography>
        <Typography variant="body2">Immutable record of all financial entries</Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
          <TextField
            select
            label="Wallet"
            size="small"
            value={walletId}
            onChange={(e) => { setWalletId(e.target.value); setPage(0); }}
            sx={{ minWidth: 240 }}
          >
            <MenuItem value="">Select a wallet</MenuItem>
            {walletOptions.map((w) => (
              <MenuItem key={w.id} value={w.id}>
                {w.name} ({w.currency})
              </MenuItem>
            ))}
          </TextField>
        </CardContent>
      </Card>

      {!walletId ? (
        <Card>
          <CardContent sx={{ py: 6, textAlign: 'center' }}>
            <Typography color="text.secondary">Select a wallet to view ledger entries</Typography>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Reference</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Currency</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!isLoading && entries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">No ledger entries found</Typography>
                    </TableCell>
                  </TableRow>
                )}
                {entries.map((entry) => (
                  <TableRow key={entry.entryId} hover>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(entry.createdAt).toLocaleTimeString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={entry.entryType}
                        color={entry.entryType === 'Credit' ? 'success' : 'error'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{entry.description ?? '-'}</TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                        {entry.referenceId.slice(0, 8)}...
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontFamily: 'monospace',
                          color: entry.entryType === 'Credit' ? 'success.main' : 'error.main',
                        }}
                      >
                        {entry.entryType === 'Debit' ? '-' : '+'}{entry.amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>{entry.currency}</TableCell>
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
            rowsPerPageOptions={[10, 20, 50]}
          />
        </Card>
      )}
    </Box>
  );
}
