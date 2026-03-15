import { api } from '@/shared/api';
import type {
  Transaction,
  PaginatedResponse,
  DepositRequest,
  WithdrawRequest,
  TransferRequest,
} from '@/shared/types';

interface TransactionFilters {
  page?: number;
  pageSize?: number;
  type?: string;
  status?: string;
  walletId?: string;
}

export const transactionApi = {
  list: (filters: TransactionFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.pageSize) params.set('pageSize', String(filters.pageSize));
    if (filters.type) params.set('type', filters.type);
    if (filters.status) params.set('status', filters.status);
    if (filters.walletId) params.set('walletId', filters.walletId);
    return api
      .get<PaginatedResponse<Transaction>>(`/transactions?${params.toString()}`)
      .then((r) => r.data);
  },

  deposit: (data: DepositRequest) =>
    api.post<Transaction>('/transactions/deposit', data).then((r) => r.data),

  withdraw: (data: WithdrawRequest) =>
    api.post<Transaction>('/transactions/withdraw', data).then((r) => r.data),

  transfer: (data: TransferRequest) =>
    api.post<Transaction>('/transactions/transfer', data).then((r) => r.data),
};
