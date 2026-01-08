import { TransferForm } from '../components/TransferForm';

export function TransferPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Transfer Money</h1>
        <p className="text-gray-500">Send money between wallets</p>
      </div>

      <TransferForm />
    </div>
  );
}