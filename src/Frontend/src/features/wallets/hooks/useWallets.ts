import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletsApi } from '../api/wallets.api';
import { walletKeys } from './keys';
import type { PaginationParams } from '@/shared/types/common';
import type { CreateWalletRequest } from '../api/wallets.types';

export function useWallets(params?: PaginationParams) {
  return useQuery({
    queryKey: walletKeys.list(JSON.stringify(params)),
    queryFn: () => walletsApi.getAll(params),
    staleTime: 30 * 1000,
  });
}

export function useWallet(walletId: string) {
  return useQuery({
    queryKey: walletKeys.detail(walletId),
    queryFn: () => walletsApi.getById(walletId),
    enabled: !!walletId,
  });
}

export function useWalletBalance(walletId: string) {
  return useQuery({
    queryKey: walletKeys.balance(walletId),
    queryFn: () => walletsApi.getBalance(walletId),
    enabled: !!walletId,
    refetchInterval: 60 * 1000,
  });
}

export function useCreateWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWalletRequest) => walletsApi.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: walletKeys.lists() });
      queryClient.setQueryData(
        walletKeys.detail(response.data.walletId),
        response
      );
    },
  });
}

export function useFreezeWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (walletId: string) => walletsApi.freeze(walletId),
    onSuccess: (_, walletId) => {
      queryClient.invalidateQueries({ queryKey: walletKeys.detail(walletId) });
      queryClient.invalidateQueries({ queryKey: walletKeys.lists() });
    },
  });
}

export function useUnfreezeWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (walletId: string) => walletsApi.unfreeze(walletId),
    onSuccess: (_, walletId) => {
      queryClient.invalidateQueries({ queryKey: walletKeys.detail(walletId) });
      queryClient.invalidateQueries({ queryKey: walletKeys.lists() });
    },
  });
}

export function useCloseWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (walletId: string) => walletsApi.close(walletId),
    onSuccess: (_, walletId) => {
      queryClient.invalidateQueries({ queryKey: walletKeys.detail(walletId) });
      queryClient.invalidateQueries({ queryKey: walletKeys.lists() });
    },
  });
}