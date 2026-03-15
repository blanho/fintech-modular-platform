import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Switch from '@mui/material/Switch';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificationPreferences, useUpdateNotificationPreferences } from '../hooks/useNotifications';

const preferenceItems = [
  { key: 'emailEnabled' as const, label: 'Email Notifications', description: 'Receive notifications via email' },
  { key: 'pushEnabled' as const, label: 'Push Notifications', description: 'Receive push notifications in your browser' },
  { key: 'smsEnabled' as const, label: 'SMS Notifications', description: 'Receive notifications via text message' },
  { key: 'transactionAlerts' as const, label: 'Transaction Alerts', description: 'Get notified about deposits, withdrawals, and transfers' },
  { key: 'securityAlerts' as const, label: 'Security Alerts', description: 'Get notified about login attempts and security events' },
  { key: 'marketingEnabled' as const, label: 'Marketing', description: 'Receive promotional updates and offers' },
];

export function NotificationPreferencesPage() {
  const navigate = useNavigate();
  const { data: preferences, isLoading } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();

  const handleToggle = (key: (typeof preferenceItems)[number]['key']) => {
    if (!preferences) return;
    updatePreferences.mutate({ [key]: !preferences[key] });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Button
          variant="text"
          startIcon={<ArrowLeft size={16} />}
          onClick={() => navigate('/notifications')}
          sx={{ cursor: 'pointer' }}
        >
          Back
        </Button>
        <Box>
          <Typography variant="h4">Notification Preferences</Typography>
          <Typography variant="body2">Manage how you receive notifications</Typography>
        </Box>
      </Box>

      {updatePreferences.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to update preferences. Please try again.
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 0 }}>
          {isLoading ? (
            <Box sx={{ p: 3 }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} variant="rectangular" height={56} sx={{ mb: 1, borderRadius: 1 }} />
              ))}
            </Box>
          ) : (
            <List disablePadding>
              {preferenceItems.map((item, idx) => (
                <Box key={item.key}>
                  <ListItem sx={{ py: 2, px: 3 }}>
                    <ListItemText
                      primary={item.label}
                      secondary={item.description}
                      slotProps={{ primary: { fontWeight: 500 } }}
                    />
                    <Switch
                      edge="end"
                      checked={preferences?.[item.key] ?? false}
                      onChange={() => handleToggle(item.key)}
                      disabled={updatePreferences.isPending}
                    />
                  </ListItem>
                  {idx < preferenceItems.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
