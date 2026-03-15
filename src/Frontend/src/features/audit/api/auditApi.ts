import { api } from '@/shared/api';
import type { AuditEntry, AuditFilters, PaginatedResponse } from '@/shared/types';

export const auditApi = {
  list: (filters: AuditFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.pageSize) params.set('pageSize', String(filters.pageSize));
    if (filters.userId) params.set('userId', filters.userId);
    if (filters.actionType) params.set('actionType', filters.actionType);
    if (filters.resourceType) params.set('resourceType', filters.resourceType);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.endDate) params.set('endDate', filters.endDate);
    return api
      .get<PaginatedResponse<AuditEntry>>(`/audit?${params.toString()}`)
      .then((r) => r.data);
  },
};
