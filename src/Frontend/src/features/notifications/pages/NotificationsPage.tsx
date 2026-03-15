import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import TablePagination from '@mui/material/TablePagination';
import { alpha } from '@mui/material/styles';
import { CheckCheck, ArrowLeftRight, ShieldCheck, Monitor, Megaphone, Settings } from 'lucide-react';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../hooks/useNotifications';
import { EmptyState } from '@/shared/components';
import type { NotificationCategory } from '@/shared/types';

const categoryIconMap: Record<NotificationCategory, typeof ArrowLeftRight> = {
  Transaction: ArrowLeftRight,
  Security: ShieldCheck,
  System: Monitor,
  Marketing: Megaphone,
};

const categoryColorMap: Record<NotificationCategory, string> = {
  Transaction: '#22C55E',
  Security: '#F59E0B',
  System: '#3B82F6',
  Marketing: '#A855F7',
};

export function NotificationsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [readFilter, setReadFilter] = useState<string>('');

  const { data, isLoading } = useNotifications({
    page: page + 1,
    pageSize: rowsPerPage,
    type: categoryFilter || undefined,
    isRead: readFilter === '' ? undefined : readFilter === 'true',
  });

  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4">Notifications</Typography>
          <Typography variant="body2">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<Settings size={16} />}
            onClick={() => navigate('/notifications/preferences')}
            sx={{ cursor: 'pointer' }}
          >
            Preferences
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="outlined"
              startIcon={<CheckCheck size={16} />}
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              sx={{ cursor: 'pointer' }}
            >
              Mark All Read
            </Button>
          )}
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 2, p: 2, '&:last-child': { pb: 2 } }}>
          <TextField
            select
            label="Category"
            size="small"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="Transaction">Transaction</MenuItem>
            <MenuItem value="Security">Security</MenuItem>
            <MenuItem value="System">System</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
          </TextField>
          <TextField
            select
            label="Read Status"
            size="small"
            value={readFilter}
            onChange={(e) => { setReadFilter(e.target.value); setPage(0); }}
            sx={{ minWidth: 140 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="false">Unread</MenuItem>
            <MenuItem value="true">Read</MenuItem>
          </TextField>
        </CardContent>
      </Card>

      {!isLoading && notifications.length === 0 ? (
        <EmptyState title="No notifications" description="You're all caught up." />
      ) : (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <List disablePadding>
              {notifications.map((n, idx) => {
                const IconComponent = categoryIconMap[n.category] ?? Monitor;
                const iconColor = categoryColorMap[n.category] ?? '#3B82F6';
                return (
                  <Box key={n.id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => { if (!n.isRead) markRead.mutate(n.id); }}
                        sx={{
                          py: 2,
                          px: 3,
                          cursor: 'pointer',
                          backgroundColor: n.isRead ? 'transparent' : (t) => alpha(t.palette.primary.main, 0.04),
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 44, color: iconColor }}>
                          <IconComponent size={22} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body1" sx={{ fontWeight: n.isRead ? 400 : 600 }}>
                              {n.title}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ mb: 0.5 }}>
                                {n.body}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(n.createdAt).toLocaleString()}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                    {idx < notifications.length - 1 && <Divider />}
                  </Box>
                );
              })}
            </List>
          </CardContent>
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 20, 50]}
          />
        </Card>
      )}
    </Box>
  );
}
