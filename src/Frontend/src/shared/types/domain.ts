export interface AuditEntry {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'Info' | 'Success' | 'Warning' | 'Error';
  isRead: boolean;
  createdAt: string;
}

export interface ReportSummary {
  totalBalance: number;
  totalTransactions: number;
  monthlyVolume: number;
  activeWallets: number;
}

export interface DashboardStats {
  totalBalance: number;
  totalWallets: number;
  pendingTransactions: number;
  monthlyVolume: number;
  recentTransactions: import('./transaction').Transaction[];
  balanceHistory: { date: string; balance: number }[];
}
