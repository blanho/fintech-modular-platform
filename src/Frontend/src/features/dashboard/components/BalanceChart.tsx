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
import { useTheme, alpha } from '@mui/material/styles';

interface BalanceChartProps {
  readonly data: { date: string; balance: number }[];
}

export function BalanceChart({ data }: BalanceChartProps) {
  const muiTheme = useTheme();
  const green = muiTheme.palette.primary.main;

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Balance History
        </Typography>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={green} stopOpacity={0.3} />
                <stop offset="100%" stopColor={green} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={muiTheme.palette.divider}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke={muiTheme.palette.text.secondary}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke={muiTheme.palette.text.secondary}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: muiTheme.palette.background.paper,
                border: `1px solid ${muiTheme.palette.divider}`,
                borderRadius: 8,
                fontSize: 13,
              }}
              formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Balance']}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke={green}
              strokeWidth={2}
              fill="url(#balanceGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: green,
                stroke: alpha(green, 0.3),
                strokeWidth: 4,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
