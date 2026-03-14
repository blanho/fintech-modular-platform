import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { transferSchema, type TransferInput } from '../schemas';
import { useTransfer } from '../hooks/useTransactions';
import { useWallets } from '@/features/wallets';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { formatMoney } from '@/shared/lib/format';
import type { AxiosError } from 'axios';
import type { ApiError } from '@/shared/types/common';

export function TransferForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedSourceWallet = searchParams.get('from');

  const { data: walletsData, isLoading: isLoadingWallets } = useWallets();
  const transfer = useTransfer();

  const wallets = walletsData?.data || [];
  const activeWallets = wallets.filter((w) => w.status === 'active');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransferInput>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      sourceWalletId: preselectedSourceWallet || '',
      targetWalletId: '',
      amount: '',
      currency: '',
      description: '',
    },
  });

  const selectedSourceWalletId = watch('sourceWalletId');
  const sourceWallet = wallets.find((w) => w.walletId === selectedSourceWalletId);
  const targetWallets = activeWallets.filter((w) => w.walletId !== selectedSourceWalletId);

const handleSourceWalletChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const walletId = e.target.value;
    const wallet = wallets.find((w) => w.walletId === walletId);
    if (wallet) {
      setValue('currency', wallet.currency);
    }
  };

  const onSubmit = (data: TransferInput) => {
    transfer.mutate(data, {
      onSuccess: () => {
        navigate('/transactions');
      },
    });
  };

  const getErrorMessage = (error: unknown): string => {
    const axiosError = error as AxiosError<ApiError>;
    return axiosError.response?.data?.error?.message || 'Transfer failed';
  };

  if (isLoadingWallets) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Transfer Money</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sourceWalletId">From Wallet</Label>
            <select
              id="sourceWalletId"
              {...register('sourceWalletId')}
              onChange={(e) => {
                register('sourceWalletId').onChange(e);
                handleSourceWalletChange(e);
              }}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select source wallet</option>
              {activeWallets.map((wallet) => (
                <option key={wallet.walletId} value={wallet.walletId}>
                  {wallet.name} ({wallet.currency}) - {formatMoney(wallet.balance, wallet.currency)}
                </option>
              ))}
            </select>
            {errors.sourceWalletId && (
              <p className="text-sm text-red-500">{errors.sourceWalletId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetWalletId">To Wallet</Label>
            <select
              id="targetWalletId"
              {...register('targetWalletId')}
              disabled={!selectedSourceWalletId}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-gray-100"
            >
              <option value="">Select target wallet</option>
              {targetWallets
                .filter((w) => !sourceWallet || w.currency === sourceWallet.currency)
                .map((wallet) => (
                  <option key={wallet.walletId} value={wallet.walletId}>
                    {wallet.name} ({wallet.currency})
                  </option>
                ))}
            </select>
            {errors.targetWalletId && (
              <p className="text-sm text-red-500">{errors.targetWalletId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <Input
                id="amount"
                type="text"
                placeholder="0.00"
                {...register('amount')}
                className="pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                {sourceWallet?.currency || 'USD'}
              </span>
            </div>
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <input type="hidden" {...register('currency')} />

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              placeholder="What's this transfer for?"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          {transfer.isError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {getErrorMessage(transfer.error)}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={transfer.isPending} className="flex-1">
              {transfer.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                'Transfer'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}