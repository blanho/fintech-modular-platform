import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import { Plus, Wallet as WalletIcon } from 'lucide-react';
import { alpha } from '@mui/material/styles';
import { useWallets } from '../hooks/useWallets';
import { CreateWalletDialog } from '../components/CreateWalletDialog';
import { EmptyState, StatusChip } from '@/shared/components';
import type { Wallet } from '@/shared/types';

function WalletCard({ wallet, onClick }: { readonly wallet: Wallet; readonly onClick: () => void }) {
  const isCrypto = wallet.currency === 'BTC' || wallet.currency === 'ETH';
  const formatted = isCrypto
    ? `${wallet.balance.toFixed(4)} ${wallet.currency}`
    : `$${wallet.balance.toLocaleString()}`;

  return (
    <Card>
      <CardActionArea onClick={onClick} sx={{ cursor: 'pointer' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: (t) => alpha(t.palette.primary.main, 0.1),
                color: 'primary.main',
              }}
            >
              <WalletIcon size={20} />
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <StatusChip status={wallet.status} />
              <Chip label={wallet.currency} size="small" variant="outlined" />
            </Box>
          </Box>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {wallet.name}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
            {formatted}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Updated {wallet.updatedAt ? new Date(wallet.updatedAt).toLocaleDateString() : 'N/A'}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export function WalletsPage() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, isLoading } = useWallets();
  const wallets = data?.items ?? [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Wallets</Typography>
          <Typography variant="body2">Manage your digital wallets</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={16} />}
          onClick={() => setDialogOpen(true)}
          sx={{ cursor: 'pointer' }}
        >
          Create Wallet
        </Button>
      </Box>

      {isLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Skeleton variant="circular" width={44} height={44} />
                  <Skeleton variant="text" width="60%" sx={{ mt: 2 }} />
                  <Skeleton variant="text" width="40%" height={32} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : wallets.length === 0 ? (
        <EmptyState
          title="No wallets yet"
          description="Create your first wallet to start managing your finances."
          actionLabel="Create Wallet"
          onAction={() => setDialogOpen(true)}
        />
      ) : (
        <Grid container spacing={3}>
          {wallets.map((w) => (
            <Grid key={w.id} size={{ xs: 12, sm: 6, lg: 3 }}>
              <WalletCard wallet={w} onClick={() => navigate(`/wallets/${w.id}`)} />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateWalletDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Box>
  );
}
