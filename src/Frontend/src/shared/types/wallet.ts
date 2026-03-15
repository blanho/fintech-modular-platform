export type Currency = 'USD' | 'EUR' | 'GBP' | 'BTC' | 'ETH';
export type WalletStatus = 'Active' | 'Frozen' | 'Closed';

export interface Wallet {
  id: string;
  userId: string;
  name: string;
  currency: Currency;
  status: WalletStatus;
  balance: number;
  createdAt: string;
  updatedAt: string | null;
}

export interface WalletBalance {
  walletId: string;
  balance: number;
  currency: string;
}

export interface CreateWalletRequest {
  name: string;
  currency: Currency;
}

export interface RenameWalletRequest {
  name: string;
}
