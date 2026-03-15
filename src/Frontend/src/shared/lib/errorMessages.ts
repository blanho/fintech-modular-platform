const ERROR_MAP: Record<string, string> = {
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  CONFLICT: 'This operation conflicts with the current state.',
  DUPLICATE_TRANSACTION: 'This transaction has already been processed.',
  UNAUTHORIZED: 'You are not authorized. Please log in again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction.',
  WALLET_FROZEN: 'This wallet is currently frozen.',
  WALLET_CLOSED: 'This wallet has been closed.',
  CURRENCY_MISMATCH: 'Currency does not match the wallet currency.',
  SAME_WALLET_TRANSFER: 'Cannot transfer to the same wallet.',
  WALLET_HAS_BALANCE: 'Cannot close a wallet with remaining balance.',
  TOKEN_BLACKLISTED: 'Your session has been revoked. Please log in again.',
  RATE_LIMITED: 'Too many requests. Please try again later.',
};

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object') {
    const axiosErr = error as { response?: { data?: { code?: string; message?: string; errors?: Record<string, string[]> }; status?: number; headers?: Record<string, string> } };
    if (axiosErr.response?.status === 429) {
      const retryAfter = axiosErr.response.headers?.['retry-after'];
      return retryAfter
        ? `Too many requests. Try again in ${retryAfter} seconds.`
        : ERROR_MAP.RATE_LIMITED;
    }
    const code = axiosErr.response?.data?.code;
    if (code && ERROR_MAP[code]) return ERROR_MAP[code];
    if (axiosErr.response?.data?.message) return axiosErr.response.data.message;
    const fieldErrors = axiosErr.response?.data?.errors;
    if (fieldErrors) {
      const msgs = Object.values(fieldErrors).flat();
      if (msgs.length > 0) return msgs.join('. ');
    }
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred. Please try again.';
}
