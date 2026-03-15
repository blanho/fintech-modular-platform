import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Grid from '@mui/material/Grid';
import { User, Bell, ShieldCheck } from 'lucide-react';
import { alpha } from '@mui/material/styles';

const settingsItems = [
  { label: 'Profile', description: 'Manage your personal information and password', icon: User, path: '/profile' },
  { label: 'Notifications', description: 'Configure notification preferences', icon: Bell, path: '/notifications/preferences' },
  { label: 'Security', description: 'View audit log and security events', icon: ShieldCheck, path: '/audit' },
];

export function SettingsPage() {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4">Settings</Typography>
        <Typography variant="body2">Manage your account and preferences</Typography>
      </Box>

      <Grid container spacing={3}>
        {settingsItems.map((item) => (
          <Grid key={item.label} size={{ xs: 12, sm: 6, lg: 4 }}>
            <Card>
              <CardActionArea onClick={() => navigate(item.path)} sx={{ cursor: 'pointer' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      width: 'fit-content',
                      mb: 2,
                      backgroundColor: (t) => alpha(t.palette.primary.main, 0.1),
                      color: 'primary.main',
                    }}
                  >
                    <item.icon size={22} />
                  </Box>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>{item.label}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
