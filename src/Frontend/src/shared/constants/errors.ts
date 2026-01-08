export const ERROR_CODES = {

  VALIDATION_ERROR: 'VALIDATION_ERROR',

UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  FORBIDDEN: 'FORBIDDEN',

NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',

WALLET_NOT_FOUND: 'WALLET_NOT_FOUND',
  WALLET_FROZEN: 'WALLET_FROZEN',
  WALLET_CLOSED: 'WALLET_CLOSED',
  WALLET_HAS_BALANCE: 'WALLET_HAS_BALANCE',

INSUFFICIENT_BALANCE: 'INSUFFICIENT_BALANCE',
  DUPLICATE_TRANSACTION: 'DUPLICATE_TRANSACTION',
  TRANSACTION_NOT_FOUND: 'TRANSACTION_NOT_FOUND',
  CURRENCY_MISMATCH: 'CURRENCY_MISMATCH',
  SAME_WALLET_TRANSFER: 'SAME_WALLET_TRANSFER',

RATE_LIMITED: 'RATE_LIMITED',

INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ERROR_CODES.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ERROR_CODES.UNAUTHORIZED]: 'Please log in to continue.',
  [ERROR_CODES.INVALID_CREDENTIALS]: 'Invalid email or password.',
  [ERROR_CODES.TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
  [ERROR_CODES.FORBIDDEN]: 'You do not have permission to perform this action.',
  [ERROR_CODES.NOT_FOUND]: 'The requested resource was not found.',
  [ERROR_CODES.CONFLICT]: 'This resource already exists.',
  [ERROR_CODES.WALLET_NOT_FOUND]: 'Wallet not found.',
  [ERROR_CODES.WALLET_FROZEN]: 'This wallet is frozen and cannot be used.',
  [ERROR_CODES.WALLET_CLOSED]: 'This wallet has been closed.',
  [ERROR_CODES.WALLET_HAS_BALANCE]: 'Cannot close wallet with remaining balance.',
  [ERROR_CODES.INSUFFICIENT_BALANCE]: 'Insufficient balance for this transaction.',
  [ERROR_CODES.DUPLICATE_TRANSACTION]: 'This transaction has already been processed.',
  [ERROR_CODES.TRANSACTION_NOT_FOUND]: 'Transaction not found.',
  [ERROR_CODES.CURRENCY_MISMATCH]: 'Currency mismatch between wallets.',
  [ERROR_CODES.SAME_WALLET_TRANSFER]: 'Cannot transfer to the same wallet.',
  [ERROR_CODES.RATE_LIMITED]: 'Too many requests. Please try again later.',
  [ERROR_CODES.INTERNAL_ERROR]: 'An unexpected error occurred. Please try again.',
  [ERROR_CODES.SERVICE_UNAVAILABLE]: 'Service is temporarily unavailable.',
};

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code as ErrorCode] || ERROR_MESSAGES[ERROR_CODES.INTERNAL_ERROR];
}

export const HTTP_STATUS_TO_ERROR: Record<number, ErrorCode> = {
  400: ERROR_CODES.VALIDATION_ERROR,
  401: ERROR_CODES.UNAUTHORIZED,
  403: ERROR_CODES.FORBIDDEN,
  404: ERROR_CODES.NOT_FOUND,
  409: ERROR_CODES.CONFLICT,
  422: ERROR_CODES.VALIDATION_ERROR,
  429: ERROR_CODES.RATE_LIMITED,
  500: ERROR_CODES.INTERNAL_ERROR,
  503: ERROR_CODES.SERVICE_UNAVAILABLE,
};