export type TransactionType = 'Deposit' | 'Withdrawal' | 'Transfer';
export type TransactionStatus = 'Pending' | 'Completed' | 'Failed' | 'Cancelled';

export interface Transaction {
  id: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description: string;
  referenceId: string;
  createdAt: string;
}

export interface DepositRequest {
  walletId: string;
  amount: number;
  description?: string;
}

export interface WithdrawRequest {
  walletId: string;
  amount: number;
  description?: string;
}

export interface TransferRequest {
  sourceWalletId: string;
  destinationWalletId: string;
  amount: number;
  description?: string;
}
