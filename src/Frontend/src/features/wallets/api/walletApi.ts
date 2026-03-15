import { api } from '@/shared/api';
import type { Wallet, CreateWalletRequest } from '@/shared/types';

export const walletApi = {
  list: () => api.get<Wallet[]>('/wallets').then((r) => r.data),
  getById: (id: string) => api.get<Wallet>(`/wallets/${id}`).then((r) => r.data),
  create: (data: CreateWalletRequest) => api.post<Wallet>('/wallets', data).then((r) => r.data),
};
