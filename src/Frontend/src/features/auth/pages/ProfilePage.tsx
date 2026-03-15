import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Shield, Clock } from 'lucide-react';
import { useAuthStore } from '@/shared/stores';
import { useUpdateProfile, useChangePassword } from '../hooks/useAuth';
import { getErrorMessage } from '@/shared/lib/errorMessages';

interface ProfileFormValues {
  firstName: string;
  lastName: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const profileForm = useForm<ProfileFormValues>({
    defaultValues: { firstName: user?.firstName ?? '', lastName: user?.lastName ?? '' },
  });

  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onProfileSubmit = (data: ProfileFormValues) => {
    updateProfile.mutate(data, {
      onSuccess: () => setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' }),
      onError: (err) => setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' }),
    });
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    if (data.newPassword !== data.confirmPassword) {
      passwordForm.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    changePassword.mutate(data, {
      onSuccess: () => {
        setSnackbar({ open: true, message: 'Password changed successfully', severity: 'success' });
        passwordForm.reset();
      },
      onError: (err) => setSnackbar({ open: true, message: getErrorMessage(err), severity: 'error' }),
    });
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Profile</Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Personal Information</Typography>
              <Box component="form" onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth label="First Name"
                      {...profileForm.register('firstName', { required: 'Required', maxLength: 100 })}
                      error={Boolean(profileForm.formState.errors.firstName)}
                      helperText={profileForm.formState.errors.firstName?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth label="Last Name"
                      {...profileForm.register('lastName', { required: 'Required', maxLength: 100 })}
                      error={Boolean(profileForm.formState.errors.lastName)}
                      helperText={profileForm.formState.errors.lastName?.message}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField fullWidth label="Email" value={user?.email ?? ''} disabled />
                  </Grid>
                </Grid>
                <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Change Password</Typography>
              <Box component="form" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                <TextField
                  fullWidth label="Current Password" type={showCurrent ? 'text' : 'password'} sx={{ mb: 2 }}
                  {...passwordForm.register('currentPassword', { required: 'Required' })}
                  error={Boolean(passwordForm.formState.errors.currentPassword)}
                  helperText={passwordForm.formState.errors.currentPassword?.message}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowCurrent(!showCurrent)} edge="end" size="small">
                            {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  fullWidth label="New Password" type={showNew ? 'text' : 'password'} sx={{ mb: 2 }}
                  {...passwordForm.register('newPassword', {
                    required: 'Required',
                    minLength: { value: 8, message: 'At least 8 characters' },
                    pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z])/, message: 'Must include uppercase, lowercase, digit, and special character' },
                  })}
                  error={Boolean(passwordForm.formState.errors.newPassword)}
                  helperText={passwordForm.formState.errors.newPassword?.message}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowNew(!showNew)} edge="end" size="small">
                            {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <TextField
                  fullWidth label="Confirm New Password" type="password" sx={{ mb: 2 }}
                  {...passwordForm.register('confirmPassword', { required: 'Required' })}
                  error={Boolean(passwordForm.formState.errors.confirmPassword)}
                  helperText={passwordForm.formState.errors.confirmPassword?.message}
                />
                <Button type="submit" variant="contained" color="warning" disabled={changePassword.isPending}>
                  {changePassword.isPending ? 'Changing...' : 'Change Password'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Account Status</Typography>
              <Chip label={user?.status ?? 'Active'} color={user?.status === 'Active' ? 'success' : user?.status === 'Suspended' ? 'error' : 'default'} size="small" />
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Roles</Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {user?.roles?.map((role) => (
                  <Chip key={role} icon={<Shield size={14} />} label={role} size="small" variant="outlined" />
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Permissions</Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {user?.permissions?.map((p) => (
                  <Chip key={p} label={p} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                ))}
              </Box>
              {user?.lastLoginAt && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Clock size={14} />
                    <Typography variant="caption" color="text.secondary">
                      Last login: {new Date(user.lastLoginAt).toLocaleString()}
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>

          {user?.status === 'Suspended' && (
            <Alert severity="error">
              Your account has been suspended. Please contact support.
            </Alert>
          )}
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
