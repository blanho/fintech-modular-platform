import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletApi } from '../api/walletApi';
import type { CreateWalletRequest } from '@/shared/types';

export function useWallets() {
  return useQuery({
    queryKey: ['wallets'],
    queryFn: walletApi.list,
  });
}

export function useWallet(id: string) {
  return useQuery({
    queryKey: ['wallets', id],
    queryFn: () => walletApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWalletRequest) => walletApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wallets'] }),
  });
}
