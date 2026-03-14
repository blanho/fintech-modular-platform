export const text = {

  h1: 'text-4xl lg:text-5xl font-semibold text-slate-900 tracking-tight',
  h2: 'text-3xl lg:text-4xl font-semibold text-slate-900 tracking-tight',
  h3: 'text-2xl font-semibold text-slate-900',
  h4: 'text-xl font-semibold text-slate-900',
  h5: 'text-lg font-semibold text-slate-900',
  h6: 'text-base font-semibold text-slate-900',

body: 'text-base text-slate-600',
  bodyLarge: 'text-lg text-slate-600',
  bodySmall: 'text-sm text-slate-600',

secondary: 'text-sm text-slate-500',
  muted: 'text-xs text-slate-400',

label: 'text-sm font-medium text-slate-700',
  labelSmall: 'text-xs font-medium text-slate-500 uppercase tracking-wide',

link: 'text-indigo-600 hover:text-indigo-700 transition-colors',
  linkSubtle: 'text-slate-600 hover:text-slate-900 transition-colors',
} as const;

export const button = {

  base: 'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',

primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-600/50',
  secondary: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-500/30',
  ghost: 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-500/30',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-600/50',

sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-5 py-2.5 text-base gap-2',
  xl: 'px-6 py-3 text-base gap-2.5',

iconSm: 'p-1.5',
  iconMd: 'p-2',
  iconLg: 'p-2.5',
} as const;

export const card = {

  base: 'bg-white border border-slate-200/60 rounded-2xl',
  elevated: 'bg-white border border-slate-200/60 rounded-2xl shadow-sm',

interactive: 'bg-white border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300',

selected: 'bg-white border-2 border-indigo-600 rounded-2xl shadow-md',

featured: 'bg-white rounded-2xl shadow-xl ring-2 ring-indigo-600 scale-[1.02]',

padded: 'p-6',
  paddedSm: 'p-4',
  paddedLg: 'p-8',
} as const;

export const input = {
  base: 'w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 transition-colors duration-200',
  focus: 'focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600',
  error: 'border-red-300 focus:ring-red-500/20 focus:border-red-500',
  disabled: 'bg-slate-50 text-slate-500 cursor-not-allowed',

DEFAULT: 'w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-colors duration-200',
} as const;

export const select = {
  base: input.DEFAULT,
  trigger: 'flex items-center justify-between',
} as const;

export const checkbox = {
  base: 'h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600/50',
} as const;

export const label = {
  base: 'block text-sm font-medium text-slate-700 mb-1.5',
  required: 'after:content-["*"] after:ml-0.5 after:text-red-500',
} as const;

export const formGroup = {
  base: 'space-y-1.5',
  error: 'text-sm text-red-600 mt-1',
  hint: 'text-sm text-slate-500 mt-1',
} as const;

export const badge = {
  base: 'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded',

neutral: 'bg-slate-100 text-slate-600',
  primary: 'bg-indigo-50 text-indigo-600',
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  error: 'bg-red-50 text-red-600',

sm: 'px-1.5 py-0.5 text-[10px]',
  md: 'px-2 py-0.5 text-xs',
  lg: 'px-2.5 py-1 text-sm',
} as const;

export const iconContainer = {

  base: 'flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-50 rounded-xl ring-1 ring-indigo-100',

sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-14 h-14',

iconSm: 'w-4 h-4 text-indigo-600',
  iconMd: 'w-5 h-5 text-indigo-600',
  iconLg: 'w-6 h-6 text-indigo-600',
  iconXl: 'w-7 h-7 text-indigo-600',

interactive: 'flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-50 rounded-xl ring-1 ring-indigo-100 group-hover:ring-indigo-200 transition-all duration-300',
} as const;

export const container = {
  DEFAULT: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  narrow: 'max-w-3xl mx-auto px-4 sm:px-6 lg:px-8',
  wide: 'max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8',
} as const;

export const section = {
  base: 'py-16 lg:py-24',
  large: 'py-20 lg:py-32',
  small: 'py-12 lg:py-16',
} as const;

export const divider = {
  horizontal: 'border-t border-slate-200',
  vertical: 'border-l border-slate-200',
} as const;

export const nav = {
  link: 'px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors',
  linkActive: 'px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg',
} as const;

export const table = {
  wrapper: 'overflow-x-auto',
  base: 'w-full text-sm',
  head: 'bg-slate-50 border-b border-slate-200',
  th: 'px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide',
  td: 'px-4 py-4 text-slate-600 border-b border-slate-100',
  row: 'hover:bg-slate-50 transition-colors',
} as const;

export const modal = {
  overlay: 'fixed inset-0 bg-slate-900/50 backdrop-blur-sm',
  content: 'bg-white rounded-xl shadow-lg',
  header: 'px-6 py-4 border-b border-slate-200',
  body: 'px-6 py-4',
  footer: 'px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl',
} as const;

export const icon = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',

containerSm: 'w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100',
  containerMd: 'w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100',
  containerLg: 'w-12 h-12 flex items-center justify-center rounded-lg bg-slate-100',

containerPrimary: 'flex items-center justify-center rounded-lg bg-indigo-50 text-indigo-600',
} as const;

export const animation = {

  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  },

slideUp: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.2 },
  },

slideDown: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.2 },
  },

scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.15 },
  },

stagger: {
    animate: { transition: { staggerChildren: 0.05 } },
  },

} as const;

export const tw = {
  text,
  button,
  card,
  input,
  select,
  checkbox,
  label,
  formGroup,
  badge,
  container,
  section,
  divider,
  nav,
  table,
  modal,
  icon,
  animation,
} as const;

export default tw;