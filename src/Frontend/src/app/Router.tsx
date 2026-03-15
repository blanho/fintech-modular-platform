/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '@/app/layouts';
import { AuthGuard, GuestGuard, LoadingScreen } from '@/shared/components';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const WalletsPage = lazy(() => import('@/features/wallets/pages/WalletsPage').then(m => ({ default: m.WalletsPage })));
const WalletDetailPage = lazy(() => import('@/features/wallets/pages/WalletDetailPage').then(m => ({ default: m.WalletDetailPage })));
const TransactionsPage = lazy(() => import('@/features/transactions/pages/TransactionsPage').then(m => ({ default: m.TransactionsPage })));
const TransactionDetailPage = lazy(() => import('@/features/transactions/pages/TransactionDetailPage').then(m => ({ default: m.TransactionDetailPage })));
const LedgerPage = lazy(() => import('@/features/ledger/pages/LedgerPage').then(m => ({ default: m.LedgerPage })));
const AuditPage = lazy(() => import('@/features/audit/pages/AuditPage').then(m => ({ default: m.AuditPage })));
const NotificationsPage = lazy(() => import('@/features/notifications/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const NotificationPreferencesPage = lazy(() => import('@/features/notifications/pages/NotificationPreferencesPage').then(m => ({ default: m.NotificationPreferencesPage })));
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const ProfilePage = lazy(() => import('@/features/auth/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

function SuspenseWrapper({ children }: { readonly children: React.ReactNode }) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    element: <GuestGuard />,
    children: [
      { path: '/login', element: <SuspenseWrapper><LoginPage /></SuspenseWrapper> },
      { path: '/register', element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper> },
    ],
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
          { path: '/wallets', element: <SuspenseWrapper><WalletsPage /></SuspenseWrapper> },
          { path: '/wallets/:walletId', element: <SuspenseWrapper><WalletDetailPage /></SuspenseWrapper> },
          { path: '/transactions', element: <SuspenseWrapper><TransactionsPage /></SuspenseWrapper> },
          { path: '/transactions/:transactionId', element: <SuspenseWrapper><TransactionDetailPage /></SuspenseWrapper> },
          { path: '/ledger', element: <SuspenseWrapper><LedgerPage /></SuspenseWrapper> },
          { path: '/audit', element: <SuspenseWrapper><AuditPage /></SuspenseWrapper> },
          { path: '/notifications', element: <SuspenseWrapper><NotificationsPage /></SuspenseWrapper> },
          { path: '/notifications/preferences', element: <SuspenseWrapper><NotificationPreferencesPage /></SuspenseWrapper> },
          { path: '/reports', element: <SuspenseWrapper><ReportsPage /></SuspenseWrapper> },
          { path: '/profile', element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper> },
          { path: '/settings', element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper> },
        ],
      },
    ],
  },
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);
