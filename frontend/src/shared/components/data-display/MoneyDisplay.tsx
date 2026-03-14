import { formatMoney } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';

interface MoneyDisplayProps {
  amount: string | number;
  currency: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSign?: boolean;
  colorize?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl font-semibold',
  xl: 'text-3xl font-bold',
};

export function MoneyDisplay({
  amount,
  currency,
  size = 'md',
  showSign = false,
  colorize = false,
  className,
}: MoneyDisplayProps) {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const isPositive = numericAmount > 0;
  const isNegative = numericAmount < 0;

  const formattedAmount = formatMoney(Math.abs(numericAmount), currency);
  const sign = showSign && isPositive ? '+' : isNegative ? '-' : '';

  const colorClass = colorize
    ? isPositive
      ? 'text-green-600'
      : isNegative
        ? 'text-red-600'
        : ''
    : '';

  return (
    <span className={cn('font-mono tabular-nums', sizeClasses[size], colorClass, className)}>
      {sign}
      {formattedAmount}
    </span>
  );
}