export type Currency = 'USD' | 'EUR' | 'GBP' | 'BTC' | 'ETH';

export interface Wallet {
  id: string;
  name: string;
  currency: Currency;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWalletRequest {
  name: string;
  currency: Currency;
}
