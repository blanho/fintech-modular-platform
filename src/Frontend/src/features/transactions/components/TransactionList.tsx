import { TransactionItem } from './TransactionItem';
import { useTransactions } from '../hooks/useTransactions';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { ErrorDisplay } from '@/shared/components/feedback/ErrorDisplay';
import type { TransactionFilters } from '../api/transactions.types';

interface TransactionListProps {
  filters?: TransactionFilters;
  limit?: number;
}

export function TransactionList({ filters, limit }: TransactionListProps) {
  const { data, isLoading, isError, error, refetch } = useTransactions(filters);
  let transactions = data?.data || [];

  if (limit) {
    transactions = transactions.slice(0, limit);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorDisplay
        message={error?.message || 'Failed to load transactions'}
        onRetry={refetch}
      />
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {transactions.map((transaction) => (
        <TransactionItem key={transaction.transactionId} transaction={transaction} />
      ))}
    </div>
  );
}