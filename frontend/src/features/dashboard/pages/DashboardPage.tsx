import { BalanceSummary } from '../components/BalanceSummary';
import { QuickActions } from '../components/QuickActions';
import { RecentTransactions } from '../components/RecentTransactions';
import { useAuthStore } from '@/shared/stores/authStore';

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.firstName || 'there';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {firstName}!</h1>
        <p className="text-gray-500">Here's what's happening with your accounts.</p>
      </div>

      <BalanceSummary />
      <QuickActions />
      <RecentTransactions />
    </div>
  );
}