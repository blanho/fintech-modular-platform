import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { TransactionList } from '../components/TransactionList';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-gray-500">View and manage your transactions</p>
        </div>
        <div className="flex gap-2">
          <Link to="/transactions/deposit">
            <Button variant="outline">
              <ArrowDownLeft className="h-4 w-4 mr-2" />
              Deposit
            </Button>
          </Link>
          <Link to="/transactions/transfer">
            <Button>
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Transfer
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <TransactionList />
        </CardContent>
      </Card>
    </div>
  );
}