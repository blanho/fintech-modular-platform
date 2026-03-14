export const FORBIDDEN = {

  gradients: [
    'bg-gradient-to-* (full elements)',
    'text-gradient',
    'bg-[linear-gradient*',

  ],

animations: [
    'whileHover={{ scale: * }}',
    'whileHover={{ rotate: * }}',
    'animate-bounce',
    'animate-spin',
    'animate-ping',
    'animate-pulse',
    'transition: { type: "spring", bounce: * }',
  ],

colors: [
    'bg-slate-900',
    'bg-slate-800',
    'bg-black',
    'text-transparent',
    'shadow-indigo-*',
    'shadow-*-500',
    'ring-offset-indigo-*',
  ],

borders: [
    'border-4',
    'border-8',
    'ring-4',
    'outline-*',

  ],

shadows: [
    'shadow-2xl',
    'drop-shadow-xl',

  ],

decorative: [
    'blur-3xl',
    'backdrop-blur-3xl',
    'rotate-*',
    'skew-*',
    '-rotate-*',
  ],

multipleAccents: [

'bg-purple-*',
    'bg-pink-*',
    'bg-cyan-*',
    'bg-teal-*',
    'bg-blue-*',
    'bg-violet-*',
  ],
} as const;

export const ALLOWED = {

  backgrounds: {
    page: ['bg-white', 'bg-slate-50'],
    card: ['bg-white'],
    accent: ['bg-indigo-600', 'bg-indigo-50', 'bg-indigo-100'],
    semantic: ['bg-emerald-50', 'bg-amber-50', 'bg-red-50'],
    subtle: ['bg-slate-50', 'bg-slate-100'],
  },

text: {
    primary: ['text-slate-900', 'text-slate-800'],
    secondary: ['text-slate-600', 'text-slate-500'],
    muted: ['text-slate-400'],
    accent: ['text-indigo-600'],
    onDark: ['text-white'],
    semantic: ['text-emerald-600', 'text-amber-600', 'text-red-600'],
  },

borders: {
    default: ['border', 'border-slate-200'],
    subtle: ['border-slate-100'],
    focus: ['border-indigo-600'],
    semantic: ['border-emerald-200', 'border-amber-200', 'border-red-200'],
  },

shadows: {
    subtle: ['shadow-sm'],
    card: ['shadow-sm', 'shadow', 'shadow-md', 'shadow-lg'],
    cardFeatured: ['shadow-xl'],
    dropdown: ['shadow-lg'],
    modal: ['shadow-xl'],
  },

radius: {
    default: ['rounded-lg'],
    large: ['rounded-xl'],
    xlarge: ['rounded-2xl'],
    full: ['rounded-full'],
    none: ['rounded-none'],
  },

animations: {
    fade: { opacity: [0, 1], transition: { duration: 0.3 } },
    slideUp: { y: [20, 0], opacity: [0, 1], transition: { duration: 0.5 } },
    slideDown: { y: [-10, 0], opacity: [0, 1], transition: { duration: 0.2 } },
    scaleIn: { scale: [0.95, 1], opacity: [0, 1], transition: { duration: 0.15 } },

  },

hover: {
    background: ['hover:bg-slate-50', 'hover:bg-slate-100', 'hover:bg-indigo-700'],
    border: ['hover:border-slate-300', 'hover:border-indigo-200'],
    text: ['hover:text-slate-900', 'hover:text-indigo-700'],
    shadow: ['hover:shadow-md', 'hover:shadow-lg'],
    ring: ['group-hover:ring-indigo-200'],
    transition: ['transition-all', 'duration-300'],
  },

focus: {
    ring: ['focus:ring-2', 'focus:ring-indigo-600/20'],
    border: ['focus:border-indigo-600'],
    outline: ['focus:outline-none'],
  },

icons: {
    sizes: ['w-4 h-4', 'w-5 h-5', 'w-6 h-6', 'w-7 h-7'],
    colors: ['text-slate-400', 'text-slate-500', 'text-indigo-600'],
  },
} as const;

export const COMPONENT_RULES = {
  cards: {
    ALWAYS: ['bg-white', 'border border-slate-200/60', 'rounded-2xl'],
    ELEVATED: ['shadow-sm'],
    INTERACTIVE: ['hover:shadow-lg', 'hover:border-slate-300', 'transition-all duration-300'],
    FEATURED: ['ring-2 ring-indigo-600', 'shadow-xl', 'scale-[1.02]'],
    NEVER: ['bg-gradient-* (full background)', 'border-4+'],
  },

  iconContainers: {
    ALWAYS: ['flex items-center justify-center', 'rounded-xl', 'ring-1 ring-indigo-100'],
    GRADIENT: ['bg-gradient-to-br from-indigo-50 to-slate-50'],
    SIZES: { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12', xl: 'w-14 h-14' },
    INTERACTIVE: ['group-hover:ring-indigo-200', 'transition-all duration-300'],
  },

  buttons: {
    primary: {
      ALWAYS: ['bg-indigo-600', 'hover:bg-indigo-700', 'text-white', 'rounded-lg', 'shadow-sm hover:shadow-md'],
      NEVER: ['bg-gradient-*', 'shadow-lg', 'scale on hover'],
    },
    secondary: {
      ALWAYS: ['bg-white', 'border', 'border-slate-200', 'text-slate-700', 'rounded-lg'],
      NEVER: ['bg-slate-100', 'border-2'],
    },
  },

  inputs: {
    ALWAYS: ['border', 'border-slate-200', 'rounded-lg', 'focus:ring-2', 'focus:border-indigo-600'],
    NEVER: ['border-2', 'shadow-inner', 'bg-slate-100'],
  },

  modals: {
    overlay: ['bg-slate-900/50', 'backdrop-blur-sm'],
    content: ['bg-white', 'rounded-xl', 'shadow-lg'],
    NEVER: ['bg-black/80', 'backdrop-blur-xl'],
  },

  dropdowns: {
    ALWAYS: ['bg-white', 'border', 'border-slate-200', 'rounded-lg', 'shadow-lg'],
    NEVER: ['bg-gradient-*', 'border-2'],
  },

  tables: {
    header: ['bg-slate-50'],
    row: ['hover:bg-slate-50'],
    border: ['border-slate-200', 'border-slate-100'],
    NEVER: ['bg-slate-900', 'striped with saturated colors'],
  },
} as const;

export const SPACING_RULES = {

  section: {
    vertical: ['py-16', 'py-20', 'py-24'],
    horizontal: ['px-4', 'px-6', 'px-8'],
  },

card: {
    default: 'p-6',
    small: 'p-4',
    large: 'p-8',
  },

gaps: {
    tight: 'gap-2',
    default: 'gap-4',
    loose: 'gap-6',
    section: 'gap-8',
  },

text: {
    headingMargin: 'mb-4',
    paragraphMargin: 'mb-6',
    listItemGap: 'gap-3',
  },
} as const;

export const TYPOGRAPHY_RULES = {

  family: 'font-sans',
  monoFamily: 'font-mono',

headings: {
    h1: { size: 'text-4xl lg:text-5xl', weight: 'font-semibold', tracking: 'tracking-tight' },
    h2: { size: 'text-3xl lg:text-4xl', weight: 'font-semibold', tracking: 'tracking-tight' },
    h3: { size: 'text-2xl', weight: 'font-semibold' },
    h4: { size: 'text-xl', weight: 'font-semibold' },
    h5: { size: 'text-lg', weight: 'font-semibold' },
    h6: { size: 'text-base', weight: 'font-semibold' },
  },

body: {
    large: { size: 'text-lg', color: 'text-slate-600', leading: 'leading-relaxed' },
    default: { size: 'text-base', color: 'text-slate-600' },
    small: { size: 'text-sm', color: 'text-slate-500' },
  },

labels: {
    default: { size: 'text-sm', weight: 'font-medium', color: 'text-slate-700' },
    uppercase: { size: 'text-xs', weight: 'font-medium', color: 'text-slate-500', extra: 'uppercase tracking-wide' },
  },

NEVER: [
    'font-black',
    'font-thin',
    'font-extralight',
    'text-6xl+',
    'tracking-widest',
  ],
} as const;

export const constraints = {
  FORBIDDEN,
  ALLOWED,
  COMPONENT_RULES,
  SPACING_RULES,
  TYPOGRAPHY_RULES,
} as const;

export default constraints;