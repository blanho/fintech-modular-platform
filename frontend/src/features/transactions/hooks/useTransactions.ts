import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionsApi } from '../api/transactions.api';
import { transactionKeys } from './keys';
import { walletKeys } from '@/features/wallets/hooks/keys';
import type {
  TransactionFilters,
  TransferRequest,
  DepositRequest,
  WithdrawRequest,
} from '../api/transactions.types';

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => transactionsApi.getAll(filters),
  });
}

export function useTransaction(transactionId: string) {
  return useQuery({
    queryKey: transactionKeys.detail(transactionId),
    queryFn: () => transactionsApi.getById(transactionId),
    enabled: !!transactionId,
  });
}

export function useWalletTransactions(walletId: string, filters?: Omit<TransactionFilters, 'walletId'>) {
  return useQuery({
    queryKey: [...transactionKeys.byWallet(walletId), filters],
    queryFn: () => transactionsApi.getByWallet(walletId, filters),
    enabled: !!walletId,
  });
}

export function useTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransferRequest) => transactionsApi.transfer(data),
    onSuccess: (_, variables) => {

      queryClient.invalidateQueries({ queryKey: walletKeys.balance(variables.sourceWalletId) });
      queryClient.invalidateQueries({ queryKey: walletKeys.balance(variables.targetWalletId) });

      queryClient.invalidateQueries({ queryKey: walletKeys.lists() });

      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
}

export function useDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DepositRequest) => transactionsApi.deposit(data),
    onSuccess: (_, variables) => {

      queryClient.invalidateQueries({ queryKey: walletKeys.balance(variables.walletId) });

      queryClient.invalidateQueries({ queryKey: walletKeys.lists() });

      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
}

export function useWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WithdrawRequest) => transactionsApi.withdraw(data),
    onSuccess: (_, variables) => {

      queryClient.invalidateQueries({ queryKey: walletKeys.balance(variables.walletId) });

      queryClient.invalidateQueries({ queryKey: walletKeys.lists() });

      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
}