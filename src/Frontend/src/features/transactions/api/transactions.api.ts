import { apiClient } from '@/shared/api/client';
import type { ApiResponse, PaginatedResponse } from '@/shared/types/common';
import type {
  Transaction,
  TransactionWithEntries,
  TransferRequest,
  DepositRequest,
  WithdrawRequest,
  TransactionFilters,
} from './transactions.types';

export const transactionsApi = {
  transfer: async (data: TransferRequest): Promise<ApiResponse<Transaction>> => {
    const response = await apiClient.post('/transactions/transfer', data);
    return response.data;
  },

  deposit: async (data: DepositRequest): Promise<ApiResponse<Transaction>> => {
    const response = await apiClient.post('/transactions/deposit', data);
    return response.data;
  },

  withdraw: async (data: WithdrawRequest): Promise<ApiResponse<Transaction>> => {
    const response = await apiClient.post('/transactions/withdraw', data);
    return response.data;
  },

  getById: async (transactionId: string): Promise<ApiResponse<TransactionWithEntries>> => {
    const response = await apiClient.get(`/transactions/${transactionId}`);
    return response.data;
  },

  getAll: async (filters?: TransactionFilters): Promise<PaginatedResponse<Transaction>> => {
    const response = await apiClient.get('/transactions', { params: filters });
    return response.data;
  },

  getByWallet: async (
    walletId: string,
    filters?: Omit<TransactionFilters, 'walletId'>
  ): Promise<PaginatedResponse<Transaction>> => {
    const response = await apiClient.get('/transactions', {
      params: { ...filters, walletId },
    });
    return response.data;
  },
};