import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, MoreHorizontal, Snowflake, CheckCircle } from 'lucide-react';
import type { Wallet } from '../api/wallets.types';
import { useWalletBalance } from '../hooks/useWallets';
import { Card } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { formatMoney } from '@/shared/lib/format';

interface WalletCardProps {
  wallet: Wallet;
}

export function WalletCard({ wallet }: WalletCardProps) {
  const { data: balanceData, isLoading } = useWalletBalance(wallet.walletId);
  const balance = balanceData?.data;

  const statusConfig = {
    active: { variant: 'success' as const, icon: CheckCircle, label: 'Active' },
    frozen: { variant: 'info' as const, icon: Snowflake, label: 'Frozen' },
    closed: { variant: 'secondary' as const, icon: null, label: 'Closed' },
  };

  const status = statusConfig[wallet.status];

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{wallet.name}</h3>
          <Badge variant={status.variant} className="mt-1">
            {status.icon && <status.icon className="h-3 w-3 mr-1" />}
            {status.label}
          </Badge>
        </div>
        <Link to={`/wallets/${wallet.walletId}`}>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500">Available Balance</p>
        {isLoading ? (
          <div className="h-8 w-32 mt-1 bg-gray-200 animate-pulse rounded" />
        ) : (
          <p className="text-2xl font-bold">
            {formatMoney(balance?.availableBalance || '0', wallet.currency)}
          </p>
        )}
      </div>

      {wallet.status === 'active' && (
        <div className="mt-6 flex gap-2">
          <Link to={`/transactions/transfer?from=${wallet.walletId}`} className="flex-1">
            <Button className="w-full" size="sm">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Send
            </Button>
          </Link>
          <Link to={`/transactions/deposit?to=${wallet.walletId}`} className="flex-1">
            <Button variant="outline" className="w-full" size="sm">
              <ArrowDownLeft className="h-4 w-4 mr-2" />
              Deposit
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}