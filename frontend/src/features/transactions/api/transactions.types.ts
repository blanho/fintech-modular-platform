export interface Transaction {
  transactionId: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  status: 'pending' | 'completed' | 'failed';
  amount: string;
  currency: string;
  sourceWalletId: string;
  targetWalletId?: string;
  description?: string;
  idempotencyKey: string;
  failureReason?: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
}

export interface TransactionWithEntries extends Transaction {
  ledgerEntries?: LedgerEntry[];
}

export interface LedgerEntry {
  entryId: string;
  walletId: string;
  amount: string;
  type: 'credit' | 'debit';
  createdAt: string;
}

export interface TransferRequest {
  sourceWalletId: string;
  targetWalletId: string;
  amount: string;
  currency: string;
  description?: string;
}

export interface DepositRequest {
  walletId: string;
  amount: string;
  currency: string;
  description?: string;
}

export interface WithdrawRequest {
  walletId: string;
  amount: string;
  currency: string;
  description?: string;
}

export interface TransactionFilters {
  walletId?: string;
  type?: 'deposit' | 'withdrawal' | 'transfer';
  status?: 'pending' | 'completed' | 'failed';
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}