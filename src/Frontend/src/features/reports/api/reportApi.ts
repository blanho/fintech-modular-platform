import { api } from '@/shared/api';
import type { ReportSummary } from '@/shared/types';

export const reportApi = {
  getSummary: () => api.get<ReportSummary>('/reports/summary').then((r) => r.data),
  getMonthlyBreakdown: () =>
    api.get<{ month: string; income: number; expense: number }[]>('/reports/monthly').then((r) => r.data),
};
