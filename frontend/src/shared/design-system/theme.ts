export const themeCSS = `

:root {

  --color-primary-50: 238 242 255;
  --color-primary-100: 224 231 255;
  --color-primary-200: 199 210 254;
  --color-primary-300: 165 180 252;
  --color-primary-400: 129 140 248;
  --color-primary-500: 99 102 241;
  --color-primary-600: 79 70 229;
  --color-primary-700: 67 56 202;
  --color-primary-800: 55 48 163;
  --color-primary-900: 49 46 129;
  --color-primary-950: 30 27 75;

--color-neutral-50: 248 250 252;
  --color-neutral-100: 241 245 249;
  --color-neutral-200: 226 232 240;
  --color-neutral-300: 203 213 225;
  --color-neutral-400: 148 163 184;
  --color-neutral-500: 100 116 139;
  --color-neutral-600: 71 85 105;
  --color-neutral-700: 51 65 85;
  --color-neutral-800: 30 41 59;
  --color-neutral-900: 15 23 42;
  --color-neutral-950: 2 6 23;

--color-success-50: 236 253 245;
  --color-success-500: 16 185 129;
  --color-success-600: 5 150 105;

--color-warning-50: 255 251 235;
  --color-warning-500: 245 158 11;
  --color-warning-600: 217 119 6;

--color-error-50: 254 242 242;
  --color-error-500: 239 68 68;
  --color-error-600: 220 38 38;

--color-info-50: 240 249 255;
  --color-info-500: 14 165 233;
  --color-info-600: 2 132 199;

--font-family-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-family-mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;

--text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;

--font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

--leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;

--tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;

--space-0: 0;
  --space-px: 1px;
  --space-0-5: 0.125rem;
  --space-1: 0.25rem;
  --space-1-5: 0.375rem;
  --space-2: 0.5rem;
  --space-2-5: 0.625rem;
  --space-3: 0.75rem;
  --space-3-5: 0.875rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-7: 1.75rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

--border-width: 1px;
  --border-color: rgb(var(--color-neutral-200));

--radius-none: 0;
  --radius-sm: 0.25rem;
  --radius-DEFAULT: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;

--shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-DEFAULT: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

--transition-fast: 150ms;
  --transition-DEFAULT: 200ms;
  --transition-slow: 300ms;
  --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);

--z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;

--input-border-color: rgb(var(--color-neutral-200));
  --input-border-color-focus: rgb(var(--color-primary-600));
  --input-ring-color: rgb(var(--color-primary-600) / 0.2);
  --input-placeholder-color: rgb(var(--color-neutral-400));

--card-bg: white;
  --card-border-color: rgb(var(--color-neutral-200));
  --card-shadow: var(--shadow-sm);

--btn-primary-bg: rgb(var(--color-primary-600));
  --btn-primary-bg-hover: rgb(var(--color-primary-700));
  --btn-primary-text: white;

--table-header-bg: rgb(var(--color-neutral-50));
  --table-border-color: rgb(var(--color-neutral-200));
  --table-row-hover-bg: rgb(var(--color-neutral-50));
}

.dark {
  --color-neutral-50: 15 23 42;
  --color-neutral-100: 30 41 59;
  --color-neutral-200: 51 65 85;
  --color-neutral-300: 71 85 105;
  --color-neutral-400: 100 116 139;
  --color-neutral-500: 148 163 184;
  --color-neutral-600: 203 213 225;
  --color-neutral-700: 226 232 240;
  --color-neutral-800: 241 245 249;
  --color-neutral-900: 248 250 252;

  --card-bg: rgb(var(--color-neutral-100));
  --card-border-color: rgb(var(--color-neutral-200));
  --input-border-color: rgb(var(--color-neutral-300));
}
`;

export default themeCSS;