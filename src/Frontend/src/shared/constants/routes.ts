export const API_ROUTES = {

  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

USERS: {
    ME: '/users/me',
    PROFILE: '/users/me/profile',
    CHANGE_PASSWORD: '/users/me/change-password',
    BY_ID: (id: string) => `/users/${id}`,
  },

WALLETS: {
    LIST: '/wallets',
    CREATE: '/wallets',
    BY_ID: (id: string) => `/wallets/${id}`,
    BALANCE: (id: string) => `/wallets/${id}/balance`,
    FREEZE: (id: string) => `/wallets/${id}/freeze`,
    UNFREEZE: (id: string) => `/wallets/${id}/unfreeze`,
    CLOSE: (id: string) => `/wallets/${id}/close`,
  },

TRANSACTIONS: {
    LIST: '/transactions',
    BY_ID: (id: string) => `/transactions/${id}`,
    TRANSFER: '/transactions/transfer',
    DEPOSIT: '/transactions/deposit',
    WITHDRAW: '/transactions/withdraw',
    BY_WALLET: (walletId: string) => `/wallets/${walletId}/transactions`,
  },

LEDGER: {
    ENTRIES: '/ledger/entries',
    BY_WALLET: (walletId: string) => `/ledger/entries?walletId=${walletId}`,
    BY_TRANSACTION: (txId: string) => `/ledger/entries?referenceId=${txId}`,
  },

NOTIFICATIONS: {
    PREFERENCES: '/notifications/preferences',
    LIST: '/notifications',
  },

HEALTH: {
    CHECK: '/health',
    READY: '/health/ready',
    LIVE: '/health/live',
  },
} as const;

export const APP_ROUTES = {

  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

DASHBOARD: '/dashboard',

WALLETS: '/wallets',
  WALLET_DETAIL: (id: string) => `/wallets/${id}`,
  WALLET_CREATE: '/wallets/new',

TRANSACTIONS: '/transactions',
  TRANSACTION_DETAIL: (id: string) => `/transactions/${id}`,
  TRANSFER: '/transactions/transfer',
  DEPOSIT: '/transactions/deposit',
  WITHDRAW: '/transactions/withdraw',

SETTINGS: '/settings',
  PROFILE: '/settings/profile',
  SECURITY: '/settings/security',
  NOTIFICATIONS: '/settings/notifications',

NOT_FOUND: '/404',
  ERROR: '/error',
} as const;