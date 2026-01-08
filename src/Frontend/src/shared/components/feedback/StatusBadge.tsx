import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/components/ui/badge';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Pause,
  Ban,
  type LucideIcon,
} from 'lucide-react';

type StatusType =
  | 'success'
  | 'error'
  | 'warning'
  | 'pending'
  | 'info'
  | 'paused'
  | 'cancelled'
  | 'active'
  | 'inactive'
  | 'frozen'
  | 'closed';

interface StatusConfig {
  icon: LucideIcon;
  className: string;
  label: string;
}

const statusConfigs: Record<StatusType, StatusConfig> = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800 border-green-200',
    label: 'Success',
  },
  error: {
    icon: XCircle,
    className: 'bg-red-100 text-red-800 border-red-200',
    label: 'Error',
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    label: 'Warning',
  },
  pending: {
    icon: Clock,
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    label: 'Pending',
  },
  info: {
    icon: Clock,
    className: 'bg-gray-100 text-gray-800 border-gray-200',
    label: 'Info',
  },
  paused: {
    icon: Pause,
    className: 'bg-orange-100 text-orange-800 border-orange-200',
    label: 'Paused',
  },
  cancelled: {
    icon: Ban,
    className: 'bg-gray-100 text-gray-600 border-gray-200',
    label: 'Cancelled',
  },
  active: {
    icon: CheckCircle,
    className: 'bg-green-100 text-green-800 border-green-200',
    label: 'Active',
  },
  inactive: {
    icon: XCircle,
    className: 'bg-gray-100 text-gray-600 border-gray-200',
    label: 'Inactive',
  },
  frozen: {
    icon: Pause,
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    label: 'Frozen',
  },
  closed: {
    icon: Ban,
    className: 'bg-gray-100 text-gray-600 border-gray-200',
    label: 'Closed',
  },
};

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({
  status,
  label,
  showIcon = true,
  className,
}: StatusBadgeProps) {
  const config = statusConfigs[status];
  const Icon = config.icon;
  const displayLabel = label || config.label;

  return (
    <Badge variant="outline" className={cn('gap-1.5 font-medium', config.className, className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {displayLabel}
    </Badge>
  );
}

export function TransactionStatus({ status }: { status: 'completed' | 'pending' | 'failed' }) {
  const mapping: Record<string, StatusType> = {
    completed: 'success',
    pending: 'pending',
    failed: 'error',
  };
  const labels: Record<string, string> = {
    completed: 'Completed',
    pending: 'Pending',
    failed: 'Failed',
  };
  return <StatusBadge status={mapping[status]} label={labels[status]} />;
}

export function WalletStatus({ status }: { status: 'active' | 'frozen' | 'closed' }) {
  return <StatusBadge status={status} />;
}