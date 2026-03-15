import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import { CheckCheck, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { notificationApi } from '../api/notificationApi';
import { EmptyState } from '@/shared/components';
import type { Notification } from '@/shared/types';

const iconMap = {
  Info: Info,
  Success: CheckCircle,
  Warning: AlertTriangle,
  Error: XCircle,
};

const colorMap: Record<string, string> = {
  Info: '#3B82F6',
  Success: '#22C55E',
  Warning: '#F59E0B',
  Error: '#EF4444',
};

const mockNotifications: Notification[] = [
  { id: '1', userId: 'u1', title: 'Deposit Completed', message: 'Your deposit of $5,000 has been processed.', type: 'Success', isRead: false, createdAt: '2026-03-14T10:30:00Z' },
  { id: '2', userId: 'u1', title: 'Transfer Failed', message: 'International transfer of $3,500 EUR failed.', type: 'Error', isRead: false, createdAt: '2026-03-11T16:45:00Z' },
  { id: '3', userId: 'u1', title: 'Security Alert', message: 'New login detected from a new device.', type: 'Warning', isRead: true, createdAt: '2026-03-10T08:00:00Z' },
  { id: '4', userId: 'u1', title: 'Monthly Report Ready', message: 'Your February financial report is available.', type: 'Info', isRead: true, createdAt: '2026-03-01T09:00:00Z' },
];

export function NotificationsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationApi.list,
  });

  const markAllRead = useMutation({
    mutationFn: notificationApi.markAllRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const notifications = data ?? mockNotifications;
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
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            startIcon={<CheckCheck size={16} />}
            onClick={() => markAllRead.mutate()}
            sx={{ cursor: 'pointer' }}
          >
            Mark All Read
          </Button>
        )}
      </Box>

      {notifications.length === 0 ? (
        <EmptyState title="No notifications" description="You're all caught up." />
      ) : (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <List disablePadding>
              {notifications.map((n, idx) => {
                const IconComponent = iconMap[n.type];
                return (
                  <Box key={n.id}>
                    <ListItem
                      sx={{
                        py: 2,
                        px: 3,
                        backgroundColor: n.isRead ? 'transparent' : (t) => alpha(t.palette.primary.main, 0.04),
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 44, color: colorMap[n.type] }}>
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
                              {n.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(n.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {idx < notifications.length - 1 && <Divider />}
                  </Box>
                );
              })}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
