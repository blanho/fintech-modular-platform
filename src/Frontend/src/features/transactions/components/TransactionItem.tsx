import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, ChevronRight } from 'lucide-react';
import type { Transaction } from '../api/transactions.types';
import { Badge } from '@/shared/components/ui/badge';
import { formatMoney, formatRelativeTime } from '@/shared/lib/format';

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const typeConfig = {
    deposit: {
      icon: ArrowDownLeft,
      label: 'Deposit',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    withdrawal: {
      icon: ArrowUpRight,
      label: 'Withdrawal',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    transfer: {
      icon: ArrowRightLeft,
      label: 'Transfer',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  };

  const statusConfig = {
    pending: { variant: 'warning' as const, label: 'Pending' },
    completed: { variant: 'success' as const, label: 'Completed' },
    failed: { variant: 'destructive' as const, label: 'Failed' },
  };

  const type = typeConfig[transaction.type];
  const status = statusConfig[transaction.status];
  const TypeIcon = type.icon;

  const isIncoming = transaction.type === 'deposit';
  const amountPrefix = isIncoming ? '+' : '-';
  const amountColor = isIncoming ? 'text-green-600' : 'text-gray-900';

  return (
    <Link
      to={`/transactions/${transaction.transactionId}`}
      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
    >
      <div className={`p-2 rounded-full ${type.bgColor}`}>
        <TypeIcon className={`h-5 w-5 ${type.color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium">{type.label}</p>
          <Badge variant={status.variant} className="text-xs">
            {status.label}
          </Badge>
        </div>
        <p className="text-sm text-gray-500 truncate">
          {transaction.description || `${type.label} transaction`}
        </p>
      </div>

      <div className="text-right">
        <p className={`font-semibold ${amountColor}`}>
          {amountPrefix}{formatMoney(transaction.amount, transaction.currency)}
        </p>
        <p className="text-sm text-gray-500">{formatRelativeTime(transaction.createdAt)}</p>
      </div>

      <ChevronRight className="h-5 w-5 text-gray-400" />
    </Link>
  );
}