import { api } from '@/shared/api';
import type {
  Report,
  ReportListItem,
  GenerateReportRequest,
  DashboardStatsResponse,
  PaginatedResponse,
} from '@/shared/types';

export const reportApi = {
  generate: (data: GenerateReportRequest) =>
    api.post<Report>('/reports/generate', data).then((r) => r.data),

  getById: (id: string) =>
    api.get<Report>(`/reports/${id}`).then((r) => r.data),

  list: (page = 1, pageSize = 20) =>
    api
      .get<PaginatedResponse<ReportListItem>>(`/reports?page=${page}&pageSize=${pageSize}`)
      .then((r) => r.data),

  download: (id: string) =>
    api.get<Blob>(`/reports/${id}/download`, { responseType: 'blob' }).then((r) => r.data),

  getDashboardStats: () =>
    api.get<DashboardStatsResponse>('/statistics/dashboard').then((r) => r.data),
};
