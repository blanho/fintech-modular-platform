export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  decimals: number;
  flag?: string;
}

export const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    decimals: 2,
    flag: '🇺🇸',
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    decimals: 2,
    flag: '🇪🇺',
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    decimals: 2,
    flag: '🇬🇧',
  },
  JPY: {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    decimals: 0,
    flag: '🇯🇵',
  },
  CHF: {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    decimals: 2,
    flag: '🇨🇭',
  },
  CAD: {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    decimals: 2,
    flag: '🇨🇦',
  },
  AUD: {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    decimals: 2,
    flag: '🇦🇺',
  },
  SGD: {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    decimals: 2,
    flag: '🇸🇬',
  },
} as const;

export const SUPPORTED_CURRENCIES = Object.keys(CURRENCIES) as (keyof typeof CURRENCIES)[];

export const CURRENCY_OPTIONS = Object.values(CURRENCIES).map((currency) => ({
  value: currency.code,
  label: `${currency.code} - ${currency.name}`,
  symbol: currency.symbol,
  flag: currency.flag,
}));

export function getCurrencyInfo(code: string): CurrencyInfo | undefined {
  return CURRENCIES[code.toUpperCase()];
}

export function getCurrencySymbol(code: string): string {
  return CURRENCIES[code.toUpperCase()]?.symbol || code;
}

export function isSupportedCurrency(code: string): boolean {
  return code.toUpperCase() in CURRENCIES;
}