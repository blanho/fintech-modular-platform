import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Transaction } from '@/shared/types';

interface TxConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
  sign: string;
}

const txConfig: Record<string, TxConfig> = {
  Deposit: { label: 'Deposit', icon: <ArrowDownLeft size={14} />, color: '#22C55E', sign: '+' },
  Withdrawal: { label: 'Withdrawal', icon: <ArrowUpRight size={14} />, color: '#EF4444', sign: '-' },
  Transfer: { label: 'Transfer', icon: <ArrowLeftRight size={14} />, color: '#3B82F6', sign: '' },
};

const statusColors: Record<string, string> = {
  Completed: '#22C55E',
  Pending: '#F59E0B',
  Failed: '#EF4444',
};

interface RecentTransactionsProps {
  readonly transactions: Transaction[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const navigate = useNavigate();

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#F8FAFC', lineHeight: 1.2 }}>
            Recent
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#475569', mt: 0.375 }}>
            Latest transactions
          </Typography>
        </Box>

        {transactions.length === 0 ? (
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
              gap: 1,
            }}
          >
            <ArrowLeftRight size={28} color="#1E293B" />
            <Typography sx={{ fontSize: '0.875rem', color: '#334155', textAlign: 'center' }}>
              No transactions yet
            </Typography>
          </Box>
        ) : (
          <Box sx={{ flex: 1 }}>
            {transactions.map((tx, i) => {
              const cfg = txConfig[tx.type] ?? { label: tx.type, icon: <ArrowLeftRight size={14} />, color: '#64748B', sign: '' };
              const date = new Date(tx.createdAt);
              const statusColor = statusColors[tx.status] ?? '#64748B';

              return (
                <Box key={tx.id}>
                  <Box
                    onClick={() => navigate('/transactions')}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      py: 1.25,
                      px: 0.75,
                      mx: -0.75,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'background 150ms ease',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.03)' },
                    }}
                  >
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: '10px',
                        backgroundColor: `${cfg.color}18`,
                        color: cfg.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: `1px solid ${cfg.color}28`,
                      }}
                    >
                      {cfg.icon}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#E2E8F0', lineHeight: 1.2 }}>
                        {cfg.label}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                        <Box sx={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: statusColor, flexShrink: 0 }} />
                        <Typography sx={{ fontSize: '0.6875rem', color: '#475569' }}>
                          {tx.status} · {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: cfg.color,
                        fontVariantNumeric: 'tabular-nums',
                        flexShrink: 0,
                      }}
                    >
                      {cfg.sign}${tx.amount.toLocaleString()}
                    </Typography>
                  </Box>
                  {i < transactions.length - 1 && (
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)' }} />
                  )}
                </Box>
              );
            })}
          </Box>
        )}

        <Button
          fullWidth
          onClick={() => navigate('/transactions')}
          sx={{
            mt: 2,
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: '#22C55E',
            backgroundColor: 'rgba(34,197,94,0.06)',
            border: '1px solid rgba(34,197,94,0.12)',
            borderRadius: '8px',
            py: 0.875,
            cursor: 'pointer',
            '&:hover': { backgroundColor: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.2)' },
          }}
        >
          View All Transactions
        </Button>
      </CardContent>
    </Card>
  );
}
