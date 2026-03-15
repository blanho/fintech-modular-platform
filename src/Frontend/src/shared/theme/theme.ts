import { createTheme, alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    card: { main: string; hover: string };
    border: { main: string };
  }
  interface PaletteOptions {
    card?: { main: string; hover: string };
    border?: { main: string };
  }
}

const colors = {
  primary: '#0F172A',
  secondary: '#1E293B',
  cta: '#22C55E',
  ctaHover: '#16A34A',
  background: '#020617',
  surface: '#0F172A',
  surfaceHover: '#1E293B',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#334155',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
};

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.cta,
      dark: colors.ctaHover,
      contrastText: '#020617',
    },
    secondary: {
      main: colors.secondary,
      contrastText: colors.text,
    },
    background: {
      default: colors.background,
      paper: colors.surface,
    },
    text: {
      primary: colors.text,
      secondary: colors.textSecondary,
    },
    error: { main: colors.error },
    warning: { main: colors.warning },
    info: { main: colors.info },
    success: { main: colors.cta },
    divider: colors.border,
    card: {
      main: colors.surface,
      hover: colors.surfaceHover,
    },
    border: {
      main: colors.border,
    },
  },
  typography: {
    fontFamily: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: { fontWeight: 700, fontSize: '2.25rem', lineHeight: 1.2 },
    h2: { fontWeight: 700, fontSize: '1.875rem', lineHeight: 1.25 },
    h3: { fontWeight: 600, fontSize: '1.5rem', lineHeight: 1.3 },
    h4: { fontWeight: 600, fontSize: '1.25rem', lineHeight: 1.35 },
    h5: { fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.4 },
    h6: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.5 },
    subtitle1: { fontWeight: 500, color: colors.textSecondary },
    subtitle2: { fontWeight: 500, fontSize: '0.875rem', color: colors.textSecondary },
    body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.6, color: colors.textSecondary },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.background,
          scrollbarColor: `${colors.border} ${colors.background}`,
          '&::-webkit-scrollbar': { width: 8 },
          '&::-webkit-scrollbar-track': { background: colors.background },
          '&::-webkit-scrollbar-thumb': {
            background: colors.border,
            borderRadius: 4,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '10px 24px',
          cursor: 'pointer',
          transition: 'all 200ms ease',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': { boxShadow: `0 4px 12px ${alpha(colors.cta, 0.3)}` },
        },
        outlined: {
          borderColor: colors.border,
          '&:hover': { borderColor: colors.cta, backgroundColor: alpha(colors.cta, 0.08) },
        },
      },
      defaultProps: { disableRipple: false },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          transition: 'border-color 200ms ease, box-shadow 200ms ease',
          '&:hover': {
            borderColor: alpha(colors.cta, 0.3),
            boxShadow: `0 4px 20px ${alpha(colors.cta, 0.08)}`,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '& fieldset': { borderColor: colors.border },
            '&:hover fieldset': { borderColor: colors.textSecondary },
            '&.Mui-focused fieldset': { borderColor: colors.cta },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: 16,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.surface,
          borderRight: `1px solid ${colors.border}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: colors.border,
        },
        head: {
          fontWeight: 600,
          color: colors.textSecondary,
          backgroundColor: colors.surface,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.secondary,
          border: `1px solid ${colors.border}`,
          borderRadius: 8,
          fontSize: '0.8125rem',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: alpha(colors.border, 0.3),
        },
      },
    },
  },
});
