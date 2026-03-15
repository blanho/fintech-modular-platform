import { api } from '@/shared/api';
import type { DashboardStatsResponse } from '@/shared/types';

export const dashboardApi = {
  getStats: () => api.get<DashboardStatsResponse>('/statistics/dashboard').then((r) => r.data),
};
