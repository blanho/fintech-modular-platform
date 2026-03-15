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
import { useState } from 'react';
import { useDeposit, useWithdraw, useTransfer } from '../hooks/useTransactions';
import { useWallets } from '@/features/wallets/hooks/useWallets';

interface DepositForm {
  walletId: string;
  amount: number;
  description: string;
}

interface TransferForm {
  sourceWalletId: string;
  destinationWalletId: string;
  amount: number;
  description: string;
}

interface TransactionDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

export function TransactionDialog({ open, onClose }: TransactionDialogProps) {
  const [tab, setTab] = useState(0);
  const { data: wallets } = useWallets();
  const deposit = useDeposit();
  const withdraw = useWithdraw();
  const transfer = useTransfer();

  const depositForm = useForm<DepositForm>({
    defaultValues: { walletId: '', amount: 0, description: '' },
  });

  const transferForm = useForm<TransferForm>({
    defaultValues: { sourceWalletId: '', destinationWalletId: '', amount: 0, description: '' },
  });

  const handleDeposit = (data: DepositForm) => {
    deposit.mutate(data, {
      onSuccess: () => {
        depositForm.reset();
        onClose();
      },
    });
  };

  const handleWithdraw = (data: DepositForm) => {
    withdraw.mutate(data, {
      onSuccess: () => {
        depositForm.reset();
        onClose();
      },
    });
  };

  const handleTransfer = (data: TransferForm) => {
    transfer.mutate(data, {
      onSuccess: () => {
        transferForm.reset();
        onClose();
      },
    });
  };

  const isPending = deposit.isPending || withdraw.isPending || transfer.isPending;
  const walletOptions = wallets ?? [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
                valueAsNumber: true,
                required: 'Amount is required',
                min: { value: 0.01, message: 'Must be positive' },
              })}
              label="Amount"
              type="number"
              fullWidth
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
              name="destinationWalletId"
              control={transferForm.control}
              rules={{ required: 'Select destination wallet' }}
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
                valueAsNumber: true,
                required: 'Amount is required',
                min: { value: 0.01, message: 'Must be positive' },
              })}
              label="Amount"
              type="number"
              fullWidth
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
        <Button onClick={onClose} sx={{ cursor: 'pointer' }}>
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
