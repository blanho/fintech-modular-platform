import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

import { LandingPage } from '@/features/landing';

import { LoginPage, RegisterPage } from '@/features/auth';

import { DashboardPage } from '@/features/dashboard';

import { WalletsPage } from '@/features/wallets';

import { TransactionsPage, TransferPage } from '@/features/transactions';

export const router = createBrowserRouter([

  {
    path: '/',
    element: <LandingPage />,
  },

{
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },

{
    element: <DashboardLayout />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'wallets', element: <WalletsPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'transactions/transfer', element: <TransferPage /> },

],
  },

{
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);