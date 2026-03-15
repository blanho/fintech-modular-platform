import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionApi } from '../api/transactionApi';
import type { DepositRequest, WithdrawRequest, TransferRequest } from '@/shared/types';

interface TransactionFilters {
  page?: number;
  pageSize?: number;
  type?: string;
  status?: string;
  walletId?: string;
}

export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionApi.list(filters),
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
