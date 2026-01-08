export const walletKeys = {
  all: ['wallets'] as const,
  lists: () => [...walletKeys.all, 'list'] as const,
  list: (filters: string) => [...walletKeys.lists(), { filters }] as const,
  details: () => [...walletKeys.all, 'detail'] as const,
  detail: (id: string) => [...walletKeys.details(), id] as const,
  balance: (id: string) => [...walletKeys.detail(id), 'balance'] as const,
};