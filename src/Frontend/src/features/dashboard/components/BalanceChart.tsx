import { useState } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const PERIODS = ['7D', '30D', '90D', 'ALL'] as const;

interface BalanceChartProps {
  readonly data: { date: string; balance: number }[];
}

export function BalanceChart({ data }: BalanceChartProps) {
  const [period, setPeriod] = useState<string>('30D');

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#F8FAFC', lineHeight: 1.2 }}>
              Volume Trend
            </Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#475569', mt: 0.375 }}>
              Transaction volume over time
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {PERIODS.map((p) => (
              <Button
                key={p}
                size="small"
                onClick={() => setPeriod(p)}
                sx={{
                  minWidth: 36,
                  px: 1,
                  py: 0.375,
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: period === p ? 'rgba(34,197,94,0.12)' : 'transparent',
                  color: period === p ? '#22C55E' : '#475569',
                  border: period === p ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(255,255,255,0.06)',
                  '&:hover': {
                    backgroundColor: period === p ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)',
                    color: period === p ? '#22C55E' : '#94A3B8',
                  },
                }}
              >
                {p}
              </Button>
            ))}
          </Box>
        </Box>

        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#1E293B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#475569' }}
            />
            <YAxis
              stroke="#1E293B"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#475569' }}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0A1628',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                fontSize: 12,
                boxShadow: '0 10px 32px rgba(0,0,0,0.5)',
              }}
              labelStyle={{ color: '#64748B', marginBottom: 4, fontSize: 11 }}
              itemStyle={{ color: '#22C55E', fontWeight: 600 }}
              formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Volume']}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#22C55E"
              strokeWidth={1.5}
              fill="url(#volGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#22C55E', stroke: 'rgba(34,197,94,0.3)', strokeWidth: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
