import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  BookOpen,
  ShieldCheck,
  Bell,
  FileBarChart,
} from 'lucide-react';
import { useSidebarStore } from '@/shared/stores';

const DRAWER_WIDTH = 260;

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Wallets', path: '/wallets', icon: Wallet },
  { label: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
  { label: 'Ledger', path: '/ledger', icon: BookOpen },
  { label: 'Audit Log', path: '/audit', icon: ShieldCheck },
  { label: 'Notifications', path: '/notifications', icon: Bell },
  { label: 'Reports', path: '/reports', icon: FileBarChart },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isOpen = useSidebarStore((s) => s.isOpen);

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
        },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2,
            background: (t) =>
              `linear-gradient(135deg, ${t.palette.primary.main}, ${alpha(t.palette.primary.main, 0.6)})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: 16, color: 'primary.contrastText' }}>
            F
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          FinTech
        </Typography>
      </Box>

      <Divider />

      <List sx={{ px: 1.5, pt: 2, flex: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                cursor: 'pointer',
                backgroundColor: isActive ? (t) => alpha(t.palette.primary.main, 0.12) : 'transparent',
                color: isActive ? 'primary.main' : 'text.secondary',
                '&:hover': {
                  backgroundColor: (t) => alpha(t.palette.primary.main, 0.08),
                  color: 'text.primary',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <item.icon size={20} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 400 }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
