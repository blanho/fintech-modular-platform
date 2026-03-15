import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Chip from '@mui/material/Chip';
import { api } from '@/shared/api';
import type { PaginatedResponse } from '@/shared/types';

interface LedgerEntry {
  id: string;
  walletId: string;
  entryType: 'Debit' | 'Credit';
  amount: number;
  balance: number;
  description: string;
  createdAt: string;
}

const mockLedger: LedgerEntry[] = [
  { id: '1', walletId: 'w1', entryType: 'Credit', amount: 5000, balance: 85240.50, description: 'Wire transfer deposit', createdAt: '2026-03-14T10:30:00Z' },
  { id: '2', walletId: 'w1', entryType: 'Debit', amount: 1200, balance: 80240.50, description: 'Transfer to savings', createdAt: '2026-03-13T14:20:00Z' },
  { id: '3', walletId: 'w2', entryType: 'Debit', amount: 800, balance: 31300.00, description: 'ATM withdrawal', createdAt: '2026-03-13T09:15:00Z' },
  { id: '4', walletId: 'w1', entryType: 'Credit', amount: 15000, balance: 81440.50, description: 'Salary deposit', createdAt: '2026-03-12T08:00:00Z' },
  { id: '5', walletId: 'w2', entryType: 'Credit', amount: 1200, balance: 32100.00, description: 'Transfer from main', createdAt: '2026-03-13T14:20:00Z' },
  { id: '6', walletId: 'w1', entryType: 'Debit', amount: 450, balance: 66440.50, description: 'Bill payment', createdAt: '2026-03-09T15:00:00Z' },
];

export function LedgerPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const { data } = useQuery({
    queryKey: ['ledger', page + 1, rowsPerPage],
    queryFn: () =>
      api
        .get<PaginatedResponse<LedgerEntry>>(`/ledger?page=${page + 1}&pageSize=${rowsPerPage}`)
        .then((r) => r.data),
  });

  const entries = data?.items ?? mockLedger;
  const totalCount = data?.totalCount ?? mockLedger.length;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Ledger</Typography>
        <Typography variant="body2">Immutable record of all financial entries</Typography>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id} hover>
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
                  <TableCell>{entry.description}</TableCell>
                  <TableCell align="right">
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontFamily: 'monospace',
                        color: entry.entryType === 'Credit' ? 'success.main' : 'error.main',
                      }}
                    >
                      {entry.entryType === 'Debit' ? '-' : '+'}${entry.amount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                      ${entry.balance.toLocaleString()}
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
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Card>
    </Box>
  );
}
