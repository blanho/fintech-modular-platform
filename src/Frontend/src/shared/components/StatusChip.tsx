import Chip from '@mui/material/Chip';
import type { TransactionStatus } from '@/shared/types';

const statusConfig: Record<TransactionStatus, { color: 'success' | 'warning' | 'error' | 'default'; label: string }> = {
  Completed: { color: 'success', label: 'Completed' },
  Pending: { color: 'warning', label: 'Pending' },
  Failed: { color: 'error', label: 'Failed' },
  Cancelled: { color: 'default', label: 'Cancelled' },
};

interface StatusChipProps {
  readonly status: TransactionStatus;
}

export function StatusChip({ status }: StatusChipProps) {
  const config = statusConfig[status];
  return <Chip label={config.label} color={config.color} size="small" variant="outlined" />;
}
