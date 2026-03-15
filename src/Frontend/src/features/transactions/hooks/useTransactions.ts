import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionApi } from '../api/transactionApi';
import type { TransactionFilters, DepositRequest, WithdrawRequest, TransferRequest } from '@/shared/types';

export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionApi.list(filters),
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: ['transactions', id],
    queryFn: () => transactionApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: DepositRequest) => transactionApi.deposit(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['transactions'] });
      void qc.invalidateQueries({ queryKey: ['wallets'] });
      void qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useWithdraw() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: WithdrawRequest) => transactionApi.withdraw(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['transactions'] });
      void qc.invalidateQueries({ queryKey: ['wallets'] });
      void qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: TransferRequest) => transactionApi.transfer(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['transactions'] });
      void qc.invalidateQueries({ queryKey: ['wallets'] });
      void qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
