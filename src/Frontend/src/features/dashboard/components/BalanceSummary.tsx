import { Link } from 'react-router-dom';
import { Wallet, TrendingUp, Eye } from 'lucide-react';
import { useWallets } from '@/features/wallets';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { formatMoney } from '@/shared/lib/format';

export function BalanceSummary() {
  const { data, isLoading } = useWallets();
  const wallets = data?.data || [];
  const activeWallets = wallets.filter((w) => w.status === 'active');

const balancesByCurrency = activeWallets.reduce((acc, wallet) => {
    const currency = wallet.currency;
    const balance = parseFloat(wallet.balance);
    acc[currency] = (acc[currency] || 0) + balance;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Balance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Balance Overview
        </CardTitle>
        <Link to="/wallets">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {Object.keys(balancesByCurrency).length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 mb-2">No wallets yet</p>
            <Link to="/wallets">
              <Button size="sm">Create Wallet</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(balancesByCurrency).map(([currency, balance]) => (
              <div
                key={currency}
                className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <p className="text-sm text-gray-500 mb-1">{currency}</p>
                <p className="text-xl font-bold">
                  {formatMoney(balance.toString(), currency)}
                </p>
                <div className="flex items-center gap-1 mt-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>
                    {activeWallets.filter((w) => w.currency === currency).length} wallet(s)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}