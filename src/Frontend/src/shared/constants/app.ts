export const APP_NAME = 'FinTech Platform';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Modern FinTech platform for digital wallets and transactions';

export const API_VERSION = 'v1';
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
export const API_TIMEOUT = 10000;

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

export const DEFAULT_CURRENCY = 'USD';
export const MONEY_DECIMAL_PLACES = 4;
export const MONEY_DISPLAY_DECIMAL_PLACES = 2;
export const MAX_MONEY_DIGITS = 18;

export const DATE_FORMAT = 'MMM d, yyyy';
export const TIME_FORMAT = 'h:mm a';
export const DATETIME_FORMAT = 'MMM d, yyyy h:mm a';
export const ISO_DATE_FORMAT = 'yyyy-MM-dd';

export const PASSWORD_MIN_LENGTH = 8;
export const EMAIL_MAX_LENGTH = 255;
export const NAME_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 500;
export const WALLET_NAME_MAX_LENGTH = 100;

export const TOAST_DURATION = 5000;
export const DEBOUNCE_DELAY = 300;
export const ANIMATION_DURATION = 200;
export const SIDEBAR_WIDTH = 280;
export const HEADER_HEIGHT = 64;

export const STALE_TIME = 30 * 1000;
export const CACHE_TIME = 5 * 60 * 1000;
export const BALANCE_REFRESH_INTERVAL = 60 * 1000;
export const TRANSACTION_REFRESH_INTERVAL = 30 * 1000;

export const STORAGE_KEYS = {
  AUTH: 'fintech-auth',
  THEME: 'fintech-theme',
  LOCALE: 'fintech-locale',
  SIDEBAR_STATE: 'fintech-sidebar',
  TABLE_SETTINGS: 'fintech-table-settings',
} as const;

export const SESSION_KEYS = {
  REDIRECT_URL: 'fintech-redirect-url',
  FORM_DATA: 'fintech-form-data',
} as const;