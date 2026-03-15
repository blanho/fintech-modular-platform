export type TransactionType = 'Deposit' | 'Withdrawal' | 'Transfer';
export type TransactionStatus = 'Pending' | 'Completed' | 'Failed' | 'Cancelled';

export interface Transaction {
  id: string;
  sourceWalletId: string | null;
  targetWalletId: string | null;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description: string | null;
  failureReason: string | null;
  idempotencyKey: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface TransactionFilters {
  page?: number;
  pageSize?: number;
  type?: string;
  status?: string;
  walletId?: string;
  startDate?: string;
  endDate?: string;
}

export interface DepositRequest {
  walletId: string;
  amount: string;
  currency: string;
  description?: string;
  idempotencyKey: string;
}

export interface WithdrawRequest {
  walletId: string;
  amount: string;
  currency: string;
  description?: string;
  idempotencyKey: string;
}

export interface TransferRequest {
  sourceWalletId: string;
  targetWalletId: string;
  amount: string;
  currency: string;
  description?: string;
  idempotencyKey: string;
}
