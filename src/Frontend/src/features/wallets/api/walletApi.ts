import { api } from '@/shared/api';
import type { Wallet, WalletBalance, CreateWalletRequest, RenameWalletRequest, PaginatedResponse } from '@/shared/types';

export const walletApi = {
  list: (page = 1, pageSize = 20) =>
    api.get<PaginatedResponse<Wallet>>(`/wallets?page=${page}&pageSize=${pageSize}`).then((r) => r.data),

  getById: (id: string) =>
    api.get<Wallet>(`/wallets/${id}`).then((r) => r.data),

  getBalance: (id: string) =>
    api.get<WalletBalance>(`/wallets/${id}/balance`).then((r) => r.data),

  create: (data: CreateWalletRequest) =>
    api.post<Wallet>('/wallets', data).then((r) => r.data),

  rename: (id: string, data: RenameWalletRequest) =>
    api.patch<Wallet>(`/wallets/${id}`, data).then((r) => r.data),

  freeze: (id: string) =>
    api.post<Wallet>(`/wallets/${id}/freeze`).then((r) => r.data),

  unfreeze: (id: string) =>
    api.post<Wallet>(`/wallets/${id}/unfreeze`).then((r) => r.data),

  close: (id: string) =>
    api.post<Wallet>(`/wallets/${id}/close`).then((r) => r.data),
};
