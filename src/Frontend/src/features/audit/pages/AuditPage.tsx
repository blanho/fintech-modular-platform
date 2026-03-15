import { useState } from 'react';
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
import { useAuditLog } from '../hooks/useAudit';
import type { ActionType } from '@/shared/types';

const actionTypeColors: Record<ActionType, 'success' | 'info' | 'warning' | 'error' | 'default' | 'primary' | 'secondary'> = {
  Create: 'success',
  Update: 'info',
  Delete: 'error',
  Execute: 'primary',
  Query: 'default',
  Login: 'secondary',
  Logout: 'secondary',
  Export: 'warning',
};

export function AuditPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [actionType, setActionType] = useState('');
  const [resourceType, setResourceType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data, isLoading } = useAuditLog({
    page: page + 1,
    pageSize: rowsPerPage,
    actionType: actionType || undefined,
    resourceType: resourceType || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const entries = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Audit Log</Typography>
        <Typography variant="body2">Track all system activities and user actions</Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 2, p: 2, '&:last-child': { pb: 2 }, flexWrap: 'wrap' }}>
          <TextField
            select
            label="Action Type"
            size="small"
            value={actionType}
            onChange={(e) => { setActionType(e.target.value); setPage(0); }}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All Actions</MenuItem>
            {(['Create', 'Update', 'Delete', 'Execute', 'Query', 'Login', 'Logout', 'Export'] as const).map((a) => (
              <MenuItem key={a} value={a}>{a}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Resource Type"
            size="small"
            value={resourceType}
            onChange={(e) => { setResourceType(e.target.value); setPage(0); }}
            placeholder="e.g. Wallet, Transaction"
            sx={{ minWidth: 180 }}
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
                <TableCell>Timestamp</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Resource</TableCell>
                <TableCell>Module</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>IP Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!isLoading && entries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No audit entries found</Typography>
                  </TableCell>
                </TableRow>
              )}
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
                    <Chip
                      label={entry.actionType}
                      color={actionTypeColors[entry.actionType] ?? 'default'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{entry.resourceType}</Typography>
                    {entry.resourceId && (
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                        {entry.resourceId.slice(0, 8)}...
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{entry.module}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {entry.description ?? '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {entry.durationMs}ms
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={entry.isSuccess ? 'Success' : 'Failed'}
                      color={entry.isSuccess ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {entry.ipAddress ?? '-'}
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
