import { useForm, Controller } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useState, useMemo } from 'react';
import { useDeposit, useWithdraw, useTransfer } from '../hooks/useTransactions';
import { useWallets } from '@/features/wallets/hooks/useWallets';
import type { Wallet } from '@/shared/types';

interface DepositWithdrawForm {
  walletId: string;
  amount: string;
  description: string;
}

interface TransferFormData {
  sourceWalletId: string;
  targetWalletId: string;
  amount: string;
  description: string;
}

interface TransactionDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

function getWalletCurrency(wallets: Wallet[], walletId: string): string {
  return wallets.find((w) => w.id === walletId)?.currency ?? 'USD';
}

export function TransactionDialog({ open, onClose }: TransactionDialogProps) {
  const [tab, setTab] = useState(0);
  const { data: walletData } = useWallets();
  const deposit = useDeposit();
  const withdraw = useWithdraw();
  const transfer = useTransfer();

  const walletOptions = useMemo(
    () => (walletData?.items ?? []).filter((w) => w.status === 'Active'),
    [walletData],
  );

  const depositForm = useForm<DepositWithdrawForm>({
    defaultValues: { walletId: '', amount: '', description: '' },
  });

  const transferForm = useForm<TransferFormData>({
    defaultValues: { sourceWalletId: '', targetWalletId: '', amount: '', description: '' },
  });

  const handleClose = () => {
    depositForm.reset();
    transferForm.reset();
    onClose();
  };

  const handleDeposit = (data: DepositWithdrawForm) => {
    const currency = getWalletCurrency(walletOptions, data.walletId);
    deposit.mutate(
      {
        walletId: data.walletId,
        amount: data.amount,
        currency,
        description: data.description || undefined,
        idempotencyKey: crypto.randomUUID(),
      },
      { onSuccess: handleClose },
    );
  };

  const handleWithdraw = (data: DepositWithdrawForm) => {
    const currency = getWalletCurrency(walletOptions, data.walletId);
    withdraw.mutate(
      {
        walletId: data.walletId,
        amount: data.amount,
        currency,
        description: data.description || undefined,
        idempotencyKey: crypto.randomUUID(),
      },
      { onSuccess: handleClose },
    );
  };

  const handleTransfer = (data: TransferFormData) => {
    const currency = getWalletCurrency(walletOptions, data.sourceWalletId);
    transfer.mutate(
      {
        sourceWalletId: data.sourceWalletId,
        targetWalletId: data.targetWalletId,
        amount: data.amount,
        currency,
        description: data.description || undefined,
        idempotencyKey: crypto.randomUUID(),
      },
      { onSuccess: handleClose },
    );
  };

  const isPending = deposit.isPending || withdraw.isPending || transfer.isPending;
  const error = deposit.error ?? withdraw.error ?? transfer.error;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Transaction</DialogTitle>
      <DialogContent>
        <Tabs
          value={tab}
          onChange={(_, v: number) => setTab(v)}
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Deposit" sx={{ cursor: 'pointer' }} />
          <Tab label="Withdraw" sx={{ cursor: 'pointer' }} />
          <Tab label="Transfer" sx={{ cursor: 'pointer' }} />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {(error as Error).message ?? 'Transaction failed'}
          </Alert>
        )}

        {(tab === 0 || tab === 1) && (
          <Box component="form">
            <Controller
              name="walletId"
              control={depositForm.control}
              rules={{ required: 'Select a wallet' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  label="Wallet"
                  fullWidth
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  sx={{ mb: 2.5 }}
                >
                  {walletOptions.map((w) => (
                    <MenuItem key={w.id} value={w.id}>
                      {w.name} ({w.currency})
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <TextField
              {...depositForm.register('amount', {
                required: 'Amount is required',
                validate: (v) => {
                  const num = Number(v);
                  if (Number.isNaN(num) || num <= 0) return 'Must be a positive number';
                  return true;
                },
              })}
              label="Amount"
              fullWidth
              placeholder="0.00"
              error={Boolean(depositForm.formState.errors.amount)}
              helperText={depositForm.formState.errors.amount?.message}
              sx={{ mb: 2.5 }}
            />
            <TextField
              {...depositForm.register('description')}
              label="Description (optional)"
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        )}

        {tab === 2 && (
          <Box component="form">
            <Controller
              name="sourceWalletId"
              control={transferForm.control}
              rules={{ required: 'Select source wallet' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  label="From Wallet"
                  fullWidth
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  sx={{ mb: 2.5 }}
                >
                  {walletOptions.map((w) => (
                    <MenuItem key={w.id} value={w.id}>
                      {w.name} ({w.currency})
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="targetWalletId"
              control={transferForm.control}
              rules={{
                required: 'Select destination wallet',
                validate: (v) =>
                  v !== transferForm.getValues('sourceWalletId') || 'Source and target wallet must be different',
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  label="To Wallet"
                  fullWidth
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  sx={{ mb: 2.5 }}
                >
                  {walletOptions.map((w) => (
                    <MenuItem key={w.id} value={w.id}>
                      {w.name} ({w.currency})
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <TextField
              {...transferForm.register('amount', {
                required: 'Amount is required',
                validate: (v) => {
                  const num = Number(v);
                  if (Number.isNaN(num) || num <= 0) return 'Must be a positive number';
                  return true;
                },
              })}
              label="Amount"
              fullWidth
              placeholder="0.00"
              error={Boolean(transferForm.formState.errors.amount)}
              helperText={transferForm.formState.errors.amount?.message}
              sx={{ mb: 2.5 }}
            />
            <TextField
              {...transferForm.register('description')}
              label="Description (optional)"
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} sx={{ cursor: 'pointer' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={isPending}
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            if (tab === 0) void depositForm.handleSubmit(handleDeposit)();
            else if (tab === 1) void depositForm.handleSubmit(handleWithdraw)();
            else void transferForm.handleSubmit(handleTransfer)();
          }}
        >
          {isPending ? 'Processing...' : tab === 0 ? 'Deposit' : tab === 1 ? 'Withdraw' : 'Transfer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
