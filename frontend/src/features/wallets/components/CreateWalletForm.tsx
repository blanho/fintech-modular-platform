import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateWallet } from '../hooks/useWallets';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import type { AxiosError } from 'axios';
import type { ApiError } from '@/shared/types/common';

const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'SGD'];

const createWalletSchema = z.object({
  currency: z.string().min(1, 'Currency is required'),
  name: z.string().max(100, 'Name is too long').optional(),
});

type CreateWalletInput = z.infer<typeof createWalletSchema>;

interface CreateWalletFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CreateWalletForm({ onSuccess, onCancel }: CreateWalletFormProps) {
  const createWallet = useCreateWallet();
  const [selectedCurrency, setSelectedCurrency] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateWalletInput>({
    resolver: zodResolver(createWalletSchema),
  });

  const onSubmit = (data: CreateWalletInput) => {
    createWallet.mutate(
      { currency: data.currency, name: data.name || undefined },
      { onSuccess }
    );
  };

  const getErrorMessage = (error: unknown): string => {
    const axiosError = error as AxiosError<ApiError>;
    return axiosError.response?.data?.error?.message || 'Failed to create wallet';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Currency</Label>
        <div className="grid grid-cols-4 gap-2">
          {SUPPORTED_CURRENCIES.map((currency) => (
            <button
              key={currency}
              type="button"
              onClick={() => {
                setSelectedCurrency(currency);
                setValue('currency', currency);
              }}
              className={`p-2 text-sm rounded-md border transition-colors ${
                selectedCurrency === currency
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {currency}
            </button>
          ))}
        </div>
        <input type="hidden" {...register('currency')} />
        {errors.currency && (
          <p className="text-sm text-red-500">{errors.currency.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Wallet Name (Optional)</Label>
        <Input
          id="name"
          placeholder={`My ${selectedCurrency || 'USD'} Wallet`}
          {...register('name')}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {createWallet.isError && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {getErrorMessage(createWallet.error)}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={createWallet.isPending} className="flex-1">
          {createWallet.isPending ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Creating...
            </>
          ) : (
            'Create Wallet'
          )}
        </Button>
      </div>
    </form>
  );
}