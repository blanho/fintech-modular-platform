export const colors = {

primary: {
    DEFAULT: '#4F46E5',
    hover: '#4338CA',
    light: '#EEF2FF',
    muted: '#C7D2FE',
  },

neutral: {
    white: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },

semantic: {
    success: '#10B981',
    successLight: '#D1FAE5',
    error: '#EF4444',
    errorLight: '#FEE2E2',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
  },

} as const;

export const typography = {

fontFamily: {
    sans: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"SF Mono", "Fira Code", "Fira Mono", Menlo, monospace',
  },

fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1.1' }],
    '6xl': ['3.75rem', { lineHeight: '1.1' }],
  },

fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',

},

lineHeight: {
    tight: '1.1',
    snug: '1.25',
    normal: '1.5',
    relaxed: '1.625',
  },

letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.05em',
  },
} as const;

export const spacing = {

px: '1px',
  0: '0',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
} as const;

export const borders = {

width: {
    DEFAULT: '1px',
    0: '0',
    2: '2px',

  },

radius: {
    none: '0',
    sm: '0.25rem',
    DEFAULT: '0.5rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },

color: {
    DEFAULT: '#E2E8F0',
    light: '#F1F5F9',
    dark: '#CBD5E1',
    focus: '#4F46E5',

  },
} as const;

export const shadows = {

none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',

} as const;

export const transitions = {

duration: {
    fast: '150ms',
    DEFAULT: '200ms',
    slow: '300ms',

  },

  timing: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },

} as const;

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  header: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  tooltip: 80,
} as const;

export const patterns = {

card: {
    base: 'bg-white border border-slate-200 rounded-lg',
    hover: 'hover:border-slate-300 hover:shadow-sm transition-all duration-200',
    interactive: 'bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all duration-200',
  },

button: {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200',
    secondary: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-medium rounded-lg transition-colors duration-200',
    ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium rounded-lg transition-colors duration-200',
  },

input: {
    base: 'w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors duration-200',
  },

badge: {
    neutral: 'px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded',
    primary: 'px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded',
    success: 'px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-600 rounded',
  },

section: {
    padding: 'py-16 lg:py-24',
    paddingLarge: 'py-20 lg:py-32',
  },

container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
} as const;

export default {
  colors,
  typography,
  spacing,
  borders,
  shadows,
  transitions,
  zIndex,
  patterns,
};