import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

const actions = [
  {
    icon: ArrowUpRight,
    label: 'Transfer',
    description: 'Send money between wallets',
    href: '/transactions/transfer',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: ArrowDownLeft,
    label: 'Deposit',
    description: 'Add funds to your wallet',
    href: '/transactions/deposit',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Send,
    label: 'Withdraw',
    description: 'Withdraw funds',
    href: '/transactions/withdraw',
    color: 'bg-orange-100 text-orange-600',
  },
  {
    icon: ArrowRightLeft,
    label: 'History',
    description: 'View all transactions',
    href: '/transactions',
    color: 'bg-purple-100 text-purple-600',
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className={`p-2 rounded-lg ${action.color}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{action.label}</p>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}