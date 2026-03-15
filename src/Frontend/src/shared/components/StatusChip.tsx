import Chip from '@mui/material/Chip';
import type { TransactionStatus, WalletStatus, ReportStatus } from '@/shared/types';

type ChipColor = 'success' | 'warning' | 'error' | 'default' | 'info';

const statusConfig: Record<string, { color: ChipColor; label: string }> = {
  Completed: { color: 'success', label: 'Completed' },
  Pending: { color: 'warning', label: 'Pending' },
  Failed: { color: 'error', label: 'Failed' },
  Cancelled: { color: 'default', label: 'Cancelled' },
  Active: { color: 'success', label: 'Active' },
  Frozen: { color: 'warning', label: 'Frozen' },
  Closed: { color: 'error', label: 'Closed' },
  Generating: { color: 'info', label: 'Generating' },
  Expired: { color: 'default', label: 'Expired' },
};

interface StatusChipProps {
  readonly status: TransactionStatus | WalletStatus | ReportStatus;
}

export function StatusChip({ status }: StatusChipProps) {
  const config = statusConfig[status] ?? { color: 'default' as ChipColor, label: status };
  return <Chip label={config.label} color={config.color} size="small" variant="outlined" />;
}
