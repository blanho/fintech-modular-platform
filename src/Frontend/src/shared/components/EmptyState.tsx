import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { AlertTriangle } from 'lucide-react';

interface EmptyStateProps {
  readonly title: string;
  readonly description?: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        gap: 2,
      }}
    >
      <AlertTriangle size={48} style={{ opacity: 0.3 }} />
      <Typography variant="h6">{title}</Typography>
      {description && (
        <Typography variant="body2" sx={{ maxWidth: 400, textAlign: 'center' }}>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} sx={{ mt: 1, cursor: 'pointer' }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
