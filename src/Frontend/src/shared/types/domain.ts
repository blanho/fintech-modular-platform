export type ActionType = 'Execute' | 'Create' | 'Update' | 'Delete' | 'Query' | 'Login' | 'Logout' | 'Export';

export interface AuditEntry {
  id: string;
  userId: string;
  actionType: ActionType;
  resourceType: string;
  resourceId: string | null;
  module: string;
  description: string | null;
  correlationId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  durationMs: number;
  isSuccess: boolean;
  errorMessage: string | null;
  timestamp: string;
}

export interface AuditFilters {
  page?: number;
  pageSize?: number;
  userId?: string;
  actionType?: string;
  resourceType?: string;
  startDate?: string;
  endDate?: string;
}

export type NotificationType = 'Email' | 'Push' | 'Sms' | 'InApp';
export type NotificationCategory = 'Transaction' | 'Security' | 'System' | 'Marketing';
export type NotificationStatus = 'Pending' | 'Sent' | 'Failed' | 'Read' | 'Cancelled';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  category: NotificationCategory;
  status: NotificationStatus;
  isRead: boolean;
  referenceId: string | null;
  referenceType: string | null;
  createdAt: string;
  sentAt: string | null;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  transactionAlerts: boolean;
  securityAlerts: boolean;
  marketingEnabled: boolean;
}

export interface NotificationFilters {
  type?: string;
  isRead?: boolean;
  page?: number;
  pageSize?: number;
}

export type ReportType = 'TransactionSummary' | 'WalletBalance' | 'UserActivity' | 'RevenueAnalysis' | 'DailyReconciliation' | 'MonthlyStatement';
export type ReportStatus = 'Pending' | 'Generating' | 'Completed' | 'Failed' | 'Expired';

export interface Report {
  id: string;
  title: string;
  type: ReportType;
  status: ReportStatus;
  requestedByUserId: string;
  periodStart: string;
  periodEnd: string;
  parameters: Record<string, unknown> | null;
  errorMessage: string | null;
  completedAt: string | null;
  fileSizeBytes: number | null;
  createdAt: string;
}

export interface ReportListItem {
  id: string;
  title: string;
  type: ReportType;
  status: ReportStatus;
  periodStart: string;
  periodEnd: string;
  completedAt: string | null;
  createdAt: string;
}

export interface GenerateReportRequest {
  title: string;
  type: ReportType;
  periodStart: string;
  periodEnd: string;
  parameters?: Record<string, unknown>;
}

export interface DashboardStatsResponse {
  totalTransactions: number;
  totalVolume: number;
  activeUsers: number;
  activeWallets: number;
  successRate: number;
  averageTransactionValue: number;
  newUsersToday: number;
  failedTransactions: number;
  transactionTrend: { timestamp: string; value: number }[];
  volumeTrend: { timestamp: string; value: number }[];
}

export type BackgroundJobStatus = 'Pending' | 'Running' | 'Completed' | 'Failed' | 'Cancelled';

export interface BackgroundJob {
  id: string;
  jobType: string;
  status: BackgroundJobStatus;
  progress: number;
  result: string | null;
  errorMessage: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export type LedgerEntryType = 'Credit' | 'Debit';

export interface LedgerEntry {
  entryId: string;
  walletId: string;
  amount: number;
  currency: string;
  entryType: LedgerEntryType;
  referenceId: string;
  description: string | null;
  createdAt: string;
}

export interface LedgerFilters {
  walletId: string;
  transactionId?: string;
  page?: number;
  pageSize?: number;
}
