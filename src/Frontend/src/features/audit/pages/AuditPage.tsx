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
import { auditApi } from '../api/auditApi';
import type { AuditEntry } from '@/shared/types';

const mockAudit: AuditEntry[] = [
  { id: '1', userId: 'u1', action: 'Wallet.Created', entityType: 'Wallet', entityId: 'w1', details: 'Created Main Account', ipAddress: '192.168.1.1', timestamp: '2026-03-14T10:00:00Z' },
  { id: '2', userId: 'u1', action: 'Transaction.Deposit', entityType: 'Transaction', entityId: 't1', details: 'Deposited $5,000', ipAddress: '192.168.1.1', timestamp: '2026-03-14T10:30:00Z' },
  { id: '3', userId: 'u1', action: 'User.Login', entityType: 'User', entityId: 'u1', details: 'Login from Chrome', ipAddress: '192.168.1.1', timestamp: '2026-03-14T09:00:00Z' },
  { id: '4', userId: 'u2', action: 'Transaction.Transfer', entityType: 'Transaction', entityId: 't2', details: 'Transfer $1,200 to Savings', ipAddress: '10.0.0.5', timestamp: '2026-03-13T14:20:00Z' },
  { id: '5', userId: 'u1', action: 'Wallet.Updated', entityType: 'Wallet', entityId: 'w2', details: 'Updated wallet name', ipAddress: '192.168.1.1', timestamp: '2026-03-13T12:00:00Z' },
];

export function AuditPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const { data } = useQuery({
    queryKey: ['audit', page + 1, rowsPerPage],
    queryFn: () => auditApi.list(page + 1, rowsPerPage),
  });

  const entries = data?.items ?? mockAudit;
  const totalCount = data?.totalCount ?? mockAudit.length;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Audit Log</Typography>
        <Typography variant="body2">Track all system activities and user actions</Typography>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Entity</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>IP Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id} hover>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={entry.action} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{entry.entityType}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                      {entry.entityId}
                    </Typography>
                  </TableCell>
                  <TableCell>{entry.details}</TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {entry.ipAddress}
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
