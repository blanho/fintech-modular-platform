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
import { Menu as MenuIcon, Bell, LogOut, User, Settings } from 'lucide-react';
import { useSidebarStore, useAuthStore } from '@/shared/stores';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '@/features/auth/hooks/useAuth';
import { DRAWER_WIDTH } from './Sidebar';

export function Topbar() {
  const toggleSidebar = useSidebarStore((s) => s.toggle);
  const isSidebarOpen = useSidebarStore((s) => s.isOpen);
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    setAnchorEl(null);
    logoutMutation.mutate();
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: isSidebarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
        ml: isSidebarOpen ? `${DRAWER_WIDTH}px` : 0,
        transition: 'width 200ms ease, margin 200ms ease',
        backgroundColor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <IconButton
          onClick={toggleSidebar}
          sx={{ mr: 2, color: 'text.secondary', cursor: 'pointer' }}
        >
          <MenuIcon size={20} />
        </IconButton>

        <Box sx={{ flex: 1 }} />

        <IconButton
          onClick={() => navigate('/notifications')}
          sx={{ color: 'text.secondary', cursor: 'pointer', mr: 1 }}
        >
          <Badge badgeContent={3} color="primary" variant="dot">
            <Bell size={20} />
          </Badge>
        </IconButton>

        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ cursor: 'pointer' }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            {user?.firstName?.charAt(0) ?? 'U'}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          slotProps={{
            paper: {
              sx: { width: 220, mt: 1 },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
            {user?.roles && user.roles.length > 0 && (
              <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {user.roles.map((role) => (
                  <Chip key={role} label={role} size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                ))}
              </Box>
            )}
          </Box>
          <Divider />
          <MenuItem onClick={() => { setAnchorEl(null); navigate('/profile'); }} sx={{ gap: 1.5, cursor: 'pointer' }}>
            <User size={16} /> Profile
          </MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings'); }} sx={{ gap: 1.5, cursor: 'pointer' }}>
            <Settings size={16} /> Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ gap: 1.5, color: 'error.main', cursor: 'pointer' }}>
            <LogOut size={16} /> Sign Out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
