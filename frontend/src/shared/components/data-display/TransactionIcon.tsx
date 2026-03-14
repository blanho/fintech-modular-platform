import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, type LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type TransactionType = 'credit' | 'debit' | 'transfer' | 'deposit' | 'withdrawal';

interface TransactionIconProps {
  type: TransactionType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const iconMap: Record<TransactionType, LucideIcon> = {
  credit: ArrowDownLeft,
  debit: ArrowUpRight,
  transfer: ArrowRightLeft,
  deposit: ArrowDownLeft,
  withdrawal: ArrowUpRight,
};

const colorMap: Record<TransactionType, string> = {
  credit: 'bg-green-100 text-green-600',
  debit: 'bg-red-100 text-red-600',
  transfer: 'bg-blue-100 text-blue-600',
  deposit: 'bg-green-100 text-green-600',
  withdrawal: 'bg-red-100 text-red-600',
};

const sizeMap = {
  sm: { container: 'h-8 w-8', icon: 'h-4 w-4' },
  md: { container: 'h-10 w-10', icon: 'h-5 w-5' },
  lg: { container: 'h-12 w-12', icon: 'h-6 w-6' },
};

export function TransactionIcon({ type, size = 'md', className }: TransactionIconProps) {
  const Icon = iconMap[type];
  const colors = colorMap[type];
  const sizes = sizeMap[size];

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full',
        colors,
        sizes.container,
        className
      )}
    >
      <Icon className={sizes.icon} />
    </div>
  );
}