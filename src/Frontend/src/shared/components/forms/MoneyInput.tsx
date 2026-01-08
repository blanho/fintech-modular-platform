'use client';

import * as React from 'react';
import { Input } from '@/shared/components/ui/input';
import { cn } from '@/shared/lib/utils';

interface MoneyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  currency?: string;
  value?: string;
  onChange?: (value: string) => void;
  showCurrencySymbol?: boolean;
}

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CHF: 'CHF',
  CAD: 'C$',
  AUD: 'A$',
  SGD: 'S$',
};

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  (
    { currency = 'USD', value, onChange, showCurrencySymbol = true, className, ...props },
    ref
  ) => {
    const symbol = currencySymbols[currency] || currency;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

if (inputValue === '' || /^\d*\.?\d{0,4}$/.test(inputValue)) {
        onChange?.(inputValue);
      }
    };

    return (
      <div className="relative">
        {showCurrencySymbol && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">
            {symbol}
          </span>
        )}
        <Input
          ref={ref}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={handleChange}
          className={cn(showCurrencySymbol && 'pl-8', 'text-right font-mono', className)}
          placeholder="0.00"
          {...props}
        />
      </div>
    );
  }
);

MoneyInput.displayName = 'MoneyInput';