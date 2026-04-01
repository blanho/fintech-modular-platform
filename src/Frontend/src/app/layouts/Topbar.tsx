import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, Bell, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useSidebarStore, useAuthStore } from '@/shared/stores';
import { useLogout } from '@/features/auth/hooks/useAuth';
import { DRAWER_WIDTH } from './Sidebar';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of your financial activity' },
  '/wallets': { title: 'Wallets', subtitle: 'Manage your digital wallets' },
  '/transactions': { title: 'Transactions', subtitle: 'Transaction history and management' },
  '/ledger': { title: 'Ledger', subtitle: 'Double-entry financial records' },
  '/audit': { title: 'Audit Log', subtitle: 'Security and compliance trail' },
  '/notifications': { title: 'Notifications', subtitle: 'Alerts and messages' },
  '/reports': { title: 'Reports', subtitle: 'Financial analytics and insights' },
  '/settings': { title: 'Settings', subtitle: 'Platform configuration' },
  '/profile': { title: 'Profile', subtitle: 'Your account details' },
};

export function Topbar() {
  const toggleSidebar = useSidebarStore((s) => s.toggle);
  const isSidebarOpen = useSidebarStore((s) => s.isOpen);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const location = useLocation();
  const logoutMutation = useLogout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    setAnchorEl(null);
    logoutMutation.mutate();
  };

  const currentPage = Object.entries(pageTitles).find(([path]) =>
    location.pathname.startsWith(path),
  )?.[1] ?? { title: 'FinTech', subtitle: '' };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: isSidebarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
        ml: isSidebarOpen ? `${DRAWER_WIDTH}px` : 0,
        transition: 'width 200ms ease, margin 200ms ease',
        backgroundColor: 'rgba(2,6,23,0.88)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <Toolbar sx={{ gap: 1, minHeight: { xs: 60, sm: 64 } }}>
        <IconButton
          onClick={toggleSidebar}
          size="small"
          sx={{
            color: '#64748B',
            cursor: 'pointer',
            '&:hover': { color: '#F8FAFC', backgroundColor: 'rgba(255,255,255,0.06)' },
          }}
        >
          <MenuIcon size={20} />
        </IconButton>

        {/* Page title */}
        <Box sx={{ flex: 1, ml: 1 }}>
          <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#F8FAFC', lineHeight: 1.2 }}>
            {currentPage.title}
          </Typography>
          {currentPage.subtitle && (
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: '#475569',
                lineHeight: 1.2,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {currentPage.subtitle}
            </Typography>
          )}
        </Box>

        {/* Notification button */}
        <IconButton
          onClick={() => navigate('/notifications')}
          size="small"
          sx={{
            color: '#64748B',
            cursor: 'pointer',
            '&:hover': { color: '#F8FAFC', backgroundColor: 'rgba(255,255,255,0.06)' },
          }}
        >
          <Badge
            badgeContent={3}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#22C55E',
                color: '#020617',
                fontSize: '0.6rem',
                fontWeight: 700,
                minWidth: 16,
                height: 16,
                boxShadow: '0 0 6px rgba(34,197,94,0.5)',
              },
            }}
          >
            <Bell size={20} />
          </Badge>
        </IconButton>

        {/* User button */}
        <Box
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.875,
            px: 1.25,
            py: 0.625,
            borderRadius: '10px',
            cursor: 'pointer',
            border: '1px solid rgba(255,255,255,0.07)',
            transition: 'all 150ms ease',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderColor: 'rgba(255,255,255,0.12)',
            },
          }}
        >
          <Avatar
            sx={{
              width: 26,
              height: 26,
              bgcolor: 'rgba(34,197,94,0.12)',
              color: '#22C55E',
              fontSize: '0.6875rem',
              fontWeight: 700,
              border: '1px solid rgba(34,197,94,0.22)',
            }}
          >
            {user?.firstName?.charAt(0) ?? 'U'}
          </Avatar>
          <Typography
            sx={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: '#E2E8F0',
              display: { xs: 'none', md: 'block' },
            }}
          >
            {user?.firstName}
          </Typography>
          <ChevronDown size={13} color="#475569" />
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{
            paper: {
              sx: {
                width: 240,
                mt: 1,
                backgroundColor: '#0A1628',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#F8FAFC' }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#475569', mt: 0.25 }}>
              {user?.email}
            </Typography>
            {user?.roles && user.roles.length > 0 && (
              <Box sx={{ mt: 0.75, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {user.roles.map((role) => (
                  <Chip
                    key={role}
                    label={role}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: '0.625rem',
                      fontWeight: 600,
                      backgroundColor: 'rgba(34,197,94,0.1)',
                      color: '#22C55E',
                      border: '1px solid rgba(34,197,94,0.2)',
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
          <MenuItem
            onClick={() => { setAnchorEl(null); navigate('/profile'); }}
            sx={{ gap: 1.5, cursor: 'pointer', fontSize: '0.875rem', color: '#94A3B8',
              '&:hover': { color: '#F8FAFC', backgroundColor: 'rgba(255,255,255,0.04)' } }}
          >
            <User size={16} /> Profile
          </MenuItem>
          <MenuItem
            onClick={() => { setAnchorEl(null); navigate('/settings'); }}
            sx={{ gap: 1.5, cursor: 'pointer', fontSize: '0.875rem', color: '#94A3B8',
              '&:hover': { color: '#F8FAFC', backgroundColor: 'rgba(255,255,255,0.04)' } }}
          >
            <Settings size={16} /> Settings
          </MenuItem>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />
          <MenuItem
            onClick={handleLogout}
            sx={{ gap: 1.5, color: '#EF4444', cursor: 'pointer', fontSize: '0.875rem',
              '&:hover': { backgroundColor: 'rgba(239,68,68,0.08)' } }}
          >
            <LogOut size={16} /> Sign Out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}