import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Sidebar, DRAWER_WIDTH } from './Sidebar';
import { Topbar } from './Topbar';
import { useSidebarStore } from '@/shared/stores';

export function DashboardLayout() {
  const isSidebarOpen = useSidebarStore((s) => s.isOpen);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Topbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: isSidebarOpen ? 0 : `-${DRAWER_WIDTH}px`,
          transition: 'margin 200ms ease',
          width: isSidebarOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
