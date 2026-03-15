import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useCreateWallet } from '../hooks/useWallets';

const currencies = ['USD', 'EUR', 'GBP', 'BTC', 'ETH'] as const;

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  currency: z.enum(currencies),
});

type FormData = z.infer<typeof schema>;

interface CreateWalletDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

export function CreateWalletDialog({ open, onClose }: CreateWalletDialogProps) {
  const { mutate, isPending } = useCreateWallet();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', currency: 'USD' },
  });

  const onSubmit = (data: FormData) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Create Wallet</DialogTitle>
      <DialogContent>
        <TextField
          {...register('name')}
          label="Wallet Name"
          fullWidth
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
          sx={{ mt: 1, mb: 2.5 }}
        />
        <TextField
          {...register('currency')}
          select
          label="Currency"
          fullWidth
          defaultValue="USD"
          error={Boolean(errors.currency)}
          helperText={errors.currency?.message}
        >
          {currencies.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ cursor: 'pointer' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={isPending}
          sx={{ cursor: 'pointer' }}
        >
          {isPending ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
