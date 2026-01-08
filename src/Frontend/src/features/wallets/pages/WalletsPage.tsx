import { useState } from 'react';
import { Plus } from 'lucide-react';
import { WalletList } from '../components/WalletList';
import { CreateWalletForm } from '../components/CreateWalletForm';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';

export function WalletsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Wallets</h1>
          <p className="text-gray-500">Manage your digital wallets</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Wallet
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateWalletForm
              onSuccess={() => setShowCreateForm(false)}
              onCancel={() => setShowCreateForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <WalletList onCreateWallet={() => setShowCreateForm(true)} />
    </div>
  );
}