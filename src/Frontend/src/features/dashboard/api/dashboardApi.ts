import { api } from '@/shared/api';
import type { DashboardStats } from '@/shared/types';

export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats').then((r) => r.data),
};
