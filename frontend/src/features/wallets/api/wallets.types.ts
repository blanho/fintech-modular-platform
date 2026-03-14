import type { WalletStatus } from '@/shared/types/common';

export interface Wallet {
  walletId: string;
  userId: string;
  currency: string;
  name: string;
  status: WalletStatus;
  balance: string;
  createdAt: string;
  updatedAt?: string;
}

export interface WalletBalance {
  walletId: string;
  currency: string;
  balance: string;
  availableBalance: string;
  pendingBalance: string;
  calculatedAt: string;
}

export interface CreateWalletRequest {
  currency: string;
  name?: string;
}

export interface RenameWalletRequest {
  name: string;
}