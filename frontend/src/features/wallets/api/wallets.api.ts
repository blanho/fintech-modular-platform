import apiClient from '@/shared/api/client';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/shared/types/common';
import type {
  Wallet,
  WalletBalance,
  CreateWalletRequest,
  RenameWalletRequest,
} from './wallets.types';

export const walletsApi = {
  getAll: async (params?: PaginationParams): Promise<PaginatedResponse<Wallet>> => {
    const response = await apiClient.get('/wallets', { params });
    return response.data;
  },

  getById: async (walletId: string): Promise<ApiResponse<Wallet>> => {
    const response = await apiClient.get(`/wallets/${walletId}`);
    return response.data;
  },

  getBalance: async (walletId: string): Promise<ApiResponse<WalletBalance>> => {
    const response = await apiClient.get(`/wallets/${walletId}/balance`);
    return response.data;
  },

  create: async (data: CreateWalletRequest): Promise<ApiResponse<Wallet>> => {
    const response = await apiClient.post('/wallets', data);
    return response.data;
  },

  rename: async (walletId: string, data: RenameWalletRequest): Promise<ApiResponse<Wallet>> => {
    const response = await apiClient.patch(`/wallets/${walletId}`, data);
    return response.data;
  },

  freeze: async (walletId: string): Promise<ApiResponse<Wallet>> => {
    const response = await apiClient.post(`/wallets/${walletId}/freeze`);
    return response.data;
  },

  unfreeze: async (walletId: string): Promise<ApiResponse<Wallet>> => {
    const response = await apiClient.post(`/wallets/${walletId}/unfreeze`);
    return response.data;
  },

  close: async (walletId: string): Promise<ApiResponse<Wallet>> => {
    const response = await apiClient.post(`/wallets/${walletId}/close`);
    return response.data;
  },
};