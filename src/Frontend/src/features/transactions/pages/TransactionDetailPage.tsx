import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { ArrowLeft } from 'lucide-react';
import { useTransaction } from '../hooks/useTransactions';
import { StatusChip } from '@/shared/components';

const typeColor: Record<string, 'success' | 'primary' | 'error'> = {
  Deposit: 'success',
  Transfer: 'primary',
  Withdrawal: 'error',
};

function getAmountColor(type: string): string {
  if (type === 'Deposit') return 'success.main';
  if (type === 'Withdrawal') return 'error.main';
  return 'text.primary';
}

function getAmountPrefix(type: string): string {
  if (type === 'Deposit') return '+';
  if (type === 'Withdrawal') return '-';
  return '';
}

export function TransactionDetailPage() {
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const { data: tx, isLoading } = useTransaction(transactionId ?? '');

  if (isLoading) {
    return <Box><Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} /></Box>;
  }
  if (!tx) {
    return <Alert severity="error">Transaction not found</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate('/transactions')}><ArrowLeft size={20} /></IconButton>
        <Typography variant="h5" sx={{ fontWeight: 700, flex: 1 }}>Transaction Details</Typography>
        <StatusChip status={tx.status} />
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Transaction ID</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all' }}>{tx.id}</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Type</Typography>
                  <Box sx={{ mt: 0.5 }}><Chip label={tx.type} color={typeColor[tx.type] ?? 'default'} size="small" /></Box>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Amount</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: getAmountColor(tx.type) }}>
                    {getAmountPrefix(tx.type)}{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {tx.currency}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Created</Typography>
                  <Typography variant="body2">{new Date(tx.createdAt).toLocaleString()}</Typography>
                </Grid>
                {tx.completedAt && (
                  <Grid size={6}>
                    <Typography variant="caption" color="text.secondary">Completed</Typography>
                    <Typography variant="body2">{new Date(tx.completedAt).toLocaleString()}</Typography>
                  </Grid>
                )}
                {tx.sourceWalletId && (
                  <Grid size={6}>
                    <Typography variant="caption" color="text.secondary">Source Wallet</Typography>
                    <Typography
                      variant="body2" sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
                      onClick={() => navigate(`/wallets/${tx.sourceWalletId}`)}
                    >
                      {tx.sourceWalletId}
                    </Typography>
                  </Grid>
                )}
                {tx.targetWalletId && (
                  <Grid size={6}>
                    <Typography variant="caption" color="text.secondary">Target Wallet</Typography>
                    <Typography
                      variant="body2" sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
                      onClick={() => navigate(`/wallets/${tx.targetWalletId}`)}
                    >
                      {tx.targetWalletId}
                    </Typography>
                  </Grid>
                )}
                {tx.description && (
                  <Grid size={12}>
                    <Typography variant="caption" color="text.secondary">Description</Typography>
                    <Typography variant="body2">{tx.description}</Typography>
                  </Grid>
                )}
                {tx.failureReason && (
                  <Grid size={12}>
                    <Alert severity="error" sx={{ mt: 1 }}>
                      <Typography variant="subtitle2">Failure Reason</Typography>
                      <Typography variant="body2">{tx.failureReason}</Typography>
                    </Alert>
                  </Grid>
                )}
                {tx.idempotencyKey && (
                  <Grid size={12}>
                    <Typography variant="caption" color="text.secondary">Idempotency Key</Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{tx.idempotencyKey}</Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            {tx.sourceWalletId && (
              <Button variant="outlined" size="small" onClick={() => navigate(`/ledger?walletId=${tx.sourceWalletId}&transactionId=${tx.id}`)}>
                View Ledger Entries
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
