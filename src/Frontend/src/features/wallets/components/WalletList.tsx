import { Plus } from 'lucide-react';
import { WalletCard } from './WalletCard';
import { useWallets } from '../hooks/useWallets';
import { Button } from '@/shared/components/ui/button';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { ErrorDisplay } from '@/shared/components/feedback/ErrorDisplay';

interface WalletListProps {
  onCreateWallet: () => void;
}

export function WalletList({ onCreateWallet }: WalletListProps) {
  const { data, isLoading, isError, error, refetch } = useWallets();
  const wallets = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorDisplay
        message={error?.message || 'Failed to load wallets'}
        onRetry={refetch}
      />
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No wallets yet</h3>
        <p className="text-gray-500 mb-4">Get started by creating your first wallet.</p>
        <Button onClick={onCreateWallet}>
          <Plus className="h-4 w-4 mr-2" />
          Create Wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {wallets.map((wallet) => (
        <WalletCard key={wallet.walletId} wallet={wallet} />
      ))}
    </div>
  );
}