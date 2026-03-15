import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import { ArrowLeft, Snowflake, Sun, XCircle, Pencil } from 'lucide-react';
import { useWallet, useWalletBalance, useFreezeWallet, useUnfreezeWallet, useCloseWallet, useRenameWallet } from '../hooks/useWallets';
import { getErrorMessage } from '@/shared/lib/errorMessages';
import { PermissionGate } from '@/shared/components';

const statusColor: Record<string, 'success' | 'warning' | 'error'> = {
  Active: 'success',
  Frozen: 'warning',
  Closed: 'error',
};

export function WalletDetailPage() {
  const { walletId } = useParams<{ walletId: string }>();
  const navigate = useNavigate();
  const { data: wallet, isLoading } = useWallet(walletId ?? '');
  const { data: balanceData } = useWalletBalance(walletId ?? '');
  const freezeWallet = useFreezeWallet();
  const unfreezeWallet = useUnfreezeWallet();
  const closeWallet = useCloseWallet();
  const renameWallet = useRenameWallet();

  const [renameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [confirmClose, setConfirmClose] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const showSuccess = (message: string) => setSnackbar({ open: true, message, severity: 'success' });
  const showError = (err: unknown) => setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' });

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="rectangular" height={200} sx={{ mt: 2, borderRadius: 2 }} />
      </Box>
    );
  }

  if (!wallet) {
    return <Alert severity="error">Wallet not found</Alert>;
  }

  const balance = balanceData?.balance ?? wallet.balance ?? 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate('/wallets')}>
          <ArrowLeft size={20} />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 700, flex: 1 }}>{wallet.name}</Typography>
        <Chip label={wallet.status} color={statusColor[wallet.status] ?? 'default'} />
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Balance</Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mt: 1 }}>
                {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                <Typography component="span" variant="h5" color="text.secondary" sx={{ ml: 1 }}>
                  {wallet.currency}
                </Typography>
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Wallet Details</Typography>
              <Grid container spacing={2}>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Wallet ID</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{wallet.id}</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Currency</Typography>
                  <Typography variant="body2">{wallet.currency}</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Created</Typography>
                  <Typography variant="body2">{new Date(wallet.createdAt).toLocaleString()}</Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="caption" color="text.secondary">Last Updated</Typography>
                  <Typography variant="body2">{wallet.updatedAt ? new Date(wallet.updatedAt).toLocaleString() : 'Never'}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Actions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <PermissionGate permission="wallets:write">
                  <Button
                    fullWidth variant="outlined" startIcon={<Pencil size={16} />}
                    disabled={wallet.status === 'Closed'}
                    onClick={() => { setNewName(wallet.name); setRenameOpen(true); }}
                  >
                    Rename Wallet
                  </Button>
                </PermissionGate>

                <PermissionGate permission="wallets:manage">
                  {wallet.status === 'Active' && (
                    <Button
                      fullWidth variant="outlined" color="warning" startIcon={<Snowflake size={16} />}
                      disabled={freezeWallet.isPending}
                      onClick={() => {
                        freezeWallet.mutate(wallet.id, {
                          onSuccess: () => showSuccess('Wallet frozen'),
                          onError: showError,
                        });
                      }}
                    >
                      Freeze Wallet
                    </Button>
                  )}
                  {wallet.status === 'Frozen' && (
                    <Button
                      fullWidth variant="outlined" color="info" startIcon={<Sun size={16} />}
                      disabled={unfreezeWallet.isPending}
                      onClick={() => {
                        unfreezeWallet.mutate(wallet.id, {
                          onSuccess: () => showSuccess('Wallet unfrozen'),
                          onError: showError,
                        });
                      }}
                    >
                      Unfreeze Wallet
                    </Button>
                  )}
                  {wallet.status !== 'Closed' && (
                    <Button
                      fullWidth variant="outlined" color="error" startIcon={<XCircle size={16} />}
                      onClick={() => setConfirmClose(true)}
                    >
                      Close Wallet
                    </Button>
                  )}
                </PermissionGate>

                <Button fullWidth variant="text" onClick={() => navigate(`/transactions?walletId=${wallet.id}`)}>
                  View Transactions
                </Button>
                <Button fullWidth variant="text" onClick={() => navigate(`/ledger?walletId=${wallet.id}`)}>
                  View Ledger
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={renameOpen} onClose={() => setRenameOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Rename Wallet</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth autoFocus label="New Name" value={newName}
            onChange={(e) => setNewName(e.target.value)} sx={{ mt: 1 }}
            slotProps={{ htmlInput: { maxLength: 100 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!newName.trim() || renameWallet.isPending}
            onClick={() => {
              renameWallet.mutate({ id: wallet.id, data: { name: newName.trim() } }, {
                onSuccess: () => { setRenameOpen(false); showSuccess('Wallet renamed'); },
                onError: showError,
              });
            }}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmClose} onClose={() => setConfirmClose(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Close Wallet</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mt: 1 }}>
            This action cannot be undone. The wallet must have a zero balance to be closed.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmClose(false)}>Cancel</Button>
          <Button
            variant="contained" color="error"
            disabled={closeWallet.isPending}
            onClick={() => {
              closeWallet.mutate(wallet.id, {
                onSuccess: () => { setConfirmClose(false); showSuccess('Wallet closed'); },
                onError: showError,
              });
            }}
          >
            Close Wallet
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open} autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
