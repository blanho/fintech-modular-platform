import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletApi } from '../api/walletApi';
import type { CreateWalletRequest, RenameWalletRequest } from '@/shared/types';

export function useWallets(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['wallets', page, pageSize],
    queryFn: () => walletApi.list(page, pageSize),
  });
}

export function useWallet(id: string) {
  return useQuery({
    queryKey: ['wallets', id],
    queryFn: () => walletApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useWalletBalance(id: string) {
  return useQuery({
    queryKey: ['wallets', id, 'balance'],
    queryFn: () => walletApi.getBalance(id),
    enabled: Boolean(id),
    refetchInterval: 30_000,
  });
}

export function useCreateWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWalletRequest) => walletApi.create(data),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['wallets'] }); },
  });
}

export function useRenameWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RenameWalletRequest }) => walletApi.rename(id, data),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['wallets'] }); },
  });
}

export function useFreezeWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => walletApi.freeze(id),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['wallets'] }); },
  });
}

export function useUnfreezeWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => walletApi.unfreeze(id),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['wallets'] }); },
  });
}

export function useCloseWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => walletApi.close(id),
    onSuccess: () => { void qc.invalidateQueries({ queryKey: ['wallets'] }); },
  });
}
