import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  BookOpen,
  ShieldCheck,
  Bell,
  FileBarChart,
  Settings,
  TrendingUp,
} from 'lucide-react';
import { useSidebarStore, useAuthStore } from '@/shared/stores';
import { usePermissions, type Permission } from '@/shared/hooks/usePermission';
import type { LucideIcon } from 'lucide-react';

const DRAWER_WIDTH = 260;

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  permission?: Permission;
}

const navSections = [
  {
    label: 'MAIN',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ] as NavItem[],
  },
  {
    label: 'FINANCE',
    items: [
      { label: 'Wallets', path: '/wallets', icon: Wallet },
      { label: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
      { label: 'Ledger', path: '/ledger', icon: BookOpen },
    ] as NavItem[],
  },
  {
    label: 'COMPLIANCE',
    items: [
      { label: 'Audit Log', path: '/audit', icon: ShieldCheck, permission: 'audit:read' as Permission },
      { label: 'Reports', path: '/reports', icon: FileBarChart, permission: 'reports:read' as Permission },
    ] as NavItem[],
  },
  {
    label: 'SYSTEM',
    items: [
      { label: 'Notifications', path: '/notifications', icon: Bell },
      { label: 'Settings', path: '/settings', icon: Settings },
    ] as NavItem[],
  },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isOpen = useSidebarStore((s) => s.isOpen);
  const user = useAuthStore((s) => s.user);
  const { hasPermission } = usePermissions();

  return (
    <Drawer
      variant="persistent"
      open={isOpen}
      sx={{
        width: isOpen ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        transition: 'width 200ms ease',
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          transition: 'transform 200ms ease',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          background: '#080F1E',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #22C55E, #16A34A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 14px rgba(34,197,94,0.35)',
            flexShrink: 0,
          }}
        >
          <TrendingUp size={18} color="#020617" strokeWidth={2.5} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', lineHeight: 1.15, color: '#F8FAFC' }}>
            FinTech
          </Typography>
          <Typography sx={{ fontWeight: 400, fontSize: '0.6875rem', lineHeight: 1.2, color: '#475569', letterSpacing: '0.05em' }}>
            Platform
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

      {/* Nav sections */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, pt: 1.5, pb: 1 }}>
        {navSections.map((section) => {
          const visibleItems = section.items.filter(
            (item) => !item.permission || hasPermission(item.permission),
          );
          if (visibleItems.length === 0) return null;

          return (
            <Box key={section.label} sx={{ mb: 1 }}>
              <Typography
                sx={{
                  px: 1.5,
                  py: 0.75,
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: '#334155',
                  textTransform: 'uppercase',
                }}
              >
                {section.label}
              </Typography>
              <List disablePadding>
                {visibleItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <ListItemButton
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      sx={{
                        borderRadius: '10px',
                        mb: 0.25,
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                        backgroundColor: isActive ? 'rgba(34,197,94,0.1)' : 'transparent',
                        color: isActive ? '#22C55E' : '#64748B',
                        borderLeft: isActive ? '2px solid #22C55E' : '2px solid transparent',
                        pl: 1.375,
                        '&:hover': {
                          backgroundColor: isActive
                            ? 'rgba(34,197,94,0.13)'
                            : 'rgba(255,255,255,0.04)',
                          color: isActive ? '#22C55E' : '#CBD5E1',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 34, color: 'inherit' }}>
                        <item.icon size={17} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        slotProps={{
                          primary: {
                            sx: {
                              fontSize: '0.875rem',
                              fontWeight: isActive ? 600 : 400,
                              color: 'inherit',
                            },
                          },
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

      {/* User profile */}
      <Box
        onClick={() => navigate('/profile')}
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: 'pointer',
          transition: 'background 150ms ease',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' },
        }}
      >
        <Avatar
          sx={{
            width: 30,
            height: 30,
            bgcolor: 'rgba(34,197,94,0.12)',
            color: '#22C55E',
            fontSize: '0.75rem',
            fontWeight: 700,
            border: '1px solid rgba(34,197,94,0.22)',
            flexShrink: 0,
          }}
        >
          {user?.firstName?.charAt(0) ?? 'U'}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#E2E8F0',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.6875rem',
              color: '#334155',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.roles?.[0] ?? 'User'}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
