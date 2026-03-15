import { api } from '@/shared/api';
import type {
  Transaction,
  PaginatedResponse,
  TransactionFilters,
  DepositRequest,
  WithdrawRequest,
  TransferRequest,
} from '@/shared/types';

export const transactionApi = {
  list: (filters: TransactionFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.pageSize) params.set('pageSize', String(filters.pageSize));
    if (filters.type) params.set('type', filters.type);
    if (filters.status) params.set('status', filters.status);
    if (filters.walletId) params.set('walletId', filters.walletId);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    return api
      .get<PaginatedResponse<Transaction>>(`/transactions?${params.toString()}`)
      .then((r) => r.data);
  },

  getById: (id: string) =>
    api.get<Transaction>(`/transactions/${id}`).then((r) => r.data),

  deposit: (data: DepositRequest) =>
    api.post<Transaction>('/transactions/deposit', data, {
      headers: { 'Idempotency-Key': data.idempotencyKey },
    }).then((r) => r.data),

  withdraw: (data: WithdrawRequest) =>
    api.post<Transaction>('/transactions/withdraw', data, {
      headers: { 'Idempotency-Key': data.idempotencyKey },
    }).then((r) => r.data),

  transfer: (data: TransferRequest) =>
    api.post<Transaction>('/transactions/transfer', data, {
      headers: { 'Idempotency-Key': data.idempotencyKey },
    }).then((r) => r.data),
};
