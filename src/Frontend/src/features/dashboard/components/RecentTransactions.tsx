import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { StatusChip } from '@/shared/components';
import type { Transaction } from '@/shared/types';

const typeColors: Record<string, 'success' | 'error' | 'info'> = {
  Deposit: 'success',
  Withdrawal: 'error',
  Transfer: 'info',
};

interface RecentTransactionsProps {
  readonly transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recent Transactions
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} hover>
                  <TableCell>
                    <Chip
                      label={tx.type}
                      color={typeColors[tx.type] ?? 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                      {tx.type === 'Withdrawal' ? '-' : '+'}${tx.amount.toLocaleString()}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <StatusChip status={tx.status} />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
